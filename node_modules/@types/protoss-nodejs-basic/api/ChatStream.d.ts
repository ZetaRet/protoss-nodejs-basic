declare namespace zetaret.node.api {
	export interface StreamMessage {
		type?: string;
		data?: object;
		sid?: string;
	}
	export interface CommentStream extends StreamMessage {
		comment?: ChatMessage;
		commentTarget?: ChatMessage;
		commentMid?: string;
	}
	export interface IconStream extends StreamMessage {
		icon?: string;
	}
	export interface FileStream extends StreamMessage {
		name?: string;
		mime?: string;
		filesize?: number;
	}
	export interface ImageStream extends FileStream {
		imageURL?: string;
		imageBase64?: string;
		imageDBKeyChain?: Array<string>;
	}
	export interface URLStream extends StreamMessage {
		url?: string;
		urlImage?: ImageStream;
	}
	export interface BufferStream extends StreamMessage {
		buffer?: Array<object>;
		bits?: NumBuffer;
		bufferTarget?: StreamMessage;
		bufferSid?: string;
	}
	export interface MediaContainer {
		mime: string[];
		supportAudio?: string[];
		supportVideo?: string[];
		metaData?: object;
	}
	export interface Codec {
		codecId: string;
		codecName?: string;
		containerSupport?: MediaContainer[];
		sideEffect?: string[];

		encode?: (data: BufferStream) => object[];
		decode?: (data: BufferStream) => object[];
	}
	export interface VideoStream extends BufferStream, ImageStream {
		backBuffer?: object[];
		videoResolutionWidth?: number;
		videoResolutionHeight?: number;
		videoResolutionDPI?: number;
		vcodex?: Array<Codec>;
		vdata?: object;
	}
	export interface AudioStream extends BufferStream, FileStream {
		audioChannels?: number;
		audioSampleRate?: number;
		audioSampleSize?: number;
		acodex?: Array<Codec>;
		adata?: object;
	}
	export interface AVStream extends AudioStream, VideoStream { }
}