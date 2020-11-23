declare namespace zetaret.node.utils.html {
	export interface HTMLCacheCTOR {
		new(): HTMLCache
	}
	export interface HTMLCache {
		structs: { [page: string]: string | Array<string> };
		autoStructPage: boolean;
		pages: { [page: string]: HTMLCachePage };
		despaceChars: { [type: string]: string };
		despaceRules: { [rule: string]: boolean | number };
		watchFiles: boolean;
		watchOptions: object;
		watchListener: Function;
		watchMap: { [path: string]: Watcher };
		events: zetaret.node.utils.Emitter;

		setStruct(id: string, pagesOrStructIds: Array<string>): zetaret.node.utils.html.HTMLCache
		getStruct(id: string): string
		addPage(page: string, parser: zetaret.node.utils.html.HTMLParser, hfile: string, dir: string): HTMLCachePage
		getPage(page: string): string
		exePage(page: string, cfg?: HTMLCacheCFG): HTMLCachePage
		renderContent(page: string): string
		resetBinders(page: string): void
		recache(page: string): void
		setPages(pages: { [page: string]: HTMLCachePageEnum }, HTMLParser: zetaret.node.utils.html.HTMLParser, watchers?: object, log?: boolean): void
		swapCSS(page: string, handler?: Function): void
		swapJS(page: string, handler?: Function): void
		defaultRenderTemplate(hcache: zetaret.node.utils.html.HTMLCache, page: string, pdata: HTMLCachePage, hpinst: zetaret.node.utils.html.HTMLParser, cfg: object): void
		watch(listener: Function, options?: object): void
		getWatchers(listener?: Function, interval?: number, debug?: boolean, recacheOnChange?: boolean): object
		watchFile(pr: string, page: string, type: string): void
		resetWatchers(): void
		despace(v: string, type?: string): string
	}
	export interface HTMLCachePage {
		parser: HTMLParser;
		hfile: string;
		dir: string;
		hfileloc: string;
		binders: object;
		execfg: HTMLCacheCFG;
		content: string;
	}
	export interface HTMLCacheCFG {
		render?: boolean;
		nowhite?: boolean;
		pretty?: boolean;
		nocontent?: boolean;
		swapjs?: boolean;
		jsh?: Function;
		despacejs?: boolean;
		swapcss?: boolean;
		cssh?: Function;
		despacecss?: boolean;
	}
	export interface HTMLCachePageEnum {
		id?: string;
		useAutomaton?: boolean;
		debug?: boolean;
		closeTags?: Array<string>;
		cfgParser?: boolean;
		hfile?: string;
		dir?: string;
		exe?: HTMLCacheCFG;
	}
	export interface HTMLCacheEvents {
		SET_STRUCT: "setStruct";
		ADD_PAGE: "addPage";
		EXE_PAGE: "exePage";
		RENDER_CONTENT: "renderContent";
		RECACHE: "recache";
		SWAP_JS: "swapJs";
		SWAP_CSS: "swapCss";
		WATCH: "watch";
		ON_WATCH: "onWatch";
		WATCH_FILE: "watchFile";
		RESET_WATCHERS: "resetWatchers";
	}
	export interface HTMLCacheModule {
		EVENTS: HTMLCacheEvents;
		HTMLCache: HTMLCacheCTOR;
	}
}