"use strict";
exports.__esModule = true;

const { Buffer } = require("buffer");

const settings = {
	debug: false,
	debugData: false,
};
exports.settings = settings;

var ParsingState;
(function (ParsingState) {
	ParsingState[(ParsingState["INIT"] = 0)] = "INIT";
	ParsingState[(ParsingState["READING_HEADERS"] = 1)] = "READING_HEADERS";
	ParsingState[(ParsingState["READING_DATA"] = 2)] = "READING_DATA";
	ParsingState[(ParsingState["READING_PART_SEPARATOR"] = 3)] = "READING_PART_SEPARATOR";
})(ParsingState || (ParsingState = {}));

function parse(multipartBodyBuffer, boundary) {
	var lastline = "";
	var contentDispositionHeader = "";
	var contentTypeHeader = "";
	var state = ParsingState.INIT;
	var buffer = [];
	var allParts = [];
	var currentPartHeaders = [];
	for (var i = 0; i < multipartBodyBuffer.length; i++) {
		var oneByte = multipartBodyBuffer[i];
		var prevByte = i > 0 ? multipartBodyBuffer[i - 1] : null;

		var newLineDetected = oneByte === 0x0a && prevByte === 0x0d;
		var newLineChar = oneByte === 0x0a || oneByte === 0x0d;
		if (!newLineChar) lastline += String.fromCharCode(oneByte);
		if (ParsingState.INIT === state && newLineDetected) {
			if ("--" + boundary === lastline) {
				state = ParsingState.READING_HEADERS;
			}
			lastline = "";
		} else if (ParsingState.READING_HEADERS === state && newLineDetected) {
			if (lastline.length) {
				currentPartHeaders.push(lastline);
			} else {
				for (var _i = 0, currentPartHeaders_1 = currentPartHeaders; _i < currentPartHeaders_1.length; _i++) {
					var h = currentPartHeaders_1[_i];
					if (h.toLowerCase().startsWith("content-disposition:")) {
						contentDispositionHeader = h;
					} else if (h.toLowerCase().startsWith("content-type:")) {
						contentTypeHeader = h;
					}
				}
				state = ParsingState.READING_DATA;
				buffer = [];
			}
			lastline = "";
		} else if (ParsingState.READING_DATA === state) {
			if (lastline.length > boundary.length + 4) {
				lastline = "";
			}
			if ("--" + boundary === lastline) {
				var j = buffer.length - lastline.length;
				var part = buffer.slice(0, j - 1);
				allParts.push(
					process({
						contentDispositionHeader: contentDispositionHeader,
						contentTypeHeader: contentTypeHeader,
						part: part,
					})
				);
				buffer = [];
				currentPartHeaders = [];
				lastline = "";
				state = ParsingState.READING_PART_SEPARATOR;
				contentDispositionHeader = "";
				contentTypeHeader = "";
			} else {
				buffer.push(oneByte);
			}
			if (newLineDetected) {
				lastline = "";
			}
		} else if (ParsingState.READING_PART_SEPARATOR === state) {
			if (newLineDetected) {
				state = ParsingState.READING_HEADERS;
			}
		}
	}
	return allParts;
}
exports.parse = parse;

function getBoundary(header) {
	var items = header.split(";");
	if (items) {
		for (var i = 0; i < items.length; i++) {
			var item = new String(items[i]).trim();
			if (item.indexOf("boundary") >= 0) {
				var k = item.split("=");
				return new String(k[1]).trim().replace(/^["']|["']$/g, "");
			}
		}
	}
	return "";
}
exports.getBoundary = getBoundary;

function process(part) {
	var obj = function (str) {
		var k = str.split("=");
		var a = k[0].trim();
		var b = JSON.parse(k[1].trim());
		var o = {};
		Object.defineProperty(o, a, {
			value: b,
			writable: true,
			enumerable: true,
			configurable: true,
		});
		return o;
	};
	var header = part.contentDispositionHeader.split(";");
	var filenameData = header[2];
	var input = {};
	if (filenameData) {
		input = obj(filenameData);
		var contentType = part.contentTypeHeader.split(":")[1].trim();
		Object.defineProperty(input, "type", {
			value: contentType,
			writable: true,
			enumerable: true,
			configurable: true,
		});
	}

	Object.defineProperty(input, "name", {
		value: header[1].split("=")[1].replace(/"/g, ""),
		writable: true,
		enumerable: true,
		configurable: true,
	});
	Object.defineProperty(input, "data", {
		value: Buffer.from(part.part),
		writable: true,
		enumerable: true,
		configurable: true,
	});
	return input;
}

function contentParser(body, headers, request) {
	if (settings.debug) console.log("#Parse multiform data");
	var boundary = getBoundary(headers["content-type"]);
	if (settings.debug) console.log(" #Boundary:", boundary);

	var parseddata = parse(request.__bodyBuffer, boundary);
	if (settings.debugData) console.log(" #Parsed Data", parseddata);
	var formdata = {
		boundary: boundary,
		parts: parseddata,
		byname: {},
	};
	parseddata.forEach((e) => {
		formdata.byname[e.name] = e;
	});
	if (settings.debugData) console.log(" #Form Data", formdata);

	return formdata;
}
exports.contentParser = contentParser;

function configParser(server, callback) {
	server.keepBufferPerContentType["multipart/form-data"] = true;
	server.contentParsers["multipart/form-data"] = (body, headers, request) => {
		let res = contentParser(body, headers, request);
		if (callback) callback(res);
		return res;
	};
}
exports.configParser = configParser;
