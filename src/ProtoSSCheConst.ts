const ERRORS = {
	UNCAUGHT_EXCEPTION: "uncaughtException",
	UNCAUGHT_EXCEPTION_MONITOR: "uncaughtExceptionMonitor",
	UNHANDLED_REJECTION: "unhandledRejection",
	UNHANDLED_PROMISE_REJECTION_WARNING: "UnhandledPromiseRejectionWarning",
	WARNING: "warning",
	ABORT: "abort",
};

const PROCESS_EVENTS = {
	EXIT: "exit",
	BEFORE_EXIT: "beforeExit",
	DISCONNECT: "disconnect",
	MESSAGE: "message",
	WORKER_MESSAGE: "workerMessage",
};

const SIGNALS = {
	SIGINT: "SIGINT",
	SIGTERM: "SIGTERM",
	SIGQUIT: "SIGQUIT",
	SIGKILL: "SIGKILL",
	SIGTSTP: "SIGTSTP",
};

const EVENTS = {
	DATA: "data",
	ERROR: "error",
	END: "end",
};

module.exports.ERRORS = ERRORS;
module.exports.PROCESS_EVENTS = PROCESS_EVENTS;
module.exports.SIGNALS = SIGNALS;
module.exports.EVENTS = EVENTS;
