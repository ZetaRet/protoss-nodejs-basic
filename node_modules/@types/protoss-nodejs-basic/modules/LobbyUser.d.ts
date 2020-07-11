declare namespace zetaret.node.modules {
	export interface LobbyUserCTOR {
		new(): LobbyUser
	}
	export interface LobbyUser {
		lobby: string;
		userId: string;
		userData: object;

		getUserPrerequisites(): object
	}
}