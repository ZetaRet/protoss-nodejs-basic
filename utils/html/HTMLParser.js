/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Simple HTML parser
 **/

var fs = require('fs'),
	path = require('path');

class HTMLParser {
	constructor() {
		var o = this;
		o.dom = null;
		o.str = null;
		o.prettyPrefix = '\t';
		o.prettyNewLine = '\n';
		o.attrAsObject = true;
		o.useAutomaton = false;
		o.automata = {
			prolog: ['<\\?[\\w]*', '[\\s]?\\?>', true],
			comment: ['<\\!--', '-->', false],
			doctype: ['<\\![\\w]*', '>', false]
		};
	}

	getFilePath(file, dir) {
		return dir === true ? file : path.resolve((dir || __dirname) + path.sep + file);
	}

	loadFromFile(file, dir) {
		var o = this;
		var filec = fs.readFileSync(o.getFilePath(file, dir)).toString();
		return filec;
	}

	parseFromFile(file, dir) {
		var o = this;
		return o.parseFromString(o.loadFromFile(file, dir));
	}

	parseFromString(str) {
		var o = this;
		o.str = str;
		o.dom = {
			elements: []
		};
		o.process();
		return o;
	}

	getDomJSON() {
		return JSON.stringify(this.dom);
	}

	domToString(dom, nowhite, pretty, prefix) {
		var o = this;
		if (!dom) dom = o.dom;
		var i, tn, prfx, chi, a, k, ch = dom.elements,
			l = ch ? ch.length : 0,
			start = '',
			end = '',
			content = [],
			pn = (pretty && dom.type ? o.prettyNewLine : '');
		if (pretty && dom.type) prefix = (prefix || []).concat(o.prettyPrefix);
		if (dom.type) {
			start = '<' + dom.type;
			if (dom.attr) {
				if (dom.attr.constructor === Array) {
					a = [];
					if (nowhite) {
						dom.attr.forEach(e => a.push(e.trim()));
						if (a.length > 0) start += ' ' + a.join(' ');
					} else {
						start += dom.attr.join('');
					}
				} else {
					a = [];
					for (k in dom.attr) {
						a.push(k + (dom.attr[k] === null ? '' : '="' + dom.attr[k] + '"'));
					}
					if (a.length > 0) start += ' ' + a.join(' ');
				}
			}
			start += (dom.closed && pretty ? ' ' : '') + dom.ending;
		}
		if (l > 0) {
			prfx = prefix ? prefix.join('') : '';
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
		if (dom.type && !dom.closed) {
			if (l === tn) {
				end = '</' + dom.type + '>';
			} else {
				prfx = prefix ? prefix.slice(0, prefix.length - 1).join('') : '';
				end = (pretty ? o.prettyNewLine : '') + prfx + '</' + dom.type + '>';
			}
		}
		return start + content.join('') + end;
	}

	search(type, attr, value, dom) {
		var o = this;
		if (!dom) dom = o.dom;
		var i, s, a = [],
			ch = dom.elements,
			l = ch ? ch.length : 0;
		if ((!type || dom.type === type) &&
			(!attr || (dom.attr && dom.attr.constructor === Object && (dom.attr[attr].split(new RegExp('\\s')).indexOf(value) !== -1)))) {
			a.push(dom);
		}
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
					ret = o.process(s, el);
					if (ret.closing && ret.rest) {
						ret = o.process(ret.rest, d);
					}
				} else ret = o.process(s, d);
			} else ret = tag;
		}
		return ret;
	}

	getTag(s) {
		var o = this;
		var t0, tag = s.match(new RegExp('<[/]?[\\w]*'));
		if (tag) {
			t0 = tag[0];
			tag.pre = tag.input.substr(0, tag.index);
			if (t0 === '<' && o.useAutomaton) {
				var ak, akt, atag;
				for (ak in o.automata) {
					akt = o.automata[ak];
					atag = tag.input.match(new RegExp(akt[0]));
					if (atag) {
						tag.auto = ak;
						tag.type = atag[0].substr(1);
						tag.closing = false;
						tag.rest = tag.input.substr(atag.index + atag[0].length);
						break;
					}
				}
			}
			if (!tag.type) {
				tag.closing = (t0.charAt(1) === '/');
				tag.rest = tag.input.substr(tag.index + t0.length + (tag.closing ? 1 : 0));
				tag.type = t0.substr(tag.closing ? 2 : 1);
			}
		}
		return tag;
	}

	getElement(type, closed, attr) {
		var el = {};
		el.type = type;
		el.closed = closed;
		el.ending = (closed ? '/' : '') + '>';
		el.attr = attr || {};
		if (!closed) el.elements = [];
		return el;
	}

	attributes(s, el) {
		var o = this;
		var a, at, attr, i, a0, lc, aa = [],
			noattr = (!el.auto || o.automata[el.auto][2] ? null : []);
		while (true) {
			a = s.match(new RegExp('[\\s|\\w]*[>|\'|\"]'));
			if (a) {
				a0 = a[0];
				lc = a0.charAt(a0.length - 1);
				if (lc === '\'' || lc === '"') {
					if (!noattr) {
						i = a.input.indexOf(lc, a.index + a0.length);
						aa.push(a.input.substr(0, i + 1));
						s = a.input.substr(i + 1);
					} else {
						noattr.push(a.input.substr(0, a.index + a0.length));
						s = a.input.substr(a.index + a0.length);
					}
				} else {
					attr = a.input.substr(0, a.index + a0.length);
					if (el.auto) {
						at = attr.match(o.automata[el.auto][1]);
						if (!at) {
							if (noattr) noattr.push(attr);
							s = a.input.substr(a.index + a0.length);
							continue;
						} else {
							attr = at.input.substr(0, at.index);
							(noattr ? noattr : aa).push(attr);
							s = a.input.substr(at.index + at[0].length);
						}
						el.closed = true;
						el.ending = (noattr ? noattr.join('') : '') + at.input.substr(at.index);
					} else {
						el.closed = (attr[attr.length - 2] === '/');
						el.ending = (el.closed ? '/' : '') + '>';
						aa.push(attr.substr(0, attr.length - el.ending.length));
					}
					if (aa[aa.length - 1] === '') aa.pop();
					if (aa.length > 0) {
						if (o.attrAsObject) {
							el.attr = {};
							aa.forEach(e => {
								var spl = e.split('='),
									k = spl[0].trim(),
									v = spl[1] ? spl[1].trim() : null,
									kspl = k.replace(new RegExp('[\\s]+', 'g'), ' ').split(' ');
								k = kspl.pop();
								kspl.forEach(kk => el.attr[kk] = null);
								el.attr[k] = (v === null ? null : v.substr(1, v.length - 2));
							});
						} else el.attr = aa;
					}
					s = a.input.substr(a.index + a0.length);
					break;
				}
			} else break;
		}
		return s;
	}

}

module.exports.HTMLParser = HTMLParser;
