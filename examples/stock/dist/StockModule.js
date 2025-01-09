class StockSet {
    search(buyPoint, sellPoint, totalValue) {
        if (totalValue === 0 || isNaN(totalValue) || isNaN(buyPoint) || isNaN(sellPoint))
            return [];
        var result = this.stockHistory.filter((v) => (v.timestamp >= buyPoint && v.timestamp <= sellPoint));
        result = result.sort((a, b) => {
            if (a.stockValue > b.stockValue)
                return 1;
            else if (a.stockValue < b.stockValue)
                return -1;
            return 0;
        });
        result = result.filter((v) => {
            totalValue -= v.totalStackValue;
            return totalValue >= 0;
        });
        return result;
    }
    generateRandomHistory(stocks = 100) {
        const oneday = 24 * 60 * 60 * 1000;
        const now = new Date(), yesterday = new Date(now.getTime() - oneday);
        const yt = yesterday.getTime(), stockInterval = oneday / stocks;
        this.stockHistory = new Array();
        while (stocks--) {
            this.stockHistory.push(new Stock(Math.random() * 10, Math.round(Math.random() * 5), yt + stockInterval * stocks));
        }
    }
}
class Stock {
    constructor(value = 0, stack = 1, time = 0) {
        this.stockValue = value;
        this.stockStack = stack;
        this.timestamp = time;
    }
    get totalStackValue() { return this.stockValue * this.stockStack; }
    get totalStackStack() { return this.stockStack * this.stockStack; }
}
module.exports.StockSet = StockSet;
module.exports.Stock = Stock;
