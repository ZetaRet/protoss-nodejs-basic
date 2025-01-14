/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * HTML cache from parser
 **/

var fs = require("fs"),
	path = require("path"),
	events = require("events");

const EVENTS = {
	SET_STRUCT: "setStruct",
	ADD_PAGE: "addPage",
	EXE_PAGE: "exePage",
	RENDER_CONTENT: "renderContent",
	RECACHE: "recache",
	SWAP_JS: "swapJs",
	SWAP_CSS: "swapCss",
	WATCH: "watch",
	ON_WATCH: "onWatch",
	WATCH_FILE: "watchFile",
	RESET_WATCHERS: "resetWatchers",
};

class HTMLCache {
	constructor() {
		var o = this;
		o.structs = {};
		o.autoStructPage = true;
		o.pages = {};
		o.despaceChars = {};
		o.despaceRules = {};
		o.watchFiles = false;
		o.watchOptions = null;
		o.watchListener = null;
		o.watchMap = {};
		o.events = new events.EventEmitter();
	}

	setStruct(id, pagesOrStructIds) {
		var o = this;
		o.structs[id] = pagesOrStructIds;
		o.events.emit(EVENTS.SET_STRUCT, id, o);
		return o;
	}

	getStruct(id) {
		var o = this;
		var c,
			s = o.structs[id];
		if (s.constructor === Array) c = s.map((e) => o.getStruct(e)).join("");
		else c = o.getPage(s);
		return c;
	}

	addPage(page, parser, hfile, dir) {
		var o = this;
		var pdata = {
			parser: parser,
			hfile: hfile,
			dir: dir,
			hfileloc: "",
			binders: null,
			execfg: null,
			content: "",
		};
		parser.id = page;
		var hfileloc = path.resolve(path.resolve(dir, hfile)).split(path.sep);
		hfileloc.pop();
		pdata.hfileloc = hfileloc.join(path.sep);
		o.pages[page] = pdata;
		if (o.autoStructPage) o.structs[page] = page;
		o.events.emit(EVENTS.ADD_PAGE, page, pdata, o);
		return pdata;
	}

	getPage(page) {
		return this.pages[page].content || this.renderContent(page);
	}

	exePage(page, cfg) {
		var o = this;
		var pdata = o.pages[page],
			hpinst = pdata.parser;
		if (!cfg) cfg = {};
		pdata.execfg = cfg;
		pdata.binders = {};
		pdata.content = "";
		o.execDom(hpinst, page, pdata);
		o.resetBinders(page);
		if (cfg.swapjs) o.swapJS(page, cfg.jsh, cfg.despacejs);
		if (cfg.swapcss) o.swapCSS(page, cfg.cssh, cfg.despacecss);
		o.events.emit(EVENTS.EXE_PAGE, page, pdata, o);
		return pdata;
	}

	renderContent(page) {
		var o = this;
		var c,
			pdata = o.pages[page],
			hpinst = pdata.parser,
			cfg = pdata.execfg;
		o.events.emit(EVENTS.RENDER_CONTENT, page, pdata, o);
		if (cfg.render) cfg.render(o, page, pdata, hpinst, cfg);
		c = hpinst.domToString(hpinst.dom, cfg.nowhite, cfg.pretty);
		if (!cfg.nocontent) pdata.content = c;
		return c;
	}

	resetBinders(page) {
		var o = this;
		var p, pdata;
		for (p in o.pages) {
			pdata = o.pages[p];
			if (pdata.binders && pdata.binders[page]) {
				pdata.content = "";
				o.resetBinders(p);
			}
		}
	}

	recache(page) {
		var o = this;
		var pdata = o.pages[page],
			hpinst = pdata.parser;
		o.events.emit(EVENTS.RECACHE, page, pdata, o);
		hpinst.parseFromFile(hpinst.file, hpinst.dir);
		o.exePage(page, pdata.execfg);
	}

