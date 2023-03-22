const rsn = require("./../../utils/nano/RequireSupername.js");
rsn.initRequireSupername();
rsn.loadFromJSON("namespacemap.json", __dirname);

global.ProtoSSCheStatsFile = __dirname + "/" + "stats.json";

var mod = require("zetaret.node::index");
const server = mod.serverche();
console.log(server);

var htmlparser = require("zetaret.node.utils.html::HTMLParser"),
	htmlcache = require("zetaret.node.utils.html::HTMLCache"),
	htcache = new htmlcache.HTMLCache();

const PAGES = {
	HEAD: {
		id: "head",
		hfile: "./html/head.html",
	},
	HOME: {
		id: "home",
		hfile: "./html/home.html",
	},
};
const DEFAULT_PAGE = {
	dir: __dirname,
	useAutomaton: true,
	debug: true,
	closeTags: ["script", "style"],
	exe: {
		swapjs: true,
		swapcss: true,
		despacejs: true,
		despacecss: true,
		render: htcache.defaultRenderTemplate,
	},
};
for (var p in PAGES) {
	PAGES[p] = {
		...DEFAULT_PAGE,
		...PAGES[p],
	};
}

var currentSessionData = { profileName: "LoggedUser1" };

const watchers = htcache.getWatchers(null, 500, true, true);

htcache.setPages(PAGES, htmlparser.HTMLParser, watchers, true);

function isLocal(req) {
	return ["::1", "127.0.0.1"].indexOf(req.connection.remoteAddress) !== -1;
}

function replaceParams(string, data, prefix, suffix) {
	if (!prefix) prefix = "{{";
	if (!suffix) suffix = "}}";
	var regex = new RegExp(prefix + "(" + Object.keys(data).join("|") + ")" + suffix, "g");
	return string.replace(regex, (m, $1) => data[$1] || m);
}

server.addPathListener("", function (server, robj, routeData, request, response) {
	response.__headers["content-type"] = "text/html";
	if (robj.vars.recache && isLocal(request)) htcache.recache(PAGES.HOME.id);
	response.__data.push(replaceParams(htcache.getStruct(PAGES.HOME.id), currentSessionData));
});
