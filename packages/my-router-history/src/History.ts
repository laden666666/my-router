import { IHistory, BeforeChangeEventCallback, ChangeEventCallback } from './model/IHistory';
import { ILocation } from './model/ILocation';
import { IHistoryConfig } from './model/IHistoryConfig';
import { createLocation } from './LocationUtils';
import { addLeadingSlash, stripTrailingSlash } from './PathUtils';
import { canUseDOM } from './DOMUtils';

const MY_ROUTER_HISTORY_GOBACK_INIT = 'MyRouterHistory:initGoback'

// 记录MyHistory实例数，确保constructor仅能够运行一个实例
let historyCount = 0

// 保存在history的state里面的路由信息，这个信息因为不会随着浏览器刷新而消失，因此时候保存location信息
interface State{
    // 当前的Location
    location: ILocation
    // 当前的时间戳
    timeStamp: number
    // 页面的类型
    type: 'GOBACK' | 'NORMAL' | 'BE_GOING_BACK'
}

/**
 * 路由错误
 * @export
 * @interface HistoryError
 * @extends {Error}
 */
export interface HistoryError extends Error{
    /**
     * 用户取消，一般指在beforeChange钩子中，用户取消了跳转
     * @type {boolean}
     * @memberOf HistoryError
     */
    isCancelled?: boolean

    /**
     * 路由忙，无法响应请求。一般指路由处于非1状态，无法响应路由变化
     * @type {boolean}
     * @memberOf HistoryError
     */
    isBusy?: boolean
}


/**
 * 一个状态模式，每个状态的功能接口
 * @interface IHistoryState
 */
interface IHistoryState{
    type: number,
    push: IHistory['push']
    replace: IHistory['replace']
    goback: IHistory['goback']
    reload: IHistory['reload']
    hashChange(event: HashChangeEvent): void
}

/**
 * 用于mixin的基类
 */
let baseHistoryState: IHistoryState = {
    push(): Promise<ILocation>{
        return Promise.reject()
    },
    replace(): Promise<ILocation>{
        return Promise.reject()
    },
    goback(): Promise<ILocation>{
        return Promise.reject()
    },
    reload(path: string): Promise<ILocation>{
        return Promise.reject()
    },
} as any

export class MyHistory implements IHistory {

    // 当前history的状态：
    // 0未初始化    history没有完成初始化的时候
    // 1正常        history正常运行中
    // 2修正中      当用户手动修改hash，会被视为一次用户触发的跳转。此次跳转会先退回到goback页面，再前进回跳转的页面（为了保持history在浏览器中仅有两个浏览器记录——当前页面和退回页面），这个过程我们叫修改中
    // 3返回中      当用户要求跳转回退，或者正在回退
    // 4销毁中      在history销毁过程中的状态。
    // 5退出中      当用户要求退出到系统以外，系统会一直触发goback，直到页面刷新为止
    // 6跳转中      当用户要求跳转（包括push、replace、reload）
    private _state: IHistoryState = {
        ...baseHistoryState,
        type: 0,
        hashChange(){}
    };

    // state处于一些状态中，临时保存状态的过程数据的地方
    private _stateData: any;

    // 保存location数据的栈
    private _stateStack: State[] = []

    // goback页面的State
    private _gobackState: State

    get _stackTop(): State{
        if(this._stateStack.length){
            return this._stateStack[this._stateStack.length - 1]
        } else {
            return null
        }
    }

    constructor(private _config: IHistoryConfig){
        // 同一时刻，不允许有两个history实例运行
        if(historyCount > 0){
            throw new Error('There are already other undestroyed history instances. Please destroy them before you can create a new history instance.')
        }

        this._config = {
            gobackName: 'go back',
            root: '/',
            insertRoot: true,
            ..._config
        }

        this._hashchangeHandler = this._hashchangeHandler.bind(this)

        this._initHistory()

    }

    // 全局的history对象
    private _globalHistory = window.history;

