/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Extended ProtoSSChe Server loaded as module.
 **/

var http = require("http"),
	http2 = require("http2");

var ExtendProtoSSChe;

const EVENTS = {
	INIT_REQUEST: "initRequest",
	ROUTE: "route",
	ASYNC_RESPONSE: "pushProtoSSAsyncResponse",
	END_RESPONSE: "endResponse",
};
const SERVERID = "zetaret.node.modules::XProtoSSChe";

var h1srpro = http.ServerResponse.prototype,
	h2srpro = http.Http2ServerResponse.prototype;
h1srpro.__asyncEnd = h2srpro.__asyncEnd = function (code) {
	if (code !== undefined) this.__rcode = code;
	this.emit(EVENTS.ASYNC_RESPONSE);
};
h1srpro.__asyncDataEnd = h2srpro.__asyncDataEnd = function (data, code) {
	this.__data.push(data);
	if (code !== undefined) this.__rcode = code;
	this.emit(EVENTS.ASYNC_RESPONSE);
};
h1srpro.__asyncJsonEnd = h2srpro.__asyncJsonEnd = function (data, code) {
	this.__headers["content-type"] = "application/json";
	this.__data.push(JSON.stringify(data));
	if (code !== undefined) this.__rcode = code;
	this.emit(EVENTS.ASYNC_RESPONSE);
};

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
			o.contentParsers = {};
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
				if (!response.__splitUrl) response.__splitUrl = o.splitUrl(request.url);
				const ctype = request.headers["content-type"];
				var ctypeCheck = ctype ? ctype.split(";")[0] : null;
				if (o.postJSON && ctype === "application/json") {
					try {
						response.__splitUrl.post = JSON.parse(body.constructor === String ? body : body.toString());
					} catch (e) {
						response.__splitUrl.post = {};
					}
				} else if (o.contentParsers[ctypeCheck]) {
					try {
						let parsedData = o.contentParsers[ctypeCheck](body, request.headers, request);
						if (parsedData.constructor === Promise) parsedData = await parsedData;
						response.__splitUrl.post = parsedData;
					} catch (e) {
						response.__splitUrl.post = {};
					}
				}
			}
			response.__body = body;

			if (o.middleware.length > 0) {
				var m, r;
				const midobj = { body };
				for (m = 0; m < o.middleware.length; m++) {
					r = o.middleware[m](request, response, midobj);
					if (r && r.constructor === Promise) r = await r;
					if (r === true) break;
				}
			}

			if (o.emitRR) response.emit(EVENTS.ROUTE, o, request, response);
			if (o.routeCallback && !response.__breakRoute) {
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
				var typeofinput = input.constructor;
				if (typeofinput === String) input = o.wrapResponseString(response, input);
				else if (typeofinput === Object || typeofinput === Array) {
					input = JSON.stringify(input);
					response.__headers["content-type"] = "application/json";
				}
			} else if (typeofdata !== String) {
				if (typeofdata === Object || typeofdata === Array) {
					input = JSON.stringify(response.__data[0]);
					response.__headers["content-type"] = "application/json";
				} else input = response.__data[0];
			} else {
				input = o.wrapResponseString(response, response.__data.join(response.__dataJoin || o.dataJoin || ""));
			}
			var headers = o.addHeaders(request, response);
			if (o.autoCookie) o.updateCookies(request, response, headers);
			if (o.layerServer) input = o.layerEndResponse(request, response, input, headers);

			if (o.responseMiddleware.length > 0) {
				var m, r;
				const output = { data: input, headers };
				for (m = 0; m < o.responseMiddleware.length; m++) {
					r = o.responseMiddleware[m](request, response, output);
					if (r && r.constructor === Promise) r = await r;
					if (r === true) break;
				}
				input = output.data;
			}

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
