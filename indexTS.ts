import { serverclass } from "./ProtoSSChe";
import { getExtendedServerProtoSS as XProtoSSCheFactory } from "./modules/XProtoSSChe";
import { getExtendedServerProtoSS as SubserverFactory } from "./modules/Subserver";
import { getExtendedServerProtoSS as LobbyServerFactory, lobbyUserClass, lobbyRoomClass, lobbyAppClass } from "./modules/LobbyServer";
import { getExtendedServerProtoSS as CardServerFactory, cardClass, cardAppClass, sideCardAppClass } from "./modules/CardServer";
import { getExtendedServerProtoSS as VoyageFactory } from "./modules/Voyage";

const ProtoSSChe: zetaret.node.ProtoSSCheCTOR = serverclass as any;
const XProtoSSChe: zetaret.node.modules.XProtoSSCheCTOR = XProtoSSCheFactory(ProtoSSChe) as any;
const Subserver: zetaret.node.modules.SubserverCTOR = SubserverFactory(XProtoSSChe) as any;
const LobbyServer: zetaret.node.modules.LobbyServerCTOR = LobbyServerFactory(Subserver) as any;
const LobbyUser: zetaret.node.modules.LobbyUserCTOR = lobbyUserClass as any;
const LobbyRoom: zetaret.node.modules.LobbyRoomCTOR = lobbyRoomClass as any;
const LobbyApp: zetaret.node.modules.LobbyAppCTOR = lobbyAppClass as any;
const CardServer: zetaret.node.modules.CardServerCTOR = CardServerFactory(LobbyServer) as any;
const Card: zetaret.node.modules.CardCTOR = cardClass as any;
const CardApp: zetaret.node.modules.CardAppCTOR = cardAppClass as any;
const SideCardApp: zetaret.node.modules.SideCardAppCTOR = sideCardAppClass as any;
const Voyage: zetaret.node.modules.VoyageCTOR = VoyageFactory(Subserver) as any;

const ProtoSSCheInstance: zetaret.node.ProtoSSChe = new ProtoSSChe();
const XProtoSSCheInstance: zetaret.node.modules.XProtoSSChe = new XProtoSSChe();
const SubserverInstance: zetaret.node.modules.Subserver = new Subserver();
const LobbyServerInstance: zetaret.node.modules.LobbyServer = new LobbyServer();
const LobbyAppInstance: zetaret.node.modules.LobbyApp = new LobbyApp();
const LobbyRoomInstance: zetaret.node.modules.LobbyRoom = new LobbyRoom();
const LobbyUserInstance: zetaret.node.modules.LobbyUser = new LobbyUser();
const CardServerInstance: zetaret.node.modules.CardServer = new CardServer();
const CardInstance: zetaret.node.modules.Card = new Card();
const CardAppInstance: zetaret.node.modules.CardApp = new CardApp();
const SideCardAppInstance: zetaret.node.modules.SideCardApp = new SideCardApp();
const VoyageInstance: zetaret.node.modules.Voyage = new Voyage();

[
	ProtoSSCheInstance,
	XProtoSSCheInstance,
	SubserverInstance,
	LobbyServerInstance,
	LobbyAppInstance,
	LobbyRoomInstance,
	LobbyUserInstance,
	CardServerInstance,
	CardInstance,
	CardAppInstance,
	SideCardAppInstance,
	VoyageInstance
].forEach((e: any) => console.log(e));