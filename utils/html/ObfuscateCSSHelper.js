const settings = {
	prefix: "_",
	suffix: "",
	length: 16,
	cssoutJoin: "\n",
	cssinPrefix: "",
	cssinSuffix: "",
	cssinJoin: "",
};
const ob_classes = {};
const ob_output_css = {};
ob_classes.home = {
	serverexam: { "padding": "4px", "background": "#aaa", "border-radius": "2px", "display": "block" },
	proname: { "padding": "2px", "color": "#333", "font-weight": "bold", "display": "block" },
	prodesc: { padding: "1px", color: "666", display: "block" },
};
function setClassName(id, obj) {
	ob_output_css[id] = obj;
}

function obfuscateCSS(id, rnd) {
	var css = ob_classes[id];
	var cssout = [];
	ob_output_css[id] = {};
	for (var c in css) {
		var cv = css[c];
		var cvstr = [];
		for (var v in cv) {
			var cvv = cv[v];
			cvstr.push(v + ":" + cvv + ";");
		}
		ob_output_css[c] = settings.prefix + rnd(settings.length) + settings.suffix;
		cssout.push(
			"." + ob_output_css[c] + "{" + settings.cssinPrefix + cvstr.join(settings.cssinJoin) + settings.cssinSuffix + "}"
		);
	}
	return cssout.join(settings.cssoutJoin);
}

function applyObCSS(el, hpinst) {
	if (!el.attr.class) el.attr.class = "";
	el.attr.class += ob_output_css[el.attr.obcls];
	if (hpinst.exeDeleteOnSet) delete el.attr.obcls;
}

module.exports.settings = settings;
module.exports.ob_classes = ob_classes;
module.exports.ob_output_css = ob_output_css;
module.exports.setClassName = setClassName;
module.exports.obfuscateCSS = obfuscateCSS;
module.exports.applyObCSS = applyObCSS;
