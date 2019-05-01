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
    ChangeEventCallback,
    RouterActionResult
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
            oldHLoction: HLocation, newHLoction: HLocation,
            discardHLoctions: HLocation[], includeHLoctions: HLocation[]) => {

            this._cacheSession = this._cacheSession || {}
            this._cacheSession.map = this._cacheSession.map || {}

            // 将新增的地址放入_cacheSession，在onChange中，再将他们放入_stateCache中
            includeHLoctions.forEach((location)=>{
                let state = new LocationState(location)
                state.recognizeResult = this._pathRegexp.recognize(state.hLocation.href)
                this._cacheSession.map[location.key] = state
            })

            // 将缓存的push、replace的session数据，放入缓存的LocationState对象中
            if(this._cacheSession.data !== undefined && newHLoction){
                this._cacheSession.map[newHLoction.key].data = this._cacheSession.data
                this._cacheSession.data = null
            }

            let oldLoction = oldHLoction ? this._getLoctionByKey(oldHLoction.key) : null
            let newLoction = newHLoction? this._getLoctionByKey(newHLoction.key) : null
            let discardLoctions = discardHLoctions.map(l=>this._getLoctionByKey(l.key)).filter(i=>!!i)
            let includeLoctions = includeHLoctions.map(l=>this._getLoctionByKey(l.key)).filter(i=>!!i)
            this._isBeforeChanging = true
            for(let i = 0 ; i < this._beforeChanges.length; i++){
                let callback = this._beforeChanges[i]
                let result: ReturnType<BeforeChangeEventCallback>
                try {
                    result = await callback(action,
                        oldLoction,
                        newLoction,
                        discardLoctions,
                        includeLoctions)
                } catch (e){
                    console.error(e)
                    result = e
                }

                if(result === false || typeof result === 'function' || result instanceof Error){
                    this._isBeforeChanging = false
                    return result
                }
            }
            this._isBeforeChanging = false
        }

        this._history.onChange = async (action: 'init' | 'push' | 'goback' | 'replace' | 'reload',
            oldHLoction: HLocation, newHLoction: HLocation,
            discardHLoctions: HLocation[], includeHLoctions: HLocation[]) => {

            if(action === 'init'){
                let href = newHLoction.href
                ;(async ()=>{
                    try{
                        await this._history.replace(href)
                    }catch(e){
                        // this._stateCache[this._history.location.key] = new
                        this._initDeferred.resolve(null)
                    }
                })()
                return
            } else if(!this._initDeferred.isFinished){
                this._initDeferred.resolve(null)
            }

            // 将缓存的_cacheSession对象放入_stateCache中
            for(let key in this._cacheSession.map){
                this._stateCache[key] = this._cacheSession.map[key]
            }
            this._cacheSession = null

            let newState = this._getStateByKey(newHLoction.key, false)

            // 处理不同跳转类型的情况
            switch(action){
                case('goback'):
                    let oldState = oldHLoction ? this._getStateByKey(oldHLoction.key) : null
                    if(oldState && newState){
                        var backValue = oldState.backValue;
                        if(backValue instanceof Error){
                            newState.sessionDeferred.reject(backValue)
                        } else {
                            newState.sessionDeferred.resolve(backValue)
                        }
                    }
                    break;
            }

            let oldLoction = oldHLoction ? this._getLoctionByKey(oldHLoction.key) : null
            let newLoction = newHLoction? this._getLoctionByKey(newHLoction.key) : null
            let discardLoctions = discardHLoctions.map(l=>this._getLoctionByKey(l.key)).filter(i=>!!i)
            let includeLoctions = includeHLoctions.map(l=>this._getLoctionByKey(l.key)).filter(i=>!!i)
            this._changes.forEach(async callback=>{
                await callback(action,
                    oldLoction,
                    newLoction,
                    discardLoctions,
                    includeLoctions,
                )
            })

            // 释放掉移除的地址数据。
            discardHLoctions.forEach((location)=>{
                let state = this._stateCache[location.key]
                if(state){
                    state.destroy()
                    delete this._stateCache[location.key]
                }
            })
            this._popEvent.forEach(async (event)=>{
                await event.call(this, discardLoctions)
            })

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
     * 当前state
     * @private
     * @type {IPathRegexp}
     * @memberOf MyRouter
     */
    private get _currentState(): LocationState{
        return this._stateCache[this._history.location.key] || null
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
        map?: Record<string, LocationState>
    };

    _isBeforeChanging: boolean = false
    /**
     * 校验是否空闲
     * @memberof MyRouter
     */
    _checkBusy(){
        if(this._isBeforeChanging){
            throw new Error()
        }
    }

     /**
     * 前进去往一个页面，名字取自history.push，他可返回的是一个promise，当页面返回到当前页面，他能把backValue的返回值返回
     * @param {string} path                 去往的地址
     * @param {*} [sessionData]             session数据
     * @param {*} [state]                   跳转的数据，要求可以被JSON.stringify
     * @returns RouterActionResult
     * @memberOf MyRouter
     */
    push(path: string, sessionData?: any, state?: any): RouterActionResult{
        this._checkBusy()

        let result: RouterActionResult = Promise.resolve()
        .then(()=>{
            // 必须要在初始化之后才能执行
            return this._initDeferred.promise
        })
        .then(()=>{
            this._history.checkBusy()

            this._cacheSession = { data: sessionData }

            // 跳转到新页面,并且从页面再跳转回来的Deferred
            if(this._currentState){
                this._currentState.sessionDeferred = backDeferred
            }

        })
        .then(()=>{
            return this._history.push(path, state).then(()=>{})
        }) as RouterActionResult
        const backDeferred = new Deferred()
        result.comeBack = backDeferred.promise
        return result
    }

    /**
     * 用一个URL代替当前的URL，跳转不产生历史记录，名字取自history.replace
     * @param {string} path                 去往的地址
     * @param {*} [sessionData]             session数据
     * @param {*} state                   跳转的数据，要求可以被JSON.stringify
     * @returns {Promise<void>}         回调的promise
     * @memberOf MyRouter
     */
    replace(path: string, sessionData?: any, state?: any): Promise<void>{
        this._checkBusy()

        // 必须要在初始化之后才能执行
        return this._initDeferred.promise.then(()=>{
            this._history.checkBusy()

            this._cacheSession = { data: sessionData }
            return this._history.replace(path, state).then(()=>{})
        })
    }

    /**
     * 向后回退。如果退回步数，超过了栈的长度，按照栈的长度算，名字取自history.goback
     * @param {number} n                    退回的步数
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf MyRouter
     */
    goback(...arg: any[]): Promise<void>{
        this._checkBusy()

        // 必须要在初始化之后才能执行
        return this._initDeferred.promise
        .then(()=>this._history.goback(...arg))
        .then(()=>{})
    }

    /**
     * 刷新当前页面，名字取自location.reload
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf IHistory
     */
    reload(): Promise<void>{
        this._checkBusy()

        // 必须要在初始化之后才能执行
        return this._initDeferred.promise
        .then(()=>this._history.reload())
        .then(()=>{})

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
