/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * HTML cache from parser
 **/

var fs = require('fs'),
	path = require('path'),
	events = require('events');

const EVENTS = {
	ADD_PAGE: 'addPage',
	EXE_PAGE: 'exePage',
	RENDER_CONTENT: 'renderContent'
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
		return o;
	}

	getStruct(id) {
		var o = this;
		var c, s = o.structs[id];
		if (s.constructor === Array) c = s.map(e => o.getStruct(e)).join('');
		else c = o.getPage(s);
		return c;
	}

	addPage(page, parser, hfile, dir) {
		var o = this;
		var pdata = {
			parser: parser,
			hfile: hfile,
			dir: dir,
			hfileloc: '',
			binders: null,
			execfg: null,
			content: ''
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
		pdata.content = '';
		o.resetBinders(page);
		if (cfg.swapjs) o.swapJS(page, cfg.jsh, cfg.despacejs);
		if (cfg.swapcss) o.swapCSS(page, cfg.cssh, cfg.despacecss);
		o.events.emit(EVENTS.EXE_PAGE, page, pdata, o);
		return pdata;
	}

	renderContent(page) {
		var o = this;
		var c, pdata = o.pages[page],
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
				pdata.content = '';
				o.resetBinders(p);
			}
		}
	}

	recache(page) {
		var o = this;
		var pdata = o.pages[page],
			hpinst = pdata.parser;
		hpinst.parseFromFile(hpinst.file, hpinst.dir);
		o.exePage(page, pdata.execfg);
	}

	setPages(pages, HTMLParser, watchers, log) {
		var o = this;
		var hpinst, p, op;

		for (p in pages) {
			op = pages[p];
			hpinst = new HTMLParser();
			hpinst.useAutomaton = op.useAutomaton || false;
			hpinst.debug = op.debug || false;
			if (op.closeTags) hpinst.closeTags.splice(0, 0, ...op.closeTags);
			hpinst.parseFromFile(op.hfile, op.dir);
			o.addPage(op.id, hpinst, op.hfile, op.dir);
			if (log) {
				console.log(hpinst.getDomJSON());
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
		hpinst.search('link', 'type', 'text/css').forEach(e => {
			var swap, pr, f = e.attr.href;
			if (f) {
				pr = path.resolve(pdata.hfileloc, f);
				if (fs.existsSync(pr)) {
					delete e.attr.href;
					delete e.attr.rel;
					e.type = 'style';
					e.closed = false;
					e.ending = '>';
					e.elements = [fs.readFileSync(pr).toString()];
					if (despace) e.elements[0] = o.despace(e.elements[0], 'css');
					swap = true;
					if (o.watchFiles) o.watchFile(pr, page, 'css');
				}
			}
			if (handler) handler(page, pdata, e, swap);
		});
	}

	swapJS(page, handler, despace) {
		var o = this;
		var pdata = o.pages[page],
			hpinst = pdata.parser;
		hpinst.search('script', 'type', 'text/javascript').forEach(e => {
			var swap, pr, f = e.attr.src;
			if (f) {
				pr = path.resolve(pdata.hfileloc, f);
				if (fs.existsSync(pr)) {
					delete e.attr.src;
					e.elements = [fs.readFileSync(pr).toString()];
					if (despace) e.elements[0] = o.despace(e.elements[0], 'js');
					swap = true;
					if (o.watchFiles) o.watchFile(pr, page, 'js');
				}
			}
			if (handler) handler(page, pdata, e, swap);
		});
	}

	defaultRenderTemplate(hcache, page, pdata, hpinst, cfg) {
		hpinst.search('#template').forEach(t => {
			var sp = t.attr.section;
			t.norender = true;
			if (pdata.binders) pdata.binders[sp] = true;
			t.elements = !cfg.domtemplate ? [hcache.getPage(sp)] : hcache.pages[sp].parser.dom.elements;
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
				if (recacheOnChange && e === 'change') o.recache(page);
				if (listener) listener(e, f, longfile, page, type, stats);
			}, watchinterval);
		}

		return {
			watchers, watchinterval, watchmethod
		};
	}

	watchFile(pr, page, type) {
		var o = this;
		if (o.watchMap[pr]) o.watchMap[pr].close();
		o.watchMap[pr] = fs.watch(pr, o.watchOptions, (e, f) => o.watchListener(e, f, pr, page, type, fs.statSync(pr)));
	}

	resetWatchers() {
		var o = this;
		var k;
		for (k in o.watchMap) o.watchMap[k].close();
		o.watchMap = {};
	}

	despace(v, type) {
		var o = this;
		if (!o.despaceRules[' ']) v = v.replace(new RegExp('[\\s]+', 'g'), ' ', v);
		var i, chars = (o.despaceChars[type] || ':(|{}=,\?\!\&\-\+\*/%<>');
		for (i = 0; i < chars.length; i++) v = v.replace(new RegExp('[\\s]*[' + chars.charAt(i) + '][\\s]*', 'g'), chars.charAt(i));
		if (!o.despaceRules['^']) v = v.replace(new RegExp('[\\s]*[\\^][\\s]*', 'g'), '^');
		if (!o.despaceRules['.']) v = v.replace(new RegExp('[.][\\s]*', 'g'), '.');
		if (!o.despaceRules['[']) v = v.replace(new RegExp('[\\[][\\s]*', 'g'), '[');
		if (!o.despaceRules[']']) v = v.replace(new RegExp('[\\s]*[\\]]', 'g'), ']');
		if (!o.despaceRules[')']) v = v.replace(new RegExp('[\\s]*[\\)]', 'g'), ')');
		if (!o.despaceRules[';']) v = v.replace(new RegExp('[;][\\s]*', 'g'), ';');
		return v;
	}

}

module.exports.EVENTS = EVENTS;
module.exports.HTMLCache = HTMLCache;