	execDom(hpinst, id, pdata) {
		var o = this;
		var exes = hpinst.search(null, hpinst.exeOn, hpinst.exeAttr);
		if (exes.length > 0) {
			exes.forEach((el) => {
				let method = el.attr[hpinst.exeJS];
				if (!method) return;
				let marr = method.split(" ");
				marr.forEach((mel) => {
					if (hpinst.exeMethods[mel]) {
						hpinst.exeMethods[mel](el, o, hpinst, id, pdata);
					}
				});
				if (hpinst.exeDeleteOnSet) {
					delete el.attr[hpinst.exeOn];
					delete el.attr[hpinst.exeJS];
				}
			});
		}
	}

	setPages(pages, HTMLParser, watchers, log, decorateParser) {
		var o = this;
		var hpinst, p, op;

		for (p in pages) {
			op = pages[p];
			hpinst = new HTMLParser();
			if (decorateParser) decorateParser(hpinst, o, p, op);
			hpinst.useAutomaton = op.useAutomaton || false;
			hpinst.debug = op.debug || false;
			if (op.closeTags) hpinst.closeTags = op.closeTags;
			if (op.cfgParser) op.cfgParser(hpinst, p, op);
			hpinst.parseFromFile(op.hfile, op.dir);
			o.addPage(op.id, hpinst, op.hfile, op.dir);
			if (log) {
				console.log("\x1b[34m #Get Dom JSON:\x1b[0m");
				console.log(hpinst.getDomJSON());
				console.log("\x1b[34m #Dom To String:\x1b[0m");
				console.log(hpinst.domToString());
			}
		}
		if (watchers) o.watch(watchers.watchmethod);
		for (p in pages) {
			op = pages[p];
			o.exePage(op.id, op.exe);
		}
	}

	swapCSS(page, handler, despace) {
		var o = this;
		var pdata = o.pages[page],
			hpinst = pdata.parser;
		o.events.emit(EVENTS.SWAP_CSS, page, pdata, o);
		hpinst.search("link", "type", "text/css").forEach((e) => {
			var swap,
				browserpath,
				pr,
				f = e.attr.href,
				fileid = f.split("/").pop(),
				prefix = e.attr.prefix,
				base = e.attr.base;

			if (base) {
				browserpath = path.join(base, fileid).split("\\").join("/");
				delete e.attr.base;
				e.attr.href = browserpath;
			} else if (prefix) {
				browserpath = path.join(prefix, f).split("\\").join("/");
				delete e.attr.prefix;
				e.attr.href = browserpath;
			} else if (f) {
				pr = path.resolve(pdata.hfileloc, f);
				if (fs.existsSync(pr)) {
					delete e.attr.href;
					delete e.attr.rel;
					e.type = "style";
					e.closed = false;
					e.ending = ">";
					e.elements = [fs.readFileSync(pr).toString()];
					if (despace) e.elements[0] = o.despace(e.elements[0], "css");
					swap = true;
					if (o.watchFiles) o.watchFile(pr, page, "css");
				}
			}
			if (handler) handler(page, pdata, e, swap);
		});
	}

	swapJS(page, handler, despace) {
		var o = this;
		var pdata = o.pages[page],
			hpinst = pdata.parser;
		o.events.emit(EVENTS.SWAP_JS, page, pdata, o);
		hpinst.search("script", "type", "text/javascript").forEach((e) => {
			var swap,
				browserpath,
				pr,
				f = e.attr.src,
				fileid = f.split("/").pop(),
				prefix = e.attr.prefix,
				base = e.attr.base;

			if (base) {
				browserpath = path.join(base, fileid).split("\\").join("/");
				delete e.attr.base;
				e.attr.src = browserpath;
			} else if (prefix) {
				browserpath = path.join(prefix, f).split("\\").join("/");
				delete e.attr.prefix;
				e.attr.src = browserpath;
			} else if (f) {
				pr = path.resolve(pdata.hfileloc, f);
				if (fs.existsSync(pr)) {
					delete e.attr.src;
					e.elements = [fs.readFileSync(pr).toString()];
					if (despace) e.elements[0] = o.despace(e.elements[0], "js");
					swap = true;
					if (o.watchFiles) o.watchFile(pr, page, "js");
				}
			}
			if (handler) handler(page, pdata, e, swap);
		});
	}

