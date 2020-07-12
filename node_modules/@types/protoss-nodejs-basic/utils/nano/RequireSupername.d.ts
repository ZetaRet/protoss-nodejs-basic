declare namespace zetaret.node.utils.nano {
	export interface RequireSupernameModule {
		maps: object;
		supernames: object;
		namespaces: object;
		ext: Array<string>;

		RequireSupername(): Array<object>
		initRequireSupername(): void
		verifySupername(id: string): void
		setPathSupername(supername: string, paths: Array<string>): void
		setSupername(supername: string, path: string): void
		setNamespace(ns: string, paths: Array<Array<string>>): void
		setNamespaceMap(nsmap: object): void
		loadFromJSON(json: string, dir: string): void
	}
}