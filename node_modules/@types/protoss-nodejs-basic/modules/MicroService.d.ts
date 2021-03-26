declare namespace zetaret.node.modules {
	export interface MicroServiceCTOR {
		new(): MicroService
	}
	export interface MicroService extends ServiceEncasement {
		microId: string | number;
		microType: string;
		remote: boolean;
		endPoints: MicroEndpoint[];
		gateway: MicroService[];
		sameTopic: MicroService[];
	}
	export interface MicroEndpoint {
		url: string;
		protocol?: string;
		requireCookies?: boolean;
		requireStatus?: boolean;
		requireAuthHeaders?: boolean;
		encoding?: string[];
		supportSocket?: boolean;
		listAPI?: string[];
	}
	export interface MicroTypes {
		NONE: "none";
		API: "api";
		COMPOSITION: "composition";
		CONFIGURATION: "configuration";
		DATABASE: "database";
		MONOLITH: "monolith";
		STATUS: "status";
		ASYNCHRONOUS: "asynchronous";
		SYNCHRONOUS: "synchronous";
		SUBSCRIBE: "subscribe";
		LOGGING: "logging";
		TRACKING: "tracking";
		TRACING: "tracing";
		INVOCATION: "invocation";
	}
}