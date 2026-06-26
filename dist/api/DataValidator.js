class DataValidator {
	log = false;
	error;
	reset() {
		this.error = null;
		return this;
	}
	validate(data, validation, keychain) {
		let k;
		let v;
		let value;
		let t;
		let min;
		let max;
		let re;
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
			} else if (value === undefined) return true;
			if (t === "string") {
				if (value === null || value.constructor === String) {
					min = v.min;
					max = v.max;
					re = v.regexp;
					if (value === null && (min !== undefined || max !== undefined || re)) {
						this.error = { error: { type: "string.null", key: k, value, keychain }, validation: v };
						return false;
					}
					if (min !== undefined && value && value.length < min) {
						this.error = { error: { type: "string.min", key: k, value, keychain }, validation: v };
						return false;
					}
					if (max !== undefined && value && value.length > max) {
						this.error = { error: { type: "string.max", key: k, value, keychain }, validation: v };
						return false;
					}
					if (re && value && !re.test(value)) {
						this.error = { error: { type: "string.test", key: k, value, keychain }, validation: v };
						return false;
					}
				} else {
					this.error = { error: { type: "string.type", key: k, value, keychain }, validation: v };
					return false;
				}
			} else if (t === "number") {
				if (value === null || value.constructor === Number) {
					min = v.min;
					max = v.max;
					if (value === null && (min !== undefined || max !== undefined)) {
						this.error = { error: { type: "number.null", key: k, value, keychain }, validation: v };
						return false;
					}
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
				if (!v.tester(k, value, keychain)) {
					this.error = { error: { type: "func.test", key: k, value, keychain }, validation: v };
					return false;
				}
			} else if (t === "array") {
				if (value.constructor === Array) {
					min = v.min;
					max = v.max;
					if (min !== undefined && value.length < min) {
						this.error = { error: { type: "array.min", key: k, value, keychain }, validation: v };
						return false;
					}
					if (max !== undefined && value.length > max) {
						this.error = { error: { type: "array.max", key: k, value, keychain }, validation: v };
						return false;
					}
					let elementV = v.element;
					if (elementV)
						value.forEach((e, i) => {
							if (!v.validation[i]) v.validation[i] = elementV;
						});
					if (!this.validate(value, v.validation, (keychain || []).concat(k))) {
						if (!this.error)
							this.error = { error: { type: "array.validation", key: k, value, keychain }, validation: v };
						return false;
					}
				} else {
					this.error = { error: { type: "array.type", key: k, value, keychain }, validation: v };
					return false;
				}
			} else if (!this.validate(value, v.validation, (keychain || []).concat(k))) {
				if (!this.error) this.error = { error: { type: "object.validation", key: k, value, keychain }, validation: v };
				return false;
			}
		}
		return true;
	}
}
module.exports.DataValidator = DataValidator;
