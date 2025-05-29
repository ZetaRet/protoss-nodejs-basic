class Router {
	constructor() {
		this.prefix = "";
		this.adds = [];
		this.returns = [];
	}
	addPathListener(path, callback) {
		var routerAdd = {
			method: "addPathListener",
			arguments: [path, callback],
		};
		this.adds.push(routerAdd);
	}
	addMethodPathListener(method, path, callback) {
		var routerAdd = {
			method: "addMethodPathListener",
			arguments: [method, path, callback],
		};
		this.adds.push(routerAdd);
	}
	addParamsPathListener(path, callback, method, autoRoute) {
		var routerAdd = {
			method: "addParamsPathListener",
			arguments: [path, callback, method, autoRoute],
		};
		this.adds.push(routerAdd);
	}
	get(path, callback) {
		this.addParamsPathListener(path, callback, "GET", true);
	}
	post(path, callback) {
		this.addParamsPathListener(path, callback, "POST", true);
	}
	put(path, callback) {
		this.addParamsPathListener(path, callback, "PUT", true);
	}
	patch(path, callback) {
		this.addParamsPathListener(path, callback, "PATCH", true);
	}
	delete(path, callback) {
		this.addParamsPathListener(path, callback, "DELETE", true);
	}
}
module.exports.Router = Router;
