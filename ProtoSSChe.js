/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * XeltoSS Node Print of Basic ProtoSS Server
 **/

var http = require("http"),
	https = require("https"),
	http2 = require("http2"),
	fs = require("fs"),
	Buffer = require("buffer").Buffer;

var env = {},
	dumpall = false,
	dumpkeys = ["__reqid", "complete", "headers", "url", "method"],
	omit = {
		headers: {
			connection: 1,
			"user-agent": 1,
			"cache-control": 1,
			"accept-encoding": 1,
			accept: 1,
			"accept-language": 1,
			cookie: 1,
			host: 1,
			"x-forwarded-proto": 1,
		},
	},
	maxBodyLength = 10000,
	htport = 8888,
	reqnum = 0,
	contenttype = "text/plain",
	cookieid = "zetaretpid",
	sid,
	sidinterval = 5000,
	sfile = global.ProtoSSCheStatsFile || "stats.json",
	useXServer = false,
	xserverModule = "./modules/XProtoSSChe.js",
	stats = {
		reqnum: null,
	};
var instance;

const ServerEnum = {
	XProtoSSChe: "./modules/XProtoSSChe.js",
	Subserver: "./modules/Subserver.js",
	Voyage: "./modules/Voyage.js",
	LobbyServer: "./modules/LobbyServer.js",
	CardServer: "./modules/CardServer.js",
};

http.ServerResponse.prototype.__json = http2.Http2ServerResponse.prototype.__json = function (data, code) {
	this.__headers["content-type"] = "application/json";
	this.__data.push(JSON.stringify(data));
	if (code !== undefined) this.__rcode = code;
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
		if (!global.EnableGlobalStatsFile) resetFSInterval();
	}
}

function resetFSInterval() {
	clearInterval(sid);
	sid = setInterval(function () {
		if (stats.reqnum !== reqnum) {
			try {
				stats.reqnum = reqnum;
				fs.writeFile(sfile, JSON.stringify(stats), function (err) {});
			} catch (e) {}
		}
	}, sidinterval);
}

function stopFSInterval() {
	clearInterval(sid);
}

function applyExternalFile(sj) {
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
			if (xserverModule.charAt(0) === "#") xserverModule = ServerEnum[xserverModule.substring(1)];
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
}

function initFS() {
	env.statsin = stats;
	try {
		if (fs.existsSync(sfile)) {
			var sj = fs.readFileSync(sfile);
			try {
				sj = JSON.parse(sj) || {};
				applyExternalFile(sj);
			} catch (e) {}
		}
	} catch (e) {}
	resetFSInterval();
}

function initGlobalFile() {
	env.statsin = stats;
	applyExternalFile(global.GlobalStatsFile);
}

function StartUp() {
	if (!global.EnableGlobalStatsFile) initFS();
	else initGlobalFile();

	instance = getModuleInstance(useXServer ? (global.ProtoSSCheXServerPath || "") + xserverModule : null);
}

function ShutDown() {
	stopFSInterval();

	instance.serverche.htserv.close();
}

class ProtoSSChe {
	constructor() {
		this.env = null;
		this.htserv = null;
		this.acceptAppRequests = false;
		this.apps = {};
		this.cookieMethod = null;
		this.requestMethod = null;
		this.onErrorBody = null;
		this.onEndBody = null;
		this.dataJoin = null;
		this.reqIdLength = 31;
		this.keepBufferPerContentType = {};
		this.requestBodyMethods = null;
		this.readRequestOnError = true;
		this.requestMiddleware = [];
		this.responseMiddleware = [];
	}

	getAppRequest(request) {
		var o = this;
		var app = o.apps[request.headers.protossappid];
		return app ? app(o, request) : request;
	}

