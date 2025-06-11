class DataValidator {
	log = false;
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
			if (v.required && value === undefined) return false;
			else if (value === undefined) return true;
			if (t === "string") {
				if (value === null || value.constructor === String) {
					min = v.min;
					max = v.max;
					re = v.regexp;
					if (min !== undefined && value.length < min) return false;
					if (max !== undefined && value.length > max) return false;
					if (re && !re.test(value)) return false;
				} else return false;
			} else if (t === "number") {
				if (value === null || value.constructor === Number) {
					min = v.min;
					max = v.max;
					if (min !== undefined && value < min) return false;
					if (max !== undefined && value > max) return false;
				} else return false;
			} else if (t === "bool") {
				if (value === null || value.constructor !== Boolean) return false;
			} else if (t === "func") {
				if (!v.tester(k, value, keychain)) return false;
			} else if (t === "array") {
				if (value.constructor === Array) {
					min = v.min;
					max = v.max;
					if (min !== undefined && value.length < min) return false;
					if (max !== undefined && value.length > max) return false;
					let elementV = v.element;
					if (elementV)
						value.forEach((e, i) => {
							if (!v.validation[i]) v.validation[i] = elementV;
						});
					if (!this.validate(value, v.validation, (keychain || []).concat(k))) return false;
				} else return false;
			} else if (!this.validate(value, v.validation, (keychain || []).concat(k))) return false;
		}
		return true;
	}
}
module.exports.DataValidator = DataValidator;
