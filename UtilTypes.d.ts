declare type UtilsEventEmitter = import("events").EventEmitter;
declare type UtilsFSWatcher = import("fs").FSWatcher;

declare namespace zetaret.node.utils {
	export type Emitter = UtilsEventEmitter;
	export type Watcher = UtilsFSWatcher;
}