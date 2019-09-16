> __Author: Zeta Ret__  
> __Basic extender and nullifier__  
# Extended ProtoSSChe Server loaded as module  
> *Version: 1.1.1*  
> *Date: 2019 - Today*  

__required*__

## zetaret.node.modules::XProtoSSChe  
> Inherits: zetaret.node::index  

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
__onReadRequestBody(*http.ClientRequest* request, *String* body, *http.ServerResponse* response) : *zetaret.node.modules::XProtoSSChe*__  
response.__splitUrl is decoded route object using splitUrl method of request.url  
- __request*__ - __*http.ClientRequest*__,   
- __body*__ - __*String*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __zetaret.node.modules::XProtoSSChe__*  

##  
__pushProtoSSResponse(*http.ClientRequest* request, *http.ServerResponse* response) : *zetaret.node.modules::XProtoSSChe*__  
  
- __request*__ - __*http.ClientRequest*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __zetaret.node.modules::XProtoSSChe__*  

##  
__addHeaders(*http.ClientRequest* request, *http.ServerResponse* response) : *Object*__  
  
- __request*__ - __*http.ClientRequest*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __Object__*  

##  
__endResponse(*http.ClientRequest* request, *http.ServerResponse* response) : *zetaret.node.modules::XProtoSSChe*__  
response.__rcode property will be checked before setting 200  
- __request*__ - __*http.ClientRequest*__,   
- __response*__ - __*http.ServerResponse*__,   
> *return __zetaret.node.modules::XProtoSSChe__*  

---  
### MarkDown - JsonDox 1.02 - Zeta Ret Zetadmin Documentation Generator
