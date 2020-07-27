declare namespace zetaret.node.modules {
	export interface LobbyServerCTOR {
		new(): LobbyServer
	}
	export interface LobbyServer extends Subserver {
		lobbyId: string;
		lobbyData: object;
		apps: { [name: string]: LobbyApp };
		users: { [name: string]: LobbyUser };
		rooms: { [name: string]: LobbyRoom };
		lobbyEvents: zetaret.node.Emitter;

		initLobby(): void
		initRooms(): void
		initApps(): void
		connectTo(options: object, data?: string, secure?: boolean): zetaret.node.XRequest
		promiseConnectTo(options: object, data?: string, secure?: boolean): Promise<object>
		onConnectError(e: Error): void
		onConnected(res: zetaret.node.Cross): void
		lobby(data: object): zetaret.node.modules.LobbyServer
		updateRemoveUser(u: LobbyUser, update?: boolean, remove?: boolean): zetaret.node.modules.LobbyServer
		updateRemoveRoom(r: LobbyRoom, update?: boolean, remove?: boolean): zetaret.node.modules.LobbyServer
		updateRemoveApp(a: LobbyApp, update?: boolean, remove?: boolean): zetaret.node.modules.LobbyServer
		user(userId: string, usercls?: LobbyUserCTOR | LobbyUser | Function): zetaret.node.modules.LobbyUser
		room(roomId: string, roomcls?: LobbyRoomCTOR | LobbyRoom | Function): zetaret.node.modules.LobbyRoom
		app(appId: string, appcls?: LobbyAppCTOR | LobbyApp | Function): zetaret.node.modules.LobbyApp
	}
	export interface LobbyServerEvents {
		CONNECT_ERROR: "connectError";
		LOBBY_UPDATE: "lobbyUpdate";
		ON_CONNECTED: "onConnected";
		NEW_USER: "newUser";
		UPDATE_USER: "updateUser";
		REMOVE_USER: "removeUser";
		NEW_ROOM: "newRoom";
		UPDATE_ROOM: "updateRoom";
		REMOVE_ROOM: "removeRoom";
		NEW_APP: "newApp";
		UPDATE_APP: "updateApp";
		REMOVE_APP: "removeApp";
	}
	export interface LobbyServerModule extends SubserverModule {
		lobbyUserClass: LobbyUserCTOR;
		lobbyRoomClass: LobbyRoomCTOR;
		lobbyAppClass: LobbyAppCTOR;

		getExtends(): zetaret.node.modules.LobbyServerCTOR
		getExtendedServerProtoSS(ProtoSSChe: ProtoSSCheCTOR): zetaret.node.modules.LobbyServerCTOR
	}
}