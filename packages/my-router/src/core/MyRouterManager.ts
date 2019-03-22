import MyHistory, {ChangeEventCallback} from 'my-router-history'
import {MyRouter as IMyRouter, MyRouterOptions, MyRouteConfig, Adapter, IPathRegexp, Location} from '../API'
import { LocationState } from './LocationState';
import { Deferred } from './util/Deferred';

/**
 * 路由管理类的实现
 * @export
 * @class MyRouter
 * @implements {IMyRouter}
 */
export class MyRouter implements IMyRouter {

    /**
     * 构造函数
     * @param {MyRouterOptions} options 
     * @memberOf MyRouter
     */
    constructor(options: MyRouterOptions){
        this._options = options
        this._history = new MyHistory({})

        this._history.onChange = ((action: 'init' | 'push' | 'goback' | 'replace' | 'reload', 
            oldLoction: Location, newLoction: Location, 
            discardLoctions: Location[], includeLoctions: Location[]) => {

            // 将新增的地址放入_stateCache
            includeLoctions.forEach((location)=>{
                this._stateCache[location.key] = new LocationState(location)
            })
                
            // 处理不同跳转类型的情况
            switch(action){
                case('init'):
                    this._currentId = newLoction.key
                    this._initDeferred.resolve(null)
                    break;
                case('goback'):
                    let oldState = oldLoction ? this._stateCache[oldLoction.key] : null
                    if(oldState){
                        var backValue = oldState.backValue;
                        if(backValue instanceof Error){
                            oldState.sessionDeferred.reject(backValue)
                        } else {
                            oldState.sessionDeferred.resolve(backValue)
                        }
                    }
                    break;
            }

            // 释放掉移除的地址数据。
            discardLoctions.forEach((location)=>{
                let state = this._stateCache[location.key]
                if(state){
                    state.destroy()
                    delete this._stateCache[location.key]
                }
            })
            
        }) as ChangeEventCallback
    }

    /**
     * Manager的配置
     * @private
     * @type {MyRouterOptions}
     * @memberOf MyRouter
     */
    private _options: MyRouterOptions

    /**
     * history模块
     * @private
     * @type {MyHistory}
     * @memberOf MyRouter
     */
    private _history: MyHistory

    /**
     * 地址查找函数
     * @private
     * @type {IPathRegexp}
     * @memberOf MyRouter
     */
    private _pathRegexp: IPathRegexp

    /**
     * 状态缓存
     * @private
     * @type {IPathRegexp}
     * @memberOf MyRouter
     */
    private _stateCache: {[name: string]: LocationState} = Object.create(null)

    /**
     * 初始化完成的promise
     * @private
     * @type {Deferred<any>}
     * @memberOf MyRouter
     */
    private _initDeferred: Deferred<any> = new Deferred<any>()

    /**
     * 当前state的ID
     * @private
     * @type {string}
     * @memberOf MyRouter
     */
    private _currentId: string

    /**
     * 当前state
     * @private
     * @type {IPathRegexp}
     * @memberOf MyRouter
     */
    private get _currentState(): LocationState{
        return this._stateCache[this._currentId] || null
    }

    /**
     * 路由模块当前的模式，目前仅提供浏览器模式，未来会提供
     * @type {string}
     * @memberOf MyRouter
     */
    get mode(): string{
        return this._options.mode
    }

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
    async push(path: string, sessionData?: any,state?: any): Promise<any>{
        // 必须要在初始化之后才能执行
        await this._initDeferred.promise

        //跳转到新页面,并且从页面再跳转回来的Deferred
        const backDeferred = new Deferred<any>()

        //如同url获取对应的路由信息
        const result = this._pathRegexp.recognize(path)
        
        // 真正的跳转
        await this._history.push(path, state)

        if(this._currentState){
            this._currentState.sessionDeferred = backDeferred
            this._currentState.recognizeResult = result
            return this._currentState.sessionDeferred.promise
        }
    }

    /**
     * 用一个URL代替当前的URL，跳转不产生历史记录，名字取自history.replace
     * @param {string} path                 去往的地址
     * @param {*} [sessionData]             session数据
     * @param {*} state                   跳转的数据，要求可以被JSON.stringify
     * @returns {Promise<void>}         回调的promise
     * @memberOf MyRouter
     */
    async replace(path: string, sessionData?: any, state?: any): Promise<void>{
        // 必须要在初始化之后才能执行
        await this._initDeferred.promise

        //如同url获取对应的路由信息
        const result = this._pathRegexp.recognize(path)
        const backDeferred = new Deferred<any>()

        await this._history.replace(path, state)

        if(this._currentState){
            this._currentState.sessionDeferred = backDeferred
            this._currentState.recognizeResult = result
            return this._currentState.sessionDeferred.promise
        }
    }

    /**
     * 向后回退。如果退回步数，超过了栈的长度，按照栈的长度算，名字取自history.goback
     * @param {number} n                    退回的步数
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf MyRouter
     */
    async goback(...arg: any[]): Promise<void>{
        // 必须要在初始化之后才能执行
        await this._initDeferred.promise

        await this._history.goback(...arg)
    }

    /**
     * 刷新当前页面，名字取自location.reload
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf IHistory
     */
    async reload(): Promise<void>{
        // 必须要在初始化之后才能执行
        await this._initDeferred.promise

        await this._history.reload()
    }
    
    /**
     * 增加一组MyRouteConfig
     * @param {MyRouteConfig[]} routes 
     * @memberOf MyRouter
     */
    addRoutes (routes: MyRouteConfig[]): void{
        this._pathRegexp.addRoutes(routes)
    }
    
    /**
     * 增加MyRouteConfig配置
     * @param {MyRouteConfig} routes 
     * @memberOf MyRouter
     */
    addRoute (route: MyRouteConfig): void{
        this._pathRegexp.addRoute(route)
    }

    /**
     * 
     * @param {String} url 
     * @returns {any[]} 
     * @memberOf MyRouter
     */
    getMatchedComponents (url: String): any[]{
        return null
    }

    /**
     * 
     * @param {*} adapter 
     * @memberOf IMyRouter
     */
    getAdapterInstance<T>(adapter: Adapter): T{
        return null
    }

}