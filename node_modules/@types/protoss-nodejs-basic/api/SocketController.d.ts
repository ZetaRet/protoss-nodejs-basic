declare namespace zetaret.node.api {
	export interface SocketControllerCTOR {
		new(api: APIController): SocketController
	}
	export interface SocketController {
		socket: zetaret.node.api.SocketServer;
		debug: boolean;
		clients: Array<ClientSocket>;
		clientmap: { [uid: string]: ClientSocket };
		mapapi: { [command: string]: boolean | number };
		sentapi: { [command: string]: boolean | number };
		apic: APIController;
		api: { [command: string]: boolean | number };
		returnCRID: boolean;
		returnCommand: boolean;

		mapClient(cs: ClientSocket, uid: string): void
		getResponse(): zetaret.node.RoutedResponseX
		getRoute(command: string, vars: object): zetaret.node.RouteObject
		listen(cs: ClientSocket): void
		wrapData(data: object): string
		writeCS(cs: ClientSocket, data: object): void
	}
	export interface SocketServerCTOR {
		new(data?: object, callback?: Function): SocketServer
	}
	export interface SocketServer {
		on(event: string, method: Function): void
		address(): object
		close(callback?: Function): void
	}
	export interface ClientSocket {
		___wsid?: string;
		___mapid?: string;

		on(event: string, method: Function): void
		send(data: string): void
	}
	export interface SocketControllerModule {
		SocketController: SocketControllerCTOR;
	}
}