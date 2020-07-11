declare namespace zetaret.node.modules {
	export interface CardCTOR {
		new(): Card
	}
	export interface Card extends Array<object> {
		cardId: string;
		cardData: object;
		cardInDeck: boolean;
		cardOnTable: boolean;
		cardFlipped: boolean;
		sharedCard: boolean;
		cardPool: object;
		cardColor: object;
		cardType: object;
		cardNumber: object;
		cardMeta: object;
		cardBack: object;
	}
}