> __Author: Zeta Ret__  
> __Basic extender and nullifier__  
# Extended ProtoSSChe Server loaded as module  
> *Version: 1.7.0*  
> *Date: 2019 - Today*  

__required*__

## zetaret.node.modules::XProtoSSChe  
> Inherits: [zetaret.node::index](../index.md)  

### *Properties*  

#  
__routeCallback__ Function  
default null,   

#  
__routeScope__ Object  
default null,   

#  
__routeData__ Object  
default null,   

#  
__autoCookie__ Boolean  
default false, used in `endResponse` to call `updateCookies`  

#  
__postJSON__ Boolean  
default true, check incoming `content-type` header and parse body as JSON, add as `post` to route object  

#  
__layerServer__ Boolean  
default false, use for proxy, cache, compress, encode, encrypt, content type based responses  

#  
__emitRR__ Boolean  
default false,   


##  
### *Methods*  

##  
__XProtoSSChe(*Function* routeCallback, *Object* routeScope, *Object* routeData) : *void*__  
  
- routeCallback - __*Function*__,   
- routeScope - __*Object*__,   
- routeData - __*Object*__,   
> *return __void__*  

##  
__initRoute() : *zetaret.node.modules::XProtoSSChe*__  
  
> *return __zetaret.node.modules::XProtoSSChe__*  

##  
__onReadRequestBody(*http.ClientRequest|http.IncomingMessage* request, *String* body, *http.ServerResponse* response) : *zetaret.node.modules::XProtoSSChe*__  
augments response based on `request` and executes `routeCallback`  
- __request*__ - __*http.ClientRequest|http.IncomingMessage*__,   
- __body*__ - __*String*__,   
- __response*__ - __*http.ServerResponse*__, `.__splitUrl` is decoded route object, `.__body` is body, mark `.__async` to self execute `endResponse` later or `.emit('pushProtoSSAsyncResponse')`  
> *return __zetaret.node.modules::XProtoSSChe__*  

##  
__pushProtoSSResponse(*http.ClientRequest|http.IncomingMessage* request, *http.ServerResponse* response) : *zetaret.node.modules::XProtoSSChe*__  
  
- __request*__ - __*http.ClientRequest|http.IncomingMessage*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __zetaret.node.modules::XProtoSSChe__*  

##  
__addHeaders(*http.ClientRequest|http.IncomingMessage* request, *http.ServerResponse* response) : *Object*__  
  
- __request*__ - __*http.ClientRequest|http.IncomingMessage*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __Object__*  

##  
__layerInitRequest(*http.ClientRequest|http.IncomingMessage* request, *http.ServerResponse* response, *String* body) : *String*__  
  
- __request*__ - __*http.ClientRequest|http.IncomingMessage*__,   
- __response*__ - __*http.ServerResponse*__,   
- __body*__ - __*String*__,   
> *return __String__*  

##  
__layerEndResponse(*http.ClientRequest|http.IncomingMessage* request, *http.ServerResponse* response, *String* input, *Object* headers) : *String*__  
override this method to contribute the server layer logic  
- __request*__ - __*http.ClientRequest|http.IncomingMessage*__, use input request data  
- __response*__ - __*http.ServerResponse*__, use route computed data  
- __input*__ - __*String*__, current body to end response  
- __headers*__ - __*Object*__, edit headers object in place  
> *return __String__, final version of response.end*  

##  
__endResponse(*http.ClientRequest|http.IncomingMessage* request, *http.ServerResponse* response) : *zetaret.node.modules::XProtoSSChe*__  
`response.__rcode` property will be checked before setting 200  
- __request*__ - __*http.ClientRequest|http.IncomingMessage*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __zetaret.node.modules::XProtoSSChe__*  

##  
### *Static Properties*  

#  
__EVENTS__ Object  
default const,   

#  
__SERVERID__ String  
default supername,   

---  
### MarkDown - JsonDox 1.02 - Zeta Ret Zetadmin Documentation Generator