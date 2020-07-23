declare namespace zetaret.node.modules {
	export interface VoyageCTOR {
		new(): Voyage
	}
	export interface Voyage extends Subserver {
		initVoyage(): void
		voya(route: object, port?: number): zetaret.node.modules.Voyage
	}
	export interface VoyageModule extends SubserverModule {
		getExtends(): zetaret.node.modules.SubserverCTOR
		getExtendedServerProtoSS(ProtoSSChe: ProtoSSCheCTOR): zetaret.node.modules.VoyageCTOR
	}
}