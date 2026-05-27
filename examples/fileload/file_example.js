const fs = require("fs");
const { join } = require("path");

const rsn = require("./../../dist/utils/nano/RequireSupername.js");
rsn.initRequireSupername();
rsn.loadFromJSON("namespacemap.json", __dirname);

global.ProtoSSCheStatsFile = __dirname + "/" + "filestats.json";

const ListDir = require("zetaret.node.utils.web::ListDir").ListDir;

var mod = require("zetaret.node::index");
mod.setEnv({ maxBodyLength: 10 * 1000 * 1000, keepBodyBuffer: true });
const server = mod.serverche();

var route = {
	api: {
		filedownload: {},
		fileupload: {},
	},
};
server.routeMap = route;

const multipart = require("zetaret.node.utils.web::Multipart");
multipart.settings.debug = true;
multipart.configParser(server, (res) => {
	console.log("#configParser", res);
});

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

var access = {
	"filestats.json": { login: true },
	"namespacemap.json": { login: false },
	"chunk.welcome.js": { login: false },
};
var access2 = {
	"*": { login: false },
};
async function accessHandler(fileid, cadata, request, response, endResponse, options) {
	console.log(fileid, cadata, options);
	if (cadata.login) {
		//simulate db operation to check user session and role permissions using provided credentials of request cookie header
		let dbresult = await new Promise((resolve) => {
			setTimeout(() => {
				//user is a guest, can not access file
				resolve(false);
			}, 50);
		});
		endResponse(dbresult);
	} else {
		endResponse(true);
	}
}

var hashMap = { chunk: true };

ListDir(server, "js", __dirname, {
	ext: ["js", "json"],
	access,
	accessHandler,
	cacheControl: { js: 60 * 60 * 1 },
	nocache: { "file_nocache.js": 1 },
	hashMap,
});
ListDir(server, "images", join(__dirname, "/files"), {
	ext: ["png"],
	streamExt: { png: true },
	cacheControl: { png: 60 * 60 * 1 },
	access: access2,
	accessHandler,
});
