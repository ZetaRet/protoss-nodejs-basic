global.ProtoSSCheStatsFile = __dirname + '/stock_stats.json';
const mod = require('zetaret.node::index');
const instance = mod.serverche();
const stockmod = require('./StockModule');
const route = {
    'favicon.ico': {},
    'api': {
        'newStock': {},
        'stockHistory': {},
        'buyStock': {}
    }
};
function addAPI(route) {
    var k, map = instance.routeMap;
    for (k in route)
        map[k] = route[k];
}
addAPI(route);
const stockset = new stockmod.StockSet();
function pushJSON(d, response) {
    response.__headers['content-type'] = 'application/json';
    response.__data.push(JSON.stringify(d));
}
function DEFAULT(server, robj, routeData, request, response) {
    response.__headers['content-type'] = 'text/html';
    response.__data.push(htcache.getStruct(PAGES.HOME.id));
}
function newStock(server, robj, routeData, request, response) {
    stockset.generateRandomHistory();
    pushJSON({ random: true }, response);
}
function stockHistory(server, robj, routeData, request, response) {
    pushJSON(stockset.stockHistory, response);
}
function buyStock(server, robj, routeData, request, response) {
    const vars = robj.vars;
    console.log(vars);
    const result = stockset.search(parseInt(vars.buyPoint), parseInt(vars.sellPoint), parseInt(vars.totalValue));
    pushJSON(result, response);
}
var p, paths = {
    'api/newStock': newStock,
    'api/stockHistory': stockHistory,
    'api/buyStock': buyStock
};
for (p in paths)
    instance.addPathListener(p, paths[p]);
instance.addPathListener('', DEFAULT);
const htmlparser = require('zetaret.node.utils.html::HTMLParser'), htmlcache = require('zetaret.node.utils.html::HTMLCache'), htcache = new htmlcache.HTMLCache();
const PAGES = {
    HOME: {
        id: 'home',
        hfile: './html/apitest.html'
    }
};
const DEFAULT_PAGE = {
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
const watchers = htcache.getWatchers(null, 500, true, true);
htcache.setPages(PAGES, htmlparser.HTMLParser, watchers, true);
module.exports.indexModule = mod;
module.exports.instance = instance;
