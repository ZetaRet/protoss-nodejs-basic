/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * XeltoSS Node Print of Basic ProtoSS Server
 **/

var http = require('http'),
	fs = require('fs');

var env = {},
	dumpall = false,
	dumpkeys = ['__reqid', 'complete', 'headers', 'url', 'method'],
	omit = {
		headers: {
			"connection": 1,
			"user-agent": 1,
			"cache-control": 1,
			"accept-encoding": 1,
			"accept": 1,
			"accept-language": 1,
			"cookie": 1,
			"host": 1,
			"x-forwarded-proto": 1
		}
	},
	maxBodyLength = 10000,
	htport = 8888,
	reqnum = 0,
	contenttype = 'text/plain',
	cookieid = 'zetaretpid',
	sid, sidinterval = 5000,
	sfile = 'stats.json',
	useXServer = false,
	xserverModule = './modules/XProtoSSChe.js',
	stats = {
		reqnum: null
	};

function setEnv(envobj) {
	for (var k in envobj) env[k] = envobj[k];
	updateEnv();
}

function updateEnv() {
	if (env.dumpall !== undefined) dumpall = env.dumpall;
	if (env.dumpkeys !== undefined) dumpkeys = env.dumpkeys;
	if (env.omit !== undefined) omit = env.omit;
	if (env.maxBodyLength !== undefined) maxBodyLength = env.maxBodyLength;
	if (env.contenttype !== undefined) contenttype = env.contenttype;
	if (env.sidinterval !== undefined) {
		sidinterval = env.sidinterval;
		resetFSInterval();
	}
}

function resetFSInterval() {
	clearInterval(sid);
	sid = setInterval(function() {
		if (stats.reqnum !== reqnum) {
			try {
				stats.reqnum = reqnum;
				fs.writeFile(sfile, JSON.stringify(stats), function(err) {});
			} catch (e) {}
		}
	}, sidinterval);
}

function stopFSInterval() {
	clearInterval(sid);
}

function initFS() {
	env.statsin = stats;
	try {
		if (fs.existsSync(sfile)) {
			var sj = fs.readFileSync(sfile);
			try {
				sj = JSON.parse(sj) || {};
				if (sj) {
					env.statsout = sj;
					if (sj.reqnum !== undefined && sj.reqnum.constructor === Number) {
						reqnum = sj.reqnum;
						stats.reqnum = reqnum;
					}
					if (sj.xserver !== undefined && sj.xserver.constructor === Boolean) {
						useXServer = sj.xserver;
						stats.xserver = useXServer;
					}
					if (sj.xserverModule !== undefined && sj.xserverModule.constructor === String) {
						xserverModule = sj.xserverModule;
						stats.xserverModule = xserverModule;
					}
					if (sj.cookieid !== undefined && sj.cookieid.constructor === String) {
						cookieid = sj.cookieid;
						stats.cookieid = cookieid;
					}
					if (sj.htport !== undefined && sj.htport.constructor === Number) {
						htport = sj.htport;
						stats.htport = htport;
					}
				}
			} catch (e) {}
		}
	} catch (e) {}
	resetFSInterval();
}

initFS();

class ProtoSSChe {
	onRequest(request, response) {
		var o = this;
		request.__reqid = o.getReqId();
		response.__data = [];
		o.pushProtoSSResponse(request, response).readRequestBody(request, response);
	}

