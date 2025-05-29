var mod = require("./ProtoSSChe.js");
if (!global.DisableAutoStartOfProtoSSChe) mod.StartUp();
for (var k in mod) module.exports[k] = mod[k];