    /**
     * 初始化goback的location
     * goback的location有2个作用：
     * 1.用于监听用户的返回事件，当用户点击地址栏的返回按钮，会退回到goback的location。由goback去处理用户注册的goback事件
     * 2.当用户手动修改浏览器的location的hash时候，history会增加一条location记录，这时候myhistory会先退回到goback的location，再前进到用户输入的lactation中，这样可以清除浏览器地址栏的前进按钮
     * @private
     * @param {number} now      初始化时候的时间戳
     * @returns {boolean}       完成的goback处于上一页。返回false表示当前就是goback页面。
     * @memberOf MyHistory
     */
    private _initGoback(now: number): boolean{
        // 先查看是否已经创建好了一个goback的location，因为浏览器中无法查看history对象里面保存的历史记录，所以使用history.state保存这个状态。

        // state里面用于记录当前是否处于goback的下一页。
        // 让goback比当前时间戳小，这样能够判断出是后退
        this._gobackState = this._pathToState('/goback', 'GOBACK', now - 1)

        if(history.state && (history.state as State).type === 'GOBACK'){
            // 如果当前页面是goback，表示goback已经初始化完成
            return false
        } else if(history.state && (history.state as State).type === 'BE_GOING_BACK'){
            // 如果当前处理goback后面的页面，表示goback已经初始化完成，并且已经在上一页
            return true
        } else {
            // 否则初始化goback页面
            this._replaceState(this._gobackState)
            
            // 因为目前还处于goback页面，所有返回false
            return false
        }
    }
    
    // 初始化URL
    private _initHistory(){
        
        // 创建hash路由
        if(!canUseDOM){
            throw new Error('Hash history needs a DOM')
        }

        // 获取当前时间戳
        let timeStamp = Date.now()

        // 获取当前的路径，将其转换为合法路径后，
        let initialPath = this._decodePath(this._getHrefToPath());
        let initialLocationState: State = this._pathToState(initialPath, 'NORMAL', timeStamp)
        
        // 初始化goback
        let isGobackNextLocation = this._initGoback(timeStamp)

        // 将当前路径压入栈中
        this._push(initialLocationState, !isGobackNextLocation)

        // 初始化监听器
        this._initEventListener()

        // 全部初始化完成，记录初始化成功
        historyCount++

        this._switchState(1)

        setTimeout(()=>{
            this._execCallback(this.onChange, 'init', null, initialLocationState.location, [], [initialLocationState.location])
        }, 0)
    }

    /**
     * 注册到HashChange事件的监听器。这个函数会在构造器中bind，以在addEventListener保持this不变
     * @private
     * @param {HashChangeEvent} event 
     * @memberOf MyHistory
     */
    private _hashchangeHandler(event: HashChangeEvent){
        this._state.hashChange(event)
    }

    private _initEventListener(){
        // 注册
        window.addEventListener('hashchange', this._hashchangeHandler)
    }

    private _destroyEventListener(){
        window.removeEventListener('hashchange', this._hashchangeHandler)
    }

