class APIController {
	constructor() {
		this.ctype = "application/json";
		this.api = ["addclient", "getclients", "sendmessage", "getmessages", "addgroup", "getgroups"];
		this.server = null;
		this.secureUid = false;
		this.db = {
			users: {},
			groups: {
				all: [],
			},
			messages: {},
		};
	}

	addServer(server) {
		var o = this;
		o.server = server;
		o.api.forEach((e) => server.addPathListener("api/" + e, o[e].bind(o)));
	}

	setheaders(response) {
		if (response.__headers) response.__headers["content-type"] = this.ctype;
	}

	pushdata(response, data) {
		this.setheaders(response);
		if (response.__rawdata) response.__rawdata.push(data);
		else response.__data.push(JSON.stringify(data));
	}

	addclient(server, robj, routeData, request, response) {
		var o = this;
		var data = {},
			u = robj.vars.username;
		if (u) {
			data.err = 0;
			if (!o.db.users[u]) {
				o.db.users[u] = {
					vars: robj.vars,
					uid: server.rndstr(30),
				};
				data.username = u;
				data.uid = o.db.users[u].uid;
				data.text = "user added";
				o.db.groups.all.push(u);
			} else {
				data.text = "user exists";
			}
		} else {
			data.err = 1;
			data.text = "no username in request";
		}
		o.pushdata(response, data);
	}

	getclients(server, robj, routeData, request, response) {
		var o = this;
		var data = {},
			g = robj.vars.group;
		if (g) {
			data.group = g;
			if (o.db.groups[g]) {
				data.err = 0;
				data.text = "existing users in group";
				data.users = o.db.groups[g];
				data.uids = {};
				if (!o.secureUid) data.users.forEach((e) => (data.uids[e] = o.db.users[e].uid));
			} else {
				data.err = 1;
				data.text = "no users in group";
			}
		} else {
			data.err = 0;
			data.text = "existing users";
			data.users = Object.keys(o.db.users);
			data.uids = {};
			if (!o.secureUid) data.users.forEach((e) => (data.uids[e] = o.db.users[e].uid));
		}
		o.pushdata(response, data);
	}

	addmessage(user, msg) {
		var o = this;
		if (o.db.users[user]) {
			if (!o.db.messages[user]) o.db.messages[user] = [];
			o.db.messages[user].push(msg);
		} else user = null;

		return user;
	}

	sendmessage(server, robj, routeData, request, response) {
		var o = this;
		var data = {},
			g = robj.vars.group,
			t = robj.vars.target,
			u = robj.vars.username,
			m = robj.vars.message,
			uid = robj.vars.uid,
			msg,
			sent;

		if (o.db.users[u] /* && (!o.secureUid || o.db.users[u].uid === uid)*/) {
			data.err = "0";
			data.text = "message sent";
			msg = {
				mid: server.rndstr(30),
				user: u,
				message: m,
				time: Date.now(),
			};
			if (g) {
				msg.group = g;
				if (o.db.groups[g]) sent = o.db.groups[g].map((gu) => o.addmessage(gu, msg));
			} else if (t) {
				sent = [o.addmessage(t, msg)];
				o.addmessage(u, msg);
			}
			sent = sent.filter((su) => su !== null);
			msg.sent = sent;
			if (robj.output) {
				robj.output.command = "addmessage";
				robj.output.message = msg;
			}
			data.sent = sent;
		} else {
			data.err = "1";
			data.text = "user uid mismatch";
		}

		o.pushdata(response, data);
	}

	getmessages(server, robj, routeData, request, response) {
		var o = this;
		var data = {},
			g = robj.vars.group,
			t = robj.vars.target,
			u = robj.vars.username,
			uid = robj.vars.uid;

		if (o.db.users[u] /* && (!o.secureUid || o.db.users[u].uid === uid)*/) {
			data.err = 0;
			if (o.db.messages[u]) {
				if (g) data.messages = o.db.messages[u].filter((m) => m.group === g);
				else if (t)
					data.messages = o.db.messages[u].filter(
						(m) => !m.group && (m.user === t || (m.sent && m.sent.indexOf(t) !== -1))
					);
				else data.messages = o.db.messages[u];
			}
		} else {
			data.err = 1;
			data.text = "user uid mismatch";
		}

		o.pushdata(response, data);
	}

	addgroup(server, robj, routeData, request, response) {
		var o = this;
		var data = {},
			g = robj.vars.group,
			u = robj.vars.username,
			uid = robj.vars.uid;
		if (g) {
			data.err = 0;
			data.group = g;
			if (!o.db.groups[g]) o.db.groups[g] = [];
			if (u && o.db.users[u] && o.db.groups[g].indexOf(u) === -1) {
				if (true /*!o.secureUid || o.db.users[u].uid === uid*/) {
					o.db.groups[g].push(u);
					data.username = u;
					data.text = "user added to group";
				} else {
					data.text = "user uid mismatch";
				}
			} else {
				data.text = "group update";
			}
		} else {
			data.err = 1;
			data.text = "no group in request";
		}
		o.pushdata(response, data);
	}

	getgroups(server, robj, routeData, request, response) {
		var o = this;
		var data = {};
		data.groups = Object.keys(o.db.groups);
		o.pushdata(response, data);
	}
}

module.exports.APIController = APIController;
