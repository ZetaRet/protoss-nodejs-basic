/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Cookies - parse, read, write, delete
 **/

class Cookies {
	constructor() {
		var o = this;
		o.headerName = "cookie";
		o.setHeaderKey = "set-cookie";
		o.setObjectHeaderKey = "set-cookie-object";
		o.cookiePath = "/";
		o.setCookiePath = false;
		o.setCookieExpires = false;
		o.cookieExpirePeriod = 24 * 60 * 60 * 1000;
		o.cookie = '';
		o.cookieMap = {};
		o.reserved = ['Created', 'Expires', 'Path', 'Max-Age', 'Domain', 'HttpOnly', 'Secure', 'SameSite'];
	}

	parseCookie(cookie) {
		var o = this;
		o.cookie = cookie;
		var i, kv, p = {},
			sp = cookie.split(';'),
			l = sp.length;
		for (i = 0; i < l; i++) {
			kv = sp[i].split('=');
			p[decodeURIComponent(kv[0].trim())] = kv[1] ? kv[1].trim() : '';
		}
		o.reserved.forEach(r => {
			delete p[r];
			delete p[r.toLowerCase()];
		});
		o.cookieMap = p;
		return p;
	}

	parseCookieRequest(request) {
		var o = this;
		return o.parseCookie(request.headers[o.headerName]);
	}

	readCookieRequest(request, key) {
		var o = this;
		return o.readCookie(request.headers, key);
	}

	readCookie(headers, key, headerName) {
		var o = this;
		var cv = headers[headerName || o.headerName],
			r = RegExp('(^|;' + ' ' + ')' + encodeURIComponent(key) + '=([^;]*)').exec(cv);
		return r ? r[2] : null;
	}

	writeCookie(headers, key, value, expires, useObject, options) {
		var o = this;
		var k, dd, c;
		if (!options) options = {};
		c = key ? key + (value ? "=" + value : '') : '';
		if (o.setCookieExpires && expires) {
			dd = new Date();
			dd.setTime(dd.getTime() + (expires * o.cookieExpirePeriod));
			c += "; Expires=" + dd.toGMTString();
		}
		if (o.setCookiePath) c += "; Path=" + o.cookiePath;
		for (k in options) c += '; ' + k + (options[k] ? '=' + options[k] : '');
		if (useObject) {
			if (!headers[o.setObjectHeaderKey]) headers[o.setObjectHeaderKey] = {};
			if (key) headers[o.setObjectHeaderKey][key] = c;
		} else {
			headers[o.setHeaderKey] = c;
		}
		return o;
	}

	deleteCookie(headers, key, useObject) {
		var o = this;
		o.writeCookie(headers, key, '', -1, useObject);
		return o;
	}

	deleteCookieObject(headers, key) {
		var o = this;
		delete headers[o.setObjectHeaderKey][key];
		return o;
	}

	transformCookieObject(headers, remove) {
		var o = this;
		var s = [],
			co = headers[o.setObjectHeaderKey];
		if (co) {
			headers[o.setHeaderKey] = s.join(';');
		}
		if (remove) delete headers[o.setObjectHeaderKey];
		return o;
	}
}

module.exports.Cookies = Cookies;