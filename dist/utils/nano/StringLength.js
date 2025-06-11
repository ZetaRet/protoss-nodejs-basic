"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringLength = void 0;
class StringLength extends String {
	constructor(s) {
		super(s);
	}
	concat(value, ...rest) {
		return new StringLength(super.concat.apply(this, arguments));
	}
	valueOf() {
		return this.length;
	}
}
exports.StringLength = StringLength;
