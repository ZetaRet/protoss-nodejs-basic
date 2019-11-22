> __Author: Zeta Ret__  
> __Basic ProtoSS Node.js Server__  
# Simple printed server from ProtoSS Packages using XeltoSS synthesis  
> *Requires: http, https, http2, fs*  
> *Version: 1.3.8*  
> *Date: 2019 - Today*  

__required*__

## zetaret.node::index  

### *Properties*  

#  
__env__ Object  
default {},   

#  
__htserv__ http.Server  
default created,   


##  
### *Methods*  

##  
__ProtoSSChe() : *void*__  
HTTP Server Constructor  
> *return __void__*  

##  
__onRequest(*http.ClientRequest* request, *http.ServerResponse* response) : *void*__  
  
- __request*__ - __*http.ClientRequest*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __void__*  

##  
__onReadRequestBody(*http.ClientRequest* request, *String* body, *http.ServerResponse* response) : *ProtoSSChe*__  
  
- __request*__ - __*http.ClientRequest*__,   
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
__pushProtoSSResponse(*http.ClientRequest* request, *http.ServerResponse* response) : *ProtoSSChe*__  
  
- __request*__ - __*http.ClientRequest*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __ProtoSSChe__*  

##  
__readRequestBody(*http.ClientRequest* request, *http.ServerResponse* response) : *ProtoSSChe*__  
  
- __request*__ - __*http.ClientRequest*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __ProtoSSChe__*  

##  
__updateCookies(*http.ClientRequest* request, *http.ServerResponse* response, *Object* headers) : *ProtoSSChe*__  
  
- __request*__ - __*http.ClientRequest*__,   
- __response*__ - __*http.ServerResponse*__,   
- __headers*__ - __*Object*__,   
> *return __ProtoSSChe__*  

##  
__endResponse(*http.ClientRequest* request, *http.ServerResponse* response) : *ProtoSSChe*__  
  
- __request*__ - __*http.ClientRequest*__,   
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
{reqnum:3, xserver:true, xserverModule: "./modules/MyServer.js", cookieid: "mycookie", htport: 3000, https: true, httpsop: {keyPath, certPath, pfxPath, caPath, h2, ...anyOtherHTTPSOptionsParameter}}  
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

---  
### MarkDown - JsonDox 1.02 - Zeta Ret Zetadmin Documentation Generator