declare type HTTPServer = import("http").Server;
declare type IncomingMessage = import("http").IncomingMessage;
declare type OutgoingMessage = import("http").OutgoingMessage;
declare type ClientRequest = import("http").ClientRequest;
declare type ServerResponse = import("http").ServerResponse;
declare type HTTPSServer = import("https").Server;
declare type Http2Server = import("http2").Http2Server;
declare type Https2Server = import("http2").Http2SecureServer;
declare type Http2Request = import("http2").Http2ServerRequest;
declare type Http2Response = import("http2").Http2ServerResponse;
declare type EventEmitter = import("events").EventEmitter;
declare type ChildProcess = import("child_process").ChildProcess;
declare type WorkerThread = import("worker_threads").Worker;
declare type Cluster = import("cluster").Cluster;

declare namespace zetaret.node {
	export type XRequest = ClientRequest | Http2Request;
	export type XResponse = ServerResponse | Http2Response;
	export type RoutedResponseX = XResponse | RoutedResponse;
	export type Input = XRequest | IncomingMessage;
	export type Output = XResponse | OutgoingMessage;
	export type Cross = XResponse | IncomingMessage;
	export type XServer = HTTPSServer | HTTPServer | Https2Server | Http2Server;
	export type Emitter = EventEmitter;
	export type Process = ChildProcess;
	export type Thread = Worker | WorkerThread;
	export type Head = Cluster;
	export type IntBuffer = Int8Array | Int16Array | Int32Array | BigInt64Array;
	export type UintBuffer = Uint8Array | Uint16Array | Uint32Array | BigUint64Array;
	export type FloatBuffer = Float32Array | Float64Array;
	export type NumBuffer = IntBuffer | UintBuffer | FloatBuffer;
}