> __Author: Zeta Ret__  
> __use ProtoSS super qualified names in `require` and `import`__  
# swap `Module._resolveFilename` with supername validator, add alias path maps, supernames and namespace folders  
> *Version: 1.0.2*  
> *Date: 2019 - Today*  

__required*__

## zetaret.node.utils.nano::RequireSupername  

### *Properties*  

#  
__maps__ Object  
default {},   

#  
__supernames__ Object  
default {},   

#  
__namespaces__ Object  
default {},   

#  
__ext__ Array  
default ['js'],   


##  
### *Methods*  

##  
__RequireSupername() : *Array*__  
require the module first, initialize, and set map from JSON or file  
> *return __Array__*  
```
var rsn = require('./path/to/utils/nano/RequireSupername.js');  
rsn.initRequireSupername();  
rsn.setNamespaceMap({  
	'zetaret.node.utils': [path.resolve(__dirname, './../../utils/')]  
});  
var htmlparser = require('zetaret.node.utils.html::HTMLParser'),  
	htmlcache = require('zetaret.node.utils.html::HTMLCache'),  
```
##  
__initRequireSupername() : *void*__  
  
> *return __void__*  

##  
__verifySupername(*String* id) : *void*__  
execute RegExp supername match validation, check namespace folders and file existence per registered extension  
- __id*__ - __*String*__,   
> *return __void__*  

##  
__setPathSupername(*String* supername, *Array* paths) : *void*__  
  
- __supername*__ - __*String*__,   
- __paths*__ - __*Array*__,   
> *return __void__*  

##  
__setSupername(*String* supername, *String* path) : *void*__  
  
- __supername*__ - __*String*__,   
- __path*__ - __*String*__,   
> *return __void__*  

##  
__setNamespace(*String* ns, *Array* paths) : *void*__  
  
- __ns*__ - __*String*__,   
- __paths*__ - __*Array*__,   
> *return __void__*  

##  
__setNamespaceMap(*Object* nsmap) : *void*__  
map many paths to a single namespace from an object  
- __nsmap*__ - __*Object*__, {'ns':['./../path/to/ns/','/absolute/path/to/folder2ofns/']}  
> *return __void__*  
```
var nsmap = JSON.parse(fs.readFileSync('namespacemap.json'));  
for (var ns in nsmap) nsmap[ns].forEach((e, i, a) => a[i] = path.resolve(__dirname, e));  
rsn.setNamespaceMap(nsmap);  
```
##  
__loadFromJSON(*String* json, *String* dir) : *void*__  
  
- __json*__ - __*String*__,   
- __dir*__ - __*String*__,   
> *return __void__*  

---  
### MarkDown - JsonDox 1.02 - Zeta Ret Zetadmin Documentation Generator