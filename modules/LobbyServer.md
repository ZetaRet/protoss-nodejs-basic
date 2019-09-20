> __Author: Zeta Ret__  
> __Lobby auth and rooms of Subserver__  
# Distribute users after authentication into rooms or applications based on requirements  
> *Requires: http, https, events*  
> *Version: 1.2.3*  
> *Date: 2019 - Today*  

__required*__

## zetaret.node.modules::LobbyServer  
> Inherits: [zetaret.node.modules::Subserver](Subserver.md)  

### *Properties*  

#  
__lobbyId__ String  
default null,   

#  
__lobbyData__ Object  
default {},   

#  
__apps__ Object  
default {},   

#  
__users__ Object  
default {},   

#  
__rooms__ Object  
default {},   

#  
__lobbyEvents__ events.EventEmitter  
default new,   


##  
### *Methods*  

##  
__LobbyServer() : *void*__  
implement application based lobby logic using provided objects  
> *return __void__*  

##  
__initLobby() : *void*__  
  
> *return __void__*  

##  
__initRooms() : *void*__  
  
> *return __void__*  

##  
__initApps() : *void*__  
  
> *return __void__*  

##  
__connectTo(*Object* options, *String* data, *Boolean* secure) : *http.ClientRequest*__  
connect to another server or lobby, auto-configure options{port, method}  
- __options*__ - __*Object*__, default http server options per request  
- data - __*String*__, data to send with request  
- secure - __*Boolean*__, connect to SSL server port using https  
> *return __http.ClientRequest__, ends automatically*  

##  
__onConnectError(*Error* e) : *void*__  
  
- __e*__ - __*Error*__,   
> *return __void__*  

##  
__onConnected(*http.IncomingMessage* res) : *void*__  
  
- __res*__ - __*http.IncomingMessage*__,   
> *return __void__*  

##  
__lobby(*Object* data) : *zetaret.node.modules::LobbyServer*__  
update current lobby server data  
- __data*__ - __*Object*__,   
> *return __zetaret.node.modules::LobbyServer__*  

##  
__updateRemoveUser(*LobbyUser* u, *Boolean* update, *Boolean* remove) : *zetaret.node.modules::LobbyServer*__  
  
- __u*__ - __*LobbyUser*__,   
- update - __*Boolean*__,   
- remove - __*Boolean*__,   
> *return __zetaret.node.modules::LobbyServer__*  

##  
__updateRemoveRoom(*LobbyRoom* r, *Boolean* update, *Boolean* remove) : *zetaret.node.modules::LobbyServer*__  
  
- __r*__ - __*LobbyRoom*__,   
- update - __*Boolean*__,   
- remove - __*Boolean*__,   
> *return __zetaret.node.modules::LobbyServer__*  

##  
__updateRemoveApp(*LobbyApp* a, *Boolean* update, *Boolean* remove) : *zetaret.node.modules::LobbyServer*__  
  
- __a*__ - __*LobbyApp*__,   
- update - __*Boolean*__,   
- remove - __*Boolean*__,   
> *return __zetaret.node.modules::LobbyServer__*  

##  
__user(*String* userId, *Function* usercls) : *LobbyUser*__  
add new user to lobby using default/custom Class  
- __userId*__ - __*String*__,   
- usercls - __*Function*__,   
> *return __LobbyUser__*  

##  
__room(*String* roomId, *Function* roomcls) : *LobbyRoom*__  
add new room to lobby using default/custom Class  
- __roomId*__ - __*String*__,   
- roomcls - __*Function*__,   
> *return __LobbyRoom__*  

##  
__app(*String* appId, *Function* appcls) : *LobbyApp*__  
add new app to lobby using default/custom Class  
- __appId*__ - __*String*__,   
- appcls - __*Function*__,   
> *return __LobbyApp__*  

##  
### *Static Properties*  

#  
__lobbyUserClass__ LobbyUser  
default module,   

#  
__lobbyRoomClass__ LobbyRoom  
default module,   

#  
__lobbyAppClass__ LobbyApp  
default module,   

---  
### MarkDown - JsonDox 1.02 - Zeta Ret Zetadmin Documentation Generator