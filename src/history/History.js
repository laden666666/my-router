import HistoryCache from './HistoryCache'
import IdUtil from './IdUtil'

/**
 * 负责监听页面跳转事件和触发页面跳转的类。要求必须是单例的,提供跳转的功能
 */
class History{
    constructor(createHistory, UrlClass){
        this._UrlClass = UrlClass;

        //历史缓存栈,依靠其封装的浏览器的history对象,从而不必真的对history对象进行监听
        this.history = createHistory();

        //保存路由信息的堆栈。
        var url = this.getCurrentUrl();
        this.historyCache = new HistoryCache();
        this.historyCache.setUrl(url.id, url);

        //保存注册的history的change事件的回调函数
        this._funArray = [];
        this.history.listen((location)=>{
            var url = new UrlClass();
            url.parse(location.href);
            url.id = url.id || "0";

            var oldHistory = this.historyCache.get();
            var result = this.historyCache.setUrl(url.id, url);

            this._funArray.map((func)=>{
                func(result, this.historyCache.get(), oldHistory);
            })
        });
    }

    getCurrentUrl(){
        var url = new this._UrlClass();
        url.parse(this.history.location.pathname + this.history.location.search);
        url.id = url.id || "0";
        return url;
    }

    push(urlPath, urlQuery){
        var id = IdUtil.createId();
        var url = new this._UrlClass(urlPath, urlQuery, id)
        this.history.push(url.stringify())
        return id;
    }

    replace(urlPath, urlQuery){
        var id = this.historyCache.currentId;
        var url = new this._UrlClass(urlPath, urlQuery, id)
        this.history.replace(url.stringify())
        return id;
    }

    go(n){
        this.history.go(n);
    }

    goBack(){
        this.history.goBack();
    }

    goForward(){
        this.history.goForward();
    }

    /**
     * 增加url变化的响应
     * @param func
     * @returns {*}
     */
    listen(func){
        this._funArray.push(func);

        return ()=>{
            this._funArray = this._funArray.filter(fn=>fn != func);
        }
    }
}

export default History;
