function replaceParams(string, data, prefix, suffix) {
	if (!prefix) prefix = "{{";
	if (!suffix) suffix = "}}";
	var regex = new RegExp(prefix + "(" + Object.keys(data).join("|") + ")" + suffix, "g");
	return string.replace(regex, (m, $1) => data[$1] || m);
}

function exportServerVar(name, json, pretty) {
	return "var " + name + "=" + JSON.stringify(json, null, pretty ? 2 : null);
}

module.exports.replaceParams = replaceParams;
module.exports.exportServerVar = exportServerVar;
