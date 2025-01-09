(global as zetaret.node.BasicServerGlobal).ProtoSSCheStatsFile = __dirname + '/stock_stats.json';
const mod: zetaret.node.ProtoSSCheModule = require('zetaret.node::index');
const instance: zetaret.node.modules.Voyage = mod.serverche as any;
const stockmod: any = require('./StockModule');

const route: any = {
	'favicon.ico': {},
	'api': {
		'newStock': {},
		'stockHistory': {},
		'buyStock': {}
	}
};

function addAPI(route: any) {
	var k: string,
		map: any = instance.routeMap;
	for (k in route) map[k] = route[k];
}

addAPI(route);

const stockset: StockSet = new stockmod.StockSet();

function pushJSON(d: any, response: zetaret.node.RoutedResponse): void {
	(response.__headers as any)['content-type'] = 'application/json';
	response.__data.push(JSON.stringify(d));
}

function DEFAULT(server: zetaret.node.modules.Voyage, robj: zetaret.node.RouteObject, routeData: any, request: zetaret.node.Input, response: zetaret.node.RoutedResponse): void {
	(response.__headers as any)['content-type'] = 'text/html';
	response.__data.push(htcache.getStruct(PAGES.HOME.id));
}

function newStock(server: zetaret.node.modules.Voyage, robj: zetaret.node.RouteObject, routeData: any, request: zetaret.node.Input, response: zetaret.node.RoutedResponse): void {
	stockset.generateRandomHistory();
	pushJSON({ random: true }, response);
}

function stockHistory(server: zetaret.node.modules.Voyage, robj: zetaret.node.RouteObject, routeData: any, request: zetaret.node.Input, response: zetaret.node.RoutedResponse): void {
	pushJSON(stockset.stockHistory, response);
}

function buyStock(server: zetaret.node.modules.Voyage, robj: zetaret.node.RouteObject, routeData: any, request: zetaret.node.Input, response: zetaret.node.RoutedResponse): void {
	const vars: any = robj.vars;
	console.log(vars);
	const result: Stock[] = stockset.search(parseInt(vars.buyPoint), parseInt(vars.sellPoint), parseInt(vars.totalValue));
	pushJSON(result, response);
}

var p: string,
	paths: any = {
		'api/newStock': newStock,
		'api/stockHistory': stockHistory,
		'api/buyStock': buyStock
	};

for (p in paths) instance.addPathListener(p, paths[p]);
instance.addPathListener('', DEFAULT);

const htmlparser: zetaret.node.utils.html.HTMLParserModule = require('zetaret.node.utils.html::HTMLParser'),
	htmlcache: zetaret.node.utils.html.HTMLCacheModule = require('zetaret.node.utils.html::HTMLCache'),
	htcache: zetaret.node.utils.html.HTMLCache = new htmlcache.HTMLCache();

const PAGES: any = {
	HOME: {
		id: 'home',
		hfile: './html/apitest.html'
	}
};
const DEFAULT_PAGE: any = {
	dir: __dirname,
	useAutomaton: true,
	debug: true,
	closeTags: ['script', 'style'],
	exe: {
		swapjs: true,
		swapcss: true,
		despacejs: true,
		despacecss: true,
		render: htcache.defaultRenderTemplate
	}
};
for (p in PAGES) {
	PAGES[p] = {
		...PAGES[p], ...DEFAULT_PAGE
	};
}

const watchers: any = htcache.getWatchers(null, 500, true, true);

htcache.setPages(PAGES, htmlparser.HTMLParser as any, watchers, true);

module.exports.indexModule = mod;
module.exports.instance = instance;