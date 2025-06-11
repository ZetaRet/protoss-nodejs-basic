/**
 * Author: Zeta Ret
 * Date: 2023 - Today
 * Reference to Number object, strict equality is false
 **/

declare module "protoss-nodejs-basic/dist/utils/nano/NumberRef.js";
declare module "zetaret.node.utils.nano::NumberRef";

export class NumberRef extends Number implements zetaret.node.utils.nano.NumberRef {
	constructor(n: number) {
		super(n);
	}

	valueOfObj(): NumberRef {
		return this;
	}
}