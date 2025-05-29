/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Length based Computational String
 **/

export class StringLength extends String implements zetaret.node.utils.nano.StringLength {
	constructor(s: string) {
		super(s);
	}

	concat(value: string, ...rest: string[]): any | StringLength {
		return new StringLength(super.concat.apply(this, arguments));
	}

	valueOf(): any | number {
		return this.length;
	}
}
