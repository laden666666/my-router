// import {RouterAction} from '../RouterAction'
// import {
//     IRouterURL,
// } from '../histort/'
// import { RouteData } from './RouteData'
// import { IRouterConfig, Route } from './IRouterConfig'

// // /**
// //  * 监听路由变化
// //  * @interface URLChangeListener
// //  */
// // export type URLChangeListener = {
// //     (result:RouterAction, from: RouteData, to:RouteData, clearState: RouteData[]): void
// // }

// // /**
// //  * 监听路由变化
// //  * @interface URLChangeListener
// //  */
// // export type BeforeRouteEnterListener = {
// //     (result:RouterAction, from: RouteData, to:RouteData, clearState: RouteData[]): boolean | Promise<boolean>
// // }

// /**
//  * 监听路由清除
//  * @interface DestroyStateListener
//  */
// export type DestroyStateListener = {
//     (routeDatas:RouteData[]):void
// }

// /**
//  * 路由改变前的的监听事件
//  * @interface BeforeUpdateListener
//  */
// export type BeforeUpdateListener = {
//     (from:RouteData, to:RouteData):Promise<any>
// }

// /**
//  * 负责监听页面跳转事件和触发页面跳转的类。要求必须是单例的,提供跳转的功能
//  * 他是各种不同浏览器历史模块的门面，同时将历史
//  */
// export interface IRouterManager{

//     /**
//      * 注册Route
//      * @param {Route} route 
//      */
//     addRoute(route: Route):void
    
//     /**
//      * 注册多个Route
//      * @param {Route[]} routes
//      */
//     addRoutes(routes: Route[]):void

//     /**
//      * 设置清除缓存的回调方法
//      * @type {DestroyStateListener}
//      */
//     addDestroyStateListener(fn: DestroyStateListener):void

//     /**
//      * 移除清除缓存的回调方法
//      * @type {DestroyStateListener}
//      */
//     removeDestroyStateListener(fn: DestroyStateListener):void
    
//     /**
//      * 设置url变化的回调方法
//      * @param {URLChangeListener} fn 
//      */
//     addURLChangeListener(fn: URLChangeListener):void
    
//     /**
//      * 移除url变化的回调方法
//      * @param {URLChangeListener} fn 
//      */
//     removeURLChangeListener(fn: URLChangeListener):void
    
//     /**
//      * 设置路由处理前的回调方法
//      * @param {BeforeRouteEnterListener} fn 
//      */
//     addBeforeRouteEnterListener(fn: BeforeRouteEnterListener):void
    
//     /**
//      * 移除路由处理前的回调方法
//      * @param {BeforeRouteEnterListener} fn 
//      */
//     removeBeforeRouteEnterListener(fn: BeforeRouteEnterListener):void
//     /**
//      * 设置url改变之前的回调方法
//      * @param {BeforeUpdateListener} fn 
//      */
//     addBeforeUpdateListener(fn: BeforeUpdateListener):void
    
//     /**
//      * 移除url改变之前的回调方法
//      * @param {BeforeUpdateListener} fn 
//      */
//     removeBeforeUpdateListener(fn: BeforeUpdateListener):void
    
//     /**
//      * 获取当前url
//      * @returns {string}        当前页面的url                
//      */
//     getCurrentURL(): IRouterURL

//     /**
//      * 获取当前urlState
//      * @returns {RouteData}   当前页面对应的路由信息                 
//      */
//     getCurrentRouteData(): RouteData
    
//     /**
//      * 带导航session的push封装，和push相比，他可返回的是一个promise，当页面返回到当前页面（session结束），他能把session的返回值返回
//      * @param {string} urlPath             要跳转页面的url
//      * @param {object} urlQuery            查询参数
//      * @param {object} sessionData         session参数
//      * @returns {Promise<any>}             回调的promise 
//      */
//     navigateTo(urlPath:string, urlQuery: object, sessionData: object): Promise<any>
    
//     /**
//      * 带导航session的replace封装，和replace相比，他可返回的是一个promise，当页面返回到当前页面（session结束），他能把session的返回值返回
//      * @param {string} urlPath             要跳转页面的url
//      * @param {object} urlQuery            查询参数
//      * @param {object} sessionData         session参数
//      * @returns {Promise<any>}             回调的promise 
//      */
//     redirectTo(urlPath:string, urlQuery: object, sessionData: object): Promise<any>

//     /**
//      * 刷新页面
//      * @returns {Promise<any>} 
//      */
//     reload(): Promise<any>
        
//     /**
//      * 设置当前页面的返回值，可以通过session返回给
//      * @param {any} backValue 
//      * @memberof IHistoryManager
//      */
//     setBackValue(backValue: any): void
    
//     /**
//      * 返回之前页面。
//      * @param {*} data                      设置的返回值             
//      * @param {number} index                默认缓存一页 
//      */
//     navigateBack(data: any, index:number): void;

//     /**
//      * 清除缓存页面的路由信息（当前页面不可清除）
//      * @param {string} toId                 开始清除的页面的路由信息id
//      * @param {string} fromId               结束的页面的路由信息id
//      */
//     destroyState(toId: string, fromId: string): void
// }


// export interface IRouterConfig{
//     //路由的模式，包括：hash -> hash路由，browser -> historyState路由，m -> 内存路由（仅测试用，正式环境禁用）
//     mode?: HistoryType,
//     //route的列表，一个Route包含：path是匹配这个路由的url，component是路由控件，meta是用户的配置
//     routes?: Route[],

//     //url将要改变事件
//     onBeforeURLChange?: BeforeUpdateListener[] | BeforeUpdateListener,
//     //url改变事件
//     onURLChange?: URLChangeListener[] | URLChangeListener,
//     //url改变后，执行路由响应前的事件
//     onBeforeRouteEnter?: BeforeRouteEnterListener[] | BeforeRouteEnterListener,
//     //缓存的用户的访问信息被消耗的事件
//     onDestroyState?: DestroyStateListener[] | DestroyStateListener,
// }

/**
 * 
 * @interface MyRouter
 */
interface MyRouter{
    constructor (options?: MyRouterOptions);

    mode: string;

    readonly currentRoute: Route;

    readonly routeStack: Route;
  
   /**
     * 前进去往一个页面，名字取自history.push
     * @param {string} path                 去往的地址
     * @param {any} state                   跳转的数据，要求可以被JSON.stringify
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf IHistory
     */
    push(path: string, state?: any): Promise<Location>

    /**
     * 用一个URL代替当前的URL，跳转不产生历史记录，名字取自history.replace
     * @param {string} path                 去往的地址
     * @param {any} state                   跳转的数据，要求可以被JSON.stringify
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf IHistory
     */
    replace(path: string, state?: any): Promise<Location>

    /**
     * 向后回退。如果退回步数，超过了栈的长度，按照栈的长度算，名字取自history.goback
     * @param {number} n                    退回的步数
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf IHistory
     */
    goback(n?: number): Promise<Location>

    /**
     * 退回到指定的path，如果为找到合适path，跳回到root
     * @param {string} path                 指定的path
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf IHistory
     */
    goback(path: string): Promise<Location>

    /**
     * 退回到符合条件的location，如果为找到合适path，跳回到root
     * @param {(fn: ReadonlgLocation)=>boolean} fn      条件函数
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf IHistory
     */
    goback(fn: (fn: Location)=>boolean): Promise<Location>

    /**
     * 刷新当前页面，名字取自location.reload
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf IHistory
     */
    reload(): Promise<Location>

    getMatchedComponents (to?: RawLocation | Route): Component[];
    onReady (cb: Function, errorCb?: ErrorHandler): void;
    onError (cb: ErrorHandler): void;
    addRoutes (routes: RouteConfig[]): void;
    resolve (to: RawLocation, current?: Route, append?: boolean): {
      location: Location;
      route: Route;
      href: string;
      // backwards compat
      normalizedTo: Location;
      resolved: Route;
    };
  
    static install: PluginFunction<never>;
}

export interface MyRouterOptions {
    // 初始化注册的路由对象配置
    routes?: MyRouteConfig[];
    // 路由模式，支持内存和浏览器两种模式
    mode?: string;
    // 应用的基路径。例如，如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"
    base?: string;
    // 一部分浏览器按住返回按钮，会显示全部历史记录信息。该字段用于配置历史信息中返回页面的名字
    gobackName?: string;
}

/**
 * 
 * @interface MyRouter
 */
interface MyRouteConfig{
    path: string;
    name?: string;
    component?: Component;
    components?: Dictionary<Component>;
    redirect?: RedirectOption;
    alias?: string | string[];
    children?: RouteConfig[];
    meta?: any;
    beforeEnter?: NavigationGuard;
    props?: boolean | Object | RoutePropsFunction;
    caseSensitive?: boolean;
    pathToRegexpOptions?: PathToRegexpOptions;
    // 它的作用几乎和standard一样。唯一不同的是，如果已经存在在栈顶在对方的任务一个同类型的活动实例，不会有任何新的activity创造，而是被发送到一个存在的activity实例通过onNewIntent() 方法的意图
    // 它的作用几乎和standard一样。唯一不同的是，如果已经存在在栈顶在对方的任务一个同类型的活动实例，不会有任何新的activity创造，而是被发送到一个存在的activity实例通过onNewIntent() 方法的意图
    'standard' | 'singleTop' | 'singleTask' | 'singleInstance'
}


export interface RouteRecord {
    path: string;
    regex: RegExp;
    components: Dictionary<Component>;
    instances: Dictionary<Vue>;
    name?: string;
    parent?: RouteRecord;
    redirect?: RedirectOption;
    matchAs?: string;
    meta: any;
    beforeEnter?: (
      route: Route,
      redirect: (location: RawLocation) => void,
      next: () => void
    ) => any;
    props: boolean | Object | RoutePropsFunction | Dictionary<boolean | Object | RoutePropsFunction>;
  }
  
  export interface Location {
    name?: string;
    path?: string;
    hash?: string;
    query?: Dictionary<string | (string | null)[] | null | undefined>;
    params?: Dictionary<string>;
    append?: boolean;
    replace?: boolean;
  }
  
  export interface Route {
    path: string;
    name?: string;
    hash: string;
    query: Dictionary<string | (string | null)[]>;
    params: Dictionary<string>;
    fullPath: string;
    matched: RouteRecord[];
    redirectedFrom?: string;
    meta?: any;
  }


export interface Location {
    name?: string;
    path?: string;
    hash?: string;
    query?: Dictionary<string | (string | null)[] | null | undefined>;
    params?: Dictionary<string>;
    append?: boolean;
    replace?: boolean;
  }

/**
 * 一个URL匹配工具，系统默认会使用path-to-regexp实现，但是用户可以根据自己需要，定制化path-to-regexp
 * @interface PathRegexp
 */
interface PathRegexp{

}