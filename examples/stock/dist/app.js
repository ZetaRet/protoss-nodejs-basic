const rsn = require("./../../../dist/utils/nano/RequireSupername");
rsn.initRequireSupername();
rsn.loadFromJSON("namespacemap.json", __dirname);
const tapp = require("./TaskApp");
console.log(tapp);
