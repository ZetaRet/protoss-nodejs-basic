/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Require by Supername
 **/

var fs = require('fs'),
	path = require('path');

var rf, maps = {},
	supernames = {},
	namespaces = {},
	verified = {},
	ext = ['js'];

function setPathSupername(supername, paths) {
	paths.forEach(p => maps[p] = supername);
}

function setSupername(supername, path) {
	supernames[supername] = path;
}

function setNamespace(ns, paths) {
	namespaces[ns] = (namespaces[ns] || []).concat(paths);
}

function setNamespaceMap(nsmap) {
	for (var ns in nsmap) setNamespace(ns, nsmap[ns]);
}

function resolveFilename() {
	var a = RequireSupername.apply(this, arguments);
	return rf.apply(this, a);
}

function verifySupername(id) {
	var mid = id.match(new RegExp('[\\w|.]*[:]?[:]?[\\w]*'));
	if (mid) {
		var found, ns, nsa, ex, fd, midr = id.replace(new RegExp('[:]+'), '.'),
			midrspl = midr.split('.'),
			cls = midrspl.pop(),
			midrns = midrspl.join('.');
		verified[id] = [midrns, cls];
		for (ns in namespaces) {
			nsa = namespaces[ns];
			if (('.' + midrns + '.').startsWith('.' + ns + '.')) {
				found = nsa.find(p => {
					fd = path.resolve(p, (midrspl.length > 1 ? '.' : '') + midr.substr(ns.length).split('.').join(path.sep));
					if (ex = ext.find(e => fs.existsSync(fd + '.' + e))) {
						supernames[id] = fd + '.' + ex;
						return true;
					}
				});
				if (found) break;
			}
		}
	}
}

function RequireSupername() {
	var a = [].slice.call(arguments);
	if (!verified[a[0]]) verifySupername(a[0]);
	if (maps[a[0]]) a[0] = maps[a[0]];
	if (supernames[a[0]]) a[0] = supernames[a[0]];
	return a;
}

function initRequireSupername() {
	rf = module.constructor._resolveFilename;
	module.constructor._resolveFilename = resolveFilename;
}

function loadFromJSON(json, dir) {
	var nsmap = JSON.parse(fs.readFileSync(path.resolve(dir, json)));
	for (var ns in nsmap) nsmap[ns].forEach((e, i, a) => a[i] = path.resolve(dir, e));
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