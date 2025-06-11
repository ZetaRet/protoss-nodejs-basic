/**
 * Author: Zeta Ret
 * Date: 2023 - Today
 * Reference to Boolean object, strict equality is false
 **/

declare module "protoss-nodejs-basic/dist/utils/nano/BooleanRef.js";
declare module "zetaret.node.utils.nano::BooleanRef";

export class BooleanRef extends Boolean implements zetaret.node.utils.nano.BooleanRef {
	constructor(b: boolean) {
		super(b);
	}

	valueOfObj(): BooleanRef {
		return this;
	}
}