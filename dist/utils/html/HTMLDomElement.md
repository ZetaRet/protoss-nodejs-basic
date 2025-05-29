> __Author: Zeta Ret__  
> __Simple XML DOM Element__  
# Wrapper class used as facade of the element and extends logic  
> *Requires: events*  
> *Version: 1.1.1*  
> *Date: 2020 - Today*  

__required*__

## zetaret.node.utils.html::HTMLDomElement  
> Inherits: Array  

### *Properties*  

#  
__dom__ String|Object  
default init,   

#  
__type__ String  
default init,   

#  
__data__ Object  
default {},   

#  
__events__ events.EventEmitter  
default new,   

#  
__id__ String  
default getter,   

#  
__classList__ Array  
default getter,   


##  
### *Methods*  

##  
__HTMLDomElement(*Object* dom) : *void*__  
  
- __dom*__ - __*Object*__,   
> *return __void__*  

##  
__convert(*Object* classes, *Boolean* sub, *Boolean* subc) : *zetaret.node.utils.html::HTMLDomElement*__  
build classes on element index position  
- classes - __*Object*__, map of type/class to instance dom elements  
- sub - __*Boolean*__, cast convert on element instances  
- subc - __*Boolean*__, continuously sub-channel elements  
> *return __zetaret.node.utils.html::HTMLDomElement__*  

