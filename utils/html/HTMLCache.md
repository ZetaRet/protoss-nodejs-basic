> __Author: Zeta Ret__  
> __HTML page cache utility__  
# Swap JS/CSS from filepath into tag as relative, cache as page content  
> *Requires: fs, path, events*  
> *Version: 1.8.0*  
> *Date: 2019 - Today*  

__required*__

## zetaret.node.utils.html::HTMLCache  

### *Properties*  

#  
__structs__ Object  
default {},   

#  
__autoStructPage__ Boolean  
default true,   

#  
__pages__ Object  
default {},   

#  
__despaceChars__ Object  
default {},   

#  
__despaceRules__ Object  
default {},   

#  
__watchFiles__ Boolean  
default false,   

#  
__watchOptions__ Object  
default null,   

#  
__watchListener__ Function  
default null,   

#  
__watchMap__ Object  
default {},   

#  
__events__ events.EventEmitter  
default new,   


##  
### *Methods*  

##  
__HTMLCache() : *void*__  
create pages by id and cache content from HTMLParser, use in server response or save as file  
> *return __void__*  
```
var htmlparser = require('./path/to/utils/html/HTMLParser.js'),  
	htmlcache = require('./path/to/utils/html/HTMLCache.js'),  
	hpinst = new htmlparser.HTMLParser(),  
	htcache = new htmlcache.HTMLCache();  
var hfile = './path/to/html/apitest.html';  
hpinst.parseFromFile(hfile, __dirname);  
htcache.addPage('home', hpinst, hfile, __dirname);  
htcache.exePage('home', {  
	swapjs: true,  
	swapcss: true,  
	despacejs: true,  
	despacecss: true  
});  
app.instance.server.addPathListener('', function(server, robj, routeData, request, response) {  
	response.__headers['content-type'] = 'text/html';  
	response.__data.push(htcache.getPage('home'));  
});  
```
##  
__setStruct(*String* id, *Array* pagesOrStructIds) : *zetaret.node.utils.html::HTMLCache*__  
  
- __id*__ - __*String*__,   
- __pagesOrStructIds*__ - __*Array*__,   
> *return __zetaret.node.utils.html::HTMLCache__*  

##  
__getStruct(*String* id) : *String*__  
  
- __id*__ - __*String*__,   
> *return __String__*  

##  
__addPage(*String* page, *zetaret.node.utils.html.HTMLParser* parser, *String* hfile, *String* dir) : *Object*__  
create new page by id in cache  
- __page*__ - __*String*__,   
- __parser*__ - __*zetaret.node.utils.html.HTMLParser*__, HTML template already converted to object  
- __hfile*__ - __*String*__, html file location on drive and relative to JS/CSS paths inside, usually the same as HTMLParser  
- __dir*__ - __*String*__, base directory to resolve html file, usually the same as HTMLParser  
> *return __Object__, cache object `{parser, hfile, dir, hfileloc, content}`*  

##  
__getPage(*String* page) : *String*__  
  
- __page*__ - __*String*__,   
> *return __String__*  

##  
__exePage(*String* page, *Object* cfg) : *Object*__  
execute page script per configuration  
- __page*__ - __*String*__,   
- cfg - __*Object*__, swap/handle/despace elements, execute `HTMLParser.domToString` {swapjs, jsh, despacejs, swapcss, cssh, despacecss, nowhite, pretty}  
> *return __Object__*  

##  
__renderContent(*String* page) : *String*__  
  
- __page*__ - __*String*__,   
> *return __String__*  

##  
__resetBinders(*String* page) : *void*__  
  
- __page*__ - __*String*__,   
> *return __void__*  

##  
__recache(*String* page) : *void*__  
  
- __page*__ - __*String*__,   
> *return __void__*  

##  
__setPages(*Object* pages, *zetaret.node.utils.html.HTMLParser* HTMLParser, *Object* watchers, *Boolean* log) : *void*__  
  
- __pages*__ - __*Object*__,   
- __HTMLParser*__ - __*zetaret.node.utils.html.HTMLParser*__,   
- watchers - __*Object*__,   
- log - __*Boolean*__,   
> *return __void__*  

##  
__swapCSS(*String* page, *Function* handler) : *void*__  
  
- __page*__ - __*String*__,   
- handler - __*Function*__,   
> *return __void__*  

##  
__swapJS(*String* page, *Function* handler) : *void*__  
  
- __page*__ - __*String*__,   
- handler - __*Function*__,   
> *return __void__*  

##  
__defaultRenderTemplate(*zetaret.node.utils.html.HTMLCache* hcache, *String* page, *Object* pdata, *zetaret.node.utils.html.HTMLParser* hpinst, *Object* cfg) : *void*__  
  
- __hcache*__ - __*zetaret.node.utils.html.HTMLCache*__,   
- __page*__ - __*String*__,   
- __pdata*__ - __*Object*__,   
- __hpinst*__ - __*zetaret.node.utils.html.HTMLParser*__,   
- __cfg*__ - __*Object*__,   
> *return __void__*  

##  
__watch(*Function* listener, *Object* options) : *void*__  
  
- __listener*__ - __*Function*__,   
- options - __*Object*__,   
> *return __void__*  

##  
__getWatchers(*Function* listener, *Number* interval, *Boolean* debug, *Boolean* recacheOnChange) : *Object*__  
  
- listener - __*Function*__,   
- interval - __*Number*__,   
- debug - __*Boolean*__,   
- recacheOnChange - __*Boolean*__,   
> *return __Object__*  

##  
__watchFile(*String* pr, *String* page, *String* type) : *void*__  
  
- __pr*__ - __*String*__,   
- __page*__ - __*String*__,   
- __type*__ - __*String*__,   
> *return __void__*  

##  
__resetWatchers() : *void*__  
  
> *return __void__*  

##  
__despace(*String* v, *String* type) : *String*__  
  
- __v*__ - __*String*__,   
- type - __*String*__,   
> *return __String__*  

##  
### *Static Properties*  

#  
__EVENTS__ Object  
default const,   

