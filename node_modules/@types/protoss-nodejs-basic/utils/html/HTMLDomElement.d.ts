declare namespace zetaret.node.utils.html {
	export interface HTMLDomElementCTOR {
		new(dom: HTMLParserDomObject): HTMLDomElement
	}
	export interface HTMLDomElement extends Array<HTMLDomElement | HTMLParserDomObject> {
		dom: HTMLParserDomObject;
		type: string;
		data: object;
		events: zetaret.node.utils.Emitter;
		id: string;
		classList: Array<string>;

		convert(classes?: object, sub?: boolean, subc?: boolean): zetaret.node.utils.html.HTMLDomElement
	}
}