/**
 * Created by njz on 17/3/7.
 */
import browserHistoryFactory from '../history/browserHistoryFactory';
import RouterAction from '../RouterAction';
const path = require('path');

function Deferred() {
    //返回的构造器
    var obj = {};

    //返回的参数
    obj.promise = new Promise(function (resolve, reject) {
        obj.resolve = resolve;
        obj.reject = reject;
    });

    return obj;
}

var history = browserHistoryFactory();
var subPath = "/";
export default {

    //对browserHistoryFactory的封装
    push : function(urlPath, urlQuery) {
        return history.push(path.join(subPath, urlPath), urlQuery);
    },
    replace : function(urlPath, urlQuery){
        return history.replace(path.join(subPath, urlPath), urlQuery);
    },
    go : function(n){
        return history.go(n);
    },
    goBack : function(){
        return history.goBack();
    },
    goForward : function(){
        return history.goForward();
    },

    setSubPath(_subPath){
        if(_subPath)
            subPath = _subPath;
    },

    //带导航session的封装
    navigateTo : function(urlPath, urlQuery, navData={}){
        //跳转到新页面,并且从页面再跳转回来的Deferred
        var backDeferred = Deferred();

        var $navigateData = {
            data: navData,
            backDeferred,
        }

        var id = this.push( urlPath, urlQuery);

        var nextPage = history.historyCache.get();

        //给跳转后的页面设置路由session数据
        if(id == nextPage.url.id){
            nextPage.data.$navigateData = $navigateData;
        }

        return backDeferred.promise;
    },
    redirectTo: function(urlPath, urlQuery, navData={}){
        var currentPage = history.historyCache.get();

        //跳转到新页面,并且从页面再跳转回来的Deferred
        var backDeferred = Deferred();

        var $navigateData = {
            data: navData,
        }
        if(currentPage.data.$navigateData && currentPage.data.$navigateData.backDeferred){
            $navigateData.backDeferred = currentPage.data.$navigateData.backDeferred
        }


        var id = this.replace(urlPath, urlQuery);

        var nextPage = history.historyCache.get();

        //给跳转后的页面设置路由session数据
        if(id == nextPage.url.id){
            nextPage.data.$navigateData = $navigateData;
        }

        return backDeferred.promise;
    },
    setBackValue: function(backValue) {
        var currentPage = history.historyCache.get();
        if(currentPage.data.$navigateData){
            currentPage.data.$navigateData.backValue = backValue;
        }
    },
    navigateBack: function(data, index=-1){
        var currentPage = history.historyCache.get();
        var $navigateData = currentPage.data.$navigateData;
        if ($navigateData && $navigateData.backDeferred) {
            $navigateData.backDeferred.resolve(data || $navigateData.backValue)
        }
        this.go(index);
    },
    //刷新
    reload(){
        var currentPage = history.historyCache.get();
        this.redirectTo(path.relative(subPath, currentPage.url.path), currentPage.url.queryMap);
    }
}
