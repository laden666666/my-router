
# my-router

在服务器端，路由是指根据请求的URL，将一个请求分发到对应的应用处理程序。因为可以通过URL确定一个页面，路由概念慢慢渗透到客户端，现在连安卓和ios开发都会有路由的概念。


## webapp的路由和app的路由的不同

提起webapp路由，大家会很自然地和浏览器的地址栏联系起来，因为地址栏可以输入编辑页面的URL，而路由又是抽象URL的产物。尽管为了充分模拟，webapp可以采用单页方案（SPA），使用hash和pushState无刷新改变URL，但是webapp路由和app路由仍然有很多区别。

||webapp路由|app路由|
|----|----|----|
|是否有location|有|无|
|用户是否可以主动刷新|能|不能|
|页面是否有缓存|看路由实现，多少路由不缓存页面|有|
|多次访问同一url会创建多个页面|否，仅创建一个页面|创建多个页面|
|可以获取路由栈数据|history能获取路由栈的长度，但是获取不了具体内容|能|
|可以监听用户返回事件|不能|能|
|...|||

## my-router

my-router设计的目的就是寻找一套webapp和app一样的路由系统，my-router试图进一步抽象history对象和location对象，将其封装为一个类似app路由的，不再提供history对象和location对象，而是进行更进一步的路由抽象。从而使得我们的webapp表现形式更像app。



## [my-router-history](./packages/my-router-history "") 

一个屏蔽了浏览器地址栏的诸多特性的history库，用于开发高仿APP的WEB路由。浏览器的地址栏可以修改URL，可以访问历史记录，无法监听返回事件等特性，这些特性都是APP不具备的。**my-router-history**致力于屏蔽这些特性，提供一个开放高仿APP路由的可能性。该项目并不依赖**my-router**，因此如果你感兴趣开发一个APP式的路由，可以直接参考甚至使用该项目。