    /**
     * 切换状态
     * @private
     * @param {any} stateType 
     * 
     * @memberOf MyHistory
     */
    private _switchState(stateType){
        switch(stateType){
            case(1):
                this._state = {
                    type: 1,
                    push: async (path: string)=> {
                        // 先切换到状态6，保护在跳转过程中不受其他操作影响
                        this._switchState(6)
                        try{
                            let state: State = this._pathToState(path, 'NORMAL')
                            let oldLocation = this._stackTop
                            let result = await this._execCallback(this.onBeforeChange, 'push', oldLocation, state, [], [state])
                    
                            if(result !== false){
                                this._push(state)
                                await this._execCallback(this.onChange, 'push', oldLocation, state, [], [state])
                                return state.location
                            } else {
                                let error: HistoryError = new Error('User cancelled')
                                error.isCancelled = true
                                throw error
                            }
                        } finally{
                            // 完成后切换状态1
                            this._switchState(1)
                        }
                    },
                    replace: async (path: string)=> {
                        this._switchState(6)
                        try{
                            let now = Date.now()
                            let state: State = this._pathToState(path, 'NORMAL', now)
    
                            let oldLocation = this._stackTop
                            let result = await this._execCallback(this.onBeforeChange, 'replace', oldLocation, state, [oldLocation], [state])
                    
                            if(result !== false){
                                this._replace(state)
                                await this._execCallback(this.onChange, 'replace', oldLocation, state, [oldLocation], [state])
                                return state.location
                            } else {
                                let error: HistoryError = new Error('User cancelled')
                                error.isCancelled = true
                                throw error
                            }
                        } finally{
                            // 完成后切换状态1
                            this._switchState(1)
                        }
                    },
                    goback: async (n: number | string | {(fn: Readonly<ILocation>): boolean}): Promise<ILocation>=>{
                        this._switchState(3)
                        try{
                            // 当前页面
                            let oldLocation: ILocation
                            // 丢弃的页面
                            let discardLoctions: ILocation[]
                            // 退回到的页面
                            let newState: State
                            // 是否有符合退回条件的页面，如果没有插入一条
                            let needInclude = false

                            // 判断是否符合页面的条件
                            let fn: {(fn: Readonly<ILocation>, index: number): boolean}

                            if(typeof n === 'number'){
                                // 如果退回的步数大于栈的长度，则给缓存插入一个根页面，让用户先退回到根页面
                                if(n <= 0){
                                    return null
                                } else if(n >= this._stateStack.length){
                                    fn = ()=> false
                                } else {
                                    fn = (location, index: number)=> this._stateStack.length - index === n
                                }
                            } else if(typeof n === 'string'){
                                // 查询有没有href等于n的页面，如果没有就退回到起点，然后插入一条记录
                                fn = (location)=> location.href === n
                            } else if(typeof n === 'function'){
                                fn = n
                            }
                            
                            let index = this._stateStack.findIndex((item, index)=>fn(item.location, index))
                            oldLocation = this._stackTop.location
                            if(index === -1){
                                // 如果没有找到，就插入一条根节点进去。但是如果查询的是指定页面，就将指定页面放进去
                                newState = this._pathToState(this._pathToLocation(typeof n === 'string' ? n : this._config.root), 'NORMAL')
                                discardLoctions = this._stateStack.map(item=> item.location)
                                needInclude = true
                            } else {
                                // 取出退回位置的state
                                newState = this._stateStack[index]
                                discardLoctions = this._stateStack.slice(index).map(item=>item.location)
                            }

                            let result = await this._execCallback(this.onBeforeChange, 'goback', oldLocation, newState.location, discardLoctions, 
                                needInclude ? [newState.location] : [])
                    
                            if(result !== false){
                                this._goback(discardLoctions.length, needInclude ? newState : null, false)
                                await this._execCallback(this.onChange, 'goback', oldLocation, newState.location, discardLoctions, 
                                    needInclude ? [newState.location] : [])
                                return newState.location
                            } else {
                                let error: HistoryError = new Error('User cancelled')
                                error.isCancelled = true
                                throw error
                            }
                        } finally{
                            this._switchState(1)
                        }
                    },
                    reload: ()=>{
                        return this._state.replace(this._stackTop.location.href)
                    },
                    hashChange: (event)=>{
                        if(history.state && (history.state as State).type === 'GOBACK'){
                            // 用户手动退回，前进一个页面，让history的修正
                            this._pushState(this._stackTop)
                            this._state.goback(1)

                        } else if(!history.state && this._getHrefToPath(event.oldURL) === this._stateStack[this._stateStack.length - 1].location.href){
                            // 判断是否是用户手动修改hash跳转，或者a标签切换hash。判断方法如下：
                            // 1.当前history没有state，或者state不等于State变量
                            // 2.oldURL等于当前_stateStack栈顶的href（即使这样也不能确定该页面是从系统页面栈顶跳转过来的，但是没有其他更好的方式）
                            
                            // 先切户到手动修正用户修改url的状态2，保留用户要跳转的url
                            this._switchState(2)
                            this._stateData = this._getHrefToPath(event.newURL)
            
                            // 后退两次，退回到goback页面
                            history.go(-2)
                        } else {
                            // 如果不是从栈顶的url转跳转到该状态，就无法确定返回页面就在当前页面的前面，因此触发修正
                            this._correct()
                        }
                    }
                }
                break;
                case(2):
                    this._state = {
                        type: 2,
                        ...baseHistoryState,
                        hashChange: (event)=>{
                            // 对纠正的处理步骤
                            // 1. 一直后退，直到后退到goback页面
                            // 2. 前进到gobackNext页面，把用户给出的地址放到gobackNext页面中。
    
                            let state = (history.state as State)
                            if(state && state.type === 'NORMAL'){
                                // 如果当前处于gobackNext页面，表示上一页就是goback，则退回，这主要是为了修改ios的safari那种无法使用go(-2)的浏览器时候的处理方式
                                this._globalHistory.back()
                            } else if(state && state.type === 'GOBACK'){
                                // 如果已经在goback页面了，则跳转到用户手输入的地址
                                let now = Date.now()
                                let location: ILocation = this._pathToLocation(this._stateData, now)
    
                                // 切回正在状态，这样就完成了对页面的修正
                                this._switchState(1)
                                this._pushState(this._stackTop)
                                this._state.push(location.href)
                            } else {
                                // 在纠正的时候，如果跳转到了goback和gobackNext以外的页面，视为异常，进行异常纠正
                                this._correct()
                            }
                        }
                    }
                    break;
                case(3):
                case(6):
                    this._state = {
                        type: stateType,
                        ...baseHistoryState,
                        hashChange: (event)=>{
                            if(!history.state && this._getHrefToPath(event.oldURL) === this._stateStack[this._stateStack.length - 1].location.href){
                                // 如果用户在此期间手动修改url，直接就在
                                this._correct()
                            } else {
                                // 用户手动退回，前进一个页面，让history的修正
                                this._pushState(this._stackTop)
                            }
                        }
                    }
                    break;
                case(4):
                case(5):
                    this._state = {
                        type: stateType,
                        ...baseHistoryState,
                        hashChange: (event)=>{
                            this._globalHistory.back()
                        }
                    }
                    break;

        }
    }

