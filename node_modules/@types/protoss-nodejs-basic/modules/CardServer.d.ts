declare namespace zetaret.node.modules {
	export interface CardServerCTOR {
		new(): CardServer
	}
	export interface CardServer extends LobbyServer {
		decks: object;

		initCards(): void
		initCardAppServer(): void
	}
	export interface CardServerEvents {
		DRAW_CARD: "drawCard";
	}
	export interface CardServerModule extends LobbyServerModule {
		cardClass: CardCTOR;
		cardAppClass: CardAppCTOR;
		sideCardAppClass: SideCardAppCTOR;

		getExtends(): zetaret.node.modules.CardServerCTOR
		getExtendedServerProtoSS(ProtoSSChe: ProtoSSCheCTOR): zetaret.node.modules.CardServerCTOR
	}
}