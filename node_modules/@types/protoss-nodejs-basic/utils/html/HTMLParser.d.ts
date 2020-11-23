declare namespace zetaret.node.utils.html {
	export interface HTMLParserCTOR {
		new(): HTMLParser
	}
	export interface HTMLParser {
		id: string;
		dom: HTMLParserDomObject;
		str: string;
		file: string;
		dir: string | boolean;
		prettyPrefix: string;
		prettyNewLine: string;
		attrAsObject: boolean;
		debug: boolean;
		debugBuffer: Array<object>;
		parseCursor: number;
		useAutomaton: boolean;
		autoOrder: boolean;
		automata: { [tag: string]: Array<string | boolean> };
		closeTags: Array<string>;
		watchFiles: boolean;
		watchOptions: object;
		watchListener: Function;
		watcher: zetaret.node.utils.Watcher;
		whiteList: { [key: string]: boolean | number };
		blackList: { [key: string]: boolean | number };
		queryPrefix: { [prefix: string]: string };

		getFilePath(file: string, dir?: string | boolean): string
		loadFromFile(file: string, dir?: string | boolean): string
		parseFromFile(file: string, dir?: string | boolean): string
		parseFromString(str: string): zetaret.node.utils.html.HTMLParser
		watchFile(fp?: string, listener?: Function, options?: object): void
		getDomJSON(): string
		domToString(dom?: HTMLParserDomObject, nowhite?: boolean, pretty?: boolean, prefix?: Array<string>): string
		search(type: string | Array<object>, attr: string | Function, value: string | object, dom?: object): Array<HTMLParserDomObject>
		query(selector: string, methods?: object, classes?: boolean | object): Array<object>
		querySafe(selector: string, methods?: object, classes?: boolean | object, debug?: Function): Array<object>
		debugCase(text: string, error?: Error | Function, data?: object): void
		cursorToCR(cursor: number): string
		process(s?: string, d?: HTMLParserDomObject): object
		getClosedTag(s: string, el: HTMLParserDomObject): object
		getTag(s: string): object
		getAutoTag(tag: object): object
		getElement(type: string, closed?: boolean, attr?: Array<object> | object): object
		attributes(s: string, el: HTMLParserDomObject): string
		attrToObject(aa: Array<object>, el: object, cursor?: number): zetaret.node.utils.html.HTMLParser
	}
	export interface HTMLParserDomObject {
		type?: string;
		elements?: Array<HTMLParserDomObject>;
		norender?: boolean;
		attr?: Array<string> | object;
		auto?: string;
		closed?: boolean;
		ending?: string;
	}
	export interface HTMLParserModule {
		HTMLParser: HTMLParserCTOR;
		HTMLDomElement: HTMLDomElementCTOR;
	}
}