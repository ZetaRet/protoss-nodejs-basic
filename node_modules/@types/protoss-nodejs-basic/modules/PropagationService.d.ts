declare namespace zetaret.node.modules {
	export interface PropagationServiceCTOR {
		new(): PropagationService
	}
	export interface PropagationService extends ServiceEncasement {
		gridTags: { [sid: string]: zetaret.node.modules.Subserver };
		binders: { [bid: string]: BindingPropagator };
		understoodContent: { [bid: string]: Array<UnderstandingBody> };
		discontent: UnderstandingBody[];
		drafts: UnderstandingBody[];
		regulations: UnderstandingBody[];
		directives: UnderstandingBody[];

		buildBinder(bid: string, bdata?: object): BindingPropagator
	}
	export interface BindingPropagatorCTOR {
		new(): BindingPropagator
	}
	export interface BindingPropagator {
		bid: string;
		emitter: Emitter;
		type: string;
		readAll?: boolean;
		understandAll?: boolean;
		propagationLimit?: number;
		service?: ServiceEncasement;
	}
	export interface UnderstandingBody {
		source: string | number;
		iterations: number;
		percentage: number;
		bytes: number;
		lines: number;
		complexity: number;
		isText: boolean;
		isFile: boolean;
		isExecutable: boolean;
		requireNewPropagator: boolean;
		tags?: string[];
		mergers?: string[];
		requiredTime?: number;
	}
	export interface PropagateTypes {
		NONE: "none";
		PYRAMID: "pyramid";
		PLANE: "plane";
		RESIDUE: "residue";
	}
}