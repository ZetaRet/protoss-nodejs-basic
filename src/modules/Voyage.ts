/**
 * Author: Zeta Ret
 * Date: 2019 - Today
 * Voyage model of Subserver.
 **/
declare module "zetaret.node.modules::Voyage";
declare module "protoss-nodejs-basic/dist/modules/Voyage.js";

export { }

var Subserver: zetaret.node.modules.SubserverCTOR,
	xpros: zetaret.node.modules.SubserverModule = require((global as zetaret.node.BasicServerGlobal).VoyageRequireModule || "./Subserver");
const SERVERID = "zetaret.node.modules::Voyage";

function getExtendedServerProtoSS(ProtoSSChe: zetaret.node.ProtoSSCheCTOR): zetaret.node.modules.VoyageCTOR {
	if (!Subserver) Subserver = xpros.getExtendedServerProtoSS(ProtoSSChe);
	return class Voyage extends Subserver implements zetaret.node.modules.Voyage {
		constructor() {
			super();
			var o = this;
			o.initVoyage();
		}

		initVoyage(): void { }

		voya(route: object | any, port?: number): zetaret.node.modules.Voyage {
			var o = this;
			var k,
				map: any = o.routeMap;
			if (port >= 0) o.htserv.close().listen(port);
			for (k in route) map[k] = route[k];
			return o;
		}
	};
}

module.exports.xpros = xpros;
module.exports.SERVERID = SERVERID;
module.exports.resetExtends = (): void => (Subserver = null);
module.exports.getExtends = (): zetaret.node.modules.SubserverCTOR => Subserver;
module.exports.getExtendedServerProtoSS = getExtendedServerProtoSS;
