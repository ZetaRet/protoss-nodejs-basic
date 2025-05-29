/**
 * Author: Zeta Ret
 * Date: 2023 - Today
 * Reference to Number object, strict equality is false
 **/

class NumberRef extends Number {
	constructor(s) {
		super(s);
	}

	valueOfObj() {
		return this;
	}
}

module.exports.NumberRef = NumberRef;
