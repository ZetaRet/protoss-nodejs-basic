/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Subserver of extended Server loaded as module.
 **/

var XProtoSSChe,
	xpros = require(global.SubserverRequireModule || "./XProtoSSChe.js"),
	events = require("events");

const EVENTS = {
	VOID: "",
};
const SERVERID = "zetaret.node.modules::Subserver";

function getExtendedServerProtoSS(ProtoSSChe) {
	if (!XProtoSSChe) XProtoSSChe = xpros.getExtendedServerProtoSS(ProtoSSChe);
	return class Subserver extends XProtoSSChe {
		constructor() {
			super(null, null, {});
			var o = this;
			o.routeMap = {};
			o.codeMap = {};
			o.noRouteCode = 404;
			o.noRouteEvent = "error404";
			o.debugRoute = true;
			o.listener = new events.EventEmitter();
			o.routeRegMap = {};
			o.routeRegExp = new RegExp("^[\\w|\\-]+$");
			o.routeRegGet = null;
			o.useProxy = true;
			o.proxyPaths = "__proxypaths";
			o.proxyMask = {};
			o.noProxyCode = 400;
			o.noProxyEvent = "proxyNoRoute";
			o.emitExacts = false;
			o.initRouteListener();
		}

		addPathListener(path, callback) {
			var o = this;
			if (!callback) callback = o.pathListenerX || o.pathListener.bind(o);
			o.listener.on(path, callback);
			return callback;
		}

		removePathListener(path, callback) {
			var o = this;
			o.listener.remove(path, callback);
			return o;
		}

		pathListener(server, robj, routeData, request, response) {
			var o = this;
			if (o.debugRoute) console.log(robj);
		}

		addMethodPathListener(method, path, callback) {
			var o = this;
			const methodup = method.toUpperCase();
			return o.addPathListener(path, function (server, robj, routeData, request, response) {
				if (request.method.toUpperCase() === methodup) {
					callback(server, robj, routeData, request, response);
				}
			});
		}

		addParamsPathListener(path, callback, method, autoRoute) {
			var o = this;
			const methodup = method ? method.toUpperCase() : null;
			var paramPath = [];
			var r = o.routeMap;
			var listenPath = path
				.split("/")
				.map((e) => {
					var param = e;
					if (param.charAt(0) === "{" && param.charAt(param.length - 1) === "}") {
						param = new RegExp(param.substring(1, param.length - 1));
						if (autoRoute) {
							if (!r["*"]) r["*"] = {};
							r = r["*"];
						}
					} else if (param.charAt(0) === ":") {
						if (autoRoute) {
							if (!r["*"]) r["*"] = {};
							r = r["*"];
						}
					} else {
						if (autoRoute) {
							if (!r[param]) r[param] = {};
							r = r[param];
						}
					}
					paramPath.push(param);
					return "*";
				})
				.join("/");

			return o.addPathListener(listenPath, function (server, robj, routeData, request, response) {
				if (!methodup || request.method.toUpperCase() === methodup) {
					var pcsplit = robj.pageCurrent.split("/");
					var i,
						param,
						paramc,
						vars = {};

					if (paramPath.length <= pcsplit.length) {
						for (i = 0; i < paramPath.length; i++) {
							param = paramPath[i];
							paramc = param.constructor;
							if (paramc === RegExp && !pcsplit[i].match(param)) break;
							else if (paramc === String && param.charAt(0) === ":")
								vars[param.substring(1)] = pcsplit[i];
							else if (paramc === String && param !== pcsplit[i]) break;
						}
						if (i === paramPath.length) {
							var newrobj = { ...robj };
							newrobj.vars = { ...robj.vars, ...vars };
							newrobj.paramsPathData = {
								path: path,
								listenPath: listenPath,
								paramPath: paramPath,
								params: vars,
							};
							callback(server, newrobj, routeData, request, response);
						}
					}
				}
			});
		}

		addRegPathListener(path, callback) {
			var o = this;
			var regexp = o.setRouteRegExp(path);
			return o.addPathListener(path, (server, robj, routeData, request, response) => {
				if (robj.pageCurrent.match(regexp)) callback(server, robj, routeData, request, response);
				else {
					response.__rcode = server.noProxyCode;
					if (server.noProxyEvent)
						server.listener.emit(server.noProxyEvent, server, robj, routeData, request, response);
				}
			});
		}

		setRouteRegExp(path) {
			var o = this;
			var r = o.routeMap,
				regmap = o.routeRegMap[path];
			path.split("/").forEach((e, i, a) => {
				if (regmap) {
					if (!regmap[i]) e = "*";
				} else if (o.routeRegExp) {
					if (!e.match(o.routeRegExp)) e = "*";
				} else if (o.routeRegGet) {
					if (!o.routeRegGet(e, i, a)) e = "*";
				}
				if (!r[e]) r[e] = {};
				r = r[e];
			});
			if (!r[o.proxyPaths]) r[o.proxyPaths] = {};
			r[o.proxyPaths][path] = {};
			return new RegExp(path);
		}

		routeCallback(routeData, body, request, response) {
			var o = this;
			var cp,
				pp,
				p,
				i,
				r = o.routeMap,
				robj = response.__splitUrl,
				l = robj.pages.length,
				rawpath = robj.pages.join("/"),
				stars = "";
			robj.rawpath = rawpath;
			if (l > 0) {
				for (i = 0; i < l; i++) {
					p = robj.pages[i];
					cp = cp ? cp + "/" + p : p;
					stars = stars ? stars + "/*" : "*";
					robj.pageIndex = i;
					robj.pageCurrent = cp;
					robj.pageProxy = null;
					if (o.useProxy && (p === o.proxyPaths || o.proxyMask[cp] || o.proxyMask[p])) r = null;
					else r = r[p] || r["*"];

					if (!r) {
						response.__rcode = o.noRouteCode;
						if (o.noRouteEvent) o.listener.emit(o.noRouteEvent, o, robj, routeData, request, response);
						break;
					} else {
						robj.exact = cp === robj.rawpath;
						o.listener.emit(stars, o, robj, routeData, request, response);
						if (!o.emitExacts || robj.exact) o.listener.emit(cp, o, robj, routeData, request, response);
						if (o.useProxy && r[o.proxyPaths]) {
							for (pp in r[o.proxyPaths]) {
								robj.pageProxy = pp;
								o.listener.emit(pp, o, robj, routeData, request, response);
							}
						}
						if (response.__breakRoute) break;
					}
				}
			} else {
				robj.exact = true;
				o.listener.emit(EVENTS.VOID, o, robj, routeData, request, response);
			}
			if (o.codeMap[rawpath]) response.__rcode = o.codeMap[rawpath];
		}

		initRoute() {
			var o = this;
			o.routeScope = o;
		}

		initRouteListener() {
			var o = this;
			o.pathListenerX = o.pathListener.bind(o);
			Object.defineProperty(o, "pathListenerX", {
				enumerable: false,
			});
			o.addPathListener(o.noRouteEvent);
			return o;
		}

		pushProtoSSResponse(request, response) {
			var o = this;
			if (!response.__headers) response.__headers = {};
			return o;
		}

		addHeaders(request, response) {
			var headers = response.__headers || {};
			return headers;
		}
	};
}

module.exports.xpros = xpros;
module.exports.EVENTS = EVENTS;
module.exports.SERVERID = SERVERID;
module.exports.resetExtends = () => (XProtoSSChe = null);
module.exports.getExtends = () => XProtoSSChe;
module.exports.getExtendedServerProtoSS = getExtendedServerProtoSS;
