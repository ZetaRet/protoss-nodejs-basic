declare module "protoss-nodejs-basic/dist/utils/web/Logging.js";
declare module "zetaret.node.utils.web::Logging";

const { appendFileSync } = require("fs");

const Settings = {};

function logText(domain: string, timestamp: number, requestId: string, data: any): string {
	var s = "";
	s += new Date(timestamp).toISOString() + ": " + domain + "\n";
	s += requestId + "\n";
	s += JSON.stringify(data) + "\n";
	return s;
}

function logMD(domain: string, timestamp: number, requestId: string, data: any): string {
	var s = "### ";
	s += domain + " " + new Date(timestamp).toISOString() + "=";
	s += requestId + "=  \n";
	s += "```\n";
	s += JSON.stringify(data) + "\n";
	s += "```\n";
	return s;
}

function log(domain: string, timestamp: number, requestId: string, data: any, format?: string): string {
	var s;
	if (format == "md") s = logMD(domain, timestamp, requestId, data);
	else s = logText(domain, timestamp, requestId, data);
	return s;
}

class Logging implements zetaret.node.utils.web.Logging {
	logStr(domain: string, timestamp: number, requestId: string, data: any, format?: string): string {
		return log(domain, timestamp, requestId, data, format);
	}

	logFile(filename: string, logstring: string): void {
		appendFileSync(filename, logstring);
	}
}

module.exports.settings = Settings;
module.exports.logText = logText;
module.exports.logMD = logMD;
module.exports.log = log;
module.exports.Logging = Logging;
