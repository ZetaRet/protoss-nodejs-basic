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
			o.routeScope = o;
			o.debugRoute = true;
			o.listener = new events.EventEmitter();
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
			var robj = response.__splitUrl;
			o.listener.emit(robj.pages.join('/'), o, robj, routeData, request, response);
		}

		initRoute() {
			var o = this;
			return o;
		}

		pushProtoSSResponse(request, response) {
			var o = this;
			return o;
		}

		addHeaders(request, response) {
			var headers = {};
			return headers;
		}
	}
}

module.exports.getExtendedServerProtoSS = getExtendedServerProtoSS;
