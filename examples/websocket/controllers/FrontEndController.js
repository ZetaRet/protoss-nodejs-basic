var htmlparser = require("zetaret.node.utils.html::HTMLParser"),
	htmlcache = require("zetaret.node.utils.html::HTMLCache");

class FrontEndController {
	constructor() {
		this.htcache = new htmlcache.HTMLCache();
		this.PAGES = {
			HOME: {
				id: "home",
				hfile: "./../html/apitest.html",
			},
			CHAT_BODY: {
				id: "chatbody",
				hfile: "./../html/chatbody.html",
			},
		};
		this.DEFAULT_PAGE = {
			dir: __dirname,
			useAutomaton: true,
			debug: true,
			closeTags: ["script", "style"],
			exe: {
				nowhite: true,
				pretty: true,
				swapjs: true,
				swapcss: true,
				despacejs: true,
				despacecss: true,
				render: this.htcache.defaultRenderTemplate,
			},
		};
		this.server = null;
		this.configPages();
	}

	configPages() {
		var o = this;
		var p,
			watchers = o.htcache.getWatchers(null, 500, true, true);
		for (p in o.PAGES) {
			o.PAGES[p] = {
				...o.PAGES[p],
				...o.DEFAULT_PAGE,
			};
		}
		o.htcache.events.on(htmlcache.EVENTS.ADD_PAGE, (page, pdata, hc) => {
			console.log(page);
			pdata.parser.prettyPrefix = "";
		});
		o.htcache.setPages(o.PAGES, htmlparser.HTMLParser, watchers, true);
	}

	addServer(server) {
		var o = this;
		o.server = server;
		server.addPathListener("", o.root.bind(o));
		server.addPathListener(o.PAGES.HOME.id, o.home.bind(o));
	}

	root(server, robj, routeData, request, response) {
		var o = this;
		o.home(server, robj, routeData, request, response);
	}

	home(server, robj, routeData, request, response) {
		var o = this;
		response.__headers["content-type"] = "text/html";
		response.__data.push(o.htcache.getStruct(o.PAGES.HOME.id));
	}
}

module.exports.FrontEndController = FrontEndController;