	defaultRenderTemplate(hcache, page, pdata, hpinst, cfg) {
		hpinst.search("#template").forEach((t) => {
			var sp = t.attr.section;
			t.norender = true;
			if (pdata.binders) pdata.binders[sp] = true;
			if (cfg.exetemplate) cfg.exetemplate(t, sp, hcache, page, pdata, hpinst, cfg);
			if (!t.attr.nodom) t.elements = !cfg.domtemplate ? [hcache.getPage(sp)] : hcache.pages[sp].parser.dom.elements;
		});
	}

	watch(listener, options) {
		var o = this;
		var k, pdata, hpinst;
		o.watchFiles = true;
		o.watchOptions = options;
		o.watchListener = listener;
		for (k in o.pages) {
			pdata = o.pages[k];
			hpinst = pdata.parser;
			hpinst.watchFiles = true;
			hpinst.watchOptions = options;
			hpinst.watchListener = listener;
			hpinst.watchFile();
		}
		o.events.emit(EVENTS.WATCH, o);
	}

	getWatchers(listener, interval, debug, recacheOnChange) {
		var o = this;
		var watchers = {},
			watchinterval = interval || 0;

		function watchmethod(e, f, longfile, page, type, stats) {
			if (watchers[longfile] !== undefined) return;
			watchers[longfile] = setTimeout(() => {
				delete watchers[longfile];
				if (debug) console.log(e, f, longfile, page, type, stats);
				if (recacheOnChange && e === "change") o.recache(page);
				if (listener) listener(e, f, longfile, page, type, stats);
				o.events.emit(EVENTS.ON_WATCH, e, f, longfile, page, type, stats, o);
			}, watchinterval);
		}

		return {
			watchers,
			watchinterval,
			watchmethod,
		};
	}

	watchFile(pr, page, type) {
		var o = this;
		if (o.watchMap[pr]) o.watchMap[pr].close();
		o.watchMap[pr] = fs.watch(pr, o.watchOptions, (e, f) => o.watchListener(e, f, pr, page, type, fs.statSync(pr)));
		o.events.emit(EVENTS.WATCH_FILE, pr, page, type, o);
	}

	resetWatchers() {
		var o = this;
		var k;
		o.events.emit(EVENTS.RESET_WATCHERS, o);
		for (k in o.watchMap) o.watchMap[k].close();
		o.watchMap = {};
	}

	despace(v, type) {
		var o = this;
		if (!o.despaceRules[" "]) v = v.replace(new RegExp("[\\s]+", "g"), " ", v);
		var i,
			chars = o.despaceChars[type] || ":(|{}=,?!&-+*/%<>";
		for (i = 0; i < chars.length; i++)
			v = v.replace(new RegExp("[\\s]*[" + chars.charAt(i) + "][\\s]*", "g"), chars.charAt(i));
		if (!o.despaceRules["^"]) v = v.replace(new RegExp("[\\s]*[\\^][\\s]*", "g"), "^");
		if (!o.despaceRules["."]) v = v.replace(new RegExp("[.][\\s]*", "g"), ".");
		if (!o.despaceRules["["]) v = v.replace(new RegExp("[\\[][\\s]*", "g"), "[");
		if (!o.despaceRules["]"]) v = v.replace(new RegExp("[\\s]*[\\]]", "g"), "]");
		if (!o.despaceRules[")"]) v = v.replace(new RegExp("[\\s]*[\\)]", "g"), ")");
		if (!o.despaceRules[";"]) v = v.replace(new RegExp("[;][\\s]*", "g"), ";");
		return v;
	}
}

module.exports.EVENTS = EVENTS;
module.exports.HTMLCache = HTMLCache;
