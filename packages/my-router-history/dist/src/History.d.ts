import { History as IHistory, BeforeChangeEventCallback, ChangeEventCallback, Location, _Location, HistoryConfig } from './API';
export { Location, ChangeEventCallback };
interface State {
    location: _Location;
    timeStamp: number;
    type: 'GOBACK' | 'NORMAL';
    data?: any;
}
/**
 * 路由错误
 * @export
 * @interface HistoryError
 * @extends {Error}
 */
export interface HistoryError extends Error {
    /**
     * 用户取消，一般指在beforeChange钩子中，用户取消了跳转
     * @type {boolean}
     * @memberOf HistoryError
     */
    isCancelled?: boolean;
    /**
     * 路由忙，无法响应请求。一般指路由处于非1状态，无法响应路由变化
     * @type {boolean}
     * @memberOf HistoryError
     */
    isBusy?: boolean;
}
export declare class MyHistory implements IHistory {
    private _config;
    private _state;
    private _stateData;
    private _stateStack;
    private _gobackState;
    readonly _stackTop: State;
    constructor(_config: HistoryConfig, _window?: Window);
    private _win;
    /**
     * 初始化goback的location
     * goback的location有2个作用：
     * 1.用于监听用户的返回事件，当用户点击地址栏的返回按钮，会退回到goback的location。由goback去处理用户注册的goback事件
     * 2.当用户手动修改浏览器的location的hash时候，history会增加一条location记录，这时候myhistory会先退回到goback的location，再前进到用户输入的lactation中，这样可以清除浏览器地址栏的前进按钮
     * @private
     * @param {number} now      初始化时候的时间戳
     * @returns {boolean}       是否是goback处于上一页。返回false表示当前就是goback页面。
     * @memberOf MyHistory
     */
    private _initGoback;
    private _initHistory;
    /**
     * 注册到HashChange事件的监听器。这个函数会在构造器中bind，以在addEventListener保持this不变
     * @private
     * @param {HashChangeEvent} event
     * @memberOf MyHistory
     */
    private _hashchangeHandler;
    private _initEventListener;
    private _destroyEventListener;
    /**
     * 如果在beforeChange生命周期，出现了跳转，会在路由重新回归1的时候执行。
     * 如果_notBusyDef已经存在，即使是在beforeChange生命周期（state为7）的时候，也不可以跳转
     * @private
     * @type {Deferred}
     * @memberOf MyHistory
     */
    private _notBusyDef;
    /**
     * 切换状态
     * @private
     * @param {any} stateType
     * @memberOf MyHistory
     */
    private _switchState;
    /**
     * 将用户给定的path转为系统显示的path
     * @private
     * @param {string} path         用户给定的path
     * @returns {string}            系统显示的path
     * @memberOf MyHistory
     */
    private _encodePath;
    /**
     * 将系统显示的path转为用户给定的path
     * @private
     * @param {string} path         系统显示的path
     * @returns {string}            用户给定的path
     * @memberOf MyHistory
     */
    private _decodePath;
    private _getHrefToPath;
    private _checkData;
    checkBusy(): void;
    /**
     * 将给定的path封装成一个location
     * @private
     * @param {string} path
     * @param {number} [timeStamp=Date.now()]
     * @returns
     * @memberOf MyHistory
     */
    private _pathToLocation;
    /**
     * 将给定的path封装成一个State
     * @private
     * @memberOf MyHistory
     */
    private _pathToState;
    private _readonlyLocation;
    private _push;
    private _replace;
    private _goback;
    _replaceState(state: State): void;
    _pushState(state: State): void;
    /**
     * 当用处于未知页面（既不是goback页面，也不是normal页面时候），触发纠正
     */
    _correct(): void;
    push(path: string, data?: any): Promise<Location>;
    replace(path: string, data?: any): Promise<Location>;
    goback(n?: number | string | {
        (fn: Readonly<Location>): boolean;
    }): Promise<Location>;
    reload(): Promise<Location>;
    destroy(): Promise<void>;
    readonly stack: Location[];
    readonly length: number;
    readonly isBusy: boolean;
    readonly location: Location;
    onBeforeChange: BeforeChangeEventCallback;
    onChange: ChangeEventCallback;
    _execCallback<T extends Function>(callback: T): T;
}