	onRequest(request, response) {
		var o = this;
		request.__reqid = o.getReqId();
		response.__data = [];
		if (o.requestMethod) o.requestMethod(o, request, response);
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
						response.__data.push(k + ": " + JSON.stringify(v));
						response.__data.push("\n");
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
						response.__data.push(k + ": " + JSON.stringify(v));
						response.__data.push("\n");
					}
				} catch (e) {}
			}
		}
		if (request.url) {
			response.__data.push("Route Object: " + JSON.stringify(o.splitUrl(request.url)));
			response.__data.push("\n");
		}
		response.__data.push("Request Body: \n");
		response.__data.push(body);
		response.__data.push("\n");
		o.endResponse(request, response);
		return o;
	}

	splitUrl(url) {
		var i,
			vk,
			surl = {},
			durl = decodeURI(url),
			uro = durl.split("?"),
			p = uro[0],
			v = uro[1],
			vs = v ? v.split("&") : [];

		surl.url = durl;
		surl.query = v;
		surl.path = p;
		surl.pages = p.split("/");
		if (surl.pages[surl.pages.length - 1] === "") surl.pages.pop();
		if (surl.pages[0] === "") surl.pages.shift();
		surl.root = surl.pages[0];
		surl.page = surl.pages[1];
		surl.sub = surl.pages[2];
		surl.param = surl.pages[3];
		surl.vars = {};
		for (i = 0; i < vs.length; i++) {
			vk = vs[i].split("=");
			surl.vars[vk[0]] = vk[1];
		}

		return surl;
	}

	rndstr(l) {
		var ch = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
			str = "",
			chl = ch.length - 1;
		while (l--) str += ch.charAt(Math.round(Math.random() * chl));
		return str;
	}

	getReqId() {
		var o = this;
		reqnum = (reqnum + 1) % Number.MAX_SAFE_INTEGER;
		return o.rndstr(o.reqIdLength) + "-" + reqnum.toString(36);
	}

	pushProtoSSResponse(request, response) {
		var o = this;
		response.__data.push("ProtoSS Node.js Server: https://github.com/ZetaRet/protoss-nodejs-basic \n");
		response.__data.push("Request Method: " + request.method + " \n");
		return o;
	}

	readRequestBody(request, response) {
		var o = this;
		var ended = false,
			bodyBuffer = [],
			bodyLength = 0,
			body = "";
		var ctype = request.headers["content-type"];
		if (ctype) ctype = ctype.split(";")[0];
		var myenv = o.env || env;
		var keepbuffer = (myenv.keepBodyBuffer && o.keepBufferPerContentType[ctype]) || myenv.swapBodyBuffer ? true : false;

		if (!request.aborted) {
			if (!o.requestBodyMethods || o.requestBodyMethods.indexOf(request.method) !== -1) {
				request.on("data", function (data) {
					if (ended) return;
					if (keepbuffer) bodyBuffer.push(data);
					bodyLength += data.length;
					body += data;
					if (bodyLength > maxBodyLength) {
						ended = true;
						request.abort();
						if (o.onErrorBody) o.onErrorBody(o, request, response, body, new Error("size"));
						if (o.readRequestOnError) o.onReadRequestBody(request, body, response);
					}
				});
			}
			request.on("error", function (error) {
				if (o.onErrorBody) o.onErrorBody(o, request, response, body, error);
				if (o.readRequestOnError) o.onReadRequestBody(request, body, response);
			});
			request.on("end", async function () {
				if (!ended) {
					if (keepbuffer) request.__bodyBuffer = Buffer.concat(bodyBuffer);
					if (myenv.swapBodyBuffer) body = request.__bodyBuffer;
					ended = true;
					if (request.url) response.__splitUrl = o.splitUrl(request.url);

					if (o.requestMiddleware.length > 0) {
						var m, r;
						const input = { data: body, ctype };
						for (m = 0; m < o.requestMiddleware.length; m++) {
							r = o.requestMiddleware[m](request, response, input);
							if (r && r.constructor === Promise) r = await r;
							if (r === true) break;
						}
						body = input.data;
					}

					if (o.onEndBody) o.onEndBody(o, request, response, body);
					o.onReadRequestBody(request, body, response);
				}
			});
		} else {
			if (o.onErrorBody) o.onErrorBody(o, request, response, body, new Error("abort"));
			if (o.readRequestOnError) o.onReadRequestBody(request, body, response);
		}
		return o;
	}

	updateCookies(request, response, headers) {
		var o = this;
		if (o.cookieMethod) o.cookieMethod(o, request, response, headers);
		else if (!request.headers.cookie) headers["set-cookie"] = cookieid + "=" + o.rndstr(32);
		return o;
	}

	endResponse(request, response) {
		var o = this;
		var input = response.__data.join(o.dataJoin || ""),
			headers = {
				"content-type": contenttype,
			};
		o.updateCookies(request, response, headers);
		response.writeHead(200, headers);
		response.end(input);
		return o;
	}
}

function getNodeServer(requestListener, envd, port) {
	var sk, httpsop, htserv;
	if (!envd) envd = env;
	if (!port) port = htport;

	if (envd.statsout && envd.statsout.https === true) {
		envd.statsin.https = true;
		httpsop = {};
		if (!envd.statsout.httpsop) {
			httpsop.keyPath = "key.pem";
			httpsop.certPath = "cert.pem";
		} else {
			envd.statsin.httpsop = envd.statsout.httpsop;
			for (sk in envd.statsout.httpsop) httpsop[sk] = envd.statsout.httpsop[sk];
		}
		if (httpsop.keyPath) httpsop.key = fs.readFileSync(httpsop.keyPath);
		if (httpsop.certPath) httpsop.cert = fs.readFileSync(httpsop.certPath);
		if (httpsop.pfxPath) httpsop.pfx = fs.readFileSync(httpsop.pfxPath);
		if (httpsop.caPath) httpsop.ca = [fs.readFileSync(httpsop.caPath)];
		if (httpsop.h2) htserv = http2.createSecureServer(httpsop, requestListener);
		else htserv = https.createServer(httpsop, requestListener);
	} else {
		if (envd.statsout && envd.statsout.h2) htserv = http2.createServer(envd.statsout.h2op, requestListener);
		else htserv = http.createServer(requestListener);
	}
	if (!htserv.request) htserv.request = http.request;
	if (!htserv.srequest) htserv.srequest = https.request;
	if (port >= 0) htserv.listen(port);

	return {
		httpsop,
		htserv,
	};
}

function getModuleInstance(xmodule) {
	var serverche, xpro, xprocls;
	if (xmodule) {
		xpro = require(xmodule);
		xprocls = xpro.getExtendedServerProtoSS(ProtoSSChe);
		serverche = new xprocls();
	} else {
		serverche = new ProtoSSChe();
	}
	serverche.env = env;

	function requestListener(req, res) {
		try {
			if (serverche.acceptAppRequests) req = serverche.getAppRequest(req);
			serverche.onRequest(req, res);
		} catch (e) {}
	}

	var { htserv } = getNodeServer(requestListener);
	serverche.htserv = htserv;

	return {
		serverche,
		xpro,
		xprocls,
		xmodule,
	};
}

module.exports.serverclass = ProtoSSChe;
module.exports.ServerEnum = ServerEnum;
module.exports.loadedModule = () => instance.xpro;
module.exports.loadedModuleClass = () => instance.xprocls;
module.exports.serverche = () => instance.serverche;
module.exports.instance = () => instance;
module.exports.StartUp = StartUp;
module.exports.ShutDown = ShutDown;
module.exports.setEnv = setEnv;
module.exports.resetFSInterval = resetFSInterval;
module.exports.stopFSInterval = stopFSInterval;
module.exports.getNodeServer = getNodeServer;
module.exports.getModuleInstance = getModuleInstance;
