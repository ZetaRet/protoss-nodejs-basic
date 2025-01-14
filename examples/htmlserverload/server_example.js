const rsn = require("./../../utils/nano/RequireSupername.js");
rsn.initRequireSupername();
rsn.loadFromJSON("namespacemap.json", __dirname);

global.ProtoSSCheStatsFile = __dirname + "/" + "stats.json";

const { join } = require("path");

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

function exportServerVar(name, json, pretty) {
	return "var " + name + "=" + JSON.stringify(json, null, pretty ? 2 : null);
}

var currentSessionData = { profileName: "LoggedUser1", profileDescription: "Logged User Description" };

const watchers = htcache.getWatchers(null, 500, true, true);
function decorateParser(hpinst, o, p, op) {
	hpinst.jsonSpace = 2;
	//hpinst.exeDeleteOnSet = true;
	hpinst.exeMethods.addDataHeadScript = function (el, htcache, hpinst, p, op) {
		console.log("#addDataHeadScript", p, el);
		let expvar = { any: { name: "server" }, num: 3, bool: true, tostr: "string", time: new Date().toISOString() };
		el.elements.push(exportServerVar("exportedVar", expvar));
	};
	hpinst.exeMethods.addDataHeadScript2 = function (el, htcache, hpinst, p, op) {
		console.log("#addDataHeadScript2", p, el);
		let expvar = { anyData2: { name2: "fromServer" }, num2: 3, bool2: true, tostr2: "string" };
		el.elements.push(exportServerVar("exportedVar2", expvar, true));
	};
	hpinst.exeMethods.exeAppScreen = function (el, htcache, hpinst, p, op) {
		console.log("#exeAppScreen", p, el);
		el.elements.push(hpinst.getElement("div", false, { id: "app-screen-inset" }));
		el.elements.push("\n");
	};
	hpinst.exeMethods.exeProfileDescription = function (el, htcache, hpinst, p, op) {
		console.log("#exeProfileDescription", p, el);
		el.elements[0] = replaceParams(el.elements[0], currentSessionData);
	};
}
htcache.setPages(PAGES, htmlparser.HTMLParser, watchers, true, decorateParser);

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

const { ListDir } = require("zetaret.node.utils.web::ListDir");

ListDir(server, "assets", join(__dirname, "/html"), { ext: ["js", "css"] });
