import {RouterAction} from '../RouterAction'
import {
    IRouterURL,
} from '../histort/'
import { RouteData } from './RouteData'
import { IRouterConfig, Route } from './IRouterConfig'

/**
 * 监听路由变化
 * @interface URLChangeListener
 */
export type URLChangeListener = {
    (result:RouterAction, from: RouteData, to:RouteData, clearState: RouteData[]): void
}

/**
 * 监听路由变化
 * @interface URLChangeListener
 */
export type BeforeRouteEnterListener = {
    (result:RouterAction, from: RouteData, to:RouteData, clearState: RouteData[]): boolean | Promise<boolean>
}

/**
 * 监听路由清除
 * @interface DestroyStateListener
 */
export type DestroyStateListener = {
    (routeDatas:RouteData[]):void
}

/**
 * 路由改变前的的监听事件
 * @interface BeforeUpdateListener
 */
export type BeforeUpdateListener = {
    (from:RouteData, to:RouteData):Promise<any>
}

/**
 * 负责监听页面跳转事件和触发页面跳转的类。要求必须是单例的,提供跳转的功能
 * 他是各种不同浏览器历史模块的门面，同时将历史
 */
export interface IRouterManager{

    /**
     * 注册Route
     * @param {Route} route 
     */
    addRoute(route: Route):void
    
    /**
     * 注册多个Route
     * @param {Route[]} routes
     */
    addRoutes(routes: Route[]):void

    /**
     * 设置清除缓存的回调方法
     * @type {DestroyStateListener}
     */
    addDestroyStateListener(fn: DestroyStateListener):void

    /**
     * 移除清除缓存的回调方法
     * @type {DestroyStateListener}
     */
    removeDestroyStateListener(fn: DestroyStateListener):void
    
    /**
     * 设置url变化的回调方法
     * @param {URLChangeListener} fn 
     */
    addURLChangeListener(fn: URLChangeListener):void
    
    /**
     * 移除url变化的回调方法
     * @param {URLChangeListener} fn 
     */
    removeURLChangeListener(fn: URLChangeListener):void
    
    /**
     * 设置路由处理前的回调方法
     * @param {BeforeRouteEnterListener} fn 
     */
    addBeforeRouteEnterListener(fn: BeforeRouteEnterListener):void
    
    /**
     * 移除路由处理前的回调方法
     * @param {BeforeRouteEnterListener} fn 
     */
    removeBeforeRouteEnterListener(fn: BeforeRouteEnterListener):void
    /**
     * 设置url改变之前的回调方法
     * @param {BeforeUpdateListener} fn 
     */
    addBeforeUpdateListener(fn: BeforeUpdateListener):void
    
    /**
     * 移除url改变之前的回调方法
     * @param {BeforeUpdateListener} fn 
     */
    removeBeforeUpdateListener(fn: BeforeUpdateListener):void
    
    /**
     * 获取当前url
     * @returns {string}        当前页面的url                
     */
    getCurrentURL(): IRouterURL

    /**
     * 获取当前urlState
     * @returns {RouteData}   当前页面对应的路由信息                 
     */
    getCurrentRouteData(): RouteData
    
    /**
     * 带导航session的push封装，和push相比，他可返回的是一个promise，当页面返回到当前页面（session结束），他能把session的返回值返回
     * @param {string} urlPath             要跳转页面的url
     * @param {object} urlQuery            查询参数
     * @param {object} sessionData         session参数
     * @returns {Promise<any>}             回调的promise 
     */
    navigateTo(urlPath:string, urlQuery: object, sessionData: object): Promise<any>
    
    /**
     * 带导航session的replace封装，和replace相比，他可返回的是一个promise，当页面返回到当前页面（session结束），他能把session的返回值返回
     * @param {string} urlPath             要跳转页面的url
     * @param {object} urlQuery            查询参数
     * @param {object} sessionData         session参数
     * @returns {Promise<any>}             回调的promise 
     */
    redirectTo(urlPath:string, urlQuery: object, sessionData: object): Promise<any>

    /**
     * 刷新页面
     * @returns {Promise<any>} 
     */
    reload(): Promise<any>
        
    /**
     * 设置当前页面的返回值，可以通过session返回给
     * @param {any} backValue 
     * @memberof IHistoryManager
     */
    setBackValue(backValue: any): void
    
    /**
     * 返回之前页面。
     * @param {*} data                      设置的返回值             
     * @param {number} index                默认缓存一页 
     */
    navigateBack(data: any, index:number): void;

    /**
     * 清除缓存页面的路由信息（当前页面不可清除）
     * @param {string} toId                 开始清除的页面的路由信息id
     * @param {string} fromId               结束的页面的路由信息id
     */
    destroyState(toId: string, fromId: string): void
}