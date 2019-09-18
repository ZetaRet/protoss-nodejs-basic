> __Author: Zeta Ret__  
> __Voyage model of Subserver__  
# Routes dynamically your server to a new destination  
> *Version: 1.2.0*  
> *Date: 2019 - Today*  

__required*__

## zetaret.node.modules::Voyage  
> Inherits: [zetaret.node.modules::Subserver](Subserver.md)  


##  
### *Methods*  

##  
__Voyage() : *void*__  
  
> *return __void__*  

##  
__initVoyage() : *void*__  
  
> *return __void__*  

##  
__voya(*Object* route, *Number* port) : *zetaret.node.modules::Voyage*__  
swiftly move to new destination by swapping ports and route maps  
- __route*__ - __*Object*__, extend map of current routeMap  
- port - __*Number*__, greater or equal to 0, zero means random port on some machines  
> *return __zetaret.node.modules::Voyage__, subjects self Voyage server*  

---  
### MarkDown - JsonDox 1.02 - Zeta Ret Zetadmin Documentation Generator