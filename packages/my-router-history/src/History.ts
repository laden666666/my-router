import { IHistory } from './model/IHistory';
import { ILocation } from './model/ILocation';
import { IHistoryConfig } from './model/IHistoryConfig';
import { createLocation } from './LocationUtils';
import { addLeadingSlash, stripTrailingSlash, hasBasename, stripBasename } from './PathUtils';
import { canUseDOM } from './DOMUtils';

const MY_ROUTER_HISTORY_GOBACK_INIT = 'MyRouterHistory:initGoback'

// 记录MyHistory实例数，确保constructor仅能够运行一个实例
let historyCount = 0

// 保存在history的state里面的路由信息，这个信息因为不会随着浏览器刷新而消失，因此时候保存location信息
export interface State{
    // 当前的Location
    location: ILocation
    // 当前的时间戳
    timeStamp: number
    // 上一个location是否是goback
    isNextToGoback: boolean
    // 是goback
    isGoback: boolean
}

export class MyHistory implements IHistory {

    // 当前history的状态：0未初始化， 1正常， 2修正中， 3返回中
    private _state = 0;
    private _stateData: any;


    // 保存location数据的栈
    private _stateStack: State[] = []

    // goback的State
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
            basename: '',
            root: '/',
            ..._config
        }

        this._hashchangeHandler = this._hashchangeHandler.bind(this)

        this._initHistory()

    }

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
        
        this._gobackState = {
            // 让goback比当前时间戳小，这样能够判断出是后退
            timeStamp: now - 1,
            location: this._getDOMLocation('/goback', now - 1),
            isNextToGoback: false,
            isGoback: true
        }

        if(history.state && (history.state as State).isGoback === true){
            // 如果当前页面是goback，表示goback已经初始化完成

            return false
        } else if(history.state && (history.state as State).isNextToGoback === true){
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
        let initialPath = this._decodePath(this._getHashPath());
        let initialLocation = this._getDOMLocation(initialPath, timeStamp)
        let initialLocationState: State = {
            isGoback: false,
            isNextToGoback: true,
            location: initialLocation,
            timeStamp,
        }
        
        // 初始化goback
        let isGobackNextLocation = this._initGoback(timeStamp)

        // 将当前路径压入栈中
        this._push(initialLocationState, !isGobackNextLocation)

        // 初始化监听器
        this._initEventListener()

        // 
        historyCount++
        this._state = 1
    }

    private _hashchangeHandler(event: HashChangeEvent){

        if(this._state === 2){
            let state = (history.state as State)
            // 在返回和纠正url的时候，如果出现了异常的url，要做异常纠正
            if(state && state.isNextToGoback){
                this._globalHistory.back()
            } else if(state && state.isGoback){
                let now = Date.now()
                let state: State = {
                    location: this._getDOMLocation(this._stateData, now),
                    timeStamp: now,
                    isGoback: false,
                    isNextToGoback: true
                }
                this._state = 1
                this._push(state, true)
            } else {
                this._correct()
                return
            }
        } else if(this._state === 1){
            if(history.state && (history.state as State).isGoback){
                //用户退回道goback页面
                this._stateStack.pop()
                if(this._stateStack.length === 0){
                    history.back()
                }
        
                let lastState = this._stackTop
                this._replace(lastState, true)
            } else if(!history.state && this._getHashPath(event.oldURL) === this._stateStack[this._stateStack.length - 1].location.href){
                // 判断是否是用户手动修改hash跳转，或者a标签切换hash。判断方法如下：
                // 1.当前history没有state，或者state不等于State变量
                // 2.oldURL等于当前_stateStack栈顶的href（即使这样也不能确定该页面是从系统页面栈顶跳转过来的，但是没有其他更好的方式）
                this._state = 2
                this._stateData = this._getHashPath(event.newURL)

                // 后退两次
                history.go(-2)
            }
        } else {
            if(history.state && (history.state as State).isGoback){
                this._goback(1, true)
            } else {
                // 以上情况都不是，则纠正
                this._correct()
            }
        }
    }

    private _initEventListener(){
        // 注册
        window.addEventListener('hashchange', this._hashchangeHandler)
    }

    private _destroyEventListener(){
        window.removeEventListener('hashchange', this._hashchangeHandler)
    }

    // 获取hash中保存的路径。
    private _getHashPath(href = window.location.href): string {
        // We can't use window.location.hash here because it's not
        // consistent across browsers - Firefox will pre-decode it!
        const hashIndex = href.indexOf('#');
        return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
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

    /**
     * 将给定的path封装成一个location
     * @private
     * @param {string} path 
     * @returns 
     * @memberOf MyHistory
     */
    private _getDOMLocation(path: string, timeStamp: number = Date.now()): ILocation {
        path = this._decodePath(path);
        const basename = this._config.basename
            ? stripTrailingSlash(addLeadingSlash(this._config.basename))
            : '';

        if(!basename || hasBasename(path, basename)){
            console.warn(`You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "${path}" to begin with "${basename}".`)
        }
    
        // 将basename拼到给定的path上面
        if (basename) path = stripBasename(path, basename);
    
        // 创建的location
        return createLocation(path, timeStamp + '');
    }

    private _push(state: State, push = false){
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

    private _replace(state: State, push = false){
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

    private _goback(n: number, push = false){
        if(n <= 0){
            return
        }
        this._stateStack.splice(Math.max(0, this._stateStack.length - n))

        if(this._stateStack.length === 0){
            let rootLocation = this._getDOMLocation(this._config.root)
            let rootState: State = {
                isGoback: false,
                isNextToGoback: false,
                location: rootLocation,
                timeStamp: Date.now(),
            }

            this._stateStack.push(rootState)
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
    
    async assign(path: string){
        let now = Date.now()
        let state: State = {
            location: this._getDOMLocation(path),
            isGoback: false,
            isNextToGoback: true,
            timeStamp: now,
        }
        this._push(state)

        return state.location
    }
    async replace(path: string){
        let now = Date.now()
        let state: State = {
            location: this._getDOMLocation(path),
            isGoback: false,
            isNextToGoback: true,
            timeStamp: now,
        }
        this._replace(state)

        return state.location
    }

    async destroy(){
        this._destroyEventListener()
        historyCount--
    }

    async goback(n: number | string | {(fn: Readonly<ILocation>, stack: Readonly<ILocation>[]): boolean}): Promise<ILocation>{
        this._goback( typeof n === 'number' ? n : 1)
        return this._stackTop.location
    }

    reload(){
        return this.replace(this._stackTop.location.href)
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

}