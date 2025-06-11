"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Refutation = exports.ArguableMaterial = exports.Premise = void 0;
class Premise extends Promise {
	constructor(executor) {
		super(executor);
	}
}
exports.Premise = Premise;
class ArguableMaterial {
	predicate;
	subject;
	proposition;
	constructor(predicate, subject, proposition) {
		this.predicate = predicate;
		this.subject = subject;
		this.proposition = proposition;
	}
	valueOf() {}
}
exports.ArguableMaterial = ArguableMaterial;
class Refutation {
	conclusion;
	failedPromises;
	constructor(conclusion, failed) {
		this.conclusion = conclusion;
		this.failedPromises = failed;
	}
	assert() {
		return false;
	}
}
exports.Refutation = Refutation;
