/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Extended ProtoSSChe Server loaded as module.
 **/
declare module "zetaret.node.modules::XProtoSSChe";
declare module "protoss-nodejs-basic/dist/modules/XProtoSSChe.js";

export { }

var http = require("http"),
	http2 = require("http2"),
	os = require("os");

var ExtendProtoSSChe: zetaret.node.ProtoSSCheCTOR;

const EVENTS = {
	INIT_REQUEST: "initRequest",
	ROUTE: "route",
	ASYNC_RESPONSE: "pushProtoSSAsyncResponse",
	END_RESPONSE: "endResponse",
};
const SERVERID = "zetaret.node.modules::XProtoSSChe";

var h1srpro = http.ServerResponse.prototype,
	h2srpro = http2.Http2ServerResponse.prototype;
h1srpro.__asyncEnd = h2srpro.__asyncEnd = function (code?: number): void {
	if (code !== undefined) this.__rcode = code;
	this.emit(EVENTS.ASYNC_RESPONSE);
};
h1srpro.__asyncDataEnd = h2srpro.__asyncDataEnd = function (data: any, code?: number): void {
	this.__data.push(data);
	if (code !== undefined) this.__rcode = code;
	this.emit(EVENTS.ASYNC_RESPONSE);
};
h1srpro.__asyncJsonEnd = h2srpro.__asyncJsonEnd = function (data: any, code?: number): void {
	this.__headers["content-type"] = "application/json";
	this.__data.push(JSON.stringify(data));
	if (code !== undefined) this.__rcode = code;
	this.emit(EVENTS.ASYNC_RESPONSE);
};

