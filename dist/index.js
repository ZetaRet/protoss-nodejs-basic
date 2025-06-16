var mod = require("./ProtoSSChe");
if (!global.DisableAutoStartOfProtoSSChe) mod.StartUp();
for (var k in mod) module.exports[k] = mod[k];
