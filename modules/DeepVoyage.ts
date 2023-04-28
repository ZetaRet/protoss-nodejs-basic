/**
 * Author: Zeta Ret
 * Date: 2020 - Today
 * Deep Voyage model as TypeScript Server.
 **/

var Voyage: zetaret.node.modules.VoyageCTOR,
	xpros: zetaret.node.modules.VoyageModule = require((global as zetaret.node.BasicServerGlobal).DeepVoyageRequireModule || "./Voyage.js");
const SERVERID = "zetaret.node.modules::DeepVoyage";

function getExtendedServerProtoSS(ProtoSSChe: zetaret.node.ProtoSSCheCTOR): zetaret.node.modules.DeepVoyageCTOR {
	if (!Voyage) Voyage = xpros.getExtendedServerProtoSS(ProtoSSChe);
	return class DeepVoyage extends Voyage implements zetaret.node.modules.DeepVoyage {
		constructor() {
			super();
			this.configTypeServer();
		}

		configTypeServer(): void {}

		initVoyage(): void {}

		voya(route: object, port?: number): DeepVoyage {
			return this;
		}
	};
}

module.exports.xpros = xpros;
module.exports.SERVERID = SERVERID;
module.exports.resetExtends = (): void => (Voyage = null);
module.exports.getExtends = (): zetaret.node.modules.VoyageCTOR => Voyage;
module.exports.getExtendedServerProtoSS = getExtendedServerProtoSS;
