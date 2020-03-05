/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Extended ProtoSSChe Server loaded as module.
 **/

const EVENTS = {
	INIT_REQUEST: 'initRequest',
	ROUTE: 'route',
	ASYNC_RESPONSE: 'pushProtoSSAsyncResponse',
	END_RESPONSE: 'endResponse'
};

function getExtendedServerProtoSS(ProtoSSChe) {
	return class XProtoSSChe extends ProtoSSChe {
		constructor(routeCallback, routeScope, routeData) {
			super();
			var o = this;
			if (routeCallback) o.routeCallback = routeCallback;
			if (routeScope) o.routeScope = routeScope;
			if (routeData) o.routeData = routeData;
			o.autoCookie = false;
			o.postJSON = true;
			o.layerServer = false;
			o.emitRR = false;
			o.initRoute();
		}

		initRoute() {
			var o = this;
			return o;
		}

		onReadRequestBody(request, body, response) {
			var o = this;
			if (o.emitRR) request.emit(EVENTS.INIT_REQUEST, o, request, response);
			if (o.layerServer) body = o.layerInitRequest(request, response, body);
			if (request.url) {
				response.__splitUrl = o.splitUrl(request.url);
				if (o.postJSON && request.headers['content-type'] === 'application/json') {
					try {
						response.__splitUrl.post = JSON.parse(body);
					} catch (e) {
						response.__splitUrl.post = {};
					}
				}
			}
			response.__body = body;
			if (o.emitRR) response.emit(EVENTS.ROUTE, o, request, response);
			if (o.routeCallback) {
				o.routeCallback.call(o.routeScope, o.routeData, response.__body, request, response);
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

		endResponse(request, response) {
			var o = this;
			if (o.emitRR) response.emit(EVENTS.END_RESPONSE, o, request, response);
			var input = response.__data.join(""),
				headers = o.addHeaders(request, response);
			if (o.autoCookie) o.updateCookies(request, response, headers);
			if (o.layerServer) input = o.layerEndResponse(request, response, input, headers);
			response.writeHead(response.__rcode || 200, headers);
			response.end(input);
			return o;
		}
	}
}

module.exports.EVENTS = EVENTS;
module.exports.getExtendedServerProtoSS = getExtendedServerProtoSS;