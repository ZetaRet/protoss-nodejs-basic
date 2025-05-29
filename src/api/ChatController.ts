import { EventEmitter } from "events";

const APIModule: zetaret.node.api.APIControllerModule = require("./APIController");

class ChatController extends APIModule.APIController implements zetaret.node.api.ChatController {
	static EVENTS: zetaret.node.api.ChatEvents = {
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
		API_MOUNT: "apiMount"
	};

	static RESPONSE_TEXT: any = {
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
		NO_GROUP: "no group"
	};

	public messages: { [msgid: string]: Array<zetaret.node.api.ChatMessage> };
	public autoDelete: WeakMap<object, zetaret.node.api.ChatMessage>;
	public db: zetaret.node.api.ChatDB;
	public install: Function;
	public error: Function;
	public defaults: Function;

	protected emitter: zetaret.node.Emitter;

	constructor() {
		super();
		this.api = ['addClient', 'getClients', 'editClient', 'sendMessage', 'getMessages', 'editMessages', 'addGroup', 'getGroups', 'editGroups'];
		this.db = {
			users: {},
			groups: {},
			messages: {},
			weak: new WeakMap()
		};
		this.messages = {};
		this.emitter = new EventEmitter();
	}

	public installDBInterface(method: Function): void {
		this.emitter.on(ChatController.EVENTS.INSTALL, method as any);
	}

	public handleError(method: Function): void {
		this.emitter.on(ChatController.EVENTS.ERROR, method as any);
	}

	public onDefault(method: Function): void {
		this.emitter.on(ChatController.EVENTS.DEFAULTS, method as any);
	}

	public addMessage(user: string, msg: string | zetaret.node.api.ChatMessage): string {
		const o: ChatController = this;
		var dbu: any = (o.db as any).users,
			dbm: any = (o.db as any).messages;
		if (dbu[user]) {
			if (!dbm[user]) dbm[user] = [];
			dbm[user].push(msg);
		} else user = null;

		return user;
	}

	public buildMessage(user: string, message: string, mid?: string): zetaret.node.api.ChatMessage {
		const o: ChatController = this;
		const msg: zetaret.node.api.ChatMessage = {};
		msg.mid = mid || o.server.rndstr(30);
		o.messages[msg.mid] = [msg];
		return msg;
	}

	public appendMessage(mid: string, text: Array<string>, data?: object): zetaret.node.api.ChatMessage {
		const o: ChatController = this;
		const msgbuffer: Array<zetaret.node.api.ChatMessage> = o.messages[mid];
		const msg: zetaret.node.api.ChatMessage = msgbuffer ? msgbuffer[msgbuffer.length - 1] : null;
		if (msg) {
			if (!msg.stream) msg.stream = text.concat();
			else msg.stream = msg.stream.concat(text);
			if (data) msg.stream.push(data);
		}
		return msg;
	}

