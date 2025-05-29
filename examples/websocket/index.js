const rsn = require("./../../dist/utils/nano/RequireSupername.js");
rsn.initRequireSupername();
rsn.loadFromJSON("namespacemap.json", __dirname);

// zetaret.node.modules::Voyage
global.ProtoSSCheStatsFile = __dirname + "/" + "stats.json";

const mod = require("zetaret.node::index");

var route = {
		"favicon.ico": {},
		"home": {},
		"api": {
			addclient: {},
			getclients: {},
			sendmessage: {},
			getmessages: {},
			addgroup: {},
			getgroups: {},
		},
	},
	server = mod.serverche();

server.autoCookie = true;
server.voya(route);

console.log(server);

const FECMod = require("websocket.example.controllers::FrontEndController");
const fec = new FECMod.FrontEndController();
fec.addServer(server);

const ACMod = require("websocket.example.controllers::APIController");
const apic = new ACMod.APIController();
apic.addServer(server);

const SCMod = require("websocket.example.controllers::SocketController");
const sc = new SCMod.SocketController(apic);
sc.debug = true;
