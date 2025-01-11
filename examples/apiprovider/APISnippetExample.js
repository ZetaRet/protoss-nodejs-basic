class Router {
	constructor() {
		this.apicontroller = new APIController();
	}

	initialize(routes, serverOrRouter, listenerName) {
		for (var k in routes) {
			let v = routes[k];
			switch (listenerName) {
				case "addMethodPathListener":
					serverOrRouter.addMethodPathListener(v.method, k, this.apicontroller["on" + v.callback], v.method);
					break;
				case "addParamsPathListener":
					serverOrRouter.addParamsPathListener(k, this.apicontroller["on" + v.callback], v.method, true);
					break;
				default:
					serverOrRouter[listenerName](k, this.apicontroller["on" + v.callback]);
			}
		}
	}

	initCRUD(prefix, serverOrRouter, listenerName) {
		var routes = {};
		routes[prefix + "GetData/:dataid"] = { callback: "GetData", method: "GET" };
		routes[prefix + "SetData"] = { callback: "SetData", method: "POST" };
		routes[prefix + "PostData"] = { callback: "PostData", method: "POST" };
		routes[prefix + "DeleteData/:dataid"] = { callback: "DeleteData", method: "GET" };
		routes[prefix + "GetDB"] = { callback: "GetDB", method: "POST" };

		this.initialize(routes, serverOrRouter, listenerName);
	}
}

class DataService {
	constructor() {}

	onGetData(server, robj, routeData, request, response) {
		console.log("Get Data Service");
		console.log(robj);
		this.setJSON({ testdata: { key1: "2" } }, response);
	}

	onSetData(server, robj, routeData, request, response) {
		console.log("Set Data Service");
		console.log(robj);
		this.setJSON({ result: "success" }, response);
	}

	onPostData(server, robj, routeData, request, response) {
		console.log("Post Data Service");
		console.log(robj);
		this.setJSON({ result: "success" }, response);
	}

	onDeleteData(server, robj, routeData, request, response) {
		console.log("Delete Data Service");
		console.log(robj);
		this.setJSON({ result: "success" }, response);
	}

	onGetDB(server, robj, routeData, request, response) {
		console.log("Get DB Service");
		console.log(robj);
		var dbdataPromiseObject = this.onGetDBData();
		response.__data.push(dbdataPromiseObject);
	}

	async onGetDBData() {
		var dataFromDB = await new Promise((resolve) => {
			setTimeout(() => resolve({ dbdata: [] }), 500);
		});
		return dataFromDB;
	}

	setJSON(data, response) {
		response.__json(data);
	}
}

class APIController {
	constructor() {
		this.dataService = new DataService();

		this.onGetData = this.onGetData.bind(this);
		this.onSetData = this.onSetData.bind(this);
		this.onPostData = this.onPostData.bind(this);
		this.onDeleteData = this.onDeleteData.bind(this);
		this.onGetDB = this.onGetDB.bind(this);
	}

	onGetData(server, robj, routeData, request, response) {
		console.log("Get Data APIController");
		this.dataService.onGetData(server, robj, routeData, request, response);
	}

	onSetData(server, robj, routeData, request, response) {
		console.log("Set Data APIController");
		this.dataService.onSetData(server, robj, routeData, request, response);
	}

	onPostData(server, robj, routeData, request, response) {
		console.log("Set Data APIController");
		this.dataService.onPostData(server, robj, routeData, request, response);
	}

	onDeleteData(server, robj, routeData, request, response) {
		console.log("Delete Data APIController");
		this.dataService.onDeleteData(server, robj, routeData, request, response);
	}

	onGetDB(server, robj, routeData, request, response) {
		console.log("Get DB APIController");
		this.dataService.onGetDB(server, robj, routeData, request, response);
	}
}

module.exports.Router = Router;
module.exports.DataService = DataService;
module.exports.APIController = APIController;