	public addClient(server: zetaret.node.modules.Subserver, robj: zetaret.node.RouteObject, routeData: object, request: zetaret.node.XRequest, response: zetaret.node.RoutedResponse): void {
		const o: ChatController = this;
		var data: any = {},
			u: string = (robj.vars as any).username,
			dbu: any = (o.db as any).users,
			dbg: any = (o.db as any).groups;
		if (u) {
			data.err = 0;
			if (!dbu[u]) {
				dbu[u] = {
					vars: robj.vars,
					uid: server.rndstr(30)
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

	public getClients(server: zetaret.node.modules.Subserver, robj: zetaret.node.RouteObject, routeData: object, request: zetaret.node.XRequest, response: zetaret.node.RoutedResponse): void {
		const o: ChatController = this;
		var data: any = {},
			g: any = (robj.vars as any).group,
			dbg: any = (o.db as any).groups;
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
			data.users = Object.keys((o.db as any).users);
		}
		o.pushData(response, data);
	}

	public editClient(server: zetaret.node.modules.Subserver, robj: zetaret.node.RouteObject, routeData: object, request: zetaret.node.XRequest, response: zetaret.node.RoutedResponseX): void {

	}

	public sendMessage(server: zetaret.node.modules.Subserver, robj: zetaret.node.RouteObject, routeData: object, request: zetaret.node.XRequest, response: zetaret.node.RoutedResponse): void {
		const o: ChatController = this;
		var data: any = {},
			vars: any = robj.vars,
			g: string = vars.group,
			t: string = vars.target,
			u: string = vars.username,
			m: string = vars.message,
			uid: string = vars.uid,
			dbu: any = (o.db as any).users,
			dbg: any = (o.db as any).groups,
			output: any = (robj as any).output,
			msg: any,
			sent: Array<string>;

		if (dbu[u] && dbu[u].uid === uid) {
			data.err = 0;
			data.text = ChatController.RESPONSE_TEXT.MESSAGE_SENT;
			msg = {
				mid: server.rndstr(30),
				user: u,
				message: m,
				time: Date.now()
			};
			if (g) {
				msg.group = g;
				if (dbg[g]) sent = dbg[g].map((gu: string) => o.addMessage(gu, msg));
			} else if (t) {
				sent = [o.addMessage(t, msg)];
				o.addMessage(u, msg);
			}
			sent = sent.filter((su: string) => su !== null);
			msg.sent = sent;
			if (output) {
				output.command = 'addMessage';
				output.message = msg;
			}
			data.sent = sent;
		} else {
			data.err = 1;
			data.text = ChatController.RESPONSE_TEXT.USER_MISMATCH;
		}

		o.pushData(response, data);
	}

	public getMessages(server: zetaret.node.modules.Subserver, robj: zetaret.node.RouteObject, routeData: object, request: zetaret.node.XRequest, response: zetaret.node.RoutedResponse): void {
		const o: ChatController = this;
		var data: any = {},
			vars: any = robj.vars,
			g: string = vars.group,
			t: string = vars.target,
			u: string = vars.username,
			uid: string = vars.uid,
			dbm: any = (o.db as any).messages,
			dbu: any = (o.db as any).users;

		if (dbu[u] && dbu[u].uid === uid) {
			data.err = 0;
			if (dbm[u]) {
				if (g) data.messages = dbm[u].filter((m: any) => m.group === g);
				else if (t) data.messages = dbm[u].filter((m: any) => !m.group && (m.user === t || (m.sent && m.sent.indexOf(t) !== -1)));
				else data.messages = dbm[u];
			}
		} else {
			data.err = 1;
			data.text = ChatController.RESPONSE_TEXT.USER_MISMATCH;
		}

		o.pushData(response, data);
	}

	public editMessages(server: zetaret.node.modules.Subserver, robj: zetaret.node.RouteObject, routeData: object, request: zetaret.node.XRequest, response: zetaret.node.RoutedResponseX): void {

	}

	public addGroup(server: zetaret.node.modules.Subserver, robj: zetaret.node.RouteObject, routeData: object, request: zetaret.node.XRequest, response: zetaret.node.RoutedResponse): void {
		const o: ChatController = this;
		var data: any = {},
			vars: any = robj.vars,
			g: string = vars.group,
			u: string = vars.username,
			uid: string = vars.uid,
			dbg: any = (o.db as any).groups,
			dbu: any = (o.db as any).users;

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

	public getGroups(server: zetaret.node.modules.Subserver, robj: zetaret.node.RouteObject, routeData: object, request: zetaret.node.XRequest, response: zetaret.node.RoutedResponse): void {
		const o: ChatController = this;
		var data: any = {};
		data.groups = Object.keys((o.db as any).groups);
		o.pushData(response, data);
	}

	public editGroups(server: zetaret.node.modules.Subserver, robj: zetaret.node.RouteObject, routeData: object, request: zetaret.node.XRequest, response: zetaret.node.RoutedResponseX): void {

	}
}

module.exports.ChatController = ChatController;