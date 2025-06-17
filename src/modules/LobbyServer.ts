/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Lobby auth and rooms of Subserver.
 **/
declare module "zetaret.node.modules::LobbyServer";
declare module "protoss-nodejs-basic/dist/modules/LobbyServer.js";

export { }

var Subserver: zetaret.node.modules.SubserverCTOR,
	xpros: zetaret.node.modules.SubserverModule = require((global as zetaret.node.BasicServerGlobal).LobbyServerRequireModule || "./Subserver"),
	http = require("http"),
	https = require("https"),
	events = require("events"),
	{ Buffer } = require("buffer");

const EVENTS = {
	CONNECT_ERROR: "connectError",
	LOBBY_UPDATE: "lobbyUpdate",
	ON_CONNECTED: "onConnected",
	NEW_USER: "newUser",
	UPDATE_USER: "updateUser",
	REMOVE_USER: "removeUser",
	NEW_ROOM: "newRoom",
	UPDATE_ROOM: "updateRoom",
	REMOVE_ROOM: "removeRoom",
	NEW_APP: "newApp",
	UPDATE_APP: "updateApp",
	REMOVE_APP: "removeApp",
};
const SERVERID = "zetaret.node.modules::LobbyServer";

class LobbyUser extends Array implements zetaret.node.modules.LobbyUser {
	lobby: string;
	userId: string;
	userData: object | any;

	constructor() {
		super();
		var o = this;
		o.lobby = null;
		o.userId = null;
		o.userData = {};
	}

	getUserPrerequisites(): object {
		var o = this;
		return o.userData.prerequisites;
	}
}

class LobbyRoom extends Array implements zetaret.node.modules.LobbyRoom {
	lobby: string;
	roomId: string;
	roomData: object;
	isChat: boolean;
	isLeader: boolean;

	constructor() {
		super();
		var o = this;
		o.lobby = null;
		o.roomId = null;
		o.roomData = {};
		o.isChat = false;
		o.isLeader = false;
	}
}

class LobbyApp extends Array implements zetaret.node.modules.LobbyApp {
	lobby: string;
	appId: string;
	appData: object;
	requirements: object | any;

	constructor() {
		super();
		var o = this;
		o.lobby = null;
		o.appId = null;
		o.appData = {};
		o.requirements = {};
	}

	meetsRequirements(user: object | zetaret.node.modules.LobbyUser): boolean {
		var o = this;
		var v,
			k,
			pk,
			res = true,
			pre: any = (user as zetaret.node.modules.LobbyUser).getUserPrerequisites();
		for (k in o.requirements) {
			v = o.requirements[k];
			pk = pre[k];
			if (pk) {
				if (v.constructor === Function) res = v(k, pk, pre, user, o);
				else res = pk === v;
			} else {
				res = false;
			}
			if (!res) break;
		}
		return res;
	}
}

