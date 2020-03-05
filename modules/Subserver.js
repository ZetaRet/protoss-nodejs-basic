/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Subserver of extended Server loaded as module.
 **/

var XProtoSSChe, xpros = require(global.SubserverRequireModule || './XProtoSSChe.js'),
	events = require('events');

const EVENTS = {
	VOID: ''
};
const SERVERID = 'zetaret.node.modules::Subserver';

function getExtendedServerProtoSS(ProtoSSChe) {
	if (!XProtoSSChe) XProtoSSChe = xpros.getExtendedServerProtoSS(ProtoSSChe);
	return class Subserver extends XProtoSSChe {
		constructor() {
			super(null, null, {});
			var o = this;
			o.routeMap = {};
			o.codeMap = {};
			o.noRouteCode = 404;
			o.noRouteEvent = 'error404';
			o.debugRoute = true;
			o.listener = new events.EventEmitter();
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

		routeCallback(routeData, body, request, response) {
			var o = this;
			var cp, p, i, r = o.routeMap,
				robj = response.__splitUrl,
				l = robj.pages.length,
				rawpath = robj.pages.join("/");
			robj.rawpath = rawpath;
			if (l > 0) {
				for (i = 0; i < l; i++) {
					p = robj.pages[i];
					cp = cp ? cp + '/' + p : p;
					r = r[p] || r["*"];
					if (!r) {
						response.__rcode = o.noRouteCode;
						if (o.noRouteEvent) o.listener.emit(o.noRouteEvent, o, robj, routeData, request, response);
						break;
					} else {
						robj.exact = (cp === robj.rawpath);
						o.listener.emit(cp, o, robj, routeData, request, response);
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
			return o;
		}

		initRouteListener() {
			var o = this;
			o.pathListenerX = o.pathListener.bind(o);
			Object.defineProperty(o, 'pathListenerX', {
				enumerable: false
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
	}
}

module.exports.xpros = xpros;
module.exports.EVENTS = EVENTS;
module.exports.SERVERID = SERVERID;
module.exports.resetExtends = () => XProtoSSChe = null;
module.exports.getExtends = () => XProtoSSChe;
module.exports.getExtendedServerProtoSS = getExtendedServerProtoSS;