declare namespace zetaret.node.modules {
	export interface LobbyAppCTOR {
		new(): LobbyApp
	}
	export interface LobbyApp extends Array<object> {
		lobby: string;
		appId: string;
		appData: object;
		requirements: object;

		meetsRequirements(user: object): boolean
	}
}