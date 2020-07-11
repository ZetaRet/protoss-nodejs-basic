declare namespace zetaret.node.modules {
	export interface LobbyRoomCTOR {
		new(): LobbyRoom
	}
	export interface LobbyRoom extends Array<object> {
		lobby: string;
		roomId: string;
		roomData: object;
		isChat: boolean;
		isLeader: boolean;
	}
}