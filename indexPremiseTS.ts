/**
 * Oppositional statement of the Promise which does not resolve to the promised value,
 * and provides a reason as failed promises of arguable materials to reach a conclusion.
 * The conclusion Promise might be provided by the Refutation executor or programmed later on.
 * Any of the steps until final result are unknown and at least one side might never receive the promised value or error.
 */

class Premise<T extends Refutation> extends Promise<T> implements zetaret.node.api.Premise<T> {
	constructor(executor: (resolve: (value?: T) => void, reject: (error?: any) => void) => void) {
		super(executor);
	}
}

class ArguableMaterial implements zetaret.node.api.ArguableMaterial {
	public predicate?: any;
	public subject?: any;
	public proposition?: any;

	constructor(predicate?: any, subject?: any, proposition?: any) {

	}

	public valueOf(): any {

	}
}

class Refutation implements zetaret.node.api.Refutation {
	public conclusion?: Promise<object>;
	public failedPromises?: Array<Promise<ArguableMaterial>>;

	constructor(conclusion?: Promise<object>, failed?: Array<Promise<ArguableMaterial>>) {

	}

	public assert(): boolean {
		return false;
	}
}

async function refExe() {
	const ref: Refutation = await new Premise((resolve) => {
		setTimeout(() => {
			resolve(new Refutation());
		}, 1000);
	});

	return ref;
}

console.log(refExe());