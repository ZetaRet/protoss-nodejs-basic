declare namespace zetaret.node.api {
	export interface EnvironmentTypes {
		ActiveEnvironment: Array<string>;
		CustomEnvironment: { [eid: string]: EnvironmentalAdapter };
		API: { [api: string]: APIController };
		Sockets: { [so: string]: SocketController };

		PushAPI(api: string, apic: APIController): void
		OpenSocket(so: string, soc: SocketController): void
		AddCustomEnvironment(eid: string, adapter: EnvironmentalAdapter): void
	}
	export interface EnvironmentAPI {
		ClassicHttpEnvironment: "che";
		AjaxRequestEnvironment: "are";
		WebSocketEnvironment: "wse";
		MixedEnvironment: "me";
	}
	export interface EnvironmentalAdapter {
		name?: string;
		server?: zetaret.node.ProtoSSChe;
		active?: boolean;
		envData?: object;

		setServer(server: zetaret.node.ProtoSSChe): void
		activate(): boolean
		deactivate(): boolean
		synchronousAdapt(call: string, data: Array<any>): any
		asynchronousAdapt(call: string, data: Array<any>, callback?: Function): Promise<object>
		adaptInput(input: Input, callback: Function): void
		adaptOutput(output: Output, callback: Function): void
		adaptDefaults(callback: Function): void
		adaptSystem(callback: Function): void
		adaptTunnel(incoming: Function, outgoing: Function, directions?: { [dir: string]: Function }): void
	}
	export interface EnvInterface {
		types?: Array<Function | object>;
		typeGuard?: Function;

		isImplemented(cast: Function | object): boolean
	}
}