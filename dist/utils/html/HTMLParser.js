"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs"),
	path = require("path"),
	events = require("events");
class HTMLParser {
	id;
	dom;
	str;
	file;
	dir;
	prettyPrefix;
	prettyNewLine;
	attrAsObject;
	debug;
	debugBuffer;
	parseCursor;
	useAutomaton;
	autoOrder;
	automata;
	closeTags;
	watchFiles;
	watchOptions;
	watchListener;
	watcher;
	whiteList;
	blackList;
	queryPrefix;
	exeMethods;
	exeOn;
	exeAttr;
	exeJS;
	exeDeleteOnSet;
	jsonReplacer;
	jsonSpace;
	constructor() {
		var o = this;
		o.id = null;
		o.dom = null;
		o.str = null;
		o.file = null;
		o.dir = null;
		o.prettyPrefix = "\t";
		o.prettyNewLine = "\n";
		o.attrAsObject = true;
		o.debug = false;
		o.debugBuffer = [];
		o.parseCursor = 0;
		o.useAutomaton = false;
		o.autoOrder = false;
		o.automata = {
			prolog: ["<\\?[\\w|\\-|.|:]*", "[\\s]?\\?>", true],
			alias: ["<@[\\w|\\-|.|:]*", "[\\s]?@>", true],
			template: ["<#[\\w|\\-|.|:]*", "[\\s]?#>", true],
			var: ["<=[\\w|.|:]*", ">", true],
			block: ["<%[\\w|\\-|.|:]*", "[\\s]?%>", false],
			comment: ["<\\!--", "-->", false],
			cdata: ["<\\!\\[[\\w]*\\[", "\\]\\]>", false],
			doctype: ["<\\![\\w]*", ">", false],
		};
		o.closeTags = [];
		o.watchFiles = false;
		o.watchOptions = null;
		o.watchListener = null;
		o.watcher = null;
		o.whiteList = null;
		o.blackList = null;
		o.queryPrefix = {
			"#": "id",
			".": "class",
			"/": "data",
			"*": "src",
			"@": "style",
			"!": "href",
			"$": "rel",
			"%": "alt",
			"^": "title",
			"&": "name",
			"=": "content",
			"-": "target",
			"+": "type",
			"?": "_",
		};
		o.exeMethods = {};
		o.exeOn = "exe";
		o.exeAttr = "node";
		o.exeJS = "js";
		o.exeDeleteOnSet = false;
		o.jsonReplacer = null;
		o.jsonSpace = null;
	}
	getFilePath(file, dir) {
		return dir === true ? file : path.resolve((dir || __dirname) + path.sep + file);
	}
	loadFromFile(file, dir) {
		var o = this;
		var fp = o.getFilePath(file, dir),
			filec = fs.readFileSync(fp).toString();
		if (o.watchFiles) o.watchFile(fp);
		return filec;
	}
	parseFromFile(file, dir) {
		var o = this;
		o.file = file;
		o.dir = dir;
		return o.parseFromString(o.loadFromFile(file, dir));
	}
	parseFromString(str) {
		var o = this;
		o.parseCursor = 0;
		o.str = str;
		o.dom = {
			elements: [],
		};
		o.process();
		return o;
	}
	watchFile(fp, listener, options) {
		var o = this;
		if (!fp) fp = o.getFilePath(o.file, o.dir);
		if (listener) o.watchListener = listener;
		if (options) o.watchOptions = options;
		if (o.watcher) o.watcher.close();
		o.watcher = fs.watch(fp, o.watchOptions, (e, f) => o.watchListener(e, f, fp, o.id, "html", fs.statSync(fp)));
	}
	getDomJSON() {
		return JSON.stringify(this.dom, this.jsonReplacer, this.jsonSpace);
	}
	domToString(dom, nowhite, pretty, prefix) {
		var o = this;
		if (!dom) dom = o.dom;
		var q,
			v,
			i,
			tn,
			prfx,
			chi,
			a,
			k,
			ch = dom.elements,
			l = ch ? ch.length : 0,
			start = "",
			end = "",
			content = [],
			pn = pretty && dom.type ? o.prettyNewLine : "";
		if (pretty && dom.type) prefix = (prefix || []).concat(o.prettyPrefix);
		if (dom.type && !dom.norender) {
			start = "<" + dom.type;
			if (dom.attr) {
				if (dom.attr.constructor === Array) {
					a = [];
					if (nowhite) {
						dom.attr.forEach((e) => a.push(e.trim()));
						if (a.length > 0) start += " " + a.join(" ");
					} else {
						start += dom.attr.join("");
					}
				} else {
					a = [];
					for (k in dom.attr) {
						v = dom.attr[k];
						if (o.whiteList && !o.whiteList[k]) continue;
						if (o.blackList && o.blackList[k]) continue;
						q = v && v.indexOf('"') !== -1 ? "'" : '"';
						a.push(k + (v === null ? "" : "=" + q + v + q));
					}
					if (a.length > 0) start += " " + a.join(" ");
				}
			}
			start += (dom.closed && pretty ? " " : "") + dom.ending;
		}
		if (l > 0) {
			prfx = prefix ? prefix.join("") : "";
			tn = 0;
			for (i = 0; i < l; i++) {
				chi = ch[i];
				if (chi.constructor === String) {
					tn++;
					content.push(nowhite ? chi.trim() : chi);
				} else {
					content.push(pn + prfx + o.domToString(chi, nowhite, pretty, prefix));
				}
			}
		}
		if (dom.type && !dom.closed && !dom.norender) {
			if (l === tn) {
				end = "</" + dom.type + ">";
			} else {
				prfx = prefix ? prefix.slice(0, prefix.length - 1).join("") : "";
				end = (pretty ? o.prettyNewLine : "") + prfx + "</" + dom.type + ">";
			}
		}
		return start + content.join("") + end;
	}
	search(type, attr, value, dom) {
		var o = this;
		if (!dom) dom = o.dom;
		var i,
			s,
			a = [],
			ch = dom.elements,
			l = ch ? ch.length : 0;
		var attrcond,
			typecond = !type || (type.constructor === Array ? type.indexOf(dom.type) !== -1 : dom.type === type);
		if (!attr) attrcond = true;
		else if (dom.attr && dom.attr.constructor === Object) {
			if (attr.constructor === Function) attrcond = attr(o, dom, dom.attr, value);
			else attrcond = dom.attr[attr] && dom.attr[attr].split(new RegExp("\\s")).indexOf(value) !== -1;
		}
		if (typecond && attrcond) a.push(dom);
		if (l > 0) {
			for (i = 0; i < l; i++) {
				if (ch[i].constructor === Object) {
					s = o.search(type, attr, value, ch[i]);
					if (s.length > 0) a = a.concat(s);
				}
			}
		}
		return a;
	}
	query(selector, methods, classes) {
		var o = this;
		var dom,
			s = selector.split(" ");
		s.forEach((e) => {
			var r,
				value,
				type,
				attr,
				prefix = e.charAt(0);
			attr = o.queryPrefix[prefix];
			if (attr) {
				value = e.substring(1);
				if (methods && methods[attr]) attr = methods[attr];
			} else type = e;
			if (dom) {
				r = [];
				dom.forEach((d) => (r = r.concat(o.search(type, attr, value, d))));
			} else r = o.search(type, attr, value, dom);
			dom = r;
		});
		if (classes === true) dom.forEach((e, i, a) => (a[i] = new HTMLDomElement(e)));
		else if (classes) dom.forEach((e, i, a) => (a[i] = classes[e.type] ? new classes[e.type](e) : e));
		return dom;
	}
	querySafe(selector, methods, classes, debug) {
		var o = this;
		var r,
			semap = {};
		try {
			selector.split(" ").forEach((e) => {
				if (!e || semap[e] || o.queryPrefix[e]) throw new SyntaxError("Unexpected query sequence or malformed string");
				semap[e] = true;
			});
			r = o.query(selector, methods, classes);
		} catch (err) {
			if (debug) debug(err, selector, methods, classes, o);
		}
		return r;
	}
	debugCase(text, error, data) {
		console.log(text);
		this.debugBuffer.push([text, error, data]);
		if (error) throw new error(text + " [Debug Buffer Index: " + (this.debugBuffer.length - 1) + "]");
	}
	cursorToCR(cursor) {
		var o = this;
		var t = o.str.substr(0, cursor),
			r = t.split(new RegExp("[\\n]"));
		return r.length + ":" + (r[r.length - 1].length + 1) + ":" + cursor + ":" + o.str.length;
	}
	process(s, d) {
		var o = this;
		if (!s) s = o.str;
		if (!d) d = o.dom;
		var tag, el, ret;
		tag = o.getTag(s);
		if (tag) {
			d.elements.push(tag.pre);
			s = tag.rest;
			if (!tag.closing) {
				el = {};
				d.elements.push(el);
				el.type = tag.type;
				if (tag.auto) el.auto = tag.auto;
				s = o.attributes(s, el);
				if (!el.closed) {
					el.elements = [];
					if (o.closeTags.indexOf(el.type) !== -1) {
						ret = o.getClosedTag(s, el);
						el.elements.push(ret.pre);
					} else ret = o.process(s, el);
					if (ret.closing && ret.rest) {
						if (o.debug && ret.type !== el.type) {
							o.debugCase("{" + o.cursorToCR(o.parseCursor) + "}, Closing tag mismatch at " + ret.inner, SyntaxError, [
								ret,
								el,
								d,
							]);
						}
						ret = o.process(ret.rest, d);
					}
				} else ret = o.process(s, d);
			} else ret = tag;
		}
		return ret;
	}
	getClosedTag(s, el) {
		var o = this;
		var t0,
			ci,
			tag = s.match(new RegExp("</" + el.type + "[\\s]*>"));
		if (tag) {
			t0 = tag[0];
			tag.pre = tag.input.substr(0, tag.index);
			ci = tag.index + t0.length;
			tag.inner = tag.input.substring(tag.index, ci);
			tag.rest = tag.input.substr(ci);
			tag.closing = true;
			tag.type = el.type;
			o.parseCursor += ci;
			if (o.debug && t0.length !== ("</" + el.type + ">").length) {
				o.debugCase("{" + o.cursorToCR(o.parseCursor) + "}, Closing tag mistyped at " + tag.inner, TypeError, [tag]);
			}
		}
		return tag;
	}
	getTag(s) {
		var o = this;
		var t0,
			ci,
			tag = s.match(new RegExp("<[/]?[\\w|\\-|.|:]*"));
		if (tag) {
			t0 = tag[0];
			tag.pre = tag.input.substr(0, tag.index);
			if (t0 === "<" && o.useAutomaton) {
				tag = o.getAutoTag(tag);
			}
			if (!tag.type) {
				tag.closing = t0.charAt(1) === "/";
				tag.endIndex = tag.input.indexOf(">", tag.index);
				ci = tag.closing ? tag.endIndex + 1 : tag.index + t0.length;
				tag.inner = tag.input.substring(tag.index, tag.endIndex + 1);
				tag.rest = tag.input.substr(ci);
				tag.type = t0.substr(tag.closing ? 2 : 1);
				o.parseCursor += ci;
				if (o.debug && tag.closing && tag.endIndex !== tag.index + t0.length) {
					o.debugCase("{" + o.cursorToCR(o.parseCursor) + "}, Closing tag mistyped at " + tag.inner, TypeError, [tag]);
				}
			}
		}
		return tag;
	}
	getAutoTag(tag) {
		var o = this;
		var ak,
			akt,
			atag,
			arest = tag.input.substr(tag.index);
		for (ak in o.automata) {
			akt = o.automata[ak];
			atag = arest.match(new RegExp(akt[0]));
			if (atag && (o.autoOrder || atag.index === 0)) {
				tag.auto = ak;
				tag.type = atag[0].substr(1);
				tag.closing = false;
				tag.rest = arest.substr(atag.index + atag[0].length);
				o.parseCursor += tag.index + atag.index + atag[0].length;
				break;
			}
		}
		return tag;
	}
	getElement(type, closed, attr) {
		var el = {};
		el.type = type;
		el.closed = closed;
		el.ending = (closed ? "/" : "") + ">";
		el.attr = attr || {};
		if (!closed) el.elements = [];
		return el;
	}
	attributes(s, el) {
		var o = this;
		var a,
			at,
			attr,
			i,
			a0,
			lc,
			aa = [],
			noattr = !el.auto || o.automata[el.auto][2] ? null : [],
			regxtag = new RegExp("[\\s|\\w|\\-|.|:]*[>|'|\"]");
		while (true) {
			a = s.match(regxtag);
			if (a) {
				a0 = a[0];
				lc = a0.charAt(a0.length - 1);
				if (lc === "'" || lc === '"') {
					if (!noattr) {
						i = a.input.indexOf(lc, a.index + a0.length);
						aa.push(a.input.substr(0, i + 1));
						s = a.input.substr(i + 1);
						o.parseCursor += i + 1;
					} else {
						noattr.push(a.input.substr(0, a.index + a0.length));
						s = a.input.substr(a.index + a0.length);
						o.parseCursor += a.index + a0.length;
					}
				} else {
					attr = a.input.substr(0, a.index + a0.length);
					if (el.auto) {
						at = attr.match(o.automata[el.auto][1]);
						if (!at) {
							if (noattr) noattr.push(attr);
							s = a.input.substr(a.index + a0.length);
							o.parseCursor += a.index + a0.length;
							continue;
						} else {
							attr = at.input.substr(0, at.index);
							(noattr || aa).push(attr);
							s = a.input.substr(at.index + at[0].length);
							o.parseCursor += at.index + at[0].length;
						}
						el.closed = true;
						el.ending = (noattr ? noattr.join("") : "") + at.input.substr(at.index);
					} else {
						el.closed = attr[attr.length - 2] === "/";
						el.ending = (el.closed ? "/" : "") + ">";
						aa.push(attr.substr(0, attr.length - el.ending.length));
						s = a.input.substr(a.index + a0.length);
						o.parseCursor += a.index + a0.length;
					}
					if (!noattr && aa.length > 0) {
						if (aa[aa.length - 1] !== undefined && aa[aa.length - 1].trim() === "") aa.pop();
						o.attrToObject(aa, el, o.parseCursor);
					}
					break;
				}
			} else break;
		}
		return s;
	}
	attrToObject(aa, el, cursor) {
		var o = this;
		if (aa.length > 0) {
			if (o.attrAsObject) {
				var ap,
					wreg = new RegExp("[\\s]+", "g"),
					regxattr = new RegExp("[\\w|\\s|\\-|.|:]*[\\w|\\-|.|:]+[\\s]*[=][\\s]*['|\"]"),
					regxkey = new RegExp("[\\w|\\-|.|:]+");
				el.attr = {};
				aa.forEach((e) => {
					ap = e.match(regxattr);
					var spl = e.split("="),
						k = spl[0].trim(),
						v = spl[1] ? spl[1].trim() : null,
						kspl = k.replace(wreg, " ").split(" ");
					if (o.debug && (!ap || ap.index !== 0) && spl.length > 1) {
						o.debugCase(
							(cursor !== undefined ? "{" + o.cursorToCR(cursor) + "}, " : "") + "Attribute pattern mismatch at " + e,
							SyntaxError,
							[aa, el]
						);
					}
					k = kspl.pop();
					if (o.debug) {
						ap = k.match(regxkey);
						if (!ap || ap[0] !== k) {
							o.debugCase(
								(cursor !== undefined ? "{" + o.cursorToCR(cursor) + "}, " : "") + "Invalid attribute key at " + e,
								TypeError,
								[aa, el]
							);
						}
						kspl.forEach((kk) => {
							ap = kk.match(regxkey);
							if (!ap || ap[0] !== kk) {
								o.debugCase(
									(cursor !== undefined ? "{" + o.cursorToCR(cursor) + "}, " : "") + "Invalid attribute key at " + e,
									TypeError,
									[aa, el]
								);
							}
						});
					}
					kspl.forEach((kk) => {
						el.attr[kk] = null;
					});
					el.attr[k] = v === null ? null : v.substr(1, v.length - 2);
				});
			} else el.attr = aa;
		}
		return o;
	}
}
class HTMLDomElement extends Array {
	dom;
	type;
	data;
	events;
	constructor(dom) {
		super();
		this.dom = dom;
		this.type = dom.type;
		this.data = {};
		this.events = new events.EventEmitter();
		var i,
			l = dom.elements ? dom.elements.length : 0;
		for (i = 0; i < l; i++) this[i] = dom.elements[i];
	}
	get id() {
		return this.dom.attr["id"];
	}
	get classList() {
		return (this.dom.attr["class"] || "").split(" ");
	}
	convert(classes, sub, subc) {
		var o = this;
		var i,
			e,
			cls,
			l = o.length;
		if (!classes) classes = {};
		for (i = 0; i < l; i++) {
			e = o[i];
			cls = classes[e.type] || HTMLDomElement;
			o[i] = new cls(e);
			if (sub) o[i].convert(classes, subc, subc);
		}
		return o;
	}
}
module.exports.HTMLParser = HTMLParser;
module.exports.HTMLDomElement = HTMLDomElement;
