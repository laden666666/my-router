# my-router
路由是创建单页应用（spa）的核心，传统的web页面和app在页面处理上有很大不同，主要区别有：
web页面路由：有location，页面无缓存，每一个页面是保存在history，用户可以自己刷新
app路由：无location，页面有缓存，用户无法自己刷新

## 解决的问题
**my-router**目标提供一个面向webapp的路由，不同于传统web路由，**my-router**目标解决传统web路由的种种，包括页面传值，对刷新的处理，对浏览器回退事件的处理等等。

## 原理
1.首先使用SessionLocation记录用户的访问历史信息，如果用户是第一次访问一个页面。因为history里面的内容js无法访问，所以弃用history
2.history仅保留3个状态：处理返回事件，当前路由状态，处理跳转页面的状态
3.每一个页面跳转使用pushState，并给每一个页面加一个uuid，保存在state里面，来记录当前路由在SessionLocation信息中的位置
4.同时使用pushState和hash，通过两种配合解决浏览器响应路由效率的问题
