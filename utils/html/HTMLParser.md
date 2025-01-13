> __Author: Zeta Ret__  
> __Simple HTML parser__  
# RegExp XML processor to object and reversed conversion to HTML  
> *Requires: fs, path, events*  
> *Version: 1.9.2*  
> *Date: 2019 - Today*  

__required*__

## zetaret.node.utils.html::HTMLParser  

### *Properties*  

#  
__id__ String  
default null,   

#  
__dom__ Object  
default null,   

#  
__str__ String  
default null,   

#  
__file__ String  
default null,   

#  
__dir__ String|Boolean  
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

#  
__debug__ Boolean  
default false,   

#  
__debugBuffer__ Array  
default [],   

#  
__parseCursor__ Number  
default 0,   

#  
__useAutomaton__ Boolean  
default false, parsing based on `automata` map, allows special tags, or define structure  

#  
__autoOrder__ Boolean  
default false, honor `automaton` order or html of parsing `automata` tags  

#  
__automata__ Object  
default init, [opener RegExp, closure RegExp, use attributes]  

#  
__closeTags__ Array  
default [], skip parsing elements and lookup to close the tag directly, i.e. `script` or `style`  

#  
__watchFiles__ Boolean  
default false,   

#  
__watchOptions__ Object  
default null,   

#  
__watchListener__ Function  
default null,   

#  
__watcher__ fs.FSWatcher  
default null,   

#  
__whiteList__ Object  
default null, map of keys to be allowed in `domToString` attributes  

#  
__blackList__ Object  
default null, map of keys to be disallowed in `domToString` attributes  

#  
__queryPrefix__ Object  
default init,   


##  
### *Methods*  

##  
__HTMLParser() : *void*__  
Parse simple XML structures with namespace into templates, swap content, or use HTMLCache, `useAutomaton` to support comments `<!--` or special tags `<!` `<?`. Must extend and override methods to supplement, or use multiple templates to create more complex HTML structure.  
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
__watchFile(*String* fp, *Function* listener, *Object* options) : *void*__  
  
- fp - __*String*__,   
- listener - __*Function*__,   
- options - __*Object*__,   
> *return __void__*  

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
__search(*String|Array* type, *String|Function* attr, *String|Object* value, *Object* dom) : *Array*__  
search the dom per type of element, and/or attribute key and value  
- __type*__ - __*String|Array*__,   
- __attr*__ - __*String|Function*__,   
- __value*__ - __*String|Object*__,   
- dom - __*Object*__,   
> *return __Array__*  

##  
__query(*String* selector, *Object* methods, *Boolean|Object* classes) : *Array*__  
execute sequential search on the dom, and convert dom objects to classes  
- __selector*__ - __*String*__, space separated sequence, use `queryPrefix` to identify attributes  
- methods - __*Object*__, object map per converted attribute, swap `attr` arguments to function handler in search  
- classes - __*Boolean|Object*__, convert dom objects to classes in final return  
> *return __Array__*  
```
htparser.query('#my-component .buttons', null, true)  
```
##  
__querySafe(*String* selector, *Object* methods, *Boolean|Object* classes, *Function* debug) : *Array*__  
  
- __selector*__ - __*String*__,   
- methods - __*Object*__,   
- classes - __*Boolean|Object*__,   
- debug - __*Function*__,   
> *return __Array__*  

##  
__debugCase(*String* text, *Error|Function* error, *Object* data) : *void*__  
  
- __text*__ - __*String*__,   
- error - __*Error|Function*__,   
- data - __*Object*__,   
> *return __void__*  

##  
__cursorToCR(*Number* cursor) : *String*__  
  
- __cursor*__ - __*Number*__,   
> *return __String__*  

##  
__process(*String* s, *Object* d) : *Object*__  
implemented for performance, use strict tagging and closures  
- __s*__ - __*String*__,   
- __d*__ - __*Object*__,   
> *return __Object__*  

##  
__getClosedTag(*String* s, *Object* el) : *Object*__  
  
- __s*__ - __*String*__,   
- __el*__ - __*Object*__,   
> *return __Object__*  

##  
__getTag(*String* s) : *Object*__  
detect any tag opener before processing attributes and closure  
- __s*__ - __*String*__,   
> *return __Object__*  

##  
__getAutoTag(*Object* tag) : *Object*__  
check current detected tag opener for an `automaton` implementation  
- __tag*__ - __*Object*__,   
> *return __Object__*  
```
<?xml prolog="attribute" ?>  
<@alias name="another" @>  
<#template file="path" type="iterator" #>  
<=var method arguments="true, jsData.htmlParserInput">  
<%block wild text %>  
<!-- comments in here-->  
<![CDATA[my cdata content]]>  
<!DOCTYPE HTML>  
```
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

##  
__attrToObject(*Array* aa, *Object* el, *Number* cursor) : *zetaret.node.utils.html::HTMLParser*__  
  
- __aa*__ - __*Array*__, non-parsed attributes from the tag  
- __el*__ - __*Object*__, element object to create `attr` into  
- cursor - __*Number*__, used in `debugCase`  
> *return __zetaret.node.utils.html::HTMLParser__*  

