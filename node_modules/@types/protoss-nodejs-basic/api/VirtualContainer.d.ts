declare namespace zetaret.node.api {
	export interface VirtualContainerCTOR {
		new(): VirtualContainer
	}
	export interface VirtualContainer {
		containerType: string;
		config: object;
		capabilities: object;
		supportFiles: object[];
		processes: object[];
		cpu: object;
		ram: object;

		setConfig(cfg: object): void
		setCapabilities(cap: object): void
		addSupport(file: object): Promise<object>
		install(): Promise<object>
		remove(): Promise<object>
		restart(): Promise<object>
		shutdown(): Promise<object>
		inspect(tool: Function): Promise<object>
		monitor(view: Function): Promise<object>
	}
	export interface VirtualTypes {
		APPLICATION: "application";
		CLOUD: "cloud";
		DATA: "data";
		DESKTOP: "desktop";
		NETWORK: "network";
		OPERATING_SYSTEM: "operatingSystem";
		SERVER: "server";
		SERVICE: "service";
		STORAGE: "storage";
	}
}