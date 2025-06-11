"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberRef = void 0;
class NumberRef extends Number {
	constructor(n) {
		super(n);
	}
	valueOfObj() {
		return this;
	}
}
exports.NumberRef = NumberRef;
