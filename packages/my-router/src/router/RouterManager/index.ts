/**
 * @file
 * 路由的统一管理类，用于管理路由相关信息，
 */
import { IRouterManager, DestroyStateListener, URLChangeListener, BeforeUpdateListener, BeforeRouteEnterListener } from './IRouterManager';
import {RouteData} from './RouteData'
import {RouterAction} from '../RouterAction'
import {StateCache} from '../StateCache'
import {RouterURLState} from '../StateCache'
import {IRouterConfig, Route, HistoryType} from './IRouterConfig'
import {
    IRouterURL,
    IHistory,
    MemoryHistory,
    // BrowserHistory,
    HashHistory
} from '../histort/'
import IdUtil from '../util/IdUtil'
import {RouteRecognizer, IRecognizeResult} from '../RouteRecognizer'
import {Deferred} from '../util/Deferred'

export {
    RouteData,
    IRouterConfig,
    Route
}

/**
 * 负责监听页面跳转事件和触发页面跳转的类。要求必须是单例的,提供跳转的功能
 */
export class RouterManager implements IRouterManager{

    /**
     * 默认配置
     * @type {IRouterConfig}
     */
    private config: IRouterConfig = {
        mode: HistoryType.HASH,
        routes: []
    }

    /**
     * 保存注册的history的change事件的回调函数
     * @private
     * @type {URLChangeListener[]}
     */
    private _funArray: URLChangeListener[] = []

    /**
     * 清除缓存事件
     */
    private _clearFunArray: DestroyStateListener[] = []

    /**
     *
     * @private
     * @type {BeforeUpdateListener[]}
     */
    private _beforeUpdateArray: BeforeUpdateListener[] = []
    /**
     *
     * @private
     * @type {BeforeUpdateListener[]}
     */
    private _beforeRouteEnterArray: BeforeRouteEnterListener[] = []

    /**
     * 缓存路由会话的数据
     * @private
     * @type {*}
     */
    private _cacheURLState: RouterURLState

    /**
     * 做路由状态匹配使用的
     * @private
     * @type {*}
     */
    private _routeRecognizer: RouteRecognizer

    /**
     * HistoryCache对象
     * @type {StateCache}
     */
    private stateCache: StateCache

    /**
     * History对象
     * @type {*}
     */
    private history: IHistory

    /**
     * 初始化完成的promise
     * @type {*}
     */
    private initDeferred: Deferred<any> = new Deferred<any>()

