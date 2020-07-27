declare namespace zetaret.node.modules {
	export interface DeepVoyageCTOR {
		new(): DeepVoyage
	}
	export interface DeepVoyage extends Voyage {
		configTypeServer(): void
	}
	export interface DeepVoyageModule extends VoyageModule {
		getExtends(): zetaret.node.modules.VoyageCTOR
		getExtendedServerProtoSS(ProtoSSChe: ProtoSSCheCTOR): zetaret.node.modules.DeepVoyageCTOR
	}
}