    /**
     * 将用户给定的path转为系统显示的path
     * @private
     * @param {string} path         用户给定的path
     * @returns {string}            系统显示的path
     * @memberOf MyHistory
     */
    private _encodePath(path: string): string{
        return addLeadingSlash(path)
    }

    /**
     * 将系统显示的path转为用户给定的path
     * @private
     * @param {string} path         系统显示的path
     * @returns {string}            用户给定的path
     * @memberOf MyHistory
     */
    private _decodePath(path: string): string{
        return addLeadingSlash(path)
    }

    // 获取hash中保存的路径。
    private _getHrefToPath(href = window.location.href): string {
        // We can't use window.location.hash here because it's not
        // consistent across browsers - Firefox will pre-decode it!
        const hashIndex = href.indexOf('#');
        return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
    }

    /**
     * 将给定的path封装成一个location
     * @private
     * @param {string} path 
     * @param {number} [timeStamp=Date.now()] 
     * @returns 
     * @memberOf MyHistory
     */
    private _pathToLocation(path: string, timeStamp: number = Date.now()): ILocation {
        
        path = this._decodePath(path);
    
        // 创建的location
        return createLocation(path, timeStamp + '');
    }

    /**
     * 将给定的path封装成一个State
     * @private
     * @memberOf MyHistory
     */
    private _pathToState(path: string | ILocation, type: State['type'], timeStamp: number = Date.now()): State{
        return {
            location: typeof path === 'string' ? this._pathToLocation(path) : path,
            type,
            timeStamp,
        }
    }
    
    private async _push(state: State, push = false){
        if(push){
            // 修改title为gobackName，这样地址栏显示的时候会是一个给定的gobackName，而不是页面的title
            document.title = this._config.gobackName
            let tempTitle = document.title
            this._pushState(state)
            document.title = tempTitle
        } else {
            this._replaceState(state)
        }
        this._stateStack.push(state)
    }

    private async _replace(state: State, push = false){
        this._stateStack.pop()
        this._stateStack.push(state)
        if(push){
            // 修改title为gobackName，这样地址栏显示的时候会是一个给定的gobackName，而不是页面的title
            document.title = this._config.gobackName
            let tempTitle = document.title
            this._pushState(state)
            document.title = tempTitle
        } else {
            this._replaceState(state)
        }
    }
    
    private async _beGoingBack(push = false){
        let state: State = this._pathToState('/be_going_back', 'BE_GOING_BACK')
        if(push){
            this._pushState(state)
        } else {
            this._replaceState(state)
        }
    }

    private _goback(n: number, state: State = null, push = false){
        if(n <= 0){
            return
        }
        this._stateStack.splice(Math.max(0, this._stateStack.length - n))

        if(state){
            this._stateStack.push(state)
        }

        let lastState = this._stateStack[this._stateStack.length - 1]
        if(push){
            this._pushState(lastState)
        } else {
            this._replaceState(lastState)
        }
    }

    _replaceState(state: State){
        this._globalHistory.replaceState(state, null, '#' + this._encodePath(state.location.href))
    }

    _pushState(state: State){
        this._globalHistory.pushState(state, null, '#' + this._encodePath(state.location.href))
    }

    _correct(){
        // 暂时先记录日志
        console.error('异常', this._stateStack, history.state, location.hash)
    }
    
    async push(path: string){
        return await this._state.push(path)
    }
    async replace(path: string){
        return await this._state.replace(path)
    }

    async goback(n: number | string | {(fn: Readonly<ILocation>): boolean}): Promise<ILocation>{
        return await this._state.goback(n as any)
    }

    reload(){
        return this._state.reload()
    }

    async destroy(){
        this._destroyEventListener()
        let state: State = this._globalHistory.state
        if(state.type === 'NORMAL' || state.type === 'BE_GOING_BACK'){
            this._globalHistory.back()
        }
        this._globalHistory.pushState(null, null, this._stackTop.location.href)
        this._stateStack = null
        this._config = null
        this._stateData = null
        this._state = null
        historyCount--
    }

    get stack(){
        return this._stateStack.map(state=> state.location)
    }

    get length(){
        return this._stateStack.length
    }

    get location(){
        return this._stackTop.location
    }

    onBeforeChange: BeforeChangeEventCallback = null

    onChange: ChangeEventCallback = null

    _execCallback(callback: Function, ...args: any[]){
        if(typeof callback === 'function'){
            return callback.apply(this, args)
        } else {
            return Promise.resolve()
        }
    }
}