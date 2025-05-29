const settings = {
	datakey: "datakey",
	dataclass: "data_class",
	defaultwrap: "span",
};

function replaceParamsRegExp(data, prefix, suffix) {
	if (!prefix) prefix = "{{";
	if (!suffix) suffix = "}}";
	var regex = new RegExp(prefix + "(" + Object.keys(data).join("|") + ")" + suffix, "g");
	return regex;
}

function wrapText(data, key, wrap) {
	if (!data[key]) return null;
	let clsstr = ' class="' + settings.dataclass + '" ';
	let datakeystr = settings.datakey + '="' + key + '"';
	return "<" + wrap + clsstr + datakeystr + ">" + data[key] + "</" + wrap + ">";
}

function replaceParams(string, data, prefix, suffix) {
	var regex = replaceParamsRegExp(data, prefix, suffix);
	return string.replace(regex, (m, $1) => data[$1] || m);
}

function replaceParamsWrapper(string, data, wrap, prefix, suffix) {
	if (!wrap) wrap = settings.defaultwrap;
	var regex = replaceParamsRegExp(data, prefix, suffix);
	return string.replace(regex, (m, $1) => wrapText(data, $1, wrap) || m);
}

function exportServerVar(name, json, pretty) {
	return "var " + name + "=" + JSON.stringify(json, null, pretty ? 2 : null);
}

module.exports.settings = settings;
module.exports.replaceParamsRegExp = replaceParamsRegExp;
module.exports.wrapText = wrapText;
module.exports.replaceParams = replaceParams;
module.exports.replaceParamsWrapper = replaceParamsWrapper;
module.exports.exportServerVar = exportServerVar;
