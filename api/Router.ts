class Router implements zetaret.node.api.Router {
	public prefix: string = "";
	public adds: zetaret.node.api.RouterAdds[] = [];
	public returns: zetaret.node.api.RouterReturns[] = [];

	addPathListener(path: string, callback?: Function): void {
		var routerAdd: zetaret.node.api.RouterAdds = {
			method: "addPathListener",
			arguments: [path, callback],
		};
		this.adds.push(routerAdd);
	}

	addMethodPathListener(method: string, path: string, callback: Function): void {
		var routerAdd: zetaret.node.api.RouterAdds = {
			method: "addMethodPathListener",
			arguments: [method, path, callback],
		};
		this.adds.push(routerAdd);
	}

	addParamsPathListener(path: string, callback: Function | Function[], method?: string, autoRoute?: boolean): void {
		var routerAdd: zetaret.node.api.RouterAdds = {
			method: "addParamsPathListener",
			arguments: [path, callback, method, autoRoute],
		};
		this.adds.push(routerAdd);
	}

	get(path: string, callback: Function | Function[]): void {
		this.addParamsPathListener(path, callback, "GET", true);
	}

	post(path: string, callback: Function | Function[]): void {
		this.addParamsPathListener(path, callback, "POST", true);
	}

	put(path: string, callback: Function | Function[]): void {
		this.addParamsPathListener(path, callback, "PUT", true);
	}

	patch(path: string, callback: Function | Function[]): void {
		this.addParamsPathListener(path, callback, "PATCH", true);
	}

	delete(path: string, callback: Function | Function[]): void {
		this.addParamsPathListener(path, callback, "DELETE", true);
	}
}

module.exports.Router = Router;
