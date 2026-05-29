declare module "zetaret.node.api::DataValidator";
declare module "protoss-nodejs-basic/dist/api/DataValidator.js";

class DataValidator implements zetaret.node.api.DataValidator {
	public log: boolean = false;
	public error: zetaret.node.api.ValidationError;

	reset() {
		this.error = null;
		return this;
	}

	validate(data: { [key: string | number]: any }, validation: { [key: string | number]: zetaret.node.api.ValidatorObject }, keychain?: Array<string | number>): boolean {
		let k: string | number;
		let v: zetaret.node.api.ValidatorObject;
		let value: any;
		let t: string;
		let min: number;
		let max: number;
		let re: RegExp;

		for (k in validation) {
			v = validation[k];
			t = v.type;
			value = data[k];
			if (value === undefined && v.defaults !== undefined) {
				value = v.defaults;
				data[k] = value;
			}
			if (this.log) console.log(k, v, t, value);
			if (v.required && value === undefined) {
				this.error = { error: { type: "required", key: k, value, keychain }, validation: v };
				return false;
			}
			else if (value === undefined) return true;
			if (t === "string") {
				if (value === null || value.constructor === String) {
					min = (v as zetaret.node.api.StringValidatorObject).min;
					max = (v as zetaret.node.api.StringValidatorObject).max;
					re = (v as zetaret.node.api.StringValidatorObject).regexp;
					if (min !== undefined && value.length < min) {
						this.error = { error: { type: "string.min", key: k, value, keychain }, validation: v };
						return false;
					}
					if (max !== undefined && value.length > max) {
						this.error = { error: { type: "string.max", key: k, value, keychain }, validation: v };
						return false;
					}
					if (re && !re.test(value as string)) {
						this.error = { error: { type: "string.test", key: k, value, keychain }, validation: v };
						return false;
					}
				} else {
					this.error = { error: { type: "string.type", key: k, value, keychain }, validation: v };
					return false;
				}
			} else if (t === "number") {
				if (value === null || value.constructor === Number) {
					min = (v as zetaret.node.api.NumberValidatorObject).min;
					max = (v as zetaret.node.api.NumberValidatorObject).max;
					if (min !== undefined && value < min) {
						this.error = { error: { type: "number.min", key: k, value, keychain }, validation: v };
						return false;
					}
					if (max !== undefined && value > max) {
						this.error = { error: { type: "number.max", key: k, value, keychain }, validation: v };
						return false;
					}
				} else {
					this.error = { error: { type: "number.type", key: k, value, keychain }, validation: v };
					return false;
				}
			} else if (t === "bool") {
				if (value === null || value.constructor !== Boolean) {
					this.error = { error: { type: "bool.type", key: k, value, keychain }, validation: v };
					return false;
				}
			} else if (t === "func") {
				if (!(v as zetaret.node.api.FunctionValidatorObject).tester(k, value, keychain)) {
					this.error = { error: { type: "func.test", key: k, value, keychain }, validation: v };
					return false;
				}
			} else if (t === "array") {
				if (value.constructor === Array) {
					min = (v as zetaret.node.api.ArrayValidatorObject).min;
					max = (v as zetaret.node.api.ArrayValidatorObject).max;
					if (min !== undefined && value.length < min) {
						this.error = { error: { type: "array.min", key: k, value, keychain }, validation: v };
						return false;
					}
					if (max !== undefined && value.length > max) {
						this.error = { error: { type: "array.max", key: k, value, keychain }, validation: v };
						return false;
					}
					let elementV: zetaret.node.api.ValidatorObject = (v as zetaret.node.api.ArrayValidatorObject).element;
					if (elementV) value.forEach((e, i) => {
						if (!(v as zetaret.node.api.ArrayValidatorObject).validation[i]) (v as zetaret.node.api.ArrayValidatorObject).validation[i] = elementV
					});
					if (!this.validate(value, (v as zetaret.node.api.ArrayValidatorObject).validation, (keychain || []).concat(k))) {
						if (!this.error) this.error = { error: { type: "array.validation", key: k, value, keychain }, validation: v };
						return false;
					}
				} else {
					this.error = { error: { type: "array.type", key: k, value, keychain }, validation: v };
					return false;
				}
			} else if (!this.validate(value, (v as zetaret.node.api.KeyValidatorObject).validation, (keychain || []).concat(k))) {
				if (!this.error) this.error = { error: { type: "object.validation", key: k, value, keychain }, validation: v };
				return false;
			}
		}

		return true;
	}
}

module.exports.DataValidator = DataValidator;
