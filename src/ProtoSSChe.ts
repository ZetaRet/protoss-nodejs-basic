/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * XeltoSS Node Print of Basic ProtoSS Server
 **/
declare module "zetaret.node::ProtoSSChe";
declare module "protoss-nodejs-basic/dist/ProtoSSChe.js";

export { }

if (!require) var require: Function = global.require;

var http = require("http"),
	https = require("https"),
	http2 = require("http2"),
	fs = require("fs"),
	Buffer = require("buffer").Buffer;

var env: zetaret.node.ServerEnvironment = {},
	dumpall = false,
	dumpkeys = ["__reqid", "complete", "headers", "url", "method"],
	omit: any = {
		headers: {
			"connection": 1,
			"user-agent": 1,
			"cache-control": 1,
			"accept-encoding": 1,
			"accept": 1,
			"accept-language": 1,
			"cookie": 1,
			"host": 1,
			"x-forwarded-proto": 1,
		},
	},
	maxBodyLength = 10000,
	htport = 8888,
	reqnum = 0,
	contenttype = "text/plain",
	cookieid = "zetaretpid",
	sid: number | any,
	sidinterval = 5000,
	sfile = (global as zetaret.node.BasicServerGlobal).ProtoSSCheStatsFile || "stats.json",
	useXServer = false,
	xserverModule = "./modules/XProtoSSChe.js",
	stats: zetaret.node.ServerStats = {
		reqnum: null,
	};
var instance: zetaret.node.ModuleInstance;

const ERRORS = {
	UNCAUGHT_EXCEPTION: "uncaughtException",
	UNCAUGHT_EXCEPTION_MONITOR: "uncaughtExceptionMonitor",
	UNHANDLED_REJECTION: "unhandledRejection",
	UNHANDLED_PROMISE_REJECTION_WARNING: "UnhandledPromiseRejectionWarning",
	WARNING: "warning",
	ABORT: "abort",
};

const PROCESS_EVENTS = {
	EXIT: "exit",
	BEFORE_EXIT: "beforeExit",
	DISCONNECT: "disconnect",
	MESSAGE: "message",
	WORKER_MESSAGE: "workerMessage",
};

const EVENTS = {
	DATA: "data",
	ERROR: "error",
	END: "end",
};

const ServerEnum: any = {
	XProtoSSChe: "./modules/XProtoSSChe.js",
	Subserver: "./modules/Subserver.js",
	Voyage: "./modules/Voyage.js",
	LobbyServer: "./modules/LobbyServer.js",
	CardServer: "./modules/CardServer.js",
};

http.ServerResponse.prototype.__json = http2.Http2ServerResponse.prototype.__json = function (data: any, code: number) {
	this.__headers["content-type"] = "application/json";
	this.__data.push(JSON.stringify(data));
	if (code !== undefined) this.__rcode = code;
};

function setEnv(envobj: any) {
	for (var k in envobj) (env as any)[k] = envobj[k];
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
		if (!(global as zetaret.node.BasicServerGlobal).EnableGlobalStatsFile) resetFSInterval();
	}
}

