export class Premise<T extends Refutation> extends Promise<T> implements zetaret.node.api.Premise<T> {
	constructor(executor: (resolve: (value?: T) => void, reject: (error?: any) => void) => void) {
		super(executor);
	}
}

export class ArguableMaterial implements zetaret.node.api.ArguableMaterial {
	public predicate?: any;
	public subject?: any;
	public proposition?: any;

	constructor(predicate?: any, subject?: any, proposition?: any) {
		this.predicate = predicate;
		this.subject = subject;
		this.proposition = proposition;
	}

	public valueOf(): any {

	}
}

export class Refutation implements zetaret.node.api.Refutation {
	public conclusion?: Promise<object>;
	public failedPromises?: Array<Promise<ArguableMaterial>>;

	constructor(conclusion?: Promise<object>, failed?: Array<Promise<ArguableMaterial>>) {
		this.conclusion = conclusion;
		this.failedPromises = failed;
	}

	public assert(): boolean {
		return false;
	}
}
