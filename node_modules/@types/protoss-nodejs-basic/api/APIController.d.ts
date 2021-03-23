declare namespace zetaret.node.api {
	export interface APIControllerCTOR {
		new(): APIController
	}
	export interface APIController {
		ctype: string;
		api: Array<string>;
		server: zetaret.node.modules.Subserver;
		db: object;
		apiPrefix: string;

		addServer(server: zetaret.node.modules.Subserver): void
		setHeaders(response: zetaret.node.RoutedResponseX): void
		pushData(response: zetaret.node.RoutedResponseX, data: object): void
	}
	export interface APIControllerModule {
		APIController: APIControllerCTOR;
	}
}