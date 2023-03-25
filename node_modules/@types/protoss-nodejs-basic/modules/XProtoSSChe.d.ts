declare namespace zetaret.node.modules {
	export interface XProtoSSCheCTOR {
		new(routeCallback?: Function, routeScope?: object, routeData?: object): XProtoSSChe
	}
	export interface XProtoSSChe extends zetaret.node.ProtoSSChe {
		routeCallback: Function;
		routeScope: object;
		routeData: object;
		autoCookie: boolean;
		postJSON: boolean;
		contentParsers: { [ctype: string]: Function };
		layerServer: boolean;
		middleware: Array<Function>;
		emitRR: boolean;
		asyncGrid: Function;
		asyncBuffer: Array<object>;
		asyncInterval: number;
		asyncId: number | object;

		initRoute(): void
		initAsyncGrid(): void
		stopAsyncGrid(): void
		flushAsyncBuffer(): void
		onReadRequestBody(request: zetaret.node.Input, body: string, response: zetaret.node.Output): Promise<zetaret.node.modules.XProtoSSChe>
		pushProtoSSResponse(request: zetaret.node.Input, response: zetaret.node.Output): zetaret.node.modules.XProtoSSChe
		addHeaders(request: zetaret.node.Input, response: zetaret.node.Output): object
		layerInitRequest(request: zetaret.node.Input, response: zetaret.node.Output, body: string): string
		layerEndResponse(request: zetaret.node.Input, response: zetaret.node.Output, input: string, headers: object): string
		endResponse(request: zetaret.node.Input, response: zetaret.node.Output): Promise<zetaret.node.modules.XProtoSSChe>
	}
	export interface XProtoSSCheEvents {
		INIT_REQUEST: "initRequest";
		ROUTE: "route";
		ASYNC_RESPONSE: "pushProtoSSAsyncResponse";
		END_RESPONSE: "endResponse";
	}
	export interface XProtoSSCheModule extends zetaret.node.ServerModule {
		getExtends(): zetaret.node.modules.XProtoSSCheCTOR
		getExtendedServerProtoSS(ProtoSSChe: ProtoSSCheCTOR): zetaret.node.modules.XProtoSSCheCTOR
	}
}