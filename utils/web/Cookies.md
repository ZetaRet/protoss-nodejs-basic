> __Author: Zeta Ret__  
> __Cookies - parse, read, write, delete__  
# Configurable Cookie class  
> *Version: 1.4.0*  
> *Date: 2019 - Today*  

__required*__

## zetaret.node.utils.web::Cookies  

### *Properties*  

#  
__headerName__ String  
default 'cookie',   

#  
__setHeaderKey__ String  
default set-cookie',   

#  
__setObjectHeaderKey__ String  
default 'set-cookie-object',   

#  
__cookiePath__ String  
default '/',   

#  
__setCookiePath__ Boolean  
default false,   

#  
__setCookieExpires__ Boolean  
default false,   

#  
__cookieExpirePeriod__ Number  
default 24h,   

#  
__cookie__ String  
default '',   

#  
__cookieMap__ Object  
default {},   


##  
### *Methods*  

##  
__Cookies() : *void*__  
  
> *return __void__*  

##  
__parseCookie(*String* cookie) : *Object*__  
  
- __cookie*__ - __*String*__,   
> *return __Object__*  

##  
__parseCookieRequest(*http.ClientRequest|http.IncomingMessage* request) : *String*__  
  
- __request*__ - __*http.ClientRequest|http.IncomingMessage*__,   
> *return __String__*  

##  
__readCookieRequest(*http.ClientRequest|http.IncomingMessage* request, *String* key) : *String*__  
  
- __request*__ - __*http.ClientRequest|http.IncomingMessage*__,   
- __key*__ - __*String*__,   
> *return __String__*  

##  
__readCookie(*Object* headers, *String* key, *String* headerName) : *String*__  
  
- __headers*__ - __*Object*__,   
- __key*__ - __*String*__,   
- headerName - __*String*__,   
> *return __String__*  

##  
__writeCookie(*Object* headers, *String* key, *String* value, *Number* expires, *Boolean* useObject, *Object* options) : *Cookies*__  
  
- __headers*__ - __*Object*__,   
- __key*__ - __*String*__,   
- __value*__ - __*String*__,   
- expires - __*Number*__,   
- useObject - __*Boolean*__,   
- options - __*Object*__,   
> *return __Cookies__*  

##  
__deleteCookie(*Object* headers, *String* key, *Boolean* useObject) : *Cookies*__  
  
- __headers*__ - __*Object*__,   
- __key*__ - __*String*__,   
- useObject - __*Boolean*__,   
> *return __Cookies__*  

##  
__deleteCookieObject(*Object* headers, *String* key) : *Cookies*__  
  
- __headers*__ - __*Object*__,   
- __key*__ - __*String*__,   
> *return __Cookies__*  

##  
__transformCookieObject(*Object* headers, *Boolean* remove) : *Cookies*__  
  
- __headers*__ - __*Object*__,   
- remove - __*Boolean*__,   
> *return __Cookies__*  

---  
### MarkDown - JsonDox 1.02 - Zeta Ret Zetadmin Documentation Generator