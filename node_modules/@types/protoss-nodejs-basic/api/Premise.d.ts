declare namespace zetaret.node.api {
	export interface PremiseCTOR {
		new <T extends Refutation>(executor: (resolve: (value?: T) => void, reject: (error?: any) => void) => void): Premise<T>
	}
	export interface Premise<T = Refutation> extends Promise<T> {
		then<T1 = T, T2 = never>(onfulfilled?: ((value: T) => T1 | PremiseLike<T1>), onrejected?: ((reason: any) => T2 | PremiseLike<T2>)): Premise<T1 | T2>;
	}
	export interface PremiseLike<T = Refutation> extends PromiseLike<T> { }
	export interface RefutationCTOR {
		new(conclusion?: Promise<object>, failed?: Array<Promise<ArguableMaterial>>): Refutation
	}
	export interface Refutation {
		conclusion?: Promise<object>;
		failedPromises?: Array<Promise<ArguableMaterial>>;

		assert(): boolean
	}
	export interface ArguableMaterialCTOR {
		new(predicate?: any, subject?: any, proposition?: any): ArguableMaterial
	}
	export interface ArguableMaterial {
		predicate?: any;
		subject?: any;
		proposition?: any;

		valueOf(): any;
	}
}