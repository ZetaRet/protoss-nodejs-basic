"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const events_1 = require("events");
const APIController_1 = require("./APIController");
class ChatController extends APIController_1.APIController {
	static EVENTS = {
		INSTALL: "install",
		ERROR: "error",
		DEFAULTS: "defaults",
		MESSAGE: "message",
		MESSAGE_UPDATE: "messageUpdate",
		USER: "user",
		USER_UPDATE: "userUpdate",
		GROUP: "group",
		GROUP_UPDATE: "groupUpdate",
		DB_CONNECT: "dbConnect",
		DB_UPDATE: "dbUpdate",
		API_MOUNT: "apiMount",
	};
	static RESPONSE_TEXT = {
		USER_ADDED: "user added",
		USER_EXISTS: "user exists",
		NO_USER: "no username in request",
		USER_ADDED_GROUP: "user added to group",
		USERS_GROUP: "existing users in group",
		GROUP_UPDATE: "group update",
		NO_USERS_GROUP: "no users in group",
		EXISTING_USERS: "existing users",
		MESSAGE_SENT: "message sent",
		USER_MISMATCH: "user uid mismatch",
		NO_GROUP: "no group",
	};
	messages;
	autoDelete;
	install;
	error;
	defaults;
	emitter;
	constructor() {
		super();
		this.api = [
			"addClient",
			"getClients",
			"editClient",
			"sendMessage",
			"getMessages",
			"editMessages",
			"addGroup",
			"getGroups",
			"editGroups",
		];
		this.db = {
			users: {},
			groups: {},
			messages: {},
			weak: new WeakMap(),
		};
		this.messages = {};
		this.emitter = new events_1.EventEmitter();
	}
	installDBInterface(method) {
		this.emitter.on(ChatController.EVENTS.INSTALL, method);
	}
	handleError(method) {
		this.emitter.on(ChatController.EVENTS.ERROR, method);
	}
	onDefault(method) {
		this.emitter.on(ChatController.EVENTS.DEFAULTS, method);
	}
	addMessage(user, msg) {
		const o = this;
		var dbu = o.db.users,
			dbm = o.db.messages;
		if (dbu[user]) {
			if (!dbm[user]) dbm[user] = [];
			dbm[user].push(msg);
		} else user = null;
		return user;
	}
	buildMessage(user, message, mid) {
		const o = this;
		const msg = {};
		msg.mid = mid || o.server.rndstr(30);
		o.messages[msg.mid] = [msg];
		return msg;
	}
	appendMessage(mid, text, data) {
		const o = this;
		const msgbuffer = o.messages[mid];
		const msg = msgbuffer ? msgbuffer[msgbuffer.length - 1] : null;
		if (msg) {
			if (!msg.stream) msg.stream = text.concat();
			else msg.stream = msg.stream.concat(text);
			if (data) msg.stream.push(data);
		}
		return msg;
	}
	addClient(server, robj, routeData, request, response) {
		const o = this;
		var data = {},
			u = robj.vars.username,
			dbu = o.db.users,
			dbg = o.db.groups;
		if (u) {
			data.err = 0;
			if (!dbu[u]) {
				dbu[u] = {
					vars: robj.vars,
					uid: server.rndstr(30),
				};
				data.username = u;
				data.uid = dbu[u].uid;
				data.text = ChatController.RESPONSE_TEXT.USER_ADDED;
				dbg.all.push(u);
			} else {
				data.text = ChatController.RESPONSE_TEXT.USER_EXISTS;
			}
		} else {
			data.err = 1;
			data.text = ChatController.RESPONSE_TEXT.NO_USER;
		}
		o.pushData(response, data);
	}
	getClients(server, robj, routeData, request, response) {
		const o = this;
		var data = {},
			g = robj.vars.group,
			dbg = o.db.groups;
		if (g) {
			data.group = g;
			if (dbg[g]) {
				data.err = 0;
				data.text = ChatController.RESPONSE_TEXT.USERS_GROUP;
				data.users = dbg[g];
			} else {
				data.err = 1;
				data.text = ChatController.RESPONSE_TEXT.NO_USERS_GROUP;
			}
		} else {
			data.err = 0;
			data.text = ChatController.RESPONSE_TEXT.EXISTING_USERS;
			data.users = Object.keys(o.db.users);
		}
		o.pushData(response, data);
	}
	editClient(server, robj, routeData, request, response) {}
	sendMessage(server, robj, routeData, request, response) {
		const o = this;
		var data = {},
			vars = robj.vars,
			g = vars.group,
			t = vars.target,
			u = vars.username,
			m = vars.message,
			uid = vars.uid,
			dbu = o.db.users,
			dbg = o.db.groups,
			output = robj.output,
			msg,
			sent;
		if (dbu[u] && dbu[u].uid === uid) {
			data.err = 0;
			data.text = ChatController.RESPONSE_TEXT.MESSAGE_SENT;
			msg = {
				mid: server.rndstr(30),
				user: u,
				message: m,
				time: Date.now(),
			};
			if (g) {
				msg.group = g;
				if (dbg[g]) sent = dbg[g].map((gu) => o.addMessage(gu, msg));
			} else if (t) {
				sent = [o.addMessage(t, msg)];
				o.addMessage(u, msg);
			}
			sent = sent.filter((su) => su !== null);
			msg.sent = sent;
			if (output) {
				output.command = "addMessage";
				output.message = msg;
			}
			data.sent = sent;
		} else {
			data.err = 1;
			data.text = ChatController.RESPONSE_TEXT.USER_MISMATCH;
		}
		o.pushData(response, data);
	}
	getMessages(server, robj, routeData, request, response) {
		const o = this;
		var data = {},
			vars = robj.vars,
			g = vars.group,
			t = vars.target,
			u = vars.username,
			uid = vars.uid,
			dbm = o.db.messages,
			dbu = o.db.users;
		if (dbu[u] && dbu[u].uid === uid) {
			data.err = 0;
			if (dbm[u]) {
				if (g) data.messages = dbm[u].filter((m) => m.group === g);
				else if (t)
					data.messages = dbm[u].filter((m) => !m.group && (m.user === t || (m.sent && m.sent.indexOf(t) !== -1)));
				else data.messages = dbm[u];
			}
		} else {
			data.err = 1;
			data.text = ChatController.RESPONSE_TEXT.USER_MISMATCH;
		}
		o.pushData(response, data);
	}
	editMessages(server, robj, routeData, request, response) {}
	addGroup(server, robj, routeData, request, response) {
		const o = this;
		var data = {},
			vars = robj.vars,
			g = vars.group,
			u = vars.username,
			uid = vars.uid,
			dbg = o.db.groups,
			dbu = o.db.users;
		if (g) {
			data.err = 0;
			data.group = g;
			if (!dbg[g]) dbg[g] = [];
			if (u && dbu[u] && dbg[g].indexOf(u) === -1) {
				if (dbu[u].uid === uid) {
					dbg[g].push(u);
					data.username = u;
					data.text = ChatController.RESPONSE_TEXT.USER_ADDED_GROUP;
				} else {
					data.text = ChatController.RESPONSE_TEXT.USER_MISMATCH;
				}
			} else {
				data.text = ChatController.RESPONSE_TEXT.GROUP_UPDATE;
			}
		} else {
			data.err = 1;
			data.text = ChatController.RESPONSE_TEXT.NO_GROUP;
		}
		o.pushData(response, data);
	}
	getGroups(server, robj, routeData, request, response) {
		const o = this;
		var data = {};
		data.groups = Object.keys(o.db.groups);
		o.pushData(response, data);
	}
	editGroups(server, robj, routeData, request, response) {}
}
exports.ChatController = ChatController;
