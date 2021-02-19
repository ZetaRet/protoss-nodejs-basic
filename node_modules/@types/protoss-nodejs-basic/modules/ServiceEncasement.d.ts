declare namespace zetaret.node.modules {
	export interface ServiceEncasementCTOR {
		new(): ServiceEncasement
	}
	export interface ServiceEncasement {
		environment: zetaret.node.api.EnvironmentTypes;
		grid: zetaret.node.modules.Subserver[];
		processor: zetaret.node.Process[];
		threads: zetaret.node.Thread[];
		cluster: zetaret.node.Head[];
		emitter: zetaret.node.Emitter;
		data: object;
		reservedPorts: { [port: number]: boolean };
		blockIP: { [ip: string]: boolean };

		bindService(service: ServiceEncasement): Promise<object>;
		unbindService(service: ServiceEncasement): Promise<object>;
		startAllServices(): Promise<object>;
		stopAllServices(): Promise<object>;
	}
}