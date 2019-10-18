> __Author: Zeta Ret__  
> __HTML page cache utility__  
# Swap JS/CSS from filepath into tag as relative, cache as page content  
> *Requires: fs, path*  
> *Version: 1.1.5*  
> *Date: 2019 - Today*  

__required*__

## zetaret.node.utils.html::HTMLCache  

### *Properties*  

#  
__pages__ Object  
default {},   


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
__swapCSS(*String* page, *Function* handler) : *void*__  
  
- __page*__ - __*String*__,   
- handler - __*Function*__,   
> *return __void__*  

##  
__swapJS(*String* page, *Function* handler) : *void*__  
  
- __page*__ - __*String*__,   
- handler - __*Function*__,   
> *return __void__*  

---  
### MarkDown - JsonDox 1.02 - Zeta Ret Zetadmin Documentation Generator