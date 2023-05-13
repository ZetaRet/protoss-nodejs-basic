const rsn = require("./../../utils/nano/RequireSupername.js");
rsn.initRequireSupername();
rsn.loadFromJSON("namespacemap.json", __dirname);

global.ProtoSSCheStatsFile = __dirname + "/" + "apistats.json";

var mod = require("zetaret.node::index");
const server = mod.serverche();
console.log(server);

const apiControllerMod = require("zetaret.node.examples.apiprovider::APIController");
var apiController = new apiControllerMod.APIController();

var Router = require("zetaret.node.api::Router").Router;
var rinst = new Router();
rinst.prefix = "api.v2/";
rinst.addParamsPathListener(
	"profile/:profileid",
	function (server, robj, routeData, request, response) {
		console.log("profile:", robj.vars.profileid, robj, server.routeMap);
	},
	"GET",
	true
);

var route = {
	"favicon.ico": {},
	"api": {
		getdata: {},
		getdbdata: {},
		setdata: {},
		deletedata: {},
		postdata: {},
	},
	"auth": {
		login: {},
		logout: {},
	},
};
server.voya(route);

var p,
	paths = {
		"api/getdata": apiController.onGetData,
		"api/getdbdata": apiController.onGetDB,
		"api/setdata": apiController.onSetData,
		"api/deletedata": apiController.onDeleteData,
		"auth/login": apiController.onLogin,
		"auth/logout": apiController.onLogout,
	};

server.middleware.push(function (request, response, midobj) {
	console.log("Process Middleware first");

	var uri = response.__splitUrl.pages;
	var i,
		path = "",
		found = false;
	for (i = 0; i < uri.length; i++) {
		path += uri[i];
		if (paths[path]) {
			found = true;
			break;
		}
		path += "/";
	}
	if (!found) return false;
	console.log("Middleware:", request.headers, request.url, response.__splitUrl, midobj.body);
	console.log("Execute on " + path);
	return new Promise((resolver) => {
		console.log("Start Session check in Database.");
		setTimeout(() => {
			console.log("Session End.");
			resolver(false);
		}, 500);
	});
});

for (p in paths) server.addPathListener(p, paths[p]);

server.addMethodPathListener("POST", "api/postdata", function (server, robj, routeData, request, response) {
	console.log("Post data:", robj);
});

server.addParamsPathListener(
	"profile/:profileid",
	function (server, robj, routeData, request, response) {
		console.log("profile:", robj.vars.profileid, robj, server.routeMap);
	},
	"GET",
	true
);
server.addParamsPathListener(
	"page/{^[\\w|\\-]+$}",
	function (server, robj, routeData, request, response) {
		console.log("page:", robj.pages[1], robj, server.routeMap);
	},
	"GET",
	true
);

server.addRouter(rinst);
