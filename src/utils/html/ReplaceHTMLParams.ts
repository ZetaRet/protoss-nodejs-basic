declare module "protoss-nodejs-basic/dist/utils/html/ReplaceHTMLParams.js";
declare module "zetaret.node.utils.html::ReplaceHTMLParams";

const settings: any = {
	datakey: "datakey",
	dataclass: "data_class",
	defaultwrap: "span",
};

function replaceParamsRegExp(data: any, prefix: string, suffix: string): RegExp {
	if (!prefix) prefix = "{{";
	if (!suffix) suffix = "}}";
	var regex = new RegExp(prefix + "(" + Object.keys(data).join("|") + ")" + suffix, "g");
	return regex;
}

function wrapText(data: any, key: string, wrap: string): string {
	if (!data[key]) return null;
	let clsstr = ' class="' + settings.dataclass + '" ';
	let datakeystr = settings.datakey + '="' + key + '"';
	return "<" + wrap + clsstr + datakeystr + ">" + data[key] + "</" + wrap + ">";
}

function replaceParams(string: string, data: any, prefix?: string, suffix?: string): string {
	var regex = replaceParamsRegExp(data, prefix, suffix);
	return string.replace(regex, (m, $1) => data[$1] || m);
}

function replaceParamsWrapper(string: string, data: any, wrap?: string, prefix?: string, suffix?: string): string {
	if (!wrap) wrap = settings.defaultwrap;
	var regex = replaceParamsRegExp(data, prefix, suffix);
	return string.replace(regex, (m, $1) => wrapText(data, $1, wrap) || m);
}

function exportServerVar(name: string, json: any, pretty?: boolean): string {
	return "var " + name + "=" + JSON.stringify(json, null, pretty ? 2 : null);
}

module.exports.settings = settings;
module.exports.replaceParamsRegExp = replaceParamsRegExp;
module.exports.wrapText = wrapText;
module.exports.replaceParams = replaceParams;
module.exports.replaceParamsWrapper = replaceParamsWrapper;
module.exports.exportServerVar = exportServerVar;
