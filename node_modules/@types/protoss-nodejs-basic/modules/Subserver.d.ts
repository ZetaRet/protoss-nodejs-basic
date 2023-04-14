declare namespace zetaret.node.modules {
	export interface SubserverCTOR {
		new(): Subserver
	}
	export interface Subserver extends XProtoSSChe {
		routeMap: object;
		codeMap: object;
		noRouteCode: number;
		noRouteEvent: string;
		debugRoute: boolean;
		listener: zetaret.node.Emitter;
		pathEmitter: zetaret.node.Emitter;
		routeRegMap: object;
		routeRegExp: RegExp;
		routeRegGet: Function;
		useProxy: boolean;
		proxyPaths: string;
		proxyMask: object;
		noProxyCode: number;
		noProxyEvent: string;
		emitExacts: boolean;

		addPathListener(path: string, callback?: Function): Function
		removePathListener(path: string, callback: Function): zetaret.node.modules.Subserver
		pathListener(server: zetaret.node.modules.Subserver, robj: object, routeData: object, request: zetaret.node.Input, response: zetaret.node.Output): void
		addMethodPathListener(method: string, path: string, callback: Function): Function
		addParamsPathListener(path: string, callback: Function, method?: string, autoRoute?: boolean): Function
		addRegPathListener(path: string, callback: Function): Function
		setRouteRegExp(path: string): RegExp
		routeCallback(routeData: object, body: string, request: zetaret.node.Input, response: zetaret.node.Output): void
		initRoute(): void
		initRouteListener(): zetaret.node.modules.Subserver
		pushProtoSSResponse(request: zetaret.node.Input, response: zetaret.node.Output): zetaret.node.modules.Subserver
		addHeaders(request: zetaret.node.Input, response: zetaret.node.Output): object
	}
	export interface SubserverEvents {
		VOID: "";
	}
	export interface SubserverModule extends XProtoSSCheModule {
		getExtends(): zetaret.node.modules.SubserverCTOR
		getExtendedServerProtoSS(ProtoSSChe: ProtoSSCheCTOR): zetaret.node.modules.SubserverCTOR
	}
}