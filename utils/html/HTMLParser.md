> __Author: Zeta Ret__  
> __Simple HTML parser__  
# RegExp XML processor to object and reversed conversion to HTML  
> *Requires: fs, path*  
> *Version: 1.1.4*  
> *Date: 2019 - Today*  

__required*__

## zetaret.node.utils.html::HTMLParser  

### *Properties*  

#  
__dom__ Object  
default null,   

#  
__str__ String  
default null,   

#  
__prettyPrefix__ String  
default '\t', tag offset per depth, change to more tabs, or spaces, deleted prefix will generate elements on each line, use in `domToString`  

#  
__prettyNewLine__ String  
default '\n', new line string upon creating new tag, use in `domToString`  

#  
__attrAsObject__ Boolean  
default true,   


##  
### *Methods*  

##  
__HTMLParser() : *void*__  
Parse simple XML structures into templates, swap content, or use HTMLCache, no support of comments `<!--` or special tags `<!` `<?`. Must extend and override methods to suplement, or use multiple templates to create more complex HTML structure.  
> *return __void__*  

##  
__getFilePath(*String* file, *String|Boolean* dir) : *String*__  
resolves using path and base directory  
- __file*__ - __*String*__, relative or absolute path to file, will merge with dir  
- dir - __*String|Boolean*__, `true` uses `file` as it is, without `path.resolve` or local/remote directory  
> *return __String__*  

##  
__loadFromFile(*String* file, *String|Boolean* dir) : *String*__  
  
- __file*__ - __*String*__,   
- dir - __*String|Boolean*__,   
> *return __String__*  

##  
__parseFromFile(*String* file, *String|Boolean* dir) : *String*__  
  
- __file*__ - __*String*__,   
- dir - __*String|Boolean*__,   
> *return __String__*  

##  
__parseFromString(*String* str) : *zetaret.node.utils.html::HTMLParser*__  
  
- __str*__ - __*String*__,   
> *return __zetaret.node.utils.html::HTMLParser__*  

##  
__getDomJSON() : *String*__  
  
> *return __String__*  

##  
__domToString(*Object* dom, *Boolean* nowhite, *Boolean* pretty, *Array* prefix) : *String*__  
  
- __dom*__ - __*Object*__,   
- nowhite - __*Boolean*__,   
- pretty - __*Boolean*__,   
- prefix - __*Array*__,   
> *return __String__*  

##  
__search(*String* type, *String* attr, *String* value, *Object* dom) : *Array*__  
query the dom per type of element, and/or attribute key and value  
- __type*__ - __*String*__,   
- __attr*__ - __*String*__,   
- __value*__ - __*String*__,   
- dom - __*Object*__,   
> *return __Array__*  

##  
__process(*String* s, *Object* d) : *Object*__  
implemented for performance, use strict tagging and closures  
- __s*__ - __*String*__,   
- __d*__ - __*Object*__,   
> *return __Object__*  

##  
__getTag(*String* s) : *Object*__  
  
- __s*__ - __*String*__,   
> *return __Object__*  

##  
__getElement(*String* type, *Boolean* closed, *Array|Object* attr) : *Object*__  
generate new object element and append to any dom structure  
- __type*__ - __*String*__,   
- closed - __*Boolean*__,   
- attr - __*Array|Object*__,   
> *return __Object__, {type, closed, ending, attr, elements}*  

##  
__attributes(*String* s, *Object* el) : *String*__  
  
- __s*__ - __*String*__,   
- __el*__ - __*Object*__,   
> *return __String__*  

---  
### MarkDown - JsonDox 1.02 - Zeta Ret Zetadmin Documentation Generator