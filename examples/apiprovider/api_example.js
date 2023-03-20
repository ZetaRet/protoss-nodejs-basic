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

for (p in paths) server.addPathListener(p, paths[p]);
