var ws, wso = {
		url: 'ws://localhost:8080'
	},
	cd = {
		uid: '',
		username: '',
		crid: 1
	},
	cmd = {};

function sendWS(cmd, options) {
	var k, msg = {
		command: cmd,
		crid: cd.crid++,
		date: Date.now()
	};
	if (cd.uid) msg.uid = cd.uid;
	if (cd.username) msg.username = cd.username;
	if (options) {
		for (k in options) msg[k] = options[k];
	}
	ws.send(JSON.stringify(msg));
}

function initSocket() {
	ws = new WebSocket(wso.url);

	ws.onopen = function(event) {
		console.log(event);
	};

	ws.onclose = function(event) {
		console.log(event);
	};

	ws.onmessage = function(event) {
		console.log(event);

		var msg = JSON.parse(event.data);
		console.log(msg);

		if (cmd[msg.command]) cmd[msg.command](msg);
	};
}

function initCommands() {
	cmd.addclient = function(msg) {
		if (msg.uid) {
			cd.uid = msg.uid;
			cd.username = msg.username;
		}
	};
	cmd.getclients = function(msg) {
		var cel = document.getElementById(msg.group ? 'usergroups' : 'clientlist');
		if (msg.users && msg.users.length > 0) {
			cel.innerHTML = '';
			msg.users.forEach(u => {
				var opt = document.createElement('option');
				opt.setAttribute('value', u);
				opt.innerText = u;
				cel.appendChild(opt);
			});
		} else {
			cel.innerHTML = '<option value="">[None]</option>';
		}
	};
	cmd.getgroups = function(msg) {
		var gel = document.getElementById('groups');
		if (msg.groups && msg.groups.length > 0) {
			gel.innerHTML = '';
			msg.groups.forEach(g => {
				var opt = document.createElement('option');
				opt.setAttribute('value', g);
				opt.innerText = g;
				gel.appendChild(opt);
			});
		} else {
			gel.innerHTML = '<option value="">[None]</option>';
		}
	};
	cmd.getmessages = function(msg) {
		var msgsel = document.getElementById('message-history');
		msgsel.innerHTML = '';
		if (msg.messages) {
			msg.messages.forEach(m => {
				var mel = document.createElement('div');
				mel.innerText = formatMessage(m);
				msgsel.appendChild(mel);
			});
		}
	};
	cmd.addmessage = function(msg) {
		var msgsel = document.getElementById('message-history');
		if (msg.message) {
			var mel = document.createElement('div');
			mel.innerText = formatMessage(msg.message);
			msgsel.appendChild(mel);
		}
	};
}

function formatMessage(msg) {
	return msg.message + ' [Sender: ' + msg.user + ', Group: ' + (msg.group || '') + ']';
}

function init() {
	initSocket();
	initCommands();
}

function addclientbtn() {
	var uel = document.getElementById('username'),
		v = uel.value;
	if (v) {
		sendWS('addclient', {
			username: v
		});
	}
}

function getclientsbtn() {
	sendWS('getclients');
}

function addgroupbtn() {
	var gel = document.getElementById('group'),
		v = gel.value;
	if (v) {
		sendWS('addgroup', {
			username: cd.username,
			uid: cd.uid,
			group: v
		});
	}
}

function getgroupsbtn() {
	sendWS('getgroups');
}

function getusergroupsbtn() {
	var gel = document.getElementById('groups'),
		v = gel.value;
	if (v) {
		sendWS('getclients', {
			group: v
		});
	}
}

function sendmessagebtn() {
	var msg = {},
		msgel = document.getElementById("message"),
		tel = document.getElementById('clientlist'),
		target = tel.value,
		gel = document.getElementById('groups'),
		group = gel.value,
		isgroup = document.getElementById('messageoptions').value === 'group';

	msg.message = msgel.value;
	if (isgroup) msg.group = group;
	else msg.target = target;
	if (msg.message && (msg.target || msg.group)) {
		sendWS('sendmessage', msg);
	}
	msgel.value = "";
}

function getmessagesbtn() {
	var msg = {},
		tel = document.getElementById('clientlist'),
		target = tel.value,
		gel = document.getElementById('groups'),
		group = gel.value,
		isgroup = document.getElementById('messageoptions').value === 'group';

	if (isgroup) msg.group = group;
	else msg.target = target;
	if (msg.target || msg.group) {
		sendWS('getmessages', msg);
	}
}