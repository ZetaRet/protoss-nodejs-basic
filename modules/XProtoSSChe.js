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
			if (o.routeCallback) {
				o.routeCallback.call(o.routeScope, o.routeData, body, request, response);
			}
			o.endResponse(request, response);
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

		endResponse(request, response) {
			var o = this;
			var input = response.__data.join("");
			var headers = o.addHeaders(request, response);
			response.writeHead(200, headers);
			response.end(input);
			return o;
		}
	}
}

module.exports.getExtendedServerProtoSS = getExtendedServerProtoSS;
