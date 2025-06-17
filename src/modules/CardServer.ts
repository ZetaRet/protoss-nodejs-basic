/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Card server based on lobby connectivity with micro apps
 **/
declare module "zetaret.node.modules::CardServer";
declare module "protoss-nodejs-basic/dist/modules/CardServer.js";

export { }

var LobbyServer: zetaret.node.modules.LobbyServerCTOR,
	xpros: zetaret.node.modules.LobbyServerModule = require((global as zetaret.node.BasicServerGlobal).CardServerRequireModule || "./LobbyServer"),
	events = require("events");

const EVENTS = {
	DRAW_CARD: "drawCard",
};
const SERVERID = "zetaret.node.modules::CardServer";

class Card extends Array implements zetaret.node.modules.Card {
	cardId: string;
	cardData: object | any;
	cardInDeck: boolean;
	cardOnTable: boolean;
	cardFlipped: boolean;
	sharedCard: boolean;
	cardPool: object;

	constructor() {
		super();
		var o = this;
		o.cardId = null;
		o.cardData = {};
		o.cardInDeck = false;
		o.cardOnTable = false;
		o.cardFlipped = false;
		o.sharedCard = false;
		o.cardPool = null;
	}

	get cardColor() {
		var o = this;
		return o.cardData.cardColor;
	}

	get cardType() {
		var o = this;
		return o.cardData.cardType;
	}

	get cardNumber() {
		var o = this;
		return o.cardData.cardNumber;
	}

	get cardMeta() {
		var o = this;
		return o.cardData.metaData;
	}

	get cardBack() {
		var o = this;
		return o.cardData.backData;
	}
}

class CardApp extends (xpros as zetaret.node.modules.LobbyServerModule).lobbyAppClass implements zetaret.node.modules.CardApp {
	cards: { [name: string]: Card };
	tableCards: Array<Card>;
	sideCards: Array<Card>;
	userCards: Array<Card>;
	poolCards: Array<Card>;
	removedCards: Array<Card>;
	cardEvents: zetaret.node.Emitter;
	hasSupport: boolean;
	isMonetary: boolean;

	constructor() {
		super();
		var o = this;
		o.cards = {};
		o.tableCards = [];
		o.sideCards = [];
		o.userCards = [];
		o.poolCards = [];
		o.removedCards = [];
		o.cardEvents = new events.EventEmitter();
		o.hasSupport = false;
		o.isMonetary = false;
	}

	drawCard(card: Card, user: zetaret.node.modules.LobbyUser): void {
		var o = this;
		o.cardEvents.emit(EVENTS.DRAW_CARD, card, user, o);
	}
}

class SideCardApp extends CardApp implements zetaret.node.modules.SideCardApp {
	sideData: object;
	isLimited: boolean;

	constructor() {
		super();
		var o = this;
		o.sideData = {};
		o.isLimited = false;
	}
}

function getExtendedServerProtoSS(ProtoSSChe: zetaret.node.ProtoSSCheCTOR): zetaret.node.modules.CardServerCTOR {
	if (!LobbyServer) LobbyServer = xpros.getExtendedServerProtoSS(ProtoSSChe);
	return class CardServer extends LobbyServer implements zetaret.node.modules.CardServer {
		decks: object;

		constructor() {
			super();
			var o = this;
			o.decks = {};
			o.initCards();
			o.initCardAppServer();
		}

		initCards(): void { }

		initCardAppServer(): void { }
	};
}

module.exports.xpros = xpros;
module.exports.EVENTS = EVENTS;
module.exports.SERVERID = SERVERID;
module.exports.cardClass = Card;
module.exports.cardAppClass = CardApp;
module.exports.sideCardAppClass = SideCardApp;
module.exports.resetExtends = (): void => (LobbyServer = null);
module.exports.getExtends = (): zetaret.node.modules.LobbyServerCTOR => LobbyServer;
module.exports.getExtendedServerProtoSS = getExtendedServerProtoSS;
