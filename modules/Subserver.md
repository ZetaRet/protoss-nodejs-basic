> __Author: Zeta Ret__  
> __Route map listener server__  
# Subserver of extended Server loaded as module  
> *Requires: events*  
> *Version: 1.13.0*  
> *Date: 2019 - Today*  

__required*__

## zetaret.node.modules::Subserver  
> Inherits: [zetaret.node.modules::XProtoSSChe](XProtoSSChe.md)  

### *Properties*  

#  
__routeMap__ Object  
default {}, object map by route path id, if no map is extended due to new Subserver subclass, then noRouteCode and noRouteEvent will occur at all times  

#  
__codeMap__ Object  
default {}, http codes based on raw path  

#  
__noRouteCode__ Number  
default 404,   

#  
__noRouteEvent__ String  
default 'error404',   

#  
__debugRoute__ Boolean  
default true,   

#  
__listener__ events.EventEmitter  
default new,   

#  
__pathEmitter__ events.EventEmitter  
default new,   

#  
__routeRegMap__ Object  
default {}, map of RegExp string routes  

#  
__routeRegExp__ RegExp  
default [\w|\-]+,   

#  
__routeRegGet__ Function  
default null,   

#  
__useProxy__ Boolean  
default true,   

#  
__proxyPaths__ String  
default '\_\_proxypaths',   

#  
__proxyMask__ Object  
default {},   

#  
__noProxyCode__ Number  
default 400,   

#  
__noProxyEvent__ String  
default 'proxyNoRoute',   

#  
__emitExacts__ Boolean  
default false,   


##  
### *Methods*  

##  
__Subserver() : *void*__  
  
> *return __void__*  

##  
__addPathListener(*String* path, *Function* callback) : *Function*__  
  
- __path*__ - __*String*__,   
- callback - __*Function*__,   
> *return __Function__*  

##  
__removePathListener(*String* path, *Function* callback) : *zetaret.node.modules::Subserver*__  
  
- __path*__ - __*String*__,   
- __callback*__ - __*Function*__,   
> *return __zetaret.node.modules::Subserver__*  

##  
__pathListener(*zetaret.node.modules.Subserver* server, *Object* robj, *Object* routeData, *http.ClientRequest|http.IncomingMessage* request, *http.ServerResponse* response) : *void*__  
  
- __server*__ - __*zetaret.node.modules.Subserver*__,   
- __robj*__ - __*Object*__,   
- __routeData*__ - __*Object*__,   
- __request*__ - __*http.ClientRequest|http.IncomingMessage*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __void__*  

##  
__addMethodPathListener(*String* method, *String* path, *Function* callback) : *Function*__  
  
- __method*__ - __*String*__,   
- __path*__ - __*String*__,   
- __callback*__ - __*Function*__,   
> *return __Function__*  

##  
__addParamsPathListener(*String* path, *Function|Array<Function>* callback, *String* method, *Boolean* autoRoute) : *Function*__  
  
- __path*__ - __*String*__,   
- __callback*__ - __*Function|Array<Function>*__,   
- method - __*String*__,   
- autoRoute - __*Boolean*__,   
> *return __Function__*  

##  
__addRegPathListener(*String* path, *Function* callback) : *Function*__  
  
- __path*__ - __*String*__,   
- __callback*__ - __*Function*__,   
> *return __Function__*  
```
server.addRegPathListener('profiles/[\w]+/photo-id/[\w]+$', (server, robj, routeData, request, response) => {});  
```
##  
__setRouteRegExp(*String* path) : *RegExp*__  
  
- __path*__ - __*String*__,   
> *return __RegExp__*  

##  
__routeCallback(*Object* routeData, *String* body, *http.ClientRequest|http.IncomingMessage* request, *http.ServerResponse* response) : *void*__  
reads response.__breakRoute to stop routing, augments route object  
- __routeData*__ - __*Object*__,   
- __body*__ - __*String*__,   
- __request*__ - __*http.ClientRequest|http.IncomingMessage*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __void__*  

##  
__initRoute() : *void*__  
set routeScope to self  
> *return __void__*  

##  
__initRouteListener() : *zetaret.node.modules::Subserver*__  
  
> *return __zetaret.node.modules::Subserver__*  

##  
__addRouter(*zetaret.node.api.Router* router) : *void*__  
  
- router - __*zetaret.node.api.Router*__,   
> *return __void__*  

##  
__pushProtoSSResponse(*http.ClientRequest|http.IncomingMessage* request, *http.ServerResponse* response) : *zetaret.node.modules::Subserver*__  
  
- __request*__ - __*http.ClientRequest|http.IncomingMessage*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __zetaret.node.modules::Subserver__*  

##  
__addHeaders(*http.ClientRequest|http.IncomingMessage* request, *http.ServerResponse* response) : *Object*__  
  
- __request*__ - __*http.ClientRequest|http.IncomingMessage*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __Object__*  

##  
### *Static Properties*  

#  
__xpros__ Module  
default load,   

#  
__EVENTS__ Object  
default const,   

#  
__SERVERID__ String  
default supername,   