    /**
     * 构造函数
     */
    constructor(config: IRouterConfig){
        const listeners = config

        //设置listeners
        if(typeof listeners.onURLChange == 'function'){
            this.addURLChangeListener(listeners.onURLChange)
        } else if(Array.isArray(listeners.onURLChange)){
            listeners.onURLChange.forEach(fn => {
                this.addURLChangeListener(fn)
            });
        }
        if(typeof listeners.onDestroyState == 'function'){
            this.addDestroyStateListener(listeners.onDestroyState)
        } else if(Array.isArray(listeners.onDestroyState)){
            listeners.onDestroyState.forEach(fn => {
                this.addDestroyStateListener(fn)
            });
        }
        if(typeof listeners.onBeforeURLChange == 'function'){
            this.addBeforeUpdateListener(listeners.onBeforeURLChange)
        } else if(Array.isArray(listeners.onBeforeURLChange)){
            listeners.onBeforeURLChange.forEach(fn => {
                this.addBeforeUpdateListener(fn)
            });
        }
        if(typeof listeners.onBeforeRouteEnter == 'function'){
            this.addBeforeRouteEnterListener(listeners.onBeforeRouteEnter)
        } else if(Array.isArray(listeners.onBeforeRouteEnter)){
            listeners.onBeforeRouteEnter.forEach(fn => {
                this.addBeforeRouteEnterListener(fn)
            });
        }

        //使用用户配置覆盖掉原始配置
        this.config = {...this.config, ...config}

        //初始化历史缓存栈
        if(this.config.mode == HistoryType.HASH){
            this.history = HashHistory.instance()
        // } else if(this.config.mode == HistoryType.BROWSER){
        //     this.history = BrowserHistory.instance()
        }  else if(this.config.mode == HistoryType.MEMORY){
            //内存路由仅内部测试使用，类型是m
            this.history = MemoryHistory.instance()
            setTimeout(()=>{
                this.history.push(this.history.getURL().stringify())
            })
        } else {
            this.history = HashHistory.instance()
        }

        //创建RouteRecognizer实例
        this._routeRecognizer = new RouteRecognizer()
        this._routeRecognizer.addRoutes(this.config.routes)

        //获取StateCache实例
        this.stateCache = StateCache.instance();

        //浏览器事件的回调
        const listenFn = async (url:IRouterURL)=>{
            /**
             * 将from的state信息，to的state信息，都封装为对外暴露的routeData
             */
            const urlState = new RouterURLState(url)
            const oldHistory = this.stateCache.get();
            const result = this.stateCache.setURLState(urlState);
            const newHistory = this.stateCache.get();

            //如果是返回上一级的路由，将缓存的路由中的promise全部resolve掉（如果返回是error，则reject掉）
            if(result.type == RouterAction.POP){
                var backValue = oldHistory.backValue;
                setTimeout(()=>{
                    if(backValue instanceof Error){
                        oldHistory.sessionDeferred.reject(backValue)
                    } else {
                        oldHistory.sessionDeferred.resolve(backValue)
                    }
                }, 20)
            }

            /**
             * 如果已经缓存了state数据，将缓存的数据里面的信息赋值给当期state。
             * 之所以这样做是因为state创建和回调是异步的，用户跳转页面时候，会将路由的信息缓存到_cacheURLState中，然后修改url数据。
             * 修改url数据后，会根据新的url再生成一个state对象，此时应该将缓存的state对象的值覆到当前state对象中
             */
            if(this._cacheURLState && this._cacheURLState.routerURL.id == url.id){
                newHistory.data = this._cacheURLState.data
                newHistory.otherData = this._cacheURLState.otherData
                newHistory.sessionDeferred = this._cacheURLState.sessionDeferred
                newHistory.recognizeResult = this._cacheURLState.recognizeResult
            } else {
                newHistory.data = newHistory.data || {}
                newHistory.otherData = newHistory.otherData || {}
                newHistory.sessionDeferred = newHistory.sessionDeferred || null
                //如同url获取对应的路由信息
                const result = this._routeRecognizer.recognize(url)
                newHistory.recognizeResult = result
            }

            //限制执行beforeRouteEnter
            let next = (await Promise.all(this._beforeRouteEnterArray.map(func=>new Promise(async (resolve, reject)=>{
                var r = true
                try{
                    r = await func(result.type, oldHistory ? RouteData.state2RouteData(oldHistory) : null,
                    RouteData.state2RouteData(newHistory),
                    result.clearedState.map(item=>RouteData.state2RouteData(item))) !== false
                } catch(e){
                    console.error('call beforeRouteEnter error', e)
                }
                resolve(r)

            })))).reduce((bool, result)=>{
                return bool && result
            }, true)

            //判断是否执行主逻辑
            if(next){
                this._funArray.map((func)=>{
                    try{
                        func(result.type, oldHistory ? RouteData.state2RouteData(oldHistory) : null,
                            RouteData.state2RouteData(newHistory),
                            result.clearedState.map(item=>RouteData.state2RouteData(item)));
                    } catch(e){
                        console.error('call urlChangeListener error', e)
                    }
                })
            }


            //调用销毁事件
            this._clearFunArray.map((func)=>{
                try{
                    func(result.clearedState.map(item=>RouteData.state2RouteData(item)));
                } catch(e){
                    console.error('call onDestroyState error', e)
                }
            })
        }

        //保存注册的history的change事件的回调函数
        this.history.listen((url: IRouterURL)=>{
            try{
                listenFn(url)
            } catch (e){
                console.error('manage router call urlChangeListener error', e)
            }
        });

        //使用setTimeout，这样运行在listeners运行RouterManager的实例。在构造方法中，因为RouterManager的实例还未创建完成，因此listeners可以运行RouterManager，因此要用setTimeout实现异步，让RouterManager对象先返回，在执行listeners
        setTimeout(async ()=>{
            try{
                //初始化完成
                this.initDeferred.resolve({})

                // //生成一个id给url
                // const url = this.history.getURL()

                // //如同url获取对应的路由信息
                // const result = this._routeRecognizer.recognize(url)
                // const toState = new RouterURLState(url)
                // toState.recognizeResult = result

                // //执行beforeUpdateListener钩子，全部执行后再跳转页面
                // await Promise.all(this._beforeUpdateArray.map(fn=>
                //     fn(RouteData.state2RouteData(this.stateCache.get()), RouteData.state2RouteData(toState))))

                // //将session信息，暂存在_cacheURLState里面。带listen里面将缓存的信息保存到stateCache里面
                // this._cacheURLState = toState

                // //跳转页面
                // try{
                //     // listenFn(url)
                // } catch (e){
                //     console.error('manage router call urlChangeListener error', e)
                // }
            }catch(e){
                console.error('manage router init error', e)
            }

        }, 0)

    }

