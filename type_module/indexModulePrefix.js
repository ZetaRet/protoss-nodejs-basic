import * as module from "module";

if (!require) var require = module.createRequire(import.meta.url);
if (!global.require) global.require = require;
if (!global.module) global.module = module;
