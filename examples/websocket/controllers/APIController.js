var chatcontrollermodule = require("zetaret.node.api::ChatController");

class APIController extends chatcontrollermodule.ChatController {
	constructor() {
		super();
		this.api = ["addclient", "getclients", "sendmessage", "getmessages", "addgroup", "getgroups"];
		this.db = {
			users: {},
			groups: {
				all: [],
			},
			messages: {},
		};
	}

	pushdata(response, data) {
		super.pushData(response, data);
	}

	addclient(server, robj, routeData, request, response) {
		super.addClient(server, robj, routeData, request, response);
	}

	getclients(server, robj, routeData, request, response) {
		super.getClients(server, robj, routeData, request, response);
	}

	addmessage(user, msg) {
		return super.addMessage(user, msg);
	}

	sendmessage(server, robj, routeData, request, response) {
		super.sendMessage(server, robj, routeData, request, response);
	}

	getmessages(server, robj, routeData, request, response) {
		super.getMessages(server, robj, routeData, request, response);
	}

	addgroup(server, robj, routeData, request, response) {
		super.addGroup(server, robj, routeData, request, response);
	}

	getgroups(server, robj, routeData, request, response) {
		super.getGroups(server, robj, routeData, request, response);
	}
}

module.exports.APIController = APIController;