    /**
     * 注册Route
     * @param {Route} route
     */
    addRoute(route: Route):void{
        route.meta = route.meta || {}
        this._routeRecognizer.addRoute(route)
    }

    /**
     * 注册多个Route
     * @param {Route[]} routes
     */
    addRoutes(routes: Route[]):void{
        routes.forEach(route=> this.addRoute(route))
    }

    /**
     * 设置清除缓存的回调方法
     * @type {{(routeDatas:RouteData[]):void}}
     */
    addDestroyStateListener(fn: {(routeDatas:RouteData[]):void}):void{
        this._clearFunArray.push(fn)
    }

    /**
     * 移除清除缓存的回调方法
     * @type {{(routeDatas:RouteData[]):void}}
     */
    removeDestroyStateListener(fn: {(routeDatas:RouteData[]):void}):void{
        this._clearFunArray = this._clearFunArray.filter(item=>item !== fn)
    }

    /**
     * 设置url变化的回调方法
     * @param {{(result:RouterAction, from:RouteData, to: RouteData, clearState: RouteData[]): void}} fn
     */
    addURLChangeListener(fn: {(result:RouterAction, from:RouteData, to: RouteData, clearState: RouteData[]): void}):void{
        this._funArray.push(fn)
    }

    /**
     * 移除url变化的回调方法
     * @param {{(result:RouterAction, from:RouteData, to: RouteData, clearState: RouteData[]): void}} fn
     */
    removeURLChangeListener(fn: {(result:RouterAction, from:RouteData, to: RouteData, clearState: RouteData[]): void}):void{
        this._funArray = this._funArray.filter(item=>item !== fn)
    }

    /**
     * 设置url改变之前的回调方法
     * @param {{(from:RouteData, to:RouteData):Promise<any>}} fn
     */
    addBeforeUpdateListener(fn:{(from:RouteData, to:RouteData):Promise<any>}){
        this._beforeUpdateArray.push(fn)
    }

    /**
     * 移除url改变之前的回调方法
     * @param {{(from:RouteData, to:RouteData):Promise<any>}} fn
     */
    removeBeforeUpdateListener(fn:{(from:RouteData, to:RouteData):Promise<any>}){
        this._beforeUpdateArray = this._beforeUpdateArray.filter(item=>item !== fn)
    }

    /**
     * 设置url改变之前的回调方法
     * @param {BeforeRouteEnterListener} fn
     */
    addBeforeRouteEnterListener(fn: BeforeRouteEnterListener):void{
        this._beforeRouteEnterArray.push(fn)
    }

    /**
     * 移除url变化的回调方法
     * @param {{(result:RouterAction, from:RouteData, to: RouteData, clearState: RouteData[]): void}} fn
     */
    removeBeforeRouteEnterListener(fn: {(result:RouterAction, from:RouteData, to: RouteData, clearState: RouteData[]): void}):void{
        this._beforeRouteEnterArray = this._beforeRouteEnterArray.filter(item=>item !== fn)
    }

    /**
     * 获取当前url
     * @returns {string}
     */
    getCurrentURL(): IRouterURL{
        return this.stateCache.get().routerURL
    }

    /**
     * 获取当前页面的路由数据
     * @returns {RouteData}
     */
    getCurrentRouteData(): RouteData{
        return RouteData.state2RouteData(this.stateCache.get())
    }