const globalExceptionsAndErrors: any = {};
const globalProcessListeners: any[] = [];
function onGlobalError(error: any) {
	process.on(error, function (err) {
		pushGlobalError(error, err);
		globalProcessListeners.forEach((cb) => cb(error, err));
	});
}
function pushGlobalError(error: any, err: any) {
	if (!globalExceptionsAndErrors[error]) globalExceptionsAndErrors[error] = [];
	globalExceptionsAndErrors[error].push(err);
	console.log("\x1b[31m #Global " + error + "\x1b[0m:", err.name, err.stack);
}
function uncaughtExceptionGlobal() {
	if (!(global as zetaret.node.BasicServerGlobal).onGlobalError) {
		(global as zetaret.node.BasicServerGlobal).onGlobalError = onGlobalError;
		(global as zetaret.node.BasicServerGlobal).pushGlobalError = pushGlobalError;
		(global as zetaret.node.BasicServerGlobal).globalExceptionsAndErrors = globalExceptionsAndErrors;
		(global as zetaret.node.BasicServerGlobal).globalProcessListeners = globalProcessListeners;
	} else return;
	onGlobalError(ERRORS.UNCAUGHT_EXCEPTION);
	onGlobalError(ERRORS.UNCAUGHT_EXCEPTION_MONITOR);
	onGlobalError(ERRORS.UNHANDLED_REJECTION);
	onGlobalError(ERRORS.UNHANDLED_PROMISE_REJECTION_WARNING);
	onGlobalError(ERRORS.WARNING);
	onGlobalError(PROCESS_EVENTS.EXIT);
	onGlobalError(PROCESS_EVENTS.BEFORE_EXIT);
	onGlobalError(PROCESS_EVENTS.DISCONNECT);
	onGlobalError(PROCESS_EVENTS.MESSAGE);
	onGlobalError(PROCESS_EVENTS.WORKER_MESSAGE);
}

function resetFSInterval() {
	clearInterval(sid);
	sid = setInterval(function () {
		if (stats.reqnum !== reqnum) {
			try {
				stats.reqnum = reqnum;
				fs.writeFile(sfile, JSON.stringify(stats), function (err: any) { });
			} catch (e) { }
		}
	}, sidinterval);
}

function stopFSInterval() {
	clearInterval(sid);
}

function applyExternalFile(sj: any) {
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
			} catch (e) { }
		}
	} catch (e) { }
	resetFSInterval();
}

function initGlobalFile() {
	env.statsin = stats;
	applyExternalFile((global as zetaret.node.BasicServerGlobal).GlobalStatsFile);
}

function StartUp() {
	if ((global as zetaret.node.BasicServerGlobal).EnableGlobalExceptions) uncaughtExceptionGlobal();

	if (!(global as zetaret.node.BasicServerGlobal).EnableGlobalStatsFile) initFS();
	else initGlobalFile();

	instance = getModuleInstance(useXServer ? ((global as zetaret.node.BasicServerGlobal).ProtoSSCheXServerPath || "") + xserverModule : null);
}

function ShutDown() {
	stopFSInterval();

	instance.serverche.htserv.close();
}

class ProtoSSChe implements zetaret.node.ProtoSSChe {
	env: zetaret.node.ServerEnvironment;
	htserv: zetaret.node.XServer;
	acceptAppRequests: boolean;
	apps: object | any;
	cookieMethod: Function;
	requestMethod: Function;
	onErrorBody: Function;
	onEndBody: Function;
	dataJoin: string;
	reqIdLength: number;
	keepBufferPerContentType: { [ctype: string]: boolean };
	requestBodyMethods: Array<string>;
	readRequestOnError: boolean;
	requestMiddleware: Array<zetaret.node.utils.RequestMiddlewareFunction>;
	responseMiddleware: Array<zetaret.node.utils.ResponseMiddlewareFunction>;

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

	getAppRequest(request: zetaret.node.XRequest): zetaret.node.Input {
		var o = this;
		var app = o.apps[(request as any).headers.protossappid];
		return app ? app(o, request) : request;
	}

	onRequest(request: zetaret.node.Input, response: zetaret.node.Output): void {
		var o = this;
		(request as zetaret.node.AugmentRequest).__reqid = o.getReqId();
		(response as zetaret.node.AugmentResponse).__data = [];
		if (o.requestMethod) o.requestMethod(o, request, response);
		o.pushProtoSSResponse(request, response).readRequestBody(request, response);
	}

