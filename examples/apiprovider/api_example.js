const rsn = require("./../../utils/nano/RequireSupername.js");
rsn.initRequireSupername();
rsn.loadFromJSON("namespacemap.json", __dirname);

global.ProtoSSCheStatsFile = __dirname + "/" + "apistats.json";

var mod = require("zetaret.node::index");
const server = mod.serverche();
console.log(server);

const { APIController } = require("zetaret.node.examples.apiprovider::APIController");
var apiController = new APIController();

const { Router } = require("zetaret.node.api::Router");
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
	middlewarePaths = {},
	paths = {
		"api/getdata": apiController.onGetData,
		"api/getdbdata": apiController.onGetDB,
		"api/setdata": apiController.onSetData,
		"api/deletedata": apiController.onDeleteData,
		"auth/login": apiController.onLogin,
		"auth/logout": apiController.onLogout,
	};
for(p in paths) middlewarePaths[p] = true;

server.middleware.push(function (request, response, midobj) {
	var uri = response.__splitUrl.pages;
	console.log("Process Middleware first:", uri);

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
server.addParamsPathListener(
	"api.v3_beta/GetData/:dataid",
	function (server, robj, routeData, request, response) {
		console.log("api v3 page:", robj.vars.dataid, robj, server.routeMap);
	},
	"GET",
	true
);

server.addRouter(rinst);

const DataValidator = require("zetaret.node.api.DataValidator").DataValidator;
var dv = new DataValidator();
dv.log = true;
var data = {
	key1: 3,
	key2: "Astral-1",
	key3: false,
	key4: "CustomStringToPassTest",
	key6: {
		k1: "Star",
		k2: null,
		k3: true,
	},
	key7: [1, 2, 5],
};
var validator = {
	key1: { required: true, type: "number", min: 0 },
	key2: { type: "string", regexp: new RegExp("^[\\w|\\-]+$") },
	key3: { type: "bool" },
	key4: { type: "func", tester: (k, value) => value === "CustomStringToPassTest" },
	key5: { required: true, type: "string", defaults: "key5value" },
	key6: { required: true, validation: { k1: { type: "string" }, k2: { type: "number" }, k3: { type: "bool" } } },
	key7: { required: true, type: "array", validation: {}, element: { type: "number" } },
};
console.log("Validator:", dv.validate(data, validator), data);

const snippetExampleModule = require("./APISnippetExample");
const router1 = new snippetExampleModule.Router();
router1.initCRUD("api.v3/", server, "addParamsPathListener");
console.log(router1);
