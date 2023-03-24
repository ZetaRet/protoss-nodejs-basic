/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Extended ProtoSSChe Server loaded as module.
 **/

var ExtendProtoSSChe;

const EVENTS = {
	INIT_REQUEST: "initRequest",
	ROUTE: "route",
	ASYNC_RESPONSE: "pushProtoSSAsyncResponse",
	END_RESPONSE: "endResponse",
};
const SERVERID = "zetaret.node.modules::XProtoSSChe";

function getExtendedServerProtoSS(ProtoSSChe) {
	if (!ExtendProtoSSChe) ExtendProtoSSChe = ProtoSSChe;
	return class XProtoSSChe extends ExtendProtoSSChe {
		constructor(routeCallback, routeScope, routeData) {
			super();
			var o = this;
			if (routeCallback) o.routeCallback = routeCallback;
			if (routeScope) o.routeScope = routeScope;
			if (routeData) o.routeData = routeData;
			o.autoCookie = false;
			o.postJSON = true;
			o.layerServer = false;
			o.middleware = [];
			o.emitRR = false;
			o.asyncGrid = null;
			o.asyncBuffer = [];
			o.asyncInterval = 1000;
			o.asyncId = null;
			o.initRoute();
			o.initAsyncGrid();
		}

		initRoute() {}

		initAsyncGrid() {
			var o = this;
			o.asyncId = setInterval(() => o.flushAsyncBuffer(), o.asyncInterval);
		}

		stopAsyncGrid() {
			var o = this;
			clearInterval(o.asyncId);
			o.asyncId = null;
		}

		flushAsyncBuffer() {
			var o = this;
			if (o.asyncBuffer.length > 0) {
				o.asyncBuffer.forEach((e) => o.routeCallback.call(o.routeScope, o.routeData, e[1].__body, e[0], e[1]));
				o.asyncBuffer.forEach((e) => {
					if (!e[1].__async) o.endResponse(e[0], e[1]);
				});
				o.asyncBuffer = [];
			}
		}

		async onReadRequestBody(request, body, response) {
			var o = this;

			if (o.emitRR) request.emit(EVENTS.INIT_REQUEST, o, request, response);
			if (o.layerServer) body = o.layerInitRequest(request, response, body);
			if (request.url) {
				response.__splitUrl = o.splitUrl(request.url);
				if (o.postJSON && request.headers["content-type"] === "application/json") {
					try {
						response.__splitUrl.post = JSON.parse(body);
					} catch (e) {
						response.__splitUrl.post = {};
					}
				}
			}
			response.__body = body;

			if (o.middleware.length > 0) {
				var m, r;
				for (m = 0; m < o.middleware.length; m++) {
					r = o.middleware[m](request, response, body);
					if (r && r.constructor === Promise) r = await r;
					if (r === true) break;
				}
			}

			if (o.emitRR) response.emit(EVENTS.ROUTE, o, request, response);
			if (o.routeCallback) {
				if (o.asyncGrid && o.asyncGrid(o, request, response)) {
					response.__async = true;
					o.asyncBuffer.push([request, response]);
				} else o.routeCallback.call(o.routeScope, o.routeData, response.__body, request, response);
			}
			if (!response.__async) o.endResponse(request, response);
			else response.on(EVENTS.ASYNC_RESPONSE, () => o.endResponse(request, response));
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

		layerInitRequest(request, response, body) {
			return body;
		}

		layerEndResponse(request, response, input, headers) {
			return input;
		}

		wrapResponseString(response, data) {
			var o = this;
			var input = (response.__dataPrefix || "") + data + (response.__dataSuffix || "");
			return input;
		}

		async endResponse(request, response) {
			var o = this;
			if (o.emitRR) response.emit(EVENTS.END_RESPONSE, o, request, response);
			var input;
			var typeofdata = response.__data[0] ? response.__data[0].constructor : null;
			if (typeofdata === Promise) {
				input = await response.__data[0];
				if (input.constructor === String) input = o.wrapResponseString(response, input);
			} else if (typeofdata !== String) {
				input = response.__data[0];
			} else {
				input = o.wrapResponseString(response, response.__data.join(response.__dataJoin || o.dataJoin || ""));
			}
			var headers = o.addHeaders(request, response);
			if (o.autoCookie) o.updateCookies(request, response, headers);
			if (o.layerServer) input = o.layerEndResponse(request, response, input, headers);
			response.writeHead(response.__rcode || 200, headers);
			response.end(input, response.__encoding);
			return o;
		}
	};
}

module.exports.EVENTS = EVENTS;
module.exports.SERVERID = SERVERID;
module.exports.resetExtends = () => (ExtendProtoSSChe = null);
module.exports.getExtends = () => ExtendProtoSSChe;
module.exports.getExtendedServerProtoSS = getExtendedServerProtoSS;
