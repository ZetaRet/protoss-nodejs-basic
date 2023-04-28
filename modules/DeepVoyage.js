var Voyage, xpros = require(global.DeepVoyageRequireModule || "./Voyage.js");
const SERVERID = "zetaret.node.modules::DeepVoyage";
function getExtendedServerProtoSS(ProtoSSChe) {
    if (!Voyage)
        Voyage = xpros.getExtendedServerProtoSS(ProtoSSChe);
    return class DeepVoyage extends Voyage {
        constructor() {
            super();
            this.configTypeServer();
        }
        configTypeServer() { }
        initVoyage() { }
        voya(route, port) {
            return this;
        }
    };
}
module.exports.xpros = xpros;
module.exports.SERVERID = SERVERID;
module.exports.resetExtends = () => (Voyage = null);
module.exports.getExtends = () => Voyage;
module.exports.getExtendedServerProtoSS = getExtendedServerProtoSS;