	onReadRequestBody(request: zetaret.node.Input, body: string, response: zetaret.node.Output): ProtoSSChe | Promise<ProtoSSChe> {
		var o = this;
		var k, a, v, vv: any, vk;
		if (dumpall) {
			for (k in request) {
				try {
					v = (request as any)[k];
					if (v.constructor !== Function) {
						(response as zetaret.node.AugmentResponse).__data.push(k + ": " + JSON.stringify(v));
						(response as zetaret.node.AugmentResponse).__data.push("\n");
					}
				} catch (e) { }
			}
		} else {
			for (a = 0; a < dumpkeys.length; a++) {
				k = dumpkeys[a];
				try {
					v = (request as any)[k];
					if (v.constructor !== Function) {
						if (omit[k]) {
							vv = {};
							for (vk in v) {
								if (omit[k][vk]) vv[vk] = v[vk];
							}
							v = vv;
						}
						(response as zetaret.node.AugmentResponse).__data.push(k + ": " + JSON.stringify(v));
						(response as zetaret.node.AugmentResponse).__data.push("\n");
					}
				} catch (e) { }
			}
		}
		if ((request as Http2Request).url) {
			(response as zetaret.node.AugmentResponse).__data.push("Route Object: " + JSON.stringify(o.splitUrl((request as Http2Request).url)));
			(response as zetaret.node.AugmentResponse).__data.push("\n");
		}
		(response as zetaret.node.AugmentResponse).__data.push("Request Body: \n");
		(response as zetaret.node.AugmentResponse).__data.push(body);
		(response as zetaret.node.AugmentResponse).__data.push("\n");
		o.endResponse(request, response);
		return o;
	}

	splitUrl(url: string): zetaret.node.SplitURL {
		var i,
			vk,
			surl: zetaret.node.SplitURL = {},
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
			(surl.vars as any)[vk[0]] = vk[1];
		}

