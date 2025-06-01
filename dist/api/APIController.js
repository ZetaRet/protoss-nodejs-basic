export class APIController {
	constructor() {
		this.ctype = "application/json";
		this.api = [];
		this.server = null;
		this.db = {};
		this.apiPrefix = "api/";
	}
	addServer(server) {
		const o = this;
		o.server = server;
		o.api.forEach((e) => server.addPathListener(o.apiPrefix + e, o[e].bind(o)));
	}
	setHeaders(response) {
		if (response.__headers) response.__headers["content-type"] = this.ctype;
	}
	pushData(response, data) {
		this.setHeaders(response);
		if (response.__rawdata) response.__rawdata.push(data);
		else response.__data.push(JSON.stringify(data));
	}
}
