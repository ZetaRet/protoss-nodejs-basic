/**
 * Oppositional statement of the Promise which does not resolve to the promised value,
 * and provides a reason as failed promises of arguable materials to reach a conclusion.
 * The conclusion Promise might be provided by the Refutation executor or programmed later on.
 * Any of the steps until final result are unknown and at least one side might never receive the promised value or error.
 */

import { Premise, Refutation } from "./api/PremiseData";

async function refExe() {
	const ref: Refutation = await new Premise((resolve) => {
		setTimeout(() => {
			resolve(new Refutation());
		}, 1000);
	});

	return ref;
}

console.log(refExe());