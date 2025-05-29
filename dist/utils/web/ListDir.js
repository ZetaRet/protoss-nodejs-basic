const fs = require("fs");

const MIME_TYPES = {
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

function ListDir(serverobj, path, dir, config) {
	return serverobj.addParamsPathListener(
		path + "/:fileid",
		(server, robj, routeData, request, response) => {
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
			var c, ccn, stats, filename;
			var ext = fileid.split(".").pop();

			if (!fileid || fileid.indexOf("\\") >= 0) nofile = true;
			if ((bl && bl.indexOf(fileid) >= 0) || (wl && wl.indexOf(fileid) === -1)) nofile = true;
			filename = dir + "/" + fileid;
			if (config.ext.indexOf(ext) === -1 || (fnf && fnf(fileid, filename, ext))) nofile = true;

			if (!nofile && fs.existsSync(filename)) {
				stream = (se && se[ext]) || (sf && sf[fileid]);
				ccn = cc ? cc[ext] : null;

				if (stream) {
					response.__disablePipeline = true;
					response.setHeader("Content-Type", MIME_TYPES[ext]);
					stats = fs.statSync(filename);
					response.setHeader("Content-Length", stats.size);
					if (ccn) response.setHeader("Cache-Control", "max-age=" + ccn);
					if (rf) rf(fileid, response, { filename, ext, stream, ccn, stats });
					fs.createReadStream(filename).pipe(response);
				} else {
					c = fs.readFileSync(filename, "binary");

					response.__headers["Content-Type"] = MIME_TYPES[ext];
					response.__headers["Content-Length"] = c.length;
					if (ccn) response.__headers["Cache-Control"] = "max-age=" + ccn;
					if (rf) rf(fileid, response, { filename, ext, stream, ccn });
					response.__encoding = "binary";
					response.__data.push(c);
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
