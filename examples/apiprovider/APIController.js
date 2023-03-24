class APIController {
	constructor() {
		this.onGetData = this.onGetData.bind(this);
		this.onSetData = this.onSetData.bind(this);
		this.onDeleteData = this.onDeleteData.bind(this);
		this.onLogin = this.onLogin.bind(this);
		this.onLogout = this.onLogout.bind(this);
	}

	onGetData(server, robj, routeData, request, response) {
		console.log("Get Data");
		console.log(robj);
		this.setJSON({ testdata: { key1: 3 } }, response);
	}
	onSetData(server, robj, routeData, request, response) {
		console.log("Set Data");
		console.log(robj);
		this.setJSON({ result: "success" }, response);
	}
	onDeleteData(server, robj, routeData, request, response) {
		console.log("Delete Data");
		console.log(robj);
	}
	onLogin(server, robj, routeData, request, response) {
		console.log("Login");
		console.log(robj);
	}
	onLogout(server, robj, routeData, request, response) {
		console.log("Logout");
		console.log(robj);
	}

	setJSON(data, response) {
		response.__headers["content-type"] = "application/json";
		response.__data.push(JSON.stringify(data));
	}
}

module.exports.APIController = APIController;
