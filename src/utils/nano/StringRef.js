/**
 * Author: Zeta Ret
 * Date: 2023 - Today
 * Reference to String object, strict equality is false
 **/

class StringRef extends String {
	constructor(s) {
		super(s);
	}

	concat() {
		return new StringRef(super.concat.apply(this, arguments));
	}

	valueOfObj() {
		return this;
	}
}

module.exports.StringRef = StringRef;
