declare namespace zetaret.node.utils.web {
	export interface CookiesCTOR {
		new(): Cookies
	}
	export interface Cookies {
		headerName: string;
		setHeaderKey: string;
		setObjectHeaderKey: string;
		cookiePath: string;
		setCookiePath: boolean;
		setCookieExpires: boolean;
		cookieExpirePeriod: number;
		cookie: string;
		cookieMap: object;

		parseCookie(cookie: string): object
		parseCookieRequest(request: zetaret.node.Input): string
		readCookieRequest(request: zetaret.node.Input, key: string): string
		readCookie(headers: object, key: string, headerName?: string): string
		writeCookie(headers: object, key: string, value: string, expires?: number, useObject?: boolean, options?: object): Cookies
		deleteCookie(headers: object, key: string, useObject?: boolean): Cookies
		deleteCookieObject(headers: object, key: string): Cookies
		transformCookieObject(headers: object, remove?: boolean): Cookies
	}
	export interface CookiesModule {
		Cookies: CookiesCTOR;
	}
}