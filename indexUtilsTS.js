"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HTMLCache_1 = require("./utils/html/HTMLCache");
const HTMLParser_1 = require("./utils/html/HTMLParser");
const HTMLDomElement_1 = require("./utils/html/HTMLDomElement");
const RequireSupernameModule = require("./utils/nano/RequireSupername");
const StringLength_1 = require("./utils/nano/StringLength");
const Cookies_1 = require("./utils/web/Cookies");
const HTMLCacheCTOR = HTMLCache_1.HTMLCache;
const HTMLCacheInstance = new HTMLCacheCTOR();
const HTMLParserCTOR = HTMLParser_1.HTMLParser;
const HTMLParserInstance = new HTMLParserCTOR();
const HTMLDomElementCTOR = HTMLDomElement_1.HTMLDomElement;
const HTMLDomElementInstance = new HTMLDomElementCTOR({});
const StringLengthCTOR = StringLength_1.StringLength;
const StringLengthInstance = new StringLengthCTOR("");
const RequireSupernameModuleLoaded = RequireSupernameModule;
const CookiesCTOR = Cookies_1.Cookies;
const CookiesInstance = new CookiesCTOR();
[
    HTMLCacheInstance,
    HTMLParserInstance,
    HTMLDomElementInstance,
    StringLengthInstance,
    RequireSupernameModuleLoaded,
    CookiesInstance
].forEach((e) => console.log(e));
