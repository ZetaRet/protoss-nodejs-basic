class APIController {
	constructor() {
		this.onGetData = this.onGetData.bind(this);
		this.onGetDB = this.onGetDB.bind(this);
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
	onGetDB(server, robj, routeData, request, response) {
		console.log("Get DB");
		console.log(robj);
		var dbdataPromiseObject = this.onGetDBData();
		response.__data.push(dbdataPromiseObject);
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

module.exports.APIController = APIController;
