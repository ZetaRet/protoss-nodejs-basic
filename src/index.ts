declare module "zetaret.node::index";
declare module "protoss-nodejs-basic/dist/index.js";

var mod = require("./ProtoSSChe");
if (!(global as zetaret.node.BasicServerGlobal).DisableAutoStartOfProtoSSChe) mod.StartUp();
for (var k in mod) module.exports[k] = mod[k];
