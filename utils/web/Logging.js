const fs = require("fs");

const settings = {};

function logText(domain, timestamp, requestId, data) {
	var s = "";
	s += new Date(timestamp).toISOString() + ": " + domain + "\n";
	s += requestId + "\n";
	s += JSON.stringify(data) + "\n";
	return s;
}

function logMD(domain, timestamp, requestId, data) {
	var s = "### ";
	s += domain + " " + new Date(timestamp).toISOString() + "=";
	s += requestId + "=  \n";
	s += "```\n";
	s += JSON.stringify(data) + "\n";
	s += "```\n";
	return s;
}

function log(domain, timestamp, requestId, data, format) {
	var s;
	if (format == "md") s = logMD(domain, timestamp, requestId, data);
	else s = logText(domain, timestamp, requestId, data);
	return s;
}

class Logging {
	logStr(domain, timestamp, requestId, data, format) {
		return log(domain, timestamp, requestId, data, format);
	}

	logFile(filename, logstring) {
		fs.appendFileSync(filename, logstring);
	}
}

module.exports.settings = settings;
module.exports.logText = logText;
module.exports.logMD = logMD;
module.exports.log = log;
module.exports.Logging = Logging;
