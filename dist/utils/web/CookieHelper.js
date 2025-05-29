const cookieModule = require("./Cookies");

const settings = {
	debug: false,
	liveSessionHandler: null,
	cookieLength: 32,
	cookieExpire: 30,
	rndstr: null,
};
const LiveSessions = {};

function bakeCookie(request, response) {
	let cook = request.headers.cookie;
	let session = null;
	let cookieobj = new cookieModule.Cookies();
	cookieobj.debug = settings.debug;
	cookieobj.setCookiePath = true;
	cookieobj.setCookieExpires = true;
	cookieobj.parseCookieRequest(request);
	request.cookieObject = cookieobj;
	if (settings.debug) console.log("\x1b[34m #Middleware Cookie:\x1b[0m", cook, cookieobj.cookieMap);
	if (!cookieobj.cookieMap.session) {
		if (settings.debug) console.log("WRITE NEW COOKIE");
		cookieobj.writeCookie(
			cookieobj.responseHeaders,
			"session",
			settings.rndstr(settings.cookieLength),
			settings.cookieExpire,
			true
		);
		cookieobj.transformCookieObject(cookieobj.responseHeaders, false, response);
		if (settings.debug) console.log("RESPONSE COOKIE", cookieobj.responseHeaders["set-cookie"]);
		session = cookieobj.readCookie(cookieobj.responseHeaders["set-cookie-object"], "session", "session");
	} else {
		session = cookieobj.cookieMap.session;
	}
	if (settings.liveSessionHandler) {
		settings.liveSessionHandler(session);
	} else {
		if (!LiveSessions[session]) LiveSessions[session] = { time: new Date(), count: 0 };
		LiveSessions[session].count++;
		if (settings.debug) console.log("Middleware Live Session Count:", session, LiveSessions[session].count);
	}
}

module.exports.settings = settings;
module.exports.LiveSessions = LiveSessions;
module.exports.bakeCookie = bakeCookie;
