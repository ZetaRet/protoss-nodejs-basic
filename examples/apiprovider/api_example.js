const rsn = require("./../../utils/nano/RequireSupername.js");
rsn.initRequireSupername();
rsn.loadFromJSON("namespacemap.json", __dirname);

global.ProtoSSCheStatsFile = __dirname + "/" + "apistats.json";

var mod = require("zetaret.node::index");
const server = mod.serverche();
console.log(server);

const apiControllerMod = require("zetaret.node.examples.apiprovider::APIController");
var apiController = new apiControllerMod.APIController();

var route = {
	"favicon.ico": {},
	api: {
		getdata: {},
		setdata: {},
		deletedata: {},
	},
	auth: {
		login: {},
		logout: {},
	},
};
server.voya(route);

var p,
	paths = {
		"api/getdata": apiController.onGetData,
		"api/setdata": apiController.onSetData,
		"api/deletedata": apiController.onDeleteData,
		"auth/login": apiController.onLogin,
		"auth/logout": apiController.onLogout,
	};

server.middleware.push(function (request, response, body) {
	console.log("Middleware first:", request.headers, request.url, response.__splitUrl, body);

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