function getExtendedServerProtoSS(ProtoSSChe: zetaret.node.ProtoSSCheCTOR): zetaret.node.modules.XProtoSSCheCTOR {
	if (!ExtendProtoSSChe) ExtendProtoSSChe = ProtoSSChe;
	return class XProtoSSChe extends ExtendProtoSSChe implements zetaret.node.modules.XProtoSSChe {
		routeScope: object;
		routeData: object;
		autoCookie: boolean;
		postJSON: boolean;
		contentParsers: { [ctype: string]: zetaret.node.utils.ContentParserFunction };
		layerServer: boolean;
		middleware: Array<zetaret.node.utils.MiddlewareFunction>;
		emitRR: boolean;
		asyncGrid: Function;
		asyncBuffer: Array<object>;
		asyncInterval: number;
		asyncId: number | object | any;
		collectionRR: any[];
		collectionStats: any[];
		collectionMax: number;

		constructor(routeCallback?: Function, routeScope?: object, routeData?: object) {
			super();
			var o = this;
			if (routeCallback) o.routeCallback = routeCallback as any;
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
			o.collectionRR = [];
			o.collectionStats = [];
			o.collectionMax = 300;
			o.initRoute();
			o.initAsyncGrid();
		}

		routeCallback(routeData: object, body: string, request: zetaret.node.Input, response: zetaret.node.Output): void { }

		initRoute(): void { }

		initAsyncGrid(): void {
			var o = this;
			o.asyncId = setInterval(() => o.flushAsyncBuffer(), o.asyncInterval);
		}

		stopAsyncGrid(): void {
			var o = this;
			clearInterval(o.asyncId);
			o.asyncId = null;
		}

		exeAsyncBuffer(): void {
			var o = this;
			if (o.asyncBuffer.length > 0) {
				o.asyncBuffer.forEach((e: any) => o.routeCallback.call(o.routeScope, o.routeData, e[1].__body, e[0], e[1]));
				o.asyncBuffer.forEach((e: any) => {
					if (!e[1].__async) o.endResponse(e[0], e[1]);
				});
				o.asyncBuffer = [];
			}
		}

		exeCollection(): void {
			var o = this;
			if (o.collectionRR.length > 0) {
				let count = o.collectionRR.length;
				let stats: any = {
					requests: count, time: 0, avrgTime: 0, average: 0, units: 0,
					cpus: 0, cpuTypes: [], memory: os.totalmem()
				};
				let firstin = o.collectionRR[0][0];
				let lastout = o.collectionRR[count - 1][1];
				o.collectionRR.forEach((e: any) => {
					stats.avrgTime += e[1].__timestamp - e[0].__timestamp;
					stats.units += e[0].__units || 0;
					stats.units += e[1].__units || 0;
					if (e[1].__timestamp > lastout.__timestamp) lastout = e[1];
				});
				stats.time = lastout.__timestamp - firstin.__timestamp;
				stats.average = stats.avrgTime / count;
				o.collectionRR = [];
				o.collectionStats.push(stats);
				if (o.collectionStats.length > o.collectionMax) o.collectionStats.shift();
				var cpus = os.cpus();
				var i, type, cpu, total;
				stats.cpus = cpus.length;
				for (i = 0; i < stats.cpus; i++) {
					cpu = cpus[i], total = 0;
					for (type in cpu.times) total += cpu.times[type];
					for (type in cpu.times) stats.cpuTypes.push([type, Math.round(100 * cpu.times[type] / total)]);
				}
			}
		}

		flushAsyncBuffer(): void {
			var o = this;
			o.exeAsyncBuffer();
			o.exeCollection();
		}

		async onReadRequestBody(request: zetaret.node.Input, body: string, response: zetaret.node.Output): Promise<zetaret.node.modules.XProtoSSChe> {
			var o = this;

			if (o.emitRR) request.emit(EVENTS.INIT_REQUEST, o, request, response);
			if (o.layerServer) body = o.layerInitRequest(request, response, body);
			if ((request as Http2Request).url) {
				if (!(response as zetaret.node.AugmentResponse).__splitUrl) (response as zetaret.node.AugmentResponse).__splitUrl = o.splitUrl((request as Http2Request).url);
				const ctype = (request as any).headers["content-type"];
				var ctypeCheck = ctype ? ctype.split(";")[0] : null;
				if (o.postJSON && ctype === "application/json") {
					try {
						(response as zetaret.node.AugmentResponse).__splitUrl.post = JSON.parse(body.constructor === String ? body : body.toString());
					} catch (e) {
						(response as zetaret.node.AugmentResponse).__splitUrl.post = {};
					}
				} else if (o.contentParsers[ctypeCheck]) {
					try {
						let parsedData = o.contentParsers[ctypeCheck](body, (request as any).headers, request);
						if (parsedData.constructor === Promise) parsedData = await parsedData;
						(response as zetaret.node.AugmentResponse).__splitUrl.post = parsedData;
					} catch (e) {
						(response as zetaret.node.AugmentResponse).__splitUrl.post = {};
					}
				}
			}
			(response as zetaret.node.AugmentResponse).__body = body;

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
			if (o.routeCallback && !(response as zetaret.node.RoutedResponse).__breakRoute) {
				if (o.asyncGrid && o.asyncGrid(o, request, response)) {
					(response as zetaret.node.AugmentResponse).__async = true;
					o.asyncBuffer.push([request, response]);
				} else o.routeCallback.call(o.routeScope, o.routeData, (response as zetaret.node.AugmentResponse).__body, request, response);
			}
			if (!(response as zetaret.node.AugmentResponse).__async) o.endResponse(request, response);
			else response.on(EVENTS.ASYNC_RESPONSE, () => o.endResponse(request, response));
			return o;
		}

		pushProtoSSResponse(request: zetaret.node.Input, response: zetaret.node.Output): zetaret.node.modules.XProtoSSChe {
			var o = this;
			return o;
		}

		addHeaders(request: zetaret.node.Input, response: zetaret.node.Output): object {
			var headers = {};
			return headers;
		}

		layerInitRequest(request: zetaret.node.Input, response: zetaret.node.Output, body: string): string {
			return body;
		}

		layerEndResponse(request: zetaret.node.Input, response: zetaret.node.Output, input: string, headers: object): string {
			return input;
		}

		wrapResponseString(response: zetaret.node.Output, data: any) {
			var o = this;
			var input = ((response as zetaret.node.AugmentResponse).__dataPrefix || "") + data + ((response as zetaret.node.AugmentResponse).__dataSuffix || "");
			return input;
		}

		async endResponse(request: zetaret.node.Input, response: zetaret.node.Output): Promise<zetaret.node.modules.XProtoSSChe> {
			if ((response as zetaret.node.AugmentResponse).__disablePipeline) return;
			var o = this;

			if ((response as zetaret.node.AugmentResponse).__await) await (response as zetaret.node.AugmentResponse).__await;
			if (o.emitRR) response.emit(EVENTS.END_RESPONSE, o, request, response);

			var input;
			var typeofdata = (response as zetaret.node.AugmentResponse).__data[0] ? (response as zetaret.node.AugmentResponse).__data[0].constructor : null;
			if (typeofdata === Promise) {
				input = await (response as zetaret.node.AugmentResponse).__data[0];
				var typeofinput = input.constructor;
				if (typeofinput === String) input = o.wrapResponseString(response, input);
				else if (typeofinput === Object || typeofinput === Array) {
					input = JSON.stringify(input);
					(response as zetaret.node.RoutedResponse).__headers["content-type"] = "application/json";
				}
			} else if (typeofdata !== String) {
				if (typeofdata === Object || typeofdata === Array) {
					input = JSON.stringify((response as zetaret.node.AugmentResponse).__data[0]);
					(response as zetaret.node.RoutedResponse).__headers["content-type"] = "application/json";
				} else input = (response as zetaret.node.AugmentResponse).__data[0];
			} else if ((response as zetaret.node.AugmentResponse).__data.length > 0) {
				input = o.wrapResponseString(response, (response as zetaret.node.AugmentResponse).__data.join((response as zetaret.node.AugmentResponse).__dataJoin || o.dataJoin || ""));
			}

			var headers: any = o.addHeaders(request, response);
			if (o.autoCookie) o.updateCookies(request, response, headers);
			if (o.layerServer) input = o.layerEndResponse(request, response, input, headers);

			if (o.responseMiddleware.length > 0) {
				var m, r;
				const output = { data: input, headers };
				for (m = 0; m < o.responseMiddleware.length; m++) {
					r = o.responseMiddleware[m](request, response, output as any);
					if (r && r.constructor === Promise) r = await r;
					if (r === true) break;
				}
				input = output.data;
			}

			if (!response.headersSent) (response as Http2Response).writeHead((response as zetaret.node.AugmentResponse).__rcode || 200, headers);
			response.end(input, (response as zetaret.node.AugmentResponse).__encoding as any);
			(response as zetaret.node.AugmentResponse).__timestamp = new Date().getTime();
			if (o.collectionMax > 0) o.collectionRR.push([request, response]);
			return o;
		}
	};
}

module.exports.EVENTS = EVENTS;
module.exports.SERVERID = SERVERID;
module.exports.resetExtends = (): void => (ExtendProtoSSChe = null);
module.exports.getExtends = (): zetaret.node.ProtoSSCheCTOR => ExtendProtoSSChe;
module.exports.getExtendedServerProtoSS = getExtendedServerProtoSS;
