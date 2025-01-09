class StockSet {
	stockHistory: Stock[];

	search(buyPoint: number, sellPoint: number, totalValue: number): Stock[] {
		if (totalValue === 0 || isNaN(totalValue) || isNaN(buyPoint) || isNaN(sellPoint)) return [];
		var result: Stock[] = this.stockHistory.filter((v: Stock) => (v.timestamp >= buyPoint && v.timestamp <= sellPoint));
		result = result.sort((a: Stock, b: Stock) => {
			if (a.stockValue > b.stockValue) return 1;
			else if (a.stockValue < b.stockValue) return -1;
			return 0;
		});
		result = result.filter((v: Stock) => {
			totalValue -= v.totalStackValue;
			return totalValue >= 0;
		});
		return result;
	}

	generateRandomHistory(stocks: number = 100): void {
		const oneday: number = 24 * 60 * 60 * 1000;
		const now: Date = new Date(),
			yesterday: Date = new Date(now.getTime() - oneday);

		const yt: number = yesterday.getTime(),
			stockInterval: number = oneday / stocks;

		this.stockHistory = new Array<Stock>();
		while (stocks--) {
			this.stockHistory.push(new Stock(Math.random() * 10, Math.round(Math.random() * 5), yt + stockInterval * stocks));
		}
	}
}

class Stock {
	stockValue: number;
	stockStack: number;
	timestamp: number;

	constructor(value: number = 0, stack: number = 1, time: number = 0) {
		this.stockValue = value;
		this.stockStack = stack;
		this.timestamp = time;
	}

	get totalStackValue(): number { return this.stockValue * this.stockStack; }
	get totalStackStack(): number { return this.stockStack * this.stockStack; }
}


module.exports.StockSet = StockSet;
module.exports.Stock = Stock;