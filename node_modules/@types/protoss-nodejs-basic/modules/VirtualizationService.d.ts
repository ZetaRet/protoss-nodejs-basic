declare namespace zetaret.node.modules {
	export interface VirtualizationServiceCTOR {
		new(): VirtualizationService
	}
	export interface VirtualizationService extends ServiceEncasement {
		containers: zetaret.node.api.VirtualContainer[];
		globalSettings: object;
		globalCapabilities: object;
		globalFiles: object[];
		isLayer: boolean;

		partition(): Promise<object>
		isolation(): Promise<object>
		encapsulation(): Promise<object>
		uninstall(container: zetaret.node.api.VirtualContainer): Promise<object>
	}
}