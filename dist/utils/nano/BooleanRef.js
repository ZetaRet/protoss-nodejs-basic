"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanRef = void 0;
class BooleanRef extends Boolean {
	constructor(b) {
		super(b);
	}
	valueOfObj() {
		return this;
	}
}
exports.BooleanRef = BooleanRef;
