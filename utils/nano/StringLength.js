/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Length based Computational String
 **/

class StringLength extends String {
	constructor(s) {
		super(s);
	}

	concat() {
		return new StringLength(super.concat.apply(this, arguments));
	}

	valueOf() {
		return this.length;
	}
}

module.exports.StringLength = StringLength;