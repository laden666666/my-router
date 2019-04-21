import { MyRouter as IMyRouter, MyRouterOptions, MyRouteConfig, Adapter, Location } from '../API';
/**
 * 路由管理类的实现
 * @export
 * @class MyRouter
 * @implements {IMyRouter}
 */
export declare class MyRouter implements IMyRouter {
    /**
     * 构造函数
     * @param {MyRouterOptions} options
     * @memberOf MyRouter
     */
    constructor(options: MyRouterOptions);
    /**
     * Manager的配置
     * @private
     * @type {MyRouterOptions}
     * @memberOf MyRouter
     */
    private _options;
    /**
     * history模块
     * @private
     * @type {MyHistory}
     * @memberOf MyRouter
     */
    private _history;
    /**
     * 地址查找函数
     * @private
     * @type {IPathRegexp}
     * @memberOf MyRouter
     */
    private _pathRegexp;
    /**
     * 状态缓存
     * @private
     * @type {IPathRegexp}
     * @memberOf MyRouter
     */
    private _stateCache;
    /**
     * 初始化完成的promise
     * @private
     * @type {Deferred<any>}
     * @memberOf MyRouter
     */
    private _initDeferred;
    /**
     * 当前state的ID
     * @private
     * @type {string}
     * @memberOf MyRouter
     */
    private _currentId;
    /**
     * 当前state
     * @private
     * @type {IPathRegexp}
     * @memberOf MyRouter
     */
    private readonly _currentState;
    /**
     * 路由模块当前的模式，目前仅提供浏览器模式，未来会提供
     * @type {string}
     * @memberOf MyRouter
     */
    readonly mode: string;
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
    * 前进去往一个页面，名字取自history.push，他可返回的是一个promise，当页面返回到当前页面，他能把backValue的返回值返回
    * @param {string} path                 去往的地址
    * @param {*} [sessionData]             session数据
    * @param {*} [state]                   跳转的数据，要求可以被JSON.stringify
    * @returns {Promise<any>}
    *
    * @memberOf MyRouter
    */
    push(path: string, sessionData?: any, state?: any): Promise<any>;
    /**
     * 用一个URL代替当前的URL，跳转不产生历史记录，名字取自history.replace
     * @param {string} path                 去往的地址
     * @param {*} [sessionData]             session数据
     * @param {*} state                   跳转的数据，要求可以被JSON.stringify
     * @returns {Promise<void>}         回调的promise
     * @memberOf MyRouter
     */
    replace(path: string, sessionData?: any, state?: any): Promise<void>;
    /**
     * 向后回退。如果退回步数，超过了栈的长度，按照栈的长度算，名字取自history.goback
     * @param {number} n                    退回的步数
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf MyRouter
     */
    goback(...arg: any[]): Promise<void>;
    /**
     * 刷新当前页面，名字取自location.reload
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf IHistory
     */
    reload(): Promise<void>;
    /**
     * 增加一组MyRouteConfig
     * @param {MyRouteConfig[]} routes
     * @memberOf MyRouter
     */
    addRoutes(routes: MyRouteConfig[]): void;
    /**
     * 增加MyRouteConfig配置
     * @param {MyRouteConfig} routes
     * @memberOf MyRouter
     */
    addRoute(route: MyRouteConfig): void;
    /**
     *
     * @param {String} url
     * @returns {any[]}
     * @memberOf MyRouter
     */
    getMatchedComponents(url: String): any[];
    /**
     *
     * @param {*} adapter
     * @memberOf IMyRouter
     */
    getAdapterInstance<T>(adapter: Adapter): T;
}
