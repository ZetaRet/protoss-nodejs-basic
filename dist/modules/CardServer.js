"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LobbyServer,
	xpros = require(global.CardServerRequireModule || "./LobbyServer"),
	events = require("events");
const EVENTS = {
	DRAW_CARD: "drawCard",
};
const SERVERID = "zetaret.node.modules::CardServer";
class Card extends Array {
	cardId;
	cardData;
	cardInDeck;
	cardOnTable;
	cardFlipped;
	sharedCard;
	cardPool;
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
class CardApp extends xpros.lobbyAppClass {
	cards;
	tableCards;
	sideCards;
	userCards;
	poolCards;
	removedCards;
	cardEvents;
	hasSupport;
	isMonetary;
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
	drawCard(card, user) {
		var o = this;
		o.cardEvents.emit(EVENTS.DRAW_CARD, card, user, o);
	}
}
class SideCardApp extends CardApp {
	sideData;
	isLimited;
	constructor() {
		super();
		var o = this;
		o.sideData = {};
		o.isLimited = false;
	}
}
function getExtendedServerProtoSS(ProtoSSChe) {
	if (!LobbyServer) LobbyServer = xpros.getExtendedServerProtoSS(ProtoSSChe);
	return class CardServer extends LobbyServer {
		decks;
		constructor() {
			super();
			var o = this;
			o.decks = {};
			o.initCards();
			o.initCardAppServer();
		}
		initCards() {}
		initCardAppServer() {}
	};
}
module.exports.xpros = xpros;
module.exports.EVENTS = EVENTS;
module.exports.SERVERID = SERVERID;
module.exports.cardClass = Card;
module.exports.cardAppClass = CardApp;
module.exports.sideCardAppClass = SideCardApp;
module.exports.resetExtends = () => (LobbyServer = null);
module.exports.getExtends = () => LobbyServer;
module.exports.getExtendedServerProtoSS = getExtendedServerProtoSS;
