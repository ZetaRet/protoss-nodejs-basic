import "./indexModulePrefix.js";
import * as mod from "./../dist/ProtoSSChe.js";

if (!global.DisableAutoStartOfProtoSSChe) mod.StartUp();

export const serverclass = mod.serverclass;
export const ServerEnum = mod.ServerEnum;
export const loadedModule = mod.loadedModule;
export const loadedModuleClass = mod.loadedModuleClass;
export const serverche = mod.serverche;
export const instance = mod.instance;
export const StartUp = mod.StartUp;
export const ShutDown = mod.ShutDown;
export const setEnv = mod.setEnv;
export const resetFSInterval = mod.resetFSInterval;
export const stopFSInterval = mod.stopFSInterval;
export const getNodeServer = mod.getNodeServer;
export const getModuleInstance = mod.getModuleInstance;
