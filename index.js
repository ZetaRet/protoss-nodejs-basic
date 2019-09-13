var http = require('http');
var fs = require('fs');

var dumpall = false;
var dumpkeys = ['__reqid', 'complete', 'headers', 'url', 'method'];
var omit = {
	headers: {
		"connection": 1,
		"user-agent": 1,
		"cache-control": 1,
		"accept-encoding": 1,
		"accept": 1,
		"accept-language": 1,
		"cookie": 1,
		"host": 1,
		"x-forwarded-proto": 1
	}
};
var reqnum = 0;

class ProtoSSChe {
	onRequest(request, response) {
		var o = this;
		request.__reqid = o.getReqId();
		response.__data = [];
		o.pushProtoSSResponse(request, response).readRequestBody(request, response);
	}

	onReadRequestBody(request, body, response) {
		var o = this;
		var k, a, v, vv, vk;
		if (dumpall) {
			for (k in request) {
				try {
					v = request[k];
					if (v.constructor !== Function) {
						response.__data.push(k + ':' + JSON.stringify(v));
						response.__data.push('\n');
					}
				} catch (e) {}
			}
		} else {
			for (a = 0; a < dumpkeys.length; a++) {
				k = dumpkeys[a];
				try {
					v = request[k];
					if (v.constructor !== Function) {
						if (omit[k]) {
							vv = {};
							for (vk in v) {
								if (omit[k][vk]) vv[vk] = v[vk];
							}
							v = vv;
						}
						response.__data.push(k + ':' + JSON.stringify(v));
						response.__data.push('\n');
					}
				} catch (e) {}
			}
		}
		response.__data.push('Request body: \n');
		response.__data.push(body);
		response.__data.push('\n');
		o.endResponse(request, response);
		return o;
	}

	rndstr(l) {
		var ch = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		var str = '',
			i = l;
		while (i--) str += ch.charAt(Math.round(Math.random() * (ch.length - 1)));
		return str;
	}

	getReqId() {
		var o = this;
		reqnum = (reqnum + 1) % Number.MAX_SAFE_INTEGER;
		return o.rndstr(31) + '-' + reqnum.toString(36);
	}

	pushProtoSSResponse(request, response) {
		var o = this;
		response.__data.push('ProtoSS Node.js Server\n');
		response.__data.push('GitHub: https://github.com/ZetaRet/protoss \n');
		response.__data.push('ProtoSS IDE for Atom: https://atom.io/packages/ide-protoss \n');
		response.__data.push('ProtoSS Project: https://zetaret.com/projects/protoss/ \n');
		response.__data.push('Request method: ' + request.method + ' \n');
		return o;
	}

	readRequestBody(request, response) {
		var o = this;
		var body = '';
		request.on('data', function(data) {
			body += data;
		});
		request.on('end', function() {
			o.onReadRequestBody(request, body, response);
		});
		return o;
	}

	endResponse(request, response) {
		var o = this;
		var input = response.__data.join("");
		var headers = {
			'content-type': 'text/plain'
		};
		if (!request.headers.cookie) headers['set-cookie'] = "zetaretpid=" + o.rndstr(32);
		response.writeHead(200, headers);
		response.end(input);
		return o;
	}
}

var serverche = new ProtoSSChe();

http.createServer(function(req, res) {
	try {
		serverche.onRequest(req, res);
	} catch (e) {}
}).listen(8888);
