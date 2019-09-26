/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Extended ProtoSSChe Server loaded as module.
 **/

function getExtendedServerProtoSS(ProtoSSChe) {
	return class XProtoSSChe extends ProtoSSChe {
		constructor(routeCallback, routeScope, routeData) {
			super();
			var o = this;
			if (routeCallback) o.routeCallback = routeCallback;
			if (routeScope) o.routeScope = routeScope;
			if (routeData) o.routeData = routeData;
			o.autoCookie = false;
			o.layerServer = false;
			o.initRoute();
		}

		initRoute() {
			var o = this;
			return o;
		}

		onReadRequestBody(request, body, response) {
			var o = this;
			if (request.url) {
				response.__splitUrl = o.splitUrl(request.url);
			}
			response.__body = body;
			if (o.routeCallback) {
				o.routeCallback.call(o.routeScope, o.routeData, body, request, response);
			}
			if (!response.__async) o.endResponse(request, response);
			else response.on('pushProtoSSAsyncResponse', () => o.endResponse(request, response));
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

		layerEndResponse(request, response, input, headers) {
			return input;
		}

		endResponse(request, response) {
			var o = this;
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

module.exports.getExtendedServerProtoSS = getExtendedServerProtoSS;