function getExtendedServerProtoSS(ProtoSSChe: zetaret.node.ProtoSSCheCTOR): zetaret.node.modules.LobbyServerCTOR {
	if (!Subserver) Subserver = xpros.getExtendedServerProtoSS(ProtoSSChe);
	return class LobbyServer extends Subserver implements zetaret.node.modules.LobbyServer {
		lobbyId: string;
		lobbyData: object | any;
		apps: { [name: string]: LobbyApp };
		users: { [name: string]: LobbyUser };
		rooms: { [name: string]: LobbyRoom };
		lobbyEvents: zetaret.node.Emitter;

		constructor() {
			super();
			var o = this;
			o.lobbyId = null;
			o.lobbyData = {};
			o.apps = {};
			o.users = {};
			o.rooms = {};
			o.lobbyEvents = new events.EventEmitter();
			o.initLobby();
			o.initRooms();
			o.initApps();
		}

		initLobby(): void {
			var o = this;
			o.lobbyId = o.rndstr(10);
			var bp: any = {};
			bp.enumerable = false;
			(o as any).onConnectedX = o.onConnected.bind(o);
			Object.defineProperty(o, "onConnectedX", bp);
			(o as any).onConnectErrorX = o.onConnectError.bind(o);
			Object.defineProperty(o, "onConnectErrorX", bp);
		}

		initRooms(): void { }

		initApps(): void { }

		connectTo(options: object | any, data?: string, secure?: boolean): zetaret.node.XRequest {
			var o = this;
			if (!options.port) options.port = secure ? 443 : 80;
			if (!options.method) options.method = "GET";
			var req = (secure ? https : http).request(options, (o as any).onConnectedX || o.onConnected.bind(o));
			req.on("error", (o as any).onConnectErrorX || o.onConnectError.bind(o));
			if (data) req.write(data);
			req.end();
			return req;
		}

		promiseConnectTo(options: object, data?: string, secure?: boolean): Promise<object> {
			var o = this;
			return new Promise((resolve, reject) => {
				const req = o.connectTo(options, data, secure);
				(req as any).addEventListener(EVENTS.ON_CONNECTED, (d: any) => resolve(d));
				(req as any).addEventListener("error", (e: any) => reject(req));
			});
		}

		onConnectError(e: Error): void {
			var o = this;
			o.lobbyEvents.emit(EVENTS.CONNECT_ERROR, e, o);
			if (o.debugRoute) {
				console.log("Lobby connect error: " + o.lobbyId);
				console.log(e);
			}
		}

		onConnected(res: zetaret.node.Cross): void {
			var o = this;
			var sbb = o.env.swapBodyBuffer;
			var d: any = sbb ? [] : "";
			(res as any).setEncoding((res as any).req.__encoding || "utf8");
			res.on("data", (chunk) => (sbb ? d.push(chunk) : (d += chunk)));
			res.on("end", () => {
				if (sbb) d = Buffer.concat(d);
				if (o.debugRoute) {
					console.log("Lobby connect data: ");
					console.log(d);
				}
				res.emit(EVENTS.ON_CONNECTED, d, o);
				o.lobbyEvents.emit(EVENTS.ON_CONNECTED, res, d, o);
			});
		}

		lobby(data: object | any): zetaret.node.modules.LobbyServer {
			var o = this;
			var k;
			for (k in data) o.lobbyData[k] = data[k];
			o.lobbyEvents.emit(EVENTS.LOBBY_UPDATE, o);
			return o;
		}

		updateRemoveUser(u: LobbyUser, update?: boolean, remove?: boolean): zetaret.node.modules.LobbyServer {
			var o = this;
			if (update) o.lobbyEvents.emit(EVENTS.UPDATE_USER, u, o);
			if (remove) o.lobbyEvents.emit(EVENTS.REMOVE_USER, u, o);
			return o;
		}

		updateRemoveRoom(r: LobbyRoom, update?: boolean, remove?: boolean): zetaret.node.modules.LobbyServer {
			var o = this;
			if (update) o.lobbyEvents.emit(EVENTS.UPDATE_ROOM, r, o);
			if (remove) o.lobbyEvents.emit(EVENTS.REMOVE_ROOM, r, o);
			return o;
		}

		updateRemoveApp(a: LobbyApp, update?: boolean, remove?: boolean): zetaret.node.modules.LobbyServer {
			var o = this;
			if (update) o.lobbyEvents.emit(EVENTS.UPDATE_APP, a, o);
			if (remove) o.lobbyEvents.emit(EVENTS.REMOVE_APP, a, o);
			return o;
		}

		user(userId: string, usercls?: zetaret.node.modules.LobbyUserCTOR | LobbyUser | Function): zetaret.node.modules.LobbyUser {
			var o = this;
			if (!usercls) usercls = LobbyUser;
			var u = new (usercls as any)();
			u.lobby = o.lobbyId;
			u.userId = userId;
			o.users[userId] = u;
			o.lobbyEvents.emit(EVENTS.NEW_USER, u, o);
			return u;
		}

		room(roomId: string, roomcls?: zetaret.node.modules.LobbyRoomCTOR | LobbyRoom | Function): zetaret.node.modules.LobbyRoom {
			var o = this;
			if (!roomcls) roomcls = LobbyRoom;
			var r = new (roomcls as any)();
			r.lobby = o.lobbyId;
			r.roomId = roomId;
			o.rooms[roomId] = r;
			o.lobbyEvents.emit(EVENTS.NEW_ROOM, r, o);
			return r;
		}

		app(appId: string, appcls?: zetaret.node.modules.LobbyAppCTOR | LobbyApp | Function): zetaret.node.modules.LobbyApp {
			var o = this;
			if (!appcls) appcls = LobbyApp;
			var a = new (appcls as any)();
			a.lobby = o.lobbyId;
			a.appId = appId;
			o.apps[appId] = a;
			o.lobbyEvents.emit(EVENTS.NEW_APP, a, o);
			return a;
		}
	};
}

module.exports.xpros = xpros;
module.exports.EVENTS = EVENTS;
module.exports.SERVERID = SERVERID;
module.exports.lobbyUserClass = LobbyUser;
module.exports.lobbyRoomClass = LobbyRoom;
module.exports.lobbyAppClass = LobbyApp;
module.exports.resetExtends = (): void => (Subserver = null);
module.exports.getExtends = (): zetaret.node.modules.SubserverCTOR => Subserver;
module.exports.getExtendedServerProtoSS = getExtendedServerProtoSS;