		return surl;
	}

	rndstr(l: number): string {
		var ch = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
			str = "",
			chl = ch.length - 1;
		while (l--) str += ch.charAt(Math.round(Math.random() * chl));
		return str;
	}

	getReqId(): string {
		var o = this;
		reqnum = (reqnum + 1) % Number.MAX_SAFE_INTEGER;
		return o.rndstr(o.reqIdLength) + "-" + reqnum.toString(36);
	}

	pushProtoSSResponse(request: zetaret.node.Input, response: zetaret.node.Output): ProtoSSChe {
		var o = this;
		(response as zetaret.node.AugmentResponse).__data.push("ProtoSS Node.js Server: https://github.com/ZetaRet/protoss-nodejs-basic \n");
		(response as zetaret.node.AugmentResponse).__data.push("Request Method: " + request.method + " \n");
		return o;
	}

	readRequestBody(request: zetaret.node.Input, response: zetaret.node.Output): ProtoSSChe {
		var o = this;
		var ended = false,
			bodyBuffer: any[] = [],
			bodyLength = 0,
			body: any = "";
		var ctype = (request as any).headers["content-type"];
		if (ctype) ctype = ctype.split(";")[0];
		var myenv = o.env || env;
		var keepbuffer = (myenv.keepBodyBuffer && o.keepBufferPerContentType[ctype]) || myenv.swapBodyBuffer ? true : false;

		if ((request as any).headers["request_url"]) (request as Http2Request).url = (request as any).headers["request_url"];
		if ((request as any).headers["request_method"]) (request as any).method = (request as any).headers["request_method"];

		if (!request.aborted) {
			if (!o.requestBodyMethods || o.requestBodyMethods.indexOf(request.method) !== -1) {
				request.on(EVENTS.DATA, function (data: any) {
					if (ended) return;
					if (keepbuffer) bodyBuffer.push(data);
					bodyLength += data.length;
					body += data;
					if (bodyLength > maxBodyLength) {
						ended = true;
						(request as any).abort();
						if (o.onErrorBody) o.onErrorBody(o, request, response, body, new Error("size"));
						if (o.readRequestOnError) o.onReadRequestBody(request, body, response);
					}
				});
			}
			request.on(EVENTS.ERROR, function (error: any) {
				if (o.onErrorBody) o.onErrorBody(o, request, response, body, error);
				if (o.readRequestOnError) o.onReadRequestBody(request, body, response);
			});
			request.on(EVENTS.END, async function () {
				if (!ended) {
					if (keepbuffer) (request as zetaret.node.AugmentRequest).__bodyBuffer = Buffer.concat(bodyBuffer);
					if (myenv.swapBodyBuffer) body = (request as zetaret.node.AugmentRequest).__bodyBuffer;
					ended = true;
					if ((request as Http2Request).url) (response as zetaret.node.AugmentResponse).__splitUrl = o.splitUrl((request as Http2Request).url);

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
			if (o.onErrorBody) o.onErrorBody(o, request, response, body, new Error(ERRORS.ABORT));
			if (o.readRequestOnError) o.onReadRequestBody(request, body, response);
		}
		return o;
	}

	updateCookies(request: zetaret.node.Input, response: zetaret.node.Output, headers: object | any): ProtoSSChe {
		var o = this;
		if (o.cookieMethod) o.cookieMethod(o, request, response, headers);
		else if (!(request as any).headers.cookie) headers["set-cookie"] = cookieid + "=" + o.rndstr(32);
		return o;
	}

	endResponse(request: zetaret.node.Input, response: zetaret.node.Output): ProtoSSChe | Promise<ProtoSSChe> {
		var o = this;
		var input = (response as zetaret.node.AugmentResponse).__data.join(o.dataJoin || ""),
			headers = {
				"content-type": contenttype,
			};
		o.updateCookies(request, response, headers);
		(response as any).writeHead(200, headers);
		(response as zetaret.node.AugmentResponse).__timestamp = new Date().getTime();
		response.end(input);
		return o;
	}
}

function getNodeServer(requestListener: Function, envd?: zetaret.node.ServerEnvironment, port?: number): zetaret.node.NodeServerData {
	var sk, httpsop: zetaret.node.ServerOptions, htserv;
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
			for (sk in envd.statsout.httpsop) (httpsop as any)[sk] = (envd.statsout.httpsop as any)[sk];
		}
		if (httpsop.keyPath) httpsop.key = fs.readFileSync(httpsop.keyPath);
		if (httpsop.certPath) httpsop.cert = fs.readFileSync(httpsop.certPath);
		if (httpsop.pfxPath) httpsop.pfx = fs.readFileSync(httpsop.pfxPath);
		if (httpsop.caPath) httpsop.ca = [fs.readFileSync(httpsop.caPath)];
		if (httpsop.h2) htserv = http2.createSecureServer(httpsop, requestListener);
		else htserv = https.createServer(httpsop, requestListener);
	} else {
		if (envd.statsout && (envd.statsout as any).h2) htserv = http2.createServer(envd.statsout.h2op, requestListener);
		else htserv = http.createServer(requestListener);
	}
	if (!htserv.request) htserv.request = http.request;
	if (!htserv.srequest) htserv.srequest = https.request;
	if (port >= 0) htserv.listen(port);
	if (envd.statsout) {
		if (envd.statsout.keepAliveTimeout) htserv.keepAliveTimeout = envd.statsout.keepAliveTimeout * 1000;
		if (envd.statsout.headersTimeout) htserv.headersTimeout = envd.statsout.headersTimeout * 1000;
	}

	return {
		httpsop,
		htserv,
	};
}

function getModuleInstance(xmodule: string): zetaret.node.ModuleInstance {
	var serverche: ProtoSSChe, xpro, xprocls;
	if (xmodule) {
		if ((global as zetaret.node.BasicServerGlobal).ProtoSSCheRequire) xpro = (global as zetaret.node.BasicServerGlobal).ProtoSSCheRequire(xmodule);
		else xpro = require(xmodule);
		xprocls = xpro.getExtendedServerProtoSS(ProtoSSChe);
		serverche = new xprocls();
	} else {
		serverche = new ProtoSSChe();
	}
	serverche.env = env;

	function requestListener(req: any, res: any) {
		try {
			(req as zetaret.node.AugmentRequest).__timestamp = new Date().getTime();
			if (serverche.acceptAppRequests) req = serverche.getAppRequest(req);
			serverche.onRequest(req, res);
		} catch (e) { }
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
