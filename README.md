## ProtoSS Node.js Server  

Simple printed server from [ProtoSS Packages](https://github.com/ZetaRet/protoss) using [XeltoSS](https://github.com/ZetaRet/protoss/blob/master/xeltoss/XeltoSS.md) synthesis.  

`GZIP` is applied automatically using `content-type header` and `Apache/NGINX` configuration based on root folder.  

`Cookies` are set based on `PHP` __setcookie__ function.  

Create a `server subclass` of __ProtoSSChe__ and `override methods`.  

Folder `modules` contains examples and base extends of the server, including sample `stats.json` per server.  

`FileSystem` module is used to maintain `stats.json` and current number of requests per `5s interval`. Each reload of server `reads the file`.  

Server executes requests non-stop and labels them by unique id **__reqid**, subclass server must extend functionality and create workers using [SkytoSS](https://github.com/ZetaRet/protoss/blob/master/skytoss/SkytoSS.md).  

[Preview server](https://protoss.zetaret.com/node/)  

## [Wiki Pages](https://github.com/ZetaRet/protoss-nodejs-basic/wiki)  
- [Change log](https://github.com/ZetaRet/protoss-nodejs-basic/wiki/Change-log)  
- [HowTo](https://github.com/ZetaRet/protoss-nodejs-basic/wiki/HowTo)  
