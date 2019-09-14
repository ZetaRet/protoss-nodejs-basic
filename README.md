## ProtoSS Node.js Server  

Simple printed server from [ProtoSS Packages](https://github.com/ZetaRet/protoss) using [XeltoSS](https://github.com/ZetaRet/protoss/wiki/XeltoSS-Documentation) synthesis.  

GZIP is applied automatically using content-type header and Apache/NGINX configuration based on root folder.  

Cookies are set based on PHP setcookie function.  

Create a server subclass of __ProtoSSChe__ and override methods.  

FileSystem module is used to maintain __stats.json__ and current number of requests per 5s interval. Each reload of server reads the file.  

Server executes requests non-stop and labels them by unique id **__reqid**, subclass server must extend functionality and create workers using [SkytoSS](https://github.com/ZetaRet/protoss/wiki/SkytoSS-Documentation).  

[Preview server](https://protoss.zetaret.com/node/) in the browser using PING-shPONGle request returning omitted client data.  
