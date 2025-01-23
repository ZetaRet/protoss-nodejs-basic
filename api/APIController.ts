declare module "zetaret.node.api::APIController";
declare module "protoss-nodejs-basic/api/APIController.js";

class APIController implements zetaret.node.api.APIController {
	public ctype: string;
	public api: Array<string>;
	public server: zetaret.node.modules.Subserver;
	public db: object;
	public apiPrefix: string;

	constructor() {
		this.ctype = "application/json";
		this.api = [];
		this.server = null;
		this.db = {};
		this.apiPrefix = "api/";
	}

	public addServer(server: zetaret.node.modules.Subserver): void {
		const o: APIController = this;
		o.server = server;
		o.api.forEach((e: string) => server.addPathListener(o.apiPrefix + e, (o as any)[e].bind(o)));
	}

	public setHeaders(response: zetaret.node.RoutedResponse): void {
		if (response.__headers) (response.__headers as any)["content-type"] = this.ctype;
	}

	public pushData(response: zetaret.node.RoutedResponse, data: object): void {
		this.setHeaders(response);
		if (response.__rawdata) response.__rawdata.push(data);
		else response.__data.push(JSON.stringify(data));
	}
}

module.exports.APIController = APIController;
