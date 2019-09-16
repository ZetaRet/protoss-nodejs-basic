/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Subserver of extended Server loaded as module.
 **/

var XProtoSSChe, xpros = require('./XProtoSSChe.js'),
	events = require('events');

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
			if (!callback) callback = o.pathListener;
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
				rawpath = robj.pages.join('/');
			for (i = 0; i < robj.pages.length; i++) {
				p = robj.pages[i];
				cp = cp ? cp + '/' + p : p;
				r = r[p];
				if (!r) {
					response.__rcode = o.noRouteCode;
					if (o.noRouteEvent) o.listener.emit(o.noRouteEvent, o, robj, routeData, request, response);
					break;
				} else {
					o.listener.emit(cp, o, robj, routeData, request, response);
				}
			}
			if (o.codeMap[rawpath]) response.__rcode = o.codeMap[rawpath];
			o.listener.emit(rawpath, o, robj, routeData, request, response);
		}

		initRoute() {
			var o = this;
			o.routeScope = o;
			return o;
		}

		initRouteListener() {
			var o = this;
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

module.exports.getExtendedServerProtoSS = getExtendedServerProtoSS;
