/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * HTML cache from parser
 **/

var fs = require('fs'),
	path = require('path');

class HTMLCache {
	constructor() {
		var o = this;
		o.pages = {};
		o.despaceChars = {};
		o.despaceRules = {};
	}

	addPage(page, parser, hfile, dir) {
		var o = this;
		var pdata = {
			parser: parser,
			hfile: hfile,
			dir: dir,
			content: ''
		};
		var hfileloc = path.resolve(path.resolve(dir, hfile)).split(path.sep);
		hfileloc.pop();
		pdata.hfileloc = hfileloc.join(path.sep);
		o.pages[page] = pdata;
		return pdata;
	}

	getPage(page) {
		return this.pages[page].content;
	}

	exePage(page, cfg) {
		var o = this;
		var pdata = o.pages[page],
			hpinst = pdata.parser;
		if (!cfg) cfg = {};
		if (cfg.swapjs) o.swapJS(page, cfg.jsh, cfg.despacejs);
		if (cfg.swapcss) o.swapCSS(page, cfg.cssh, cfg.despacecss);
		pdata.execfg = cfg;
		pdata.content = hpinst.domToString(hpinst.dom, cfg.nowhite, cfg.pretty);
		return pdata;
	}

	recache(page) {
		var o = this;
		var pdata = o.pages[page],
			hpinst = pdata.parser;
		hpinst.parseFromFile(hpinst.file, hpinst.dir);
		o.exePage(page, pdata.execfg);
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
				}
			}
			if (handler) handler(page, pdata, e, swap);
		});
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

module.exports.HTMLCache = HTMLCache;