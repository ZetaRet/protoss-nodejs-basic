declare namespace zetaret.node.modules {
	export interface CardAppCTOR {
		new(): CardApp
	}
	export interface CardApp extends LobbyApp {
		cards: { [name: string]: Card };
		tableCards: Array<Card>;
		sideCards: Array<Card>;
		userCards: Array<Card>;
		poolCards: Array<Card>;
		removedCards: Array<Card>;
		cardEvents: zetaret.node.Emitter;
		hasSupport: boolean;
		isMonetary: boolean;

		drawCard(card: Card, user: LobbyUser): void
	}
}