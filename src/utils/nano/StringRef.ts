/**
 * Author: Zeta Ret
 * Date: 2023 - Today
 * Reference to String object, strict equality is false
 **/

declare module "protoss-nodejs-basic/dist/utils/nano/StringRef.js";
declare module "zetaret.node.utils.nano::StringRef";

export class StringRef extends String implements zetaret.node.utils.nano.StringRef {
	constructor(s: string) {
		super(s);
	}

	concat(value: string, ...rest: string[]): StringRef | any {
		return new StringRef(super.concat.apply(this, arguments));
	}

	valueOfObj(): StringRef {
		return this;
	}
}