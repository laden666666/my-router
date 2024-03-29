/**
 * 用于封装只读
 */
declare type Readonly<T> = {
    readonly [P in keyof T]: Readonly<T[P]>;
};
/**
 * 一个浏览记录的对象的封装，参考了window.location对象。该属性不暴露给外部用户，仅内部使用
 * @export
 * @interface _Location
 */
export interface _Location {
    hash: string;
    pathname: string;
    search: string;
    key: string;
    readonly href: string;
}
/**
 * _Location的只读对象
 */
export declare type Location = Readonly<_Location> & {
    readonly state: any;
};
/**
 * onChange事件回调函数
 */
export declare type ChangeEventCallback = {
    (action: 'init' | 'push' | 'goback' | 'replace' | 'reload', oldLoction: Location, newLoction: Location, discardLoctions: Location[], includeLoctions: Location[]): void | Promise<void>;
};
/**
 * onBeforeChange事件回调函数
 */
export declare type BeforeChangeEventCallback = {
    (action: 'push' | 'goback' | 'replace' | 'reload', oldLoction: Location, newLoction: Location, discardLoctions: Location[], includeLoctions: Location[]): boolean | void | Error | Function | Promise<boolean | void | Error | Function>;
};
/**
 * History的Config
 */
export interface HistoryConfig {
    gobackName?: string;
    root?: string;
    insertRoot?: boolean;
    enableCache?: boolean;
    readOnlyURL?: boolean;
}
export interface History {
    /**
     * 前进去往一个页面，名字取自history.push
     * @param {string} path                 去往的地址
     * @param {any} state                   跳转的数据，要求可以被JSON.stringify
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf History
     */
    push(path: string, state?: any): Promise<Location>;
    /**
     * 用一个URL代替当前的URL，跳转不产生历史记录，名字取自history.replace
     * @param {string} path                 去往的地址
     * @param {any} state                   跳转的数据，要求可以被JSON.stringify
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf History
     */
    replace(path: string, state?: any): Promise<Location>;
    /**
     * 向后回退。如果退回步数，超过了栈的长度，按照栈的长度算，名字取自history.goback
     * @param {number} n                    退回的步数
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf History
     */
    goback(n?: number): Promise<Location>;
    /**
     * 退回到指定的path，如果为找到合适path，跳回到root
     * @param {string} path                 指定的path
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf History
     */
    goback(path: string): Promise<Location>;
    /**
     * 退回到符合条件的location，如果为找到合适path，跳回到root
     * @param {(fn: Location)=>boolean} fn      条件函数
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf History
     */
    goback(fn: (fn: Location) => boolean): Promise<Location>;
    /**
     * 刷新当前页面，名字取自location.reload
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf History
     */
    reload(): Promise<Location>;
    /**
     * 当前Location栈。这是一个只读数组
     * @type {Location[]}
     * @memberOf History
     */
    readonly stack: Location[];
    /**
     * 当前Location栈的长度，名字取自history.length
     * @type {number}
     * @memberOf History
     */
    readonly length: number;
    /**
     * 栈顶的ILocation对象
     * @type {Location}
     * @memberOf History
     */
    readonly location: Location;
    /**
     * 是否空闲，当false时候，push、replace、goback等操作均无法使用
     * @type {boolean}
     * @memberOf History
     */
    readonly isBusy: boolean;
    /**
     * 判断是否是空闲，如果不是空闲会抛出异常
     * @type {boolean}
     * @memberOf History
     */
    checkBusy(): void;
    /**
     * 销毁路由。路由是一个单例，必须要将当前实例销毁才能创建新的路由
     * @memberOf History
     */
    destroy(): Promise<void>;
    /**
     * 注册URLchange监听器，事件支持异步，不允许注册多个事件
     * @param {any} ChangeEventCallback          监听函数。
     *           5个参数：
     *               action { 'init' | 'push' | 'goback' | 'replace' | 'reload'} URL改变的类型
     *               oldLoction: 上一个页面的loction对象
     *               newLoction: 当前页面的location对象
     *               discardLoctions: 跳转过程中出栈的location对象
     *               includeLoctions: 跳转过程中入栈的location对象
     *           返回值：
     *               是void或者Promise<void>。如果是Promise<void>，路由会处于终止状态，直到事件处理完成，所以尽量不要使用异步
     * @memberOf History
     */
    onChange: ChangeEventCallback;
    /**注册BeforeURLURLchange监听器，history的特点是可以监听变化，然后确定是否要应用改变，
     * 因此可以在BeforeChange事件中阻止改变生效，可以实现如阻止回调等功能,
     * 事件支持异步，不允许注册多个事件
     * @param {any} BeforeChangeEventCallback       监听函数。
     *           4个参数：
     *               action { 'init' | 'push' | 'goback' | 'replace' | 'reload'} URL改变的类型
     *               oldLoction: 当前页面页面的loction对象
     *               newLoction: 下一个页面的location对象
     *               discardLoctions: 跳转过程中出栈的location对象
     *               includeLoctions: 跳转过程中入栈的location对象
     *           返回值：
     *               是boolean或者Promise<boolean>。如果是Promise<boolean>，路由会处于终止状态，直到事件处理完成，所以尽量不要使用异步
     *               如果boolean值是false（false以外的falsy不可），将阻止改变发生
     * @memberOf History
     */
    onBeforeChange: BeforeChangeEventCallback;
}
export {};
