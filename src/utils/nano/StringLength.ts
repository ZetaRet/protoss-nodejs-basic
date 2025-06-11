/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Length based Computational String
 **/

declare module "protoss-nodejs-basic/dist/utils/nano/StringLength.js";
declare module "zetaret.node.utils.nano::StringLength";

export class StringLength extends String implements zetaret.node.utils.nano.StringLength {
	constructor(s: string) {
		super(s);
	}

	concat(value: string, ...rest: string[]): StringLength | any {
		return new StringLength(super.concat.apply(this, arguments));
	}

	valueOf(): any | number {
		return this.length;
	}
}
