declare module "protoss-nodejs-basic/dist/utils/web/ListDir.js";
declare module "zetaret.node.utils.web::ListDir";

var fs = require("fs");
var { join } = require("path");

const MIME_TYPES: any = {
	js: "text/javascript",
	json: "application/json",
	xml: "application/xml",
	css: "text/css",
	csv: "text/csv",
	html: "text/html",
	txt: "text/plain",
	png: "image/png",
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	mp4: "video/mp4",
	mpeg: "video/mpeg",
	otf: "font/otf",
	ttf: "font/ttf",
	woff: "font/woff",
	woff2: "font/woff2",
};

function ListDir(serverobj: zetaret.node.modules.Subserver | zetaret.node.api.Router, path: string, dir: string, config: zetaret.node.utils.web.ListDirConfig) {
	return serverobj.addParamsPathListener(
		path + "/:fileid",
		(server: any, robj: any, routeData: any, request: any, response: any) => {
			var fileid = robj.vars.fileid,
				nofile = false,
				stream = false,
				bl = config.blacklist,
				wl = config.whitelist,
				fnf = config.filenameFilter,
				rf = config.readFile,
				cc = config.cacheControl,
				se = config.streamExt,
				sf = config.streamFiles;
			var c, ccn, stats, cadata, filename: string;
			var mainid = fileid;
			var unpack = fileid.split(".");
			var ext: string = unpack.pop() || "";
			var prefix: string = unpack[0] || "";
			var hash: string = config.hashMap && config.hashMap[prefix] ? (unpack.pop() || "") : null;
			if (hash) mainid = unpack.join(".") + (ext ? "." + ext : "");

			if (!fileid || fileid.indexOf("\\") >= 0 || fileid === "*") nofile = true;
			if ((bl && bl.indexOf(mainid) >= 0) || (wl && wl.indexOf(mainid) === -1)) nofile = true;
			filename = join(dir, fileid);
			if (config.ext.indexOf(ext) === -1 || (fnf && fnf(mainid, filename, ext, { fileid }))) nofile = true;

			if (!nofile && fs.existsSync(filename)) {
				response.__disablePipeline = true;

				function endResponse() {
					stream = (se && se[ext]) || (sf && sf[mainid]);
					ccn = cc ? cc[ext] : null;

					response.setHeader("Content-Type", MIME_TYPES[ext]);
					stats = fs.statSync(filename);
					response.setHeader("Content-Length", stats.size);
					if (ccn && (!config.nocache || !config.nocache[mainid])) response.setHeader("Cache-Control", "max-age=" + ccn);
					if (rf) rf(fileid, request, response, { mainid, filename, ext, stream, ccn, stats });
					if (stream) fs.createReadStream(filename).pipe(response);
					else {
						c = fs.readFileSync(filename, "binary");
						response.writeHead(200);
						response.end(c, "binary");
					}
				}
				function noAccess() {
					response.writeHead(403);
					response.end();
				}

				if (config.access) cadata = config.access[mainid] || config.access["*"];
				if (cadata !== undefined) {
					config.accessHandler(mainid, cadata, request, response, (allow: boolean) => {
						if (allow) endResponse();
						else noAccess()
					}, { fileid, filename, ext, prefix, hash });
				} else {
					endResponse();
				}
			} else {
				response.__rcode = 404;
			}
		},
		"GET",
		true
	);
}

module.exports.MIME_TYPES = MIME_TYPES;
module.exports.ListDir = ListDir;
