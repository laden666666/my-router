/**
 * MyRouter类
 * @interface MyRouter
 */
interface IMyRouter{

    /**
     * 构造方法
     * @param {MyRouterOptions} [options] 
     * @memberOf MyRouter
     */
    constructor (options?: MyRouterOptions);

    /**
     * 路由模块当前的模式
     * @type {string}
     * @memberOf MyRouter
     */
    mode: string;

    /**
     * 当前的路由实例
     * @type {Location}
     * @memberOf MyRouter
     */
    readonly currentRoute: Location;

    /**
     * 缓存的路由队列
     * @type {Location[]}
     * @memberOf MyRouter
     */
    readonly routeStack: Location[];
  
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
    
    /**
     * 增加一组MyRouteConfig
     * @param {MyRouteConfig[]} routes 
     * @memberOf MyRouter
     */
    addRoutes (routes: MyRouteConfig[]): void;
    
    /**
     * 增加MyRouteConfig配置
     * @param {MyRouteConfig} routes 
     * @memberOf MyRouter
     */
    addRoute (routes: MyRouteConfig): void;

    /**
     * 
     * @param {String} url 
     * @returns {any[]} 
     * @memberOf MyRouter
     */
    getMatchedComponents (url: String): any[];
}

/**
 * 创建MyRouter的配置
 * @export
 * @interface MyRouterOptions
 */
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
    // 映射的路径
    path: string;
    // 映射的名字
    name?: string;
    // 对应的控件
    component?: any;
    // 如果多个并列的视图，可以使用components配置
    components?: {[name: string]: any};
    // 重定向到某个路由
    redirect?: string | {(): string};
    // ？？？？
    alias?: string | string[];
    // 路由嵌套时候，可以注册子路由
    children?: MyRouteConfig[];
    // 用户自定义配置
    meta?: any;
    // 匹配规则是否大小写敏感
    caseSensitive?: boolean;
    // 它的作用几乎和standard一样。唯一不同的是，如果已经存在在栈顶在对方的任务一个同类型的活动实例，不会有任何新的activity创造，而是被发送到一个存在的activity实例通过onNewIntent() 方法的意图
    lunchMode: 'standard' | 'singleTop' | 'singleTask' | 'singleInstance'
}

export interface Location {
    name?: string;
    path?: string;
    hash?: string;
    query?: {[name: string]: string[] | string}
    params?: {[name: string]: string}
}
  
/**
 * 一个URL匹配工具，系统默认会使用path-to-regexp实现，但是用户可以根据自己需要，定制化path-to-regexp
 * @interface PathRegexp
 */
interface PathRegexp{

}