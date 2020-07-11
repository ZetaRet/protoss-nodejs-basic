declare namespace zetaret.node.modules {
	export interface SideCardAppCTOR {
		new(): SideCardApp
	}
	export interface SideCardApp extends CardApp {
		sideData: object;
		isLimited: boolean;
	}
}