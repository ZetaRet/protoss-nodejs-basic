"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringRef = void 0;
class StringRef extends String {
	constructor(s) {
		super(s);
	}
	concat(value, ...rest) {
		return new StringRef(super.concat.apply(this, arguments));
	}
	valueOfObj() {
		return this;
	}
}
exports.StringRef = StringRef;