    /**
     * 带导航session的push封装，和push相比，他可返回的是一个promise，当页面返回到当前页面，他能把backValue的返回值返回
     * @param {string} urlPath             要跳转页面的url
     * @param {object} urlQuery            查询参数
     * @param {object} sessionData         缓存数据
     * @returns {Promise<any>}             回调的promise
     */
    async navigateTo(urlPath:string, urlQuery: object = {}, sessionData: object = {}): Promise<any>{
        //必须要在初始化之后才能执行
        await this.initDeferred.promise

        //跳转到新页面,并且从页面再跳转回来的Deferred
        const backDeferred = new Deferred<any>()

        //生成一个id给url
        const urlId = IdUtil.createId()
        const url = this.history.createURL(urlPath, urlQuery, urlId)

        //如同url获取对应的路由信息
        const result = this._routeRecognizer.recognize(url)
        const toState = new RouterURLState(url, sessionData, backDeferred)
        toState.recognizeResult = result

        //执行beforeUpdateListener钩子，全部执行后再跳转页面
        await Promise.all(this._beforeUpdateArray.map(fn=>
            fn.call(this, RouteData.state2RouteData(this.stateCache.get()), RouteData.state2RouteData(toState))))

        //将session信息，暂存在_cacheURLState里面。带listen里面将缓存的信息保存到stateCache里面
        this._cacheURLState = toState

        //跳转页面
        this.history.push(url.stringify())

        return backDeferred.promise
    }

    /**
     * 带导航session的replace封装，和replace相比，他可返回的是一个promise，当页面返回到当前页面（session结束），他能把session的返回值返回
     * @param {string} urlPath             要跳转页面的url
     * @param {object} urlQuery            查询参数
     * @param {object} sessionData         缓存数据
     * @returns {Promise<any>}             回调的promise
     */
    async redirectTo(urlPath:string, urlQuery: object = {}, sessionData: object = {}): Promise<any>{
        //必须要在初始化之后才能执行
        await this.initDeferred.promise

        //跳转到新页面,并且从页面再跳转回来的Deferred
        const backDeferred = this.stateCache.get() && this.stateCache.get().sessionDeferred ? this.stateCache.get().sessionDeferred : new Deferred<any>()

        //使用当前的id
        const urlId = this.history.getURL().id
        const url = this.history.createURL(urlPath, urlQuery, urlId)

        //如同url获取对应的路由信息
        const result = this._routeRecognizer.recognize(url)
        const toState = new RouterURLState(url, sessionData, backDeferred)
        toState.recognizeResult = result

        //执行beforeUpdateListener钩子，全部执行后再跳转页面
        await Promise.all(this._beforeUpdateArray.map(fn=>
            fn.call(this, RouteData.state2RouteData(this.stateCache.get()), RouteData.state2RouteData(toState))))

        //将session信息，暂存在_cacheURLState里面。带listen里面将缓存的信息保存到stateCache里面
        this._cacheURLState = toState

        //跳转页面
        this.history.replace(url.stringify())

        return backDeferred.promise;
    }


    /**
     * 刷新
     * @returns {Promise<any>}             回调的promise
     */
    async reload(): Promise<any>{
        //必须要在初始化之后才能执行
        await this.initDeferred.promise

        //使用当前id
        const url = this.history.getURL()

        //使用当前的session
        const sessionData = this.stateCache.get() && this.stateCache.get().data ? this.stateCache.get().data : {}

        this.redirectTo(url.path, url.queryMap, sessionData);
    }

    /**
     * 设置当前页面的返回值，可以通过session返回给
     * @param {any} backValue
     * @memberof IHistoryManager
     */
    setBackValue(backValue: any): void{
        const currentPageURLStatue = this.stateCache.get();
        if(currentPageURLStatue){
            currentPageURLStatue.backValue = backValue;
        }
    }

    /**
     * 返回之前页面。
     * @param {*} data
     * @param {number} index                返回上一级的层数，默认一层
     * @memberof IRouterManager
     */
    async navigateBack(data: any, index:number = 1){
        //必须要在初始化之后才能执行
        await this.initDeferred.promise

        const currentPageURLStatue = this.stateCache.get();
        if (currentPageURLStatue.sessionDeferred) {
            //将新的返回值保存到缓存中
            currentPageURLStatue.backValue = data || currentPageURLStatue.backValue
        }
        if(index == 1) {
            this.history.goBack()
        } else {
            this.history.go(-1 * Math.max(1, index));
        }
    }

    /**
     * 安装id区间清除缓存
     * @param {string} toId             从toID开始清除
     * @param {string} fromId           清除到哪个ID
     * @returns {string[]}
     */
    destroyState(toId: string, fromId: string){
        const clearedState = this.stateCache.clear(toId, fromId)
        const clearedRouteData = clearedState.map(item=> RouteData.state2RouteData(item))

        this._clearFunArray.map(fn=>{
            fn.call(this, clearedRouteData)
        })
    }
}
