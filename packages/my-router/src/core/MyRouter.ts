import MyHistory, { Location as HLocation } from 'my-router-history'
import {
    MyRouter as IMyRouter,
    MyRouterOptions,
    MyRouteConfig,
    Adapter,
    IPathRegexp,
    Location,
    PopEventCallback,
    BeforeChangeEventCallback,
    ChangeEventCallback
} from '../API'
import { LocationState } from './LocationState';
import { Deferred } from './util/Deferred';
import { PathRegexp } from './PathRegexp';

// 默认配置
let defaultOptions: MyRouterOptions = {
    routes: [],
    // precisionMatch?: boolean;
    mode: '',
    base: '/',
    onBeforeURLChange: [],
    onURLChange: [],
    onPopLocation: [],
}

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
        this._options = {
            ...defaultOptions,
            ...options,
        }
        this._history = new MyHistory(this._options)

        this.addBeforeURLChange(this._options.onBeforeURLChange)
        this.addURLChange(this._options.onURLChange)
        this.addPopLocation(this._options.onPopLocation)

        this._pathRegexp.addRoutes(this._options.routes)

        this._history.onBeforeChange = async (action: 'push' | 'goback' | 'replace' | 'reload',
            oldLoction: HLocation, newLoction: HLocation,
            discardLoctions: HLocation[], includeLoctions: HLocation[]) => {

            this._cacheSession = this._cacheSession || {}
            this._cacheSession.map = this._cacheSession.map || {}

            // 将新增的地址放入_cacheSession，在onChange中，再将他们放入_stateCache中
            includeLoctions.forEach((location)=>{
                let state = new LocationState(location)
                state.recognizeResult = this._pathRegexp.recognize(state.hLocation.href)
                this._cacheSession.map[location.key] = state
            })

            // 将缓存的push、replace的session数据，放入缓存的LocationState对象中
            if(this._cacheSession.data !== undefined && newLoction){
                this._cacheSession.map[newLoction.key].data = this._cacheSession.data
                this._cacheSession.data = null
                this._cacheSession.map[newLoction.key].sessionDeferred = this._cacheSession.backDeferred
            }
        }

        this._history.onChange = async (action: 'init' | 'push' | 'goback' | 'replace' | 'reload',
            oldLoction: HLocation, newLoction: HLocation,
            discardLoctions: HLocation[], includeLoctions: HLocation[]) => {

            let newState = this._getStateByKey(newLoction.key, false)

            if(action === 'init'){
                this._stateCache[newLoction.key] = new LocationState(newLoction)
            } else {
                // 将缓存的_cacheSession对象放入_stateCache中
                for(let key in this._cacheSession.map){
                    this._stateCache[key] = this._cacheSession.map[key]
                }
                this._cacheSession = null
            }

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

            this._changes.forEach(async callback=>{
                await callback(action,
                    oldLoction ? this._getLoctionByKey(oldLoction.key) : null,
                    newLoction ? this._getLoctionByKey(newLoction.key) : null,
                    discardLoctions.map(l=>this._getLoctionByKey(l.key)),
                    includeLoctions.map(l=>this._getLoctionByKey(l.key)),
                )
            })

            if(newState){
                if(newState.backValue instanceof Error){
                    newState.sessionDeferred.reject(newState.backValue)
                } else {
                    newState.sessionDeferred.resolve(newState.backValue)
                }
            }

            // 释放掉移除的地址数据。
            // discardLoctions.forEach((location)=>{
            //     let state = this._stateCache[location.key]
            //     if(state){
            //         state.destroy()
            //         delete this._stateCache[location.key]
            //     }
            // })

        }
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
    private _pathRegexp: IPathRegexp = new PathRegexp()

    /**
     * 状态缓存
     * @private
     * @type {IPathRegexp}
     * @memberOf MyRouter
     */
    private _stateCache: {[name: string]: LocationState} = Object.create(null)

    /**
     * 根据key获取state对象
     * @private
     * @param {string} key          historylocation的key
     * @returns {LocationState}
     * @memberof MyRouter
     */
    private _getStateByKey(key: string, hasCache: boolean = true): LocationState{
        return (hasCache && this._cacheSession && this._cacheSession.map && this._cacheSession.map[key])
            || this._stateCache[key] || null
    }

    /**
     * 根据key获取location对象
     * @private
     * @param {string} key          historylocation的key
     * @returns {LocationState}
     * @memberof MyRouter
     */
    private _getLoctionByKey(key: string): Location {
        let state = this._getStateByKey(key)
        return state ? LocationState.toLocation(state) : null
    }

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
    get currentRoute(): Location{
        let loction = this._history.location
        return this._getLoctionByKey(loction.key)
    }

    /**
     * 缓存的路由队列
     * @type {Location[]}
     * @memberOf MyRouter
     */
    get routeStack(): Location[] {
        return this._history.stack.map(l=> this._getLoctionByKey(l.key))
    }

    /**
     * 注册BeforeChange生命周期
     * @param callback
     */
    private _beforeChanges: BeforeChangeEventCallback[] = []
    addBeforeURLChange(callback: BeforeChangeEventCallback | BeforeChangeEventCallback[]){
        if(callback){
            ;(Array.isArray(callback) ? callback : [callback])
                .map(callback=>this._beforeChanges.push(callback))
        }
    }

    /**
     * 注册URLChange生命周期
     * @param {ChangeEventCallback} callback
     * @memberOf MyRouter
     */
    private _changes: ChangeEventCallback[] = []
    addURLChange(callback: ChangeEventCallback | ChangeEventCallback[]){
        if(callback){
            ;(Array.isArray(callback) ? callback : [callback])
                .map(callback=>this._changes.push(callback))
        }
    }

    /**
     * 注册
     * @type {{(locations: Location[]): void}}
     * @memberOf MyRouter
     */
    private _popEvent: PopEventCallback[] = []
    addPopLocation(callback: PopEventCallback | PopEventCallback[]){
        if(callback){
            ;(Array.isArray(callback) ? callback : [callback])
                .map(callback=>this._popEvent.push(callback))
        }
    }

    /**
     * 用于临时保存session
     * @type {*}
     * @memberof MyRouter
     */
    _cacheSession: {
        data?: any,
        backDeferred?: Deferred<any>
        map?: Record<string, LocationState>
    };

     /**
     * 前进去往一个页面，名字取自history.push，他可返回的是一个promise，当页面返回到当前页面，他能把backValue的返回值返回
     * @param {string} path                 去往的地址
     * @param {*} [sessionData]             session数据
     * @param {*} [state]                   跳转的数据，要求可以被JSON.stringify
     * @returns {Promise<any>}
     * @memberOf MyRouter
     */
    async push(path: string, sessionData?: any, state?: any): Promise<any>{
        // 必须要在初始化之后才能执行
        await this._initDeferred.promise

        this._history.checkBusy()

        // 跳转到新页面,并且从页面再跳转回来的Deferred
        const backDeferred = new Deferred<any>()

        this._cacheSession = {data: sessionData, backDeferred}

        // 真正的跳转
        await this._history.push(path, state)
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

        // 如同url获取对应的路由信息
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
     * 销毁路由实例
     * @memberOf IMyRouter
     */
    async destroy(): Promise<void>{
        await this._history.destroy()
        this._history = null
        this._options = null
        this._pathRegexp = null
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
