declare namespace zetaret.node.api {
	export interface ChatConfig {
		chatProfiles?: ChatProfile[];
		profileMap?: WeakMap<ChatUser, ChatProfile>;
		notifyMap?: WeakMap<ChatUser, ChatNotification>;
		blockMap?: WeakMap<ChatUser, ChatBlock>;
		muteMap?: WeakMap<ChatUser, ChatMute>;
	}
	export interface ChatProfile {
		namespace?: string;
		username?: string;
		imageUrl?: string;
		about?: string;
		details?: { [did: string]: string };
	}
	export interface ChatNamespace {
		PUBLIC: "public";
		PRIVATE: "private";
		PROTECTED: "protected";
		GROUP: "group";
		GROUP_PREFIX: "group:id:";
		SELF: "self";
	}
	export interface ChatNotification {
		notifyChat?: boolean;
		notifyStream?: boolean;
		notifyComment?: boolean;
		notifyFiles?: boolean;
		notifyAudio?: boolean;
		notifyVideo?: boolean;
	}
	export interface ChatMute {
		muteChat?: boolean;
		muteSound?: boolean;
		muteVideo?: boolean;
	}
	export interface ChatBlock {
		address?: Array<[string, string]>;
		range?: Array<[string, string, string]>;
		subnet?: Array<[string, number, string]>;
		coookie?: string[];
		rules?: string[];
		blockChat?: boolean;
		blockStream?: boolean;
		blockComment?: boolean;
		blockFiles?: boolean;
		blockAudio?: boolean;
		blockVideo?: boolean;
	}
}