> __Author: Zeta Ret__  
> __Route map listener server__  
# Subserver of extended Server loaded as module  
> *Requires: events*  
> *Version: 1.1.2*  
> *Date: 2019 - Today*  

__required*__

## zetaret.node.modules::Subserver  
> Inherits: zetaret.node.modules::XProtoSSChe  

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
__pathListener(*zetaret.node.modules.Subserver* server, *Object* robj, *Object* routeData, *http.ClientReques* request, *http.ServerResponse* response) : *void*__  
  
- __server*__ - __*zetaret.node.modules.Subserver*__,   
- __robj*__ - __*Object*__,   
- __routeData*__ - __*Object*__,   
- __request*__ - __*http.ClientReques*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __void__*  

##  
__routeCallback(*Object* routeData, *String* body, *http.ClientRequest* request, *http.ServerResponse* response) : *void*__  
  
- __routeData*__ - __*Object*__,   
- __body*__ - __*String*__,   
- __request*__ - __*http.ClientRequest*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __void__*  

##  
__initRoute() : *zetaret.node.modules::Subserver*__  
adds listener on xdebug-protoss-node  
> *return __zetaret.node.modules::Subserver__*  

##  
__pushProtoSSResponse(*http.ClientRequest* request, *http.ServerResponse* response) : *zetaret.node.modules::Subserver*__  
  
- __request*__ - __*http.ClientRequest*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __zetaret.node.modules::Subserver__*  

##  
__addHeaders(*http.ClientRequest* request, *http.ServerResponse* response) : *Object*__  
  
- __request*__ - __*http.ClientRequest*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __Object__*  

---  
### MarkDown - JsonDox 1.02 - Zeta Ret Zetadmin Documentation Generator
