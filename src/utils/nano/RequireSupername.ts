/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Require by Supername
 **/

declare module "protoss-nodejs-basic/dist/utils/nano/RequireSupername.js";

var fsmod = require("fs"),
	path = require("path");

var rf: any,
	maps: any = {},
	supernames: any = {},
	namespaces: any = {},
	verified: any = {},
	ext: string[] = ["js"];

function setPathSupername(supername: string, paths: Array<string>): void {
	paths.forEach((p) => (maps[p] = supername));
}

function setSupername(supername: string, path: string): void {
	supernames[supername] = path;
}

function setNamespace(ns: string, paths: Array<Array<string>>): void {
	namespaces[ns] = (namespaces[ns] || []).concat(paths);
}

function setNamespaceMap(nsmap: object) {
	for (var ns in nsmap) setNamespace(ns, (nsmap as any)[ns]);
}

function resolveFilename() {
	var a = RequireSupername.apply(this, arguments);
	return rf.apply(this, a);
}

function verifySupername(id: string): void {
	var mid = id.match(new RegExp("[\\w|.]*[:]?[:]?[\\w]*"));
	if (mid) {
		var found,
			ns,
			nsa,
			ex,
			fd: string,
			midr = id.replace(new RegExp("[:]+"), "."),
			midrspl = midr.split("."),
			cls = midrspl.pop(),
			midrns = midrspl.join(".");
		verified[id] = [midrns, cls];
		for (ns in namespaces) {
			nsa = namespaces[ns];
			if (("." + midrns + ".").startsWith("." + ns + ".")) {
				found = nsa.find((p: any) => {
					fd = path.resolve(p, (midrspl.length > 1 ? "." : "") + midr.substr(ns.length).split(".").join(path.sep));
					if ((ex = ext.find((e) => fsmod.existsSync(fd + "." + e)))) {
						supernames[id] = fd + "." + ex;
						return true;
					}
				});
				if (found) break;
			}
		}
	}
}

function RequireSupername(): Array<object> {
	var a = [].slice.call(arguments);
	if (!verified[a[0]]) verifySupername(a[0]);
	if (maps[a[0]]) a[0] = maps[a[0]];
	if (supernames[a[0]]) a[0] = supernames[a[0]];
	return a;
}

function initRequireSupername(): void {
	rf = (module.constructor as any)._resolveFilename;
	(module.constructor as any)._resolveFilename = resolveFilename;
}

function loadFromJSON(json: string, dir: string): void {
	var nsmap = JSON.parse(fsmod.readFileSync(path.resolve(dir, json)));
	for (var ns in nsmap) nsmap[ns].forEach((e: any, i: number, a: any) => (a[i] = path.resolve(dir, e)));
	setNamespaceMap(nsmap);
}

module.exports.RequireSupername = RequireSupername;
module.exports.initRequireSupername = initRequireSupername;
module.exports.verifySupername = verifySupername;
module.exports.setPathSupername = setPathSupername;
module.exports.setSupername = setSupername;
module.exports.setNamespace = setNamespace;
module.exports.setNamespaceMap = setNamespaceMap;
module.exports.loadFromJSON = loadFromJSON;
module.exports.maps = maps;
module.exports.supernames = supernames;
module.exports.namespaces = namespaces;
module.exports.ext = ext;
