> __Author: Zeta Ret__  
> __HTML page cache utility__  
# Swap JS/CSS from filepath into tag as relative, cache as page content  
> *Requires: fs, path*  
> *Version: 1.1.4*  
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
create pages by id and cache content from HTMLParser  
> *return __void__*  

##  
__addPage(*String* page, *zetaret.node.utils.html* parser, *String* hfile, *String* dir) : *Object*__  
  
- __page*__ - __*String*__,   
- __parser*__ - __*zetaret.node.utils.html*__,   
- __hfile*__ - __*String*__,   
- __dir*__ - __*String*__,   
> *return __Object__*  

##  
__getPage(*String* page) : *String*__  
  
- __page*__ - __*String*__,   
> *return __String__*  

##  
__exePage(*String* page, *Object* cfg) : *Object*__  
  
- __page*__ - __*String*__,   
- cfg - __*Object*__,   
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