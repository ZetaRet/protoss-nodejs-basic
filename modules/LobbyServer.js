/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Lobby auth and rooms of Subserver.
 **/

var Subserver, xpros = require(global.LobbyServerRequireModule || './Subserver.js'),
	http = require('http'),
	https = require('https'),
	events = require('events');

const EVENTS = {
	CONNECT_ERROR: 'connectError',
	LOBBY_UPDATE: 'lobbyUpdate',
	ON_CONNECTED: 'onConnected',
	NEW_USER: 'newUser',
	UPDATE_USER: 'updateUser',
	REMOVE_USER: 'removeUser',
	NEW_ROOM: 'newRoom',
	UPDATE_ROOM: 'updateRoom',
	REMOVE_ROOM: 'removeRoom',
	NEW_APP: 'newApp',
	UPDATE_APP: 'updateApp',
	REMOVE_APP: 'removeApp'
};
const SERVERID = 'zetaret.node.modules::LobbyServer';

class LobbyUser extends Array {
	constructor() {
		super();
		var o = this;
		o.lobby = null;
		o.userId = null;
		o.userData = {};
	}

	getUserPrerequisites() {
		var o = this;
		return o.userData.prerequisites;
	}
}

class LobbyRoom extends Array {
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

class LobbyApp extends Array {
	constructor() {
		super();
		var o = this;
		o.lobby = null;
		o.appId = null;
		o.appData = {};
		o.requirements = {};
	}

	meetsRequirements(user) {
		var o = this;
		var v, k, pk, res = true,
			pre = user.getUserPrerequisites();
		for (k in o.requirements) {
			v = o.requirements[k];
			pk = pre[k];
			if (pk) {
				if (v.constructor === Function) res = v(k, pk, pre, user, o);
				else res = (pk === v);
			} else {
				res = false;
			}
			if (!res) break;
		}
		return res;
	}
}

function getExtendedServerProtoSS(ProtoSSChe) {
	if (!Subserver) Subserver = xpros.getExtendedServerProtoSS(ProtoSSChe);
	return class LobbyServer extends Subserver {
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

		initLobby() {
			var o = this;
			o.lobbyId = o.rndstr(10);
			var bp = {};
			bp.enumerable = false;
			o.onConnectedX = o.onConnected.bind(o);
			Object.defineProperty(o, 'onConnectedX', bp);
			o.onConnectErrorX = o.onConnectError.bind(o);
			Object.defineProperty(o, 'onConnectErrorX', bp);
		}

		initRooms() {}

		initApps() {}

		connectTo(options, data, secure) {
			var o = this;
			if (!options.port) options.port = secure ? 443 : 80;
			if (!options.method) options.method = 'GET';
			var req = (secure ? https : http).request(options, o.onConnectedX || o.onConnected.bind(o));
			req.on('error', o.onConnectErrorX || o.onConnectError.bind(o));
			if (data) req.write(data);
			req.end();
			return req;
		}

		promiseConnectTo(options, data, secure) {
			var o = this;
			return new Promise((resolve, reject) => {
				const req = o.connectTo(options, data, secure);
				req.addEventListener(EVENTS.ON_CONNECTED, d => resolve(d));
				req.addEventListener('error', e => reject(req));
			});
		}

		onConnectError(e) {
			var o = this;
			o.lobbyEvents.emit(EVENTS.CONNECT_ERROR, e, o);
			if (o.debugRoute) {
				console.log('Lobby connect error: ' + o.lobbyId);
				console.log(e);
			}
		}

		onConnected(res) {
			var o = this;
			var d = '';
			res.setEncoding(res.req.__encoding || 'utf8');
			res.on('data', chunk => d += chunk);
			res.on('end', () => {
				if (o.debugRoute) {
					console.log('Lobby connect data: ');
					console.log(d);
				}
				res.emit(EVENTS.ON_CONNECTED, d, o);
				o.lobbyEvents.emit(EVENTS.ON_CONNECTED, res, d, o);
			});
		}

		lobby(data) {
			var o = this;
			var k;
			for (k in data) o.lobbyData[k] = data[k];
			o.lobbyEvents.emit(EVENTS.LOBBY_UPDATE, o);
			return o;
		}

		updateRemoveUser(u, update, remove) {
			var o = this;
			if (update) o.lobbyEvents.emit(EVENTS.UPDATE_USER, u, o);
			if (remove) o.lobbyEvents.emit(EVENTS.REMOVE_USER, u, o);
			return o;
		}

		updateRemoveRoom(r, update, remove) {
			var o = this;
			if (update) o.lobbyEvents.emit(EVENTS.UPDATE_ROOM, r, o);
			if (remove) o.lobbyEvents.emit(EVENTS.REMOVE_ROOM, r, o);
			return o;
		}

		updateRemoveApp(a, update, remove) {
			var o = this;
			if (update) o.lobbyEvents.emit(EVENTS.UPDATE_APP, a, o);
			if (remove) o.lobbyEvents.emit(EVENTS.REMOVE_APP, a, o);
			return o;
		}

		user(userId, usercls) {
			var o = this;
			if (!usercls) usercls = LobbyUser;
			var u = new usercls();
			u.lobby = o.lobbyId;
			u.userId = userId;
			o.users[userId] = u;
			o.lobbyEvents.emit(EVENTS.NEW_USER, u, o);
			return u;
		}

		room(roomId, roomcls) {
			var o = this;
			if (!roomcls) roomcls = LobbyRoom;
			var r = new roomcls();
			r.lobby = o.lobbyId;
			r.roomId = roomId;
			o.rooms[roomId] = r;
			o.lobbyEvents.emit(EVENTS.NEW_ROOM, r, o);
			return r;
		}

		app(appId, appcls) {
			var o = this;
			if (!appcls) appcls = LobbyApp;
			var a = new appcls();
			a.lobby = o.lobbyId;
			a.appId = appId;
			o.apps[appId] = a;
			o.lobbyEvents.emit(EVENTS.NEW_APP, a, o);
			return a;
		}

	}
}

module.exports.xpros = xpros;
module.exports.EVENTS = EVENTS;
module.exports.SERVERID = SERVERID;
module.exports.lobbyUserClass = LobbyUser;
module.exports.lobbyRoomClass = LobbyRoom;
module.exports.lobbyAppClass = LobbyApp;
module.exports.resetExtends = () => Subserver = null;
module.exports.getExtends = () => Subserver;
module.exports.getExtendedServerProtoSS = getExtendedServerProtoSS;