const fs = require("fs");
const multipart = require("./multipart.js");
const { join } = require("path");

const rsn = require("./../../utils/nano/RequireSupername.js");
rsn.initRequireSupername();
rsn.loadFromJSON("namespacemap.json", __dirname);

global.ProtoSSCheStatsFile = __dirname + "/" + "filestats.json";

const ListDir = require("zetaret.node.utils.web::ListDir").ListDir;

var mod = require("zetaret.node::index");
mod.setEnv({ maxBodyLength: 10 * 1000 * 1000, keepBodyBuffer: true });
const server = mod.serverche();
server.keepBufferPerContentType["multipart/form-data"] = true;
console.log(server);

var route = {
	api: {
		filedownload: {},
		fileupload: {},
	},
};

server.routeMap = route;

server.contentParsers["multipart/form-data"] = function (body, headers, request) {
	//console.log(headers);
	console.log("Parse multiform data");
	var boundary = multipart.getBoundary(headers["content-type"]);
	console.log(boundary);

	var parseddata = multipart.parse(request.__bodyBuffer, boundary);
	console.log(parseddata);
	var formdata = {
		boundary: boundary,
		parts: parseddata,
		byname: {},
	};
	parseddata.forEach((e) => {
		formdata.byname[e.name] = e;
	});

	//console.log(request.__bodyBuffer);
	//console.log(body);

	return formdata;
};

server.addMethodPathListener("POST", "api/fileupload", function (server, robj, routeData, request, response) {
	console.log("Post data:", robj, request.headers);
	var file = robj.post.byname.file;
	var path = __dirname + "/files/" + file.filename;
	fs.writeFileSync(path, file.data);

	response.__data.push("1");
});

server.addMethodPathListener("GET", "api/filedownload", function (server, robj, routeData, request, response) {
	console.log("Get data:", robj);

	var filename = "image.png";
	var file = __dirname + "/files/" + filename;
	var filedata = fs.readFileSync(file, "binary");

	response.__headers["Content-Disposition"] = "attachment; filename=" + filename;
	response.__headers["Content-Type"] = "image/png";
	response.__headers["Content-Length"] = filedata.length;

	response.__encoding = "binary";

	response.__data.push(filedata);
});

ListDir(server, "js", __dirname, { ext: ["js", "json"] });
ListDir(server, "images", join(__dirname, "/files"), {
	ext: ["png"],
	streamExt: { png: true },
	cacheControl: { png: 60 * 60 * 1 },
});
