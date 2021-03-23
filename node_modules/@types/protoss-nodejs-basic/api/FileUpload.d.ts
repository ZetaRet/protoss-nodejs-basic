declare namespace zetaret.node.api {
	export interface FileUploadCTOR {
		new(): FileUpload
	}
	export interface FileUpload {
		name: string;
		data: string[] | Array<IntBuffer | UintBuffer>;
		size: number;
		encoding: string;
		filePath: string;
		mimetype: string;
		md5: string;
		chunks: number;
		maxChunks: number;
		uploadStart: Date | number;
		uploadEnd: Date | number;
		aborted: boolean;
		validation: boolean;
		multipart: boolean;
		uploadId: string;
		appender: FileUpload;
		strategy: string;
	}
	export interface UploadStrategy {
		NONE: "none";
		VALUE: "value";
		ARRAY: "array";
		OBJECT: "object";
		PROJECTILE: "projectile";
	}
}