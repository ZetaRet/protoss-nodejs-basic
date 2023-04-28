import * as module1 from "./ProtoSSChe";
import * as module2 from "./modules/XProtoSSChe";
import * as module3 from "./modules/Subserver";
import * as module4 from "./modules/LobbyServer";
import * as module5 from "./modules/CardServer";
import * as module6 from "./modules/Voyage";

import { serverclass } from "./ProtoSSChe";
import { getExtendedServerProtoSS as XProtoSSCheFactory } from "./modules/XProtoSSChe";
import { getExtendedServerProtoSS as SubserverFactory } from "./modules/Subserver";
import { getExtendedServerProtoSS as LobbyServerFactory, lobbyUserClass, lobbyRoomClass, lobbyAppClass } from "./modules/LobbyServer";
import { getExtendedServerProtoSS as CardServerFactory, cardClass, cardAppClass, sideCardAppClass } from "./modules/CardServer";
import { getExtendedServerProtoSS as VoyageFactory } from "./modules/Voyage";

const M1: zetaret.node.ProtoSSCheModule = module1 as any;
const M2: zetaret.node.modules.XProtoSSCheModule = module2 as any;
const M3: zetaret.node.modules.SubserverModule = module3 as any;
const M4: zetaret.node.modules.LobbyServerModule = module4 as any;
const M5: zetaret.node.modules.CardServerModule = module5 as any;
const M6: zetaret.node.modules.VoyageModule = module6 as any;

const ProtoSSChe: zetaret.node.ProtoSSCheCTOR = serverclass as any;
const XProtoSSChe: zetaret.node.modules.XProtoSSCheCTOR = XProtoSSCheFactory(ProtoSSChe) as any;
const Subserver: zetaret.node.modules.SubserverCTOR = SubserverFactory(ProtoSSChe) as any;
const LobbyServer: zetaret.node.modules.LobbyServerCTOR = LobbyServerFactory(ProtoSSChe) as any;
const LobbyUser: zetaret.node.modules.LobbyUserCTOR = lobbyUserClass as any;
const LobbyRoom: zetaret.node.modules.LobbyRoomCTOR = lobbyRoomClass as any;
const LobbyApp: zetaret.node.modules.LobbyAppCTOR = lobbyAppClass as any;
const CardServer: zetaret.node.modules.CardServerCTOR = CardServerFactory(ProtoSSChe) as any;
const Card: zetaret.node.modules.CardCTOR = cardClass as any;
const CardApp: zetaret.node.modules.CardAppCTOR = cardAppClass as any;
const SideCardApp: zetaret.node.modules.SideCardAppCTOR = sideCardAppClass as any;
const Voyage: zetaret.node.modules.VoyageCTOR = VoyageFactory(ProtoSSChe) as any;

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