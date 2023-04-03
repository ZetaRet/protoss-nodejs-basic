declare namespace zetaret.node {
	export interface SplitURL {
		url?: string;
		query?: string;
		path?: string;
		pages?: Array<string>;
		root?: string;
		page?: string;
		sub?: string;
		param?: string;
		vars?: object;
		post?: object;
	}
	export interface RouteObject extends SplitURL {
		rawpath?: string;
		pageIndex?: number;
		pageCurrent?: string;
		pageProxy?: string;
		exact?: boolean;
		output?: object;
	}
	export interface AugmentRequest {
		__reqid?: number;
		__encoding?: string;
		__bodyBuffer?: Buffer;
	}
	export interface AugmentResponse {
		__splitUrl?: SplitURL;
		__body?: string;
		__encoding?: string;
		__async?: boolean;
		__data?: Array<any>;
		__rcode?: number;
		__dataJoin?: string;
		__dataPrefix?: string;
		__dataSuffix?: string;
	}
	export interface RoutedResponse extends AugmentResponse {
		__splitUrl?: RouteObject;
		__breakRoute?: boolean;
		__headers?: object;
		__rawdata?: Array<object>;
	}
	export interface ServerEnvironment {
		dumpall?: boolean;
		dumpkeys?: Array<string>;
		omit?: object;
		maxBodyLength?: number;
		contenttype?: string;
		sidinterval?: number;
		statsin?: ServerStats;
		statsout?: ServerStats;
		keepBodyBuffer?: boolean;
	}
	export interface ServerStats {
		reqnum?: number;
		xserver?: boolean;
		xserverModule?: string;
		cookieid?: string;
		htport?: number;
		https?: boolean;
		httpsop?: ServerOptions;
		h2op?: object;
	}
	export interface ServerOptions {
		keyPath?: string;
		key?: string;
		certPath?: string;
		cert?: string;
		pfxPath?: string;
		pfx?: string;
		caPath?: string;
		ca?: Array<string> | string;
		h2?: boolean;
	}
	export interface BasicServerGlobal {
		ProtoSSCheStatsFile?: string;
		ProtoSSCheXServerPath?: string;
		SubserverRequireModule?: string;
		LobbyServerRequireModule?: string;
		CardServerRequireModule?: string;
		VoyageRequireModule?: string;
		DeepVoyageRequireModule?: string;
	}
	export interface ServerModule {
		xpros: ServerModule;
		SERVERID: string;
		EVENTS?: object;

		resetExtends(): void
		getExtends(): ProtoSSCheCTOR
		getExtendedServerProtoSS(ProtoSSChe: ProtoSSCheCTOR): ProtoSSCheCTOR
	}
	export interface ModuleInstance {
		serverche: ProtoSSChe;
		xpro: ServerModule;
		xprocls: ProtoSSCheCTOR;
		xmodule: string;
	}
}