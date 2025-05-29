class SocketController implements zetaret.node.api.SocketController {
	public socket: zetaret.node.api.SocketServer;
	public debug: boolean;
	public clients: Array<zetaret.node.api.ClientSocket>;
	public clientmap: { [uid: string]: zetaret.node.api.ClientSocket };
	public mapapi: { [command: string]: boolean | number };
	public sentapi: { [command: string]: boolean | number };
	public apic: zetaret.node.api.APIController;
	public api: { [command: string]: boolean | number };
	public returnCRID: boolean;
	public returnCommand: boolean;

	constructor(apicontroller: zetaret.node.api.APIController) {
		this.debug = false;
		this.clients = [];
		this.clientmap = {};
		this.mapapi = {};
		this.sentapi = {};
		this.api = {};
		this.apic = apicontroller;
		this.returnCRID = true;
		this.returnCommand = true;
	}

	init(socketcls: zetaret.node.api.SocketServerCTOR) {
		this.socket = new socketcls({
			port: 8080
		});
		this.socket.on('connection', this.listen.bind(this));
		this.mapapi['addclient'] = 1;
		this.sentapi['sendmessage'] = 1;
		const api: any = this.api;
		this.apic.api.forEach((e: string) => api[e] = 1);
	}

	mapClient(cs: zetaret.node.api.ClientSocket, uid: string): void {
		var o = this;
		cs.___mapid = uid;
		o.clientmap[uid] = cs;
	}

	getResponse(): zetaret.node.RoutedResponse {
		var r: zetaret.node.RoutedResponse = {} as any;
		r.__rawdata = [];
		return r;
	}

	getRoute(command: string, vars: object): zetaret.node.RouteObject {
		var r: zetaret.node.RouteObject = {};
		r.root = 'api';
		r.page = command;
		r.vars = vars || {};
		r.output = {};
		return r;
	}

	listen(cs: zetaret.node.api.ClientSocket) {
		var o: SocketController = this;

		if (o.debug) console.log('Client Socket Connected');

		o.clients.push(cs);
		cs.___wsid = o.apic.server.rndstr(30);
		cs.___mapid = null;
		cs.on('open', () => {
			if (o.debug) console.log('Client Socket Open');
		});
		cs.on('close', () => {
			var i = o.clients.indexOf(cs);
			if (i !== -1) o.clients.splice(i, 1);
			delete o.clientmap[cs.___mapid];
			if (o.debug) console.log('Client Socket Close');
		});
		cs.on('message', (m: string) => {
			var r: zetaret.node.RoutedResponse,
				rd: any,
				rt: zetaret.node.RouteObject,
				mj = JSON.parse(m);
			if (o.debug) console.log('Client Socket Receive: ' + cs.___wsid);
			if (o.debug) console.log(mj);
			if (o.api[mj.command]) {
				r = o.getResponse();
				rt = o.getRoute(mj.command, mj);
				(o.apic as any)[mj.command](o.apic.server, rt, o.apic.server.routeData, {}, r);
				rd = r.__rawdata[0];
				if (rd) {
					if (o.mapapi[mj.command] && rd.uid) {
						o.mapClient(cs, rd.uid);
					}
					if (o.returnCommand) rd.command = mj.command;
					if (o.returnCRID && mj.crid) rd.crid = mj.crid;
					o.writeCS(cs, rd);
					if (o.sentapi[mj.command] && rd.sent) {
						if (rd.sent.indexOf((rt.vars as any).username) === -1) o.writeCS(o.clientmap[(o.apic.db as any).users[(rt.vars as any).username].uid], rt.output);
						rd.sent.forEach((su: string) => o.writeCS(o.clientmap[(o.apic.db as any).users[su].uid], rt.output));
					}
				}
			}
		});
	}

	wrapData(data: object): string {
		return JSON.stringify(data);
	}

	writeCS(cs: zetaret.node.api.ClientSocket, data: object): void {
		if (cs)
			cs.send(this.wrapData(data));
	}
}

module.exports.SocketController = SocketController;