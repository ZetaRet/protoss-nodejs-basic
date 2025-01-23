const WS = require("ws/index.js");

class SocketController {
	constructor(apicontroller) {
		this.socket = new WS.Server({
			port: 8080,
		});
		this.socket.on("connection", this.listen.bind(this));
		this.debug = false;
		this.clients = [];
		this.clientmap = {};
		this.mapapi = {
			addclient: 1,
		};
		this.sentapi = {
			sendmessage: 1,
		};
		this.apic = apicontroller;
		var api = {};
		apicontroller.api.forEach((e) => (api[e] = 1));
		this.api = api;
		this.returnCRID = true;
		this.returnCommand = true;
	}

	mapClient(cs, uid) {
		var o = this;
		cs.___mapid = uid;
		o.clientmap[uid] = cs;
	}

	getResponse() {
		var r = {};
		r.__rawdata = [];
		return r;
	}

	getRoute(command, vars) {
		var r = {};
		r.root = "api";
		r.page = command;
		r.vars = vars || {};
		r.output = {};
		return r;
	}

	listen(cs) {
		var o = this;

		if (o.debug) console.log("Client Socket Connected");

		o.clients.push(cs);
		cs.___wsid = o.apic.server.rndstr(30);
		cs.___mapid = null;
		cs.on("open", () => {
			if (o.debug) console.log("Client Socket Open");
		});
		cs.on("close", () => {
			var i = o.clients.indexOf(cs);
			if (i !== -1) o.clients.splice(i, 1);
			delete o.clientmap[cs.___mapid];
			if (o.debug) console.log("Client Socket Close");
		});
		cs.on("message", (m) => {
			var r,
				rd,
				rt,
				mj = JSON.parse(m);
			if (o.debug) console.log("Client Socket Receive: " + cs.___wsid);
			if (o.debug) console.log(mj);
			if (o.api[mj.command]) {
				r = o.getResponse();
				rt = o.getRoute(mj.command, mj);
				o.apic[mj.command](o.apic.server, rt, o.apic.server.routeData, {}, r);
				rd = r.__rawdata[0];
				if (rd) {
					if (o.mapapi[mj.command] && rd.uid) {
						o.mapClient(cs, rd.uid);
					}
					if (o.returnCommand) rd.command = mj.command;
					if (o.returnCRID && mj.crid) rd.crid = mj.crid;
					o.writeCS(cs, rd);
					if (o.sentapi[mj.command] && rd.sent) {
						if (rd.sent.indexOf(rt.vars.username) === -1)
							o.writeCS(o.clientmap[o.apic.db.users[rt.vars.username].uid], rt.output);
						rd.sent.forEach((su) => o.writeCS(o.clientmap[o.apic.db.users[su].uid], rt.output));
					}
				}
			}
		});
	}

	wrapData(data) {
		return JSON.stringify(data);
	}

	writeCS(cs, data) {
		if (cs) cs.send(this.wrapData(data));
	}
}

module.exports.SocketController = SocketController;
