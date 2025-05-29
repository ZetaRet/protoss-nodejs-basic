/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Requires: Subserver and stats.json
 * Example of Subserver
 * load from terminal as "node example.js"
 **/

global.EnableGlobalStatsFile = true;
global.GlobalStatsFile = { reqnum: 0, xserver: true, xserverModule: "#Subserver", htport: 7003 };

var protossche = require("./../../dist/index.js");

var serv = protossche.serverche();
console.log(serv);

serv.codeMap["node/login"] = 401;
serv.routeMap = {
	"": {},
	"node": {
		services: {
			service1: {},
			service2: {
				"*": {},
			},
		},
		contacts: {},
		throttle: {},
	},
};
var htmlplates = {
	home: "<html><head></head><body>$BODY</body></html>",
};

serv.addPathListener("", function (server, robj, routeData, request, response) {
	if (robj.exact && robj.pages.length === 0) {
		response.__headers["content-type"] = "text/plain";
		response.__data.push("root or home content");
	}
	if (robj.pages.length > 0) response.__rcode = server.noRouteCode;
});
serv.addPathListener("node", function (server, robj, routeData, request, response) {
	if (robj.exact) {
		response.__headers["content-type"] = "text/html";
		response.__data.push(htmlplates.home.replace("$BODY", "Node home as HTML"));
	} else {
		response.__headers["content-type"] = "text/plain";
	}
});
serv.addPathListener("node/throttle", function (server, robj, routeData, request, response) {
	response.__data.push("async response after 1 second");
	response.__async = true;
	setTimeout(function () {
		response.__asyncEnd();
	}, 1000);
});
serv.addPathListener("node/contacts", function (server, robj, routeData, request, response) {
	if (robj.exact) {
		response.__headers["content-type"] = "application/json";
		response.__data.push(
			JSON.stringify({
				contactme: "@localhost",
				node: "protoss",
			})
		);
	}
});
serv.addPathListener("node/services", function (server, robj, routeData, request, response) {
	if (robj.exact) response.__data.push("Services \n");
});
serv.addPathListener("node/services/service1", function (server, robj, routeData, request, response) {
	response.__data.push("New service 1");
});
serv.addPathListener("node/services/service2", function (server, robj, routeData, request, response) {
	response.__data.push("New service 2 \n");
	response.__data.push(robj.param);
});

console.log("Route list:");
serv.debugRouteList.forEach((r) => console.log(r));
