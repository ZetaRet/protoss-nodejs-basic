var protossche = require('./index.js');

protossche.serverche.codeMap['node/login'] = 401;
protossche.serverche.routeMap = {
	"": {},
	"node": {
		"services": {
			"service1": {},
			"service2": {
				"*": {}
			}
		},
		"contacts": {}
	}
};
var htmlplates = {
	home: "<html><head></head><body>$BODY</body></html>"
};
protossche.serverche.addPathListener("", function(server, robj, routeData, request, response) {
	if (robj.exact && robj.pages.length === 0) {
		response.__headers['content-type'] = 'text/plain';
		response.__data.push('root or home content');
	}
	if (robj.pages.length > 0) response.__rcode = server.noRouteCode;
});
protossche.serverche.addPathListener("node", function(server, robj, routeData, request, response) {
	if (robj.exact) {
		response.__headers['content-type'] = 'text/html';
		response.__data.push(htmlplates.home.replace('$BODY', 'Node home as HTML'));
	} else {
		response.__headers['content-type'] = 'text/plain';
	}
});
protossche.serverche.addPathListener("node/contacts", function(server, robj, routeData, request, response) {
	if (robj.exact) {
		response.__headers['content-type'] = 'application/json';
		response.__data.push(JSON.stringify({
			contactme: "@localhost",
			node: "protoss"
		}));
	}
});
protossche.serverche.addPathListener("node/services", function(server, robj, routeData, request, response) {
	if (robj.exact) response.__data.push('Services \n');
});
protossche.serverche.addPathListener("node/services/service1", function(server, robj, routeData, request, response) {
	response.__data.push('New service 1');
});
protossche.serverche.addPathListener("node/services/service2", function(server, robj, routeData, request, response) {
	response.__data.push('New service 2 \n');
	response.__data.push(robj.param);
});
