> __Author: Zeta Ret__  
> __Basic ProtoSS Node.js Server__  
# Simple printed server from ProtoSS Packages using XeltoSS synthesis  
> *Requires: http, https, http2, fs*  
> *Version: 1.12.0*  
> *Date: 2019 - Today*  

__required*__

## zetaret.node::ProtoSSChe  

### *Properties*  

#  
__env__ Object  
default {},   

#  
__htserv__ http.Server  
default created,   

#  
__acceptAppRequests__ Boolean  
default false,   

#  
__apps__ Object  
default {}, map of id to application method  

#  
__cookieMethod__ Function  
default null,   

#  
__requestMethod__ Function  
default null,   

#  
__onErrorBody__ Function  
default null,   

#  
__onEndBody__ Function  
default null,   

#  
__dataJoin__ String  
default null,   

#  
__reqIdLength__ Number  
default 31,   

#  
__keepBufferPerContentType__ Object  
default {},   

#  
__requestBodyMethods__ Array  
default null,   

#  
__readRequestOnError__ Boolean  
default true,   

#  
__requestMiddleware__ Array  
default [],   

#  
__responseMiddleware__ Array  
default [],   


##  
### *Methods*  

##  
__ProtoSSChe() : *void*__  
HTTP Server Constructor  
> *return __void__*  

##  
__getAppRequest(*http.IncomingMessage* request) : *http.ClientRequest|http.IncomingMessage*__  
Read request.headers.protossappid  
- __request*__ - __*http.IncomingMessage*__,   
> *return __http.ClientRequest|http.IncomingMessage__, new or modified request object*  

##  
__onRequest(*http.ClientRequest|http.IncomingMessage* request, *http.ServerResponse* response) : *void*__  
  
- __request*__ - __*http.ClientRequest|http.IncomingMessage*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __void__*  

##  
__onReadRequestBody(*http.ClientRequest|http.IncomingMessage* request, *String* body, *http.ServerResponse* response) : *ProtoSSChe*__  
  
- __request*__ - __*http.ClientRequest|http.IncomingMessage*__,   
- __body*__ - __*String*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __ProtoSSChe__*  

##  
__splitUrl(*String* url) : *Object*__  
  
- __url*__ - __*String*__,   
> *return __Object__*  

##  
__rndstr(*Number* l) : *String*__  
  
- __l*__ - __*Number*__,   
> *return __String__*  

##  
__getReqId() : *String*__  
  
> *return __String__*  

##  
__pushProtoSSResponse(*http.ClientRequest|http.IncomingMessage* request, *http.ServerResponse* response) : *ProtoSSChe*__  
  
- __request*__ - __*http.ClientRequest|http.IncomingMessage*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __ProtoSSChe__*  

##  
__readRequestBody(*http.ClientRequest|http.IncomingMessage* request, *http.ServerResponse* response) : *ProtoSSChe*__  
  
- __request*__ - __*http.ClientRequest|http.IncomingMessage*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __ProtoSSChe__*  

##  
__updateCookies(*http.ClientRequest|http.IncomingMessage* request, *http.ServerResponse* response, *Object* headers) : *ProtoSSChe*__  
  
- __request*__ - __*http.ClientRequest|http.IncomingMessage*__,   
- __response*__ - __*http.ServerResponse*__,   
- __headers*__ - __*Object*__,   
> *return __ProtoSSChe__*  

##  
__endResponse(*http.ClientRequest|http.IncomingMessage* request, *http.ServerResponse* response) : *ProtoSSChe*__  
  
- __request*__ - __*http.ClientRequest|http.IncomingMessage*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __ProtoSSChe__*  

##  
### *Static Properties*  

#  
__loadedModule__ Module  
default external,   

#  
__loadedModuleClass__ zetaret.node.ProtoSSChe  
default extended,   

#  
__serverclass__ zetaret.node.ProtoSSChe  
default index,   

#  
__serverche__ zetaret.node.ProtoSSChe  
default new,   

##  
### *Static Protected Properties*  

#  
__env__ Object  
default {},   

#  
__dumpall__ Boolean  
default false,   

#  
__dumpkeys__ Array  
default init,   

#  
__omit__ Object  
default init,   

#  
__maxBodyLength__ Number  
default 10000,   

#  
__htport__ Number  
default 8888,   

#  
__reqnum__ Number  
default 0,   

#  
__contenttype__ String  
default 'text/plain',   

#  
__cookieid__ String  
default 'zetaretpid',   

#  
__sidinterval__ Number  
default 5000,   

#  
__sfile__ String  
default 'stats.json',   

#  
__useXServer__ Boolean  
default false,   

#  
__xserverModule__ String  
default './modules/XProtoSSChe.js',   

#  
__stats__ Object  
default init, JSON Object loaded and updated frequently, use *global.ProtoSSCheStatsFile* to set different path in application before loading index module  
```
{  
	reqnum:3, xserver:true, xserverModule: "./modules/MyServer.js", cookieid: "mycookie", htport: 3000, https: true,  
	httpsop: {keyPath, certPath, pfxPath, caPath, h2, ...anyOtherHTTPSOptionsParameter},  
	h2: false, h2op: null  
}  
```
##  
### *Static Methods*  

##  
__setEnv(*Object* envobj) : *void*__  
  
- __envobj*__ - __*Object*__,   
> *return __void__*  

##  
__resetFSInterval() : *void*__  
  
> *return __void__*  

##  
__stopFSInterval() : *void*__  
  
> *return __void__*  

##  
__getModuleInstance(*String* xmodule) : *Object*__  
create module server instance as it is by default, initiated once by loading the module using stats configuration and prepends *global.ProtoSSCheXServerPath* to *xserverModule*  
- xmodule - __*String*__, external path to server module  
> *return __Object__, {serverche: ProtoSSChe, xpro: Module, xprocls: ProtoSSChe, xmodule: String}*  

##  
### *Static Protected Methods*  

##  
__updateEnv() : *void*__  
  
> *return __void__*  

##  
__initFS() : *void*__  
  
> *return __void__*  

