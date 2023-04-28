"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module1 = require("./ProtoSSChe");
const module2 = require("./modules/XProtoSSChe");
const module3 = require("./modules/Subserver");
const module4 = require("./modules/LobbyServer");
const module5 = require("./modules/CardServer");
const module6 = require("./modules/Voyage");
const ProtoSSChe_1 = require("./ProtoSSChe");
const XProtoSSChe_1 = require("./modules/XProtoSSChe");
const Subserver_1 = require("./modules/Subserver");
const LobbyServer_1 = require("./modules/LobbyServer");
const CardServer_1 = require("./modules/CardServer");
const Voyage_1 = require("./modules/Voyage");
const M1 = module1;
const M2 = module2;
const M3 = module3;
const M4 = module4;
const M5 = module5;
const M6 = module6;
const ProtoSSChe = ProtoSSChe_1.serverclass;
const XProtoSSChe = (0, XProtoSSChe_1.getExtendedServerProtoSS)(ProtoSSChe);
const Subserver = (0, Subserver_1.getExtendedServerProtoSS)(ProtoSSChe);
const LobbyServer = (0, LobbyServer_1.getExtendedServerProtoSS)(ProtoSSChe);
const LobbyUser = LobbyServer_1.lobbyUserClass;
const LobbyRoom = LobbyServer_1.lobbyRoomClass;
const LobbyApp = LobbyServer_1.lobbyAppClass;
const CardServer = (0, CardServer_1.getExtendedServerProtoSS)(ProtoSSChe);
const Card = CardServer_1.cardClass;
const CardApp = CardServer_1.cardAppClass;
const SideCardApp = CardServer_1.sideCardAppClass;
const Voyage = (0, Voyage_1.getExtendedServerProtoSS)(ProtoSSChe);
const ProtoSSCheInstance = new ProtoSSChe();
const XProtoSSCheInstance = new XProtoSSChe();
const SubserverInstance = new Subserver();
const LobbyServerInstance = new LobbyServer();
const LobbyAppInstance = new LobbyApp();
const LobbyRoomInstance = new LobbyRoom();
const LobbyUserInstance = new LobbyUser();
const CardServerInstance = new CardServer();
const CardInstance = new Card();
const CardAppInstance = new CardApp();
const SideCardAppInstance = new SideCardApp();
const VoyageInstance = new Voyage();
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
].forEach((e) => console.log(e));
