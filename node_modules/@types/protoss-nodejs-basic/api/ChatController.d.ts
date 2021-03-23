declare namespace zetaret.node.api {
	export interface ChatControllerCTOR {
		new(): ChatController
	}
	export interface ChatController extends APIController {
		messages: { [mid: string]: Array<ChatMessage> };
		autoDelete: WeakMap<object, ChatMessage>;
		db: ChatDB | object;
		install: Function;
		error: Function;
		defaults: Function;

		installDBInterface(method: Function): void
		handleError(method: Function): void
		onDefault(method: Function): void
		addMessage(user: string, msg: string): string
		buildMessage(user: string, message: string, mid?: string): ChatMessage
		appendMessage(mid: string, text: Array<string>, data?: object): ChatMessage
		addClient(server: zetaret.node.modules.Subserver, robj: zetaret.node.RouteObject, routeData: object, request: zetaret.node.XRequest, response: zetaret.node.RoutedResponseX): void
		getClients(server: zetaret.node.modules.Subserver, robj: zetaret.node.RouteObject, routeData: object, request: zetaret.node.XRequest, response: zetaret.node.RoutedResponseX): void
		editClient(server: zetaret.node.modules.Subserver, robj: zetaret.node.RouteObject, routeData: object, request: zetaret.node.XRequest, response: zetaret.node.RoutedResponseX): void
		sendMessage(server: zetaret.node.modules.Subserver, robj: zetaret.node.RouteObject, routeData: object, request: zetaret.node.XRequest, response: zetaret.node.RoutedResponseX): void
		getMessages(server: zetaret.node.modules.Subserver, robj: zetaret.node.RouteObject, routeData: object, request: zetaret.node.XRequest, response: zetaret.node.RoutedResponseX): void
		editMessages(server: zetaret.node.modules.Subserver, robj: zetaret.node.RouteObject, routeData: object, request: zetaret.node.XRequest, response: zetaret.node.RoutedResponseX): void
		addGroup(server: zetaret.node.modules.Subserver, robj: zetaret.node.RouteObject, routeData: object, request: zetaret.node.XRequest, response: zetaret.node.RoutedResponseX): void
		getGroups(server: zetaret.node.modules.Subserver, robj: zetaret.node.RouteObject, routeData: object, request: zetaret.node.XRequest, response: zetaret.node.RoutedResponseX): void
		editGroups(server: zetaret.node.modules.Subserver, robj: zetaret.node.RouteObject, routeData: object, request: zetaret.node.XRequest, response: zetaret.node.RoutedResponseX): void
	}
	export interface NullMessage {
		mid?: string;
	}
	export interface ChatMessage extends NullMessage {
		user?: string;
		message?: string;
		time?: number;
		etime?: number;
		stream?: Array<StreamMessage | string | object>;
		groups?: Array<ChatGroup>;
		sent?: Array<ChatUser>;
	}
	export interface ChatUser {
		uid?: string;
		vars?: object;
	}
	export interface ChatGroup {
		gid?: string;
		users?: Array<string | ChatUser>;
		data?: object;
	}
	export interface ChatDB {
		users: { [uid: string]: ChatUser };
		groups: { [gid: string]: ChatGroup };
		messages: { [uid: string]: Array<string | ChatMessage> };
		weak: WeakMap<ChatUser, Array<ChatMessage>>;
	}
	export interface ChatEvents {
		INSTALL: "install";
		ERROR: "error";
		DEFAULTS: "defaults";
		MESSAGE: "message";
		MESSAGE_UPDATE: "messageUpdate";
		USER: "user";
		USER_UPDATE: "userUpdate";
		GROUP: "group";
		GROUP_UPDATE: "groupUpdate";
		DB_CONNECT: "dbConnect";
		DB_UPDATE: "dbUpdate";
		API_MOUNT: "apiMount";
	}
	export interface ChatControllerStatic {
		EVENTS: ChatEvents;
	}
	export interface ChatControllerModule {
		ChatController: ChatControllerCTOR;
	}
}