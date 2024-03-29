## ProtoSS Node.js Server  

### Features of the server  

- d.ts types  
- global configuration  
- environment configuration  
- fileless startup  
- examples  
- asynchronous server with pipeline  
- subserver with route management  
- router class on the side  
- custom headers  
- custom prototypes  
- middlewares  
- content parsers  
- directory listing per endpoint for static assets and streaming  
- automated json, string or buffer, and promise-based response  
- connectivity between servers  
- html support  

### Description  

Simple printed server from [ProtoSS Packages](https://github.com/ZetaRet/protoss) using [XeltoSS](https://github.com/ZetaRet/protoss/blob/master/xeltoss/XeltoSS.md) synthesis.  

`GZIP` is applied automatically using `content-type header` and `Apache/NGINX` configuration based on root folder.  

`Cookies` are set based on `PHP` __setcookie__ function or internal JS mechanism.  

Create a `server subclass` of __ProtoSSChe__ and `override methods`.  

Folder `modules` contains base extends of the `index` server, including sample `stats.json` per server.  

`FileSystem` module is used to maintain `stats.json` and current number of requests per `5s interval`. Each reload of server `reads the file`.  

Server executes requests non-stop and labels them by unique id **__reqid**, subclass server must extend functionality and create workers using [SkytoSS](https://github.com/ZetaRet/protoss/blob/master/skytoss/SkytoSS.md).  

[Preview server](https://protoss.zetaret.com/node/)  

## [Wiki Pages](https://github.com/ZetaRet/protoss-nodejs-basic/wiki)  
- [Change log](https://github.com/ZetaRet/protoss-nodejs-basic/wiki/Change-log)  
- [HowTo](https://github.com/ZetaRet/protoss-nodejs-basic/wiki/HowTo)  
