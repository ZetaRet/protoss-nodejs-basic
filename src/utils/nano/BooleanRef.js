/**
 * Author: Zeta Ret
 * Date: 2023 - Today
 * Reference to Boolean object, strict equality is false
 **/

class BooleanRef extends Boolean {
	constructor(s) {
		super(s);
	}

	valueOfObj() {
		return this;
	}
}

module.exports.BooleanRef = BooleanRef;
