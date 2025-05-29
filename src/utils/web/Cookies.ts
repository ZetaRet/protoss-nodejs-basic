/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Cookies - parse, read, write, delete
 **/

export class Cookies implements zetaret.node.utils.web.Cookies {
	public headerName: string;
	public setHeaderKey: string;
	public setObjectHeaderKey: string;
	public cookiePath: string;
	public setCookiePath: boolean;
	public setCookieExpires: boolean;
	public cookieExpirePeriod: number;
	public cookie: string;
	public cookieMap: object;
	public reserved: string[];
	public responseHeaders: object;
	public debug: boolean;

	constructor() {
		var o = this;
		o.headerName = "cookie";
		o.setHeaderKey = "set-cookie";
		o.setObjectHeaderKey = "set-cookie-object";
		o.cookiePath = "/";
		o.setCookiePath = false;
		o.setCookieExpires = false;
		o.cookieExpirePeriod = 24 * 60 * 60 * 1000;
		o.cookie = "";
		o.cookieMap = {};
		o.reserved = ["Created", "Expires", "Path", "Max-Age", "Domain", "HttpOnly", "Secure", "SameSite"];
		o.responseHeaders = {};
		o.debug = false;
	}

	parseCookie(cookie: string) {
		var o = this;
		o.cookie = cookie || "";
		var i: number,
			kv: string[],
			p: any = {},
			sp: string[] = o.cookie.split(";"),
			l: number = sp.length;
		for (i = 0; i < l; i++) {
			kv = sp[i].split("=");
			p[decodeURIComponent(kv[0].trim())] = kv[1] ? kv[1].trim() : "";
		}
		o.reserved.forEach((r) => {
			delete p[r];
			delete p[r.toLowerCase()];
		});
		o.cookieMap = p;
		return p;
	}

	parseCookieRequest(request: zetaret.node.Input): string {
		var o = this;
		return o.parseCookie((request as any).headers[o.headerName]);
	}

	readCookieRequest(request: zetaret.node.Input, key: string): string {
		var o = this;
		return o.readCookie((request as any).headers, key);
	}

	readCookie(headers: any, key: string, headerName?: string): string {
		var o = this;
		var cv = headers[headerName || o.headerName],
			r = RegExp("(^|;" + " " + ")" + encodeURIComponent(key) + "=([^;]*)").exec(cv);
		return r ? r[2] : null;
	}

	writeCookie(headers: any, key: string, value: string, expires?: number, useObject?: boolean, options?: any): Cookies {
		var o = this;
		var k, dd: Date, c;
		if (!options) options = {};
		c = key ? key + (value ? "=" + value : "") : "";
		if (o.setCookieExpires && expires) {
			dd = new Date();
			dd.setTime(dd.getTime() + expires * o.cookieExpirePeriod);
			c += "; Expires=" + dd.toUTCString();
		}
		if (o.setCookiePath) c += "; Path=" + o.cookiePath;
		for (k in options) c += "; " + k + (options[k] ? "=" + options[k] : "");
		if (useObject) {
			if (o.debug) console.log("#writeCookie obj", headers, o.setObjectHeaderKey, key, c, value, expires);
			if (!headers[o.setObjectHeaderKey]) headers[o.setObjectHeaderKey] = {};
			if (key) headers[o.setObjectHeaderKey][key] = c;
		} else {
			if (o.debug) console.log("#writeCookie key", headers, o.setHeaderKey, key, c, value, expires);
			headers[o.setHeaderKey] = c;
		}
		return o;
	}

	deleteCookie(headers: object, key: string, useObject?: boolean): Cookies {
		var o = this;
		o.writeCookie(headers, key, "", -1, useObject);
		return o;
	}

	deleteCookieObject(headers: any, key: string): Cookies {
		var o = this;
		delete headers[o.setObjectHeaderKey][key];
		return o;
	}

	transformCookieObject(headers: any, remove?: boolean, response?: zetaret.node.Output) {
		var o = this;
		var s: string[] = [],
			co = headers[o.setObjectHeaderKey];
		if (co) {
			if (o.debug) console.log("transform cookie object", s, co);
			s = Object.values(co);
			headers[o.setHeaderKey] = s.join(";");
			if (response) response.setHeader(o.setHeaderKey, headers[o.setHeaderKey]);
		}
		if (remove) delete headers[o.setObjectHeaderKey];
		return o;
	}
}