	onReadRequestBody(request, body, response) {
		var o = this;
		var k, a, v, vv, vk;
		if (dumpall) {
			for (k in request) {
				try {
					v = request[k];
					if (v.constructor !== Function) {
						response.__data.push(k + ': ' + JSON.stringify(v));
						response.__data.push('\n');
					}
				} catch (e) {}
			}
		} else {
			for (a = 0; a < dumpkeys.length; a++) {
				k = dumpkeys[a];
				try {
					v = request[k];
					if (v.constructor !== Function) {
						if (omit[k]) {
							vv = {};
							for (vk in v) {
								if (omit[k][vk]) vv[vk] = v[vk];
							}
							v = vv;
						}
						response.__data.push(k + ': ' + JSON.stringify(v));
						response.__data.push('\n');
					}
				} catch (e) {}
			}
		}
		if (request.url) {
			response.__data.push('Route Object: ' + JSON.stringify(o.splitUrl(request.url)));
			response.__data.push('\n');
		}
		response.__data.push('Request Body: \n');
		response.__data.push(body);
		response.__data.push('\n');
		o.endResponse(request, response);
		return o;
	}

	splitUrl(url) {
		var i, vk, surl = {},
			durl = decodeURI(url),
			uro = durl.split('?'),
			p = uro[0],
			v = uro[1],
			vs = v ? v.split('&') : [];

		surl.url = durl;
		surl.query = v;
		surl.path = p;
		surl.pages = p.split('/');
		if (surl.pages[surl.pages.length - 1] === "") surl.pages.pop();
		if (surl.pages[0] === "") surl.pages.shift();
		surl.root = surl.pages[0];
		surl.page = surl.pages[1];
		surl.sub = surl.pages[2];
		surl.param = surl.pages[3];
		surl.vars = {};
		for (i = 0; i < vs.length; i++) {
			vk = vs[i].split('=');
			surl.vars[vk[0]] = vk[1];
		}

		return surl;
	}

	rndstr(l) {
		var ch = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		var str = '',
			i = l;
		while (i--) str += ch.charAt(Math.round(Math.random() * (ch.length - 1)));
		return str;
	}

	getReqId() {
		var o = this;
		reqnum = (reqnum + 1) % Number.MAX_SAFE_INTEGER;
		return o.rndstr(31) + '-' + reqnum.toString(36);
	}

	pushProtoSSResponse(request, response) {
		var o = this;
		response.__data.push('ProtoSS: https://github.com/ZetaRet/protoss \n');
		response.__data.push('ProtoSS Node.js Server: https://github.com/ZetaRet/protoss-nodejs-basic \n');
		response.__data.push('ProtoSS IDE for Atom: https://atom.io/packages/ide-protoss \n');
		response.__data.push('ProtoSS Project: https://zetaret.com/projects/protoss/ \n');
		response.__data.push('ProtoSS Website: https://protoss.zetaret.com/ \n');
		response.__data.push('Request Method: ' + request.method + ' \n');
		return o;
	}

	readRequestBody(request, response) {
		var o = this;
		var ended = false,
			body = '';
		request.on('data', function(data) {
			if (ended) return;
			body += data;
			if (body.length > maxBodyLength) {
				ended = true;
				request.abort();
				o.onReadRequestBody(request, body, response);
			}
		});
		request.on('end', function() {
			if (!ended) {
				ended = true;
				o.onReadRequestBody(request, body, response);
			}
		});
		return o;
	}

	endResponse(request, response) {
		var o = this;
		var input = response.__data.join("");
		var headers = {
			'content-type': contenttype
		};
		if (!request.headers.cookie) headers['set-cookie'] = cookieid + "=" + o.rndstr(32);
		response.writeHead(200, headers);
		response.end(input);
		return o;
	}
}
var serverche;
if (useXServer) {
	var xpro = require(xserverModule),
		xprocls = xpro.getExtendedServerProtoSS(ProtoSSChe);
	serverche = new xprocls();
} else {
	serverche = new ProtoSSChe();
}
serverche.env = env;
serverche.htserv = http.createServer(function(req, res) {
	try {
		serverche.onRequest(req, res);
	} catch (e) {}
});
if (htport >= 0) serverche.htserv.listen(htport);

module.exports.serverclass = ProtoSSChe;
module.exports.serverche = serverche;
module.exports.setEnv = setEnv;
module.exports.resetFSInterval = resetFSInterval;
module.exports.stopFSInterval = stopFSInterval;
