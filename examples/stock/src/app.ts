const rsn: zetaret.node.utils.nano.RequireSupernameModule = require("./protoss-nodejs-basic/dist/utils/nano/RequireSupername");
rsn.initRequireSupername();
rsn.loadFromJSON("namespacemap.json", __dirname);

const tapp: any = require("./TaskApp");
console.log(tapp);