/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Voyage model of Subserver.
 **/

var Subserver, xpros = require(global.VoyageRequireModule || './Subserver.js');
const SERVERID = 'zetaret.node.modules::Voyage';

function getExtendedServerProtoSS(ProtoSSChe) {
	if (!Subserver) Subserver = xpros.getExtendedServerProtoSS(ProtoSSChe);
	return class Voyage extends Subserver {
		constructor() {
			super();
			var o = this;
			o.initVoyage();
		}

		initVoyage() {}

		voya(route, port) {
			var o = this;
			var k, map = o.routeMap;
			if (port >= 0) o.htserv.close().listen(port);
			for (k in route) map[k] = route[k];
			return o;
		}

	}
}

module.exports.xpros = xpros;
module.exports.SERVERID = SERVERID;
module.exports.resetExtends = () => Subserver = null;
module.exports.getExtends = () => Subserver;
module.exports.getExtendedServerProtoSS = getExtendedServerProtoSS;