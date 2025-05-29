import { HTMLCache } from "protoss-nodejs-basic/dist/utils/html/HTMLCache.js";
import { HTMLParser, HTMLDomElement } from "protoss-nodejs-basic/dist/utils/html/HTMLParser.js";
import * as RequireSupernameModule from "protoss-nodejs-basic/dist/utils/nano/RequireSupername.js";
import { StringLength } from "./utils/nano/StringLength";
import { Cookies } from "./utils/web/Cookies";

const HTMLCacheCTOR: zetaret.node.utils.html.HTMLCacheCTOR = HTMLCache as any;
const HTMLCacheInstance: zetaret.node.utils.html.HTMLCache = new HTMLCacheCTOR();
const HTMLParserCTOR: zetaret.node.utils.html.HTMLParserCTOR = HTMLParser as any;
const HTMLParserInstance: zetaret.node.utils.html.HTMLParser = new HTMLParserCTOR();
const HTMLDomElementCTOR: zetaret.node.utils.html.HTMLDomElementCTOR = HTMLDomElement as any;
const HTMLDomElementInstance: zetaret.node.utils.html.HTMLDomElement = new HTMLDomElementCTOR({});
const StringLengthCTOR: zetaret.node.utils.nano.StringLengthCTOR = StringLength as any;
const StringLengthInstance: zetaret.node.utils.nano.StringLength = new StringLengthCTOR("");
const RequireSupernameModuleLoaded: zetaret.node.utils.nano.RequireSupernameModule = RequireSupernameModule as any;
const CookiesCTOR: zetaret.node.utils.web.CookiesCTOR = Cookies as any;
const CookiesInstance: zetaret.node.utils.web.Cookies = new CookiesCTOR();

[
	HTMLCacheInstance,
	HTMLParserInstance,
	HTMLDomElementInstance,
	StringLengthInstance,
	RequireSupernameModuleLoaded,
	CookiesInstance
].forEach((e: any) => console.log(e));