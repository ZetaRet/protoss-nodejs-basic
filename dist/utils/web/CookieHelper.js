const cookieModule = require("./Cookies");
const _settings = {
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
	cookieobj.debug = _settings.debug;
	cookieobj.setCookiePath = true;
	cookieobj.setCookieExpires = true;
	cookieobj.parseCookieRequest(request);
	request.cookieObject = cookieobj;
	if (_settings.debug) console.log("\x1b[34m #Middleware Cookie:\x1b[0m", cook, cookieobj.cookieMap);
	if (!cookieobj.cookieMap.session) {
		if (_settings.debug) console.log("WRITE NEW COOKIE");
		cookieobj.writeCookie(
			cookieobj.responseHeaders,
			"session",
			_settings.rndstr(_settings.cookieLength),
			_settings.cookieExpire,
			true
		);
		cookieobj.transformCookieObject(cookieobj.responseHeaders, false, response);
		if (_settings.debug) console.log("RESPONSE COOKIE", cookieobj.responseHeaders["set-cookie"]);
		session = cookieobj.readCookie(cookieobj.responseHeaders["set-cookie-object"], "session", "session");
	} else {
		session = cookieobj.cookieMap.session;
	}
	if (_settings.liveSessionHandler) {
		_settings.liveSessionHandler(session);
	} else {
		if (!LiveSessions[session]) LiveSessions[session] = { time: new Date(), count: 0 };
		LiveSessions[session].count++;
		if (_settings.debug) console.log("Middleware Live Session Count:", session, LiveSessions[session].count);
	}
}
module.exports.settings = _settings;
module.exports.LiveSessions = LiveSessions;
module.exports.bakeCookie = bakeCookie;
