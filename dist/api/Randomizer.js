class Randomizer {
	constructor(seed, count) {
		this.Seed = seed || 0;
		this.Count = count || 0;
		this.SEED_CONST = 2147483647;
		this.TIME_CONST = 1034.256;
		this.NUMBER_SEED_CONST = 16807;
		this.OVERFLOW_CONST = 0;
		this.randomSeedCount = 20;
	}
	setRandomSeed() {
		var o = this;
		var i,
			generateCycles = Math.random() * o.randomSeedCount;
		o.Seed = o.GetTime();
		for (i = 0; i < generateCycles; i++) o.Seed = o.GenerateSeed();
		return o;
	}
	GetTime() {
		var o = this;
		return Math.round(new Date().getTime() / o.TIME_CONST);
	}
	GenerateSeed() {
		var o = this;
		return o.GetTime() % o.SEED_CONST ^ o.GetInt();
	}
	GetInt() {
		var o = this;
		o.Count++;
		o.Seed = (o.Seed * o.NUMBER_SEED_CONST + o.OVERFLOW_CONST) % o.SEED_CONST;
		return o.Seed;
	}
	GetNumber() {
		var o = this;
		o.Count++;
		o.Seed = (o.Seed * o.NUMBER_SEED_CONST + o.OVERFLOW_CONST) % o.SEED_CONST;
		return o.Seed / o.SEED_CONST;
	}
	GetRange(min, max) {
		var o = this;
		o.Count++;
		o.Seed = (o.Seed * o.NUMBER_SEED_CONST + o.OVERFLOW_CONST) % o.SEED_CONST;
		return min + ((max - min) * o.Seed) / o.SEED_CONST;
	}
	GetRangeMethod(min, max, method) {
		var o = this;
		o.Count++;
		if (!method) method = Math.floor;
		o.Seed = (o.Seed * o.NUMBER_SEED_CONST + o.OVERFLOW_CONST) % o.SEED_CONST;
		return method(min + ((max - min) * o.Seed) / o.SEED_CONST);
	}
	GetRangeInt10(min, max) {
		var o = this;
		o.Count++;
		o.Seed = (o.Seed * o.NUMBER_SEED_CONST + o.OVERFLOW_CONST) % o.SEED_CONST;
		return Math.round(min + ((max - min) * o.Seed * 10) / (o.SEED_CONST * 10));
	}
	Clone() {
		var o = this;
		var c = new o.constructor(o.Seed, o.Count);
		return c;
	}
}

module.exports.Randomizer = Randomizer;
