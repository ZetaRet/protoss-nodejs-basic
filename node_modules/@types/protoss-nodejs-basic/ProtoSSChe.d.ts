declare namespace zetaret.node {
	export interface ProtoSSCheCTOR {
		new(): ProtoSSChe
	}
	export interface ProtoSSChe {
		env: ServerEnvironment;
		htserv: XServer;
		acceptAppRequests: boolean;
		apps: object;
		cookieMethod: Function;
		requestMethod: Function;
		onErrorBody: Function;
		onEndBody: Function;
		dataJoin: string;
		reqIdLength: number;
		keepBufferPerContentType: { [ctype: string]: boolean };
		requestBodyMethods: Array<string>;
		readRequestOnError: boolean;
		requestMiddleware: Array<Function>;
		responseMiddleware: Array<Function>;

		getAppRequest(request: XRequest): Input
		onRequest(request: Input, response: Output): void
		onReadRequestBody(request: Input, body: string, response: Output): ProtoSSChe | Promise<ProtoSSChe>
		splitUrl(url: string): SplitURL
		rndstr(l: number): string
		getReqId(): string
		pushProtoSSResponse(request: Input, response: Output): ProtoSSChe
		readRequestBody(request: Input, response: Output): ProtoSSChe
		updateCookies(request: Input, response: Output, headers: object): ProtoSSChe
		endResponse(request: Input, response: Output): ProtoSSChe | Promise<ProtoSSChe>
	}
	export interface ProtoSSCheInstance {
		xpro: ServerModule;
		xprocls: ProtoSSCheCTOR;
		xmodule: string;
		serverche: ProtoSSChe;
	}
	export interface ProtoSSCheModule {
		serverclass: ProtoSSCheCTOR;

		loadedModule: () => ServerModule;
		loadedModuleClass: () => ProtoSSCheCTOR;
		serverche: () => ProtoSSChe;
		instance: () => ProtoSSCheInstance;
		StartUp(): void
		ShutDown(): void
		setEnv(envobj: ServerEnvironment): void
		resetFSInterval(): void
		stopFSInterval(): void
		getModuleInstance(xmodule: string): ModuleInstance
	}
}