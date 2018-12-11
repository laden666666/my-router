/**
 * @file
 * 路由的统一管理类，用于管理路由相关信息，
 */
import { IRouterManager, BeforeRouteEnterListener } from './IRouterManager';
import { RouteData } from './RouteData';
import { RouterAction } from '../RouterAction';
import { IRouterConfig, Route } from './IRouterConfig';
import { IRouterURL } from '../histort/';
export { RouteData, IRouterConfig, Route };
/**
 * 负责监听页面跳转事件和触发页面跳转的类。要求必须是单例的,提供跳转的功能
 */
export declare class RouterManager implements IRouterManager {
    /**
     * 默认配置
     * @type {IRouterConfig}
     */
    private config;
    /**
     * 保存注册的history的change事件的回调函数
     * @private
     * @type {URLChangeListener[]}
     */
    private _funArray;
    /**
     * 清除缓存事件
     */
    private _clearFunArray;
    /**
     *
     * @private
     * @type {BeforeUpdateListener[]}
     */
    private _beforeUpdateArray;
    /**
     *
     * @private
     * @type {BeforeUpdateListener[]}
     */
    private _beforeRouteEnterArray;
    /**
     * 缓存路由会话的数据
     * @private
     * @type {*}
     */
    private _cacheURLState;
    /**
     * 做路由状态匹配使用的
     * @private
     * @type {*}
     */
    private _routeRecognizer;
    /**
     * HistoryCache对象
     * @type {StateCache}
     */
    private stateCache;
    /**
     * History对象
     * @type {*}
     */
    private history;
    /**
     * 初始化完成的promise
     * @type {*}
     */
    private initDeferred;
    /**
     * 构造函数
     */
    constructor(config: IRouterConfig);
    /**
     * 注册Route
     * @param {Route} route
     */
    addRoute(route: Route): void;
    /**
     * 注册多个Route
     * @param {Route[]} routes
     */
    addRoutes(routes: Route[]): void;
    /**
     * 设置清除缓存的回调方法
     * @type {{(routeDatas:RouteData[]):void}}
     */
    addDestroyStateListener(fn: {
        (routeDatas: RouteData[]): void;
    }): void;
    /**
     * 移除清除缓存的回调方法
     * @type {{(routeDatas:RouteData[]):void}}
     */
    removeDestroyStateListener(fn: {
        (routeDatas: RouteData[]): void;
    }): void;
    /**
     * 设置url变化的回调方法
     * @param {{(result:RouterAction, from:RouteData, to: RouteData, clearState: RouteData[]): void}} fn
     */
    addURLChangeListener(fn: {
        (result: RouterAction, from: RouteData, to: RouteData, clearState: RouteData[]): void;
    }): void;
    /**
     * 移除url变化的回调方法
     * @param {{(result:RouterAction, from:RouteData, to: RouteData, clearState: RouteData[]): void}} fn
     */
    removeURLChangeListener(fn: {
        (result: RouterAction, from: RouteData, to: RouteData, clearState: RouteData[]): void;
    }): void;
    /**
     * 设置url改变之前的回调方法
     * @param {{(from:RouteData, to:RouteData):Promise<any>}} fn
     */
    addBeforeUpdateListener(fn: {
        (from: RouteData, to: RouteData): Promise<any>;
    }): void;
    /**
     * 移除url改变之前的回调方法
     * @param {{(from:RouteData, to:RouteData):Promise<any>}} fn
     */
    removeBeforeUpdateListener(fn: {
        (from: RouteData, to: RouteData): Promise<any>;
    }): void;
    /**
     * 设置url改变之前的回调方法
     * @param {BeforeRouteEnterListener} fn
     */
    addBeforeRouteEnterListener(fn: BeforeRouteEnterListener): void;
    /**
     * 移除url变化的回调方法
     * @param {{(result:RouterAction, from:RouteData, to: RouteData, clearState: RouteData[]): void}} fn
     */
    removeBeforeRouteEnterListener(fn: {
        (result: RouterAction, from: RouteData, to: RouteData, clearState: RouteData[]): void;
    }): void;
    /**
     * 获取当前url
     * @returns {string}
     */
    getCurrentURL(): IRouterURL;
    /**
     * 获取当前页面的路由数据
     * @returns {RouteData}
     */
    getCurrentRouteData(): RouteData;
    /**
     * 带导航session的push封装，和push相比，他可返回的是一个promise，当页面返回到当前页面，他能把backValue的返回值返回
     * @param {string} urlPath             要跳转页面的url
     * @param {object} urlQuery            查询参数
     * @param {object} sessionData         缓存数据
     * @returns {Promise<any>}             回调的promise
     */
    navigateTo(urlPath: string, urlQuery?: object, sessionData?: object): Promise<any>;
    /**
     * 带导航session的replace封装，和replace相比，他可返回的是一个promise，当页面返回到当前页面（session结束），他能把session的返回值返回
     * @param {string} urlPath             要跳转页面的url
     * @param {object} urlQuery            查询参数
     * @param {object} sessionData         缓存数据
     * @returns {Promise<any>}             回调的promise
     */
    redirectTo(urlPath: string, urlQuery?: object, sessionData?: object): Promise<any>;
    /**
     * 刷新
     * @returns {Promise<any>}             回调的promise
     */
    reload(): Promise<any>;
    /**
     * 设置当前页面的返回值，可以通过session返回给
     * @param {any} backValue
     * @memberof IHistoryManager
     */
    setBackValue(backValue: any): void;
    /**
     * 返回之前页面。
     * @param {*} data
     * @param {number} index                返回上一级的层数，默认一层
     * @memberof IRouterManager
     */
    navigateBack(data: any, index?: number): Promise<void>;
    /**
     * 安装id区间清除缓存
     * @param {string} toId             从toID开始清除
     * @param {string} fromId           清除到哪个ID
     * @returns {string[]}
     */
    destroyState(toId: string, fromId: string): void;
}
