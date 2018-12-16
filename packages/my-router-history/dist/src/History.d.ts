import { IHistory } from './model/IHistory';
import { ILocation } from './model/ILocation';
import { IHistoryConfig } from './model/IHistoryConfig';
export interface State {
    location: ILocation;
    timeStamp: number;
    isNextToGoback: boolean;
    isGoback: boolean;
}
export declare class MyHistory implements IHistory {
    private _config;
    private _state;
    private _stateData;
    private _stateStack;
    private _gobackState;
    readonly _stackTop: State;
    constructor(_config: IHistoryConfig);
    private _globalHistory;
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
    /**
     * 将给定的path封装成一个location
     * @private
     * @param {string} path
     * @returns
     * @memberOf MyHistory
     */
    private _pathToLocation;
    private _push;
    private _replace;
    private _goback;
    _replaceState(state: State): void;
    _pushState(state: State): void;
    _correct(): void;
    push(path: string): Promise<ILocation>;
    replace(path: string): Promise<ILocation>;
    destroy(): Promise<void>;
    goback(n: number | string | {
        (fn: Readonly<ILocation>, stack: Readonly<ILocation>[]): boolean;
    }): Promise<ILocation>;
    reload(): Promise<ILocation>;
    readonly stack: ILocation[];
    readonly length: number;
    readonly location: ILocation;
}
