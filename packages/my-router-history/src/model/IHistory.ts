import { ILocation } from './ILocation';
import { IHistoryConfig } from './IHistoryConfig';

/**
 * 用于
 */
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
}



type URLChangeEventCallback = {};
type BeforeURLChangeEventCallback = {};
type GobackEventCallback = {};
type BeforeGobackEventCallback = {};
type PushEventCallback = {};
type BeforePushEventCallback = {};
type ReplaceEventCallback = {};
type BeforeReplaceEventCallback = {};
type ReloadEventCallback = {};
type BeforeReloadEventCallback = {};

export interface IHistory{
    /**
     * 前进去往一个页面，名字取自history.push
     * @param {string} path                 去往的地址
     * @returns {Promise<ILocation>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf IHistory
     */
    push(path: string): Promise<ILocation>
    /**
     * 用一个URL代替当前的URL，跳转不产生历史记录，名字取自history.replace
     * @param {string} path                 去往的地址
     * @returns {Promise<ILocation>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf IHistory
     */
    replace(path: string): Promise<ILocation>
    /**
     * 向后回退。如果退回步数，超过了栈的长度，按照栈的长度算，名字取自history.goback
     * @param {number} n                    退回的步数
     * @returns {Promise<ILocation>}        跳转完成的promise，并返回新创建的ILocation
     * 
     * @memberOf IHistory
     */
    goback(n: number): Promise<ILocation>
    /**
     * 退回到指定的path，如果为找到合适path，跳回到root
     * @param {string} path                 指定的path
     * @returns {Promise<ILocation>}        跳转完成的promise，并返回新创建的ILocation
     * 
     * @memberOf IHistory
     */
    goback(path: string): Promise<ILocation>
    /**
     * 退回到符合条件的location，如果为找到合适path，跳回到root
     * @param {(fn: Readonly<ILocation>, stack: Readonly<ILocation>[])=>boolean} fn 
     *                                      条件函数
     * @returns {Promise<ILocation>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf IHistory
     */
    goback(fn: (fn: Readonly<ILocation>, stack: Readonly<ILocation>[])=>boolean): Promise<ILocation>
    /**
     * 刷新当前页面，其实和replace当前的url一致，名字取自location.replace
     * @returns {Promise<ILocation>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf IHistory
     */
    reload(): Promise<ILocation>
    
    /**
     * 当前Location栈。这是一个只读数组
     * @type {Readonly<ILocation>[]}
     * @memberOf IHistory
     */
    readonly stack: Readonly<ILocation>[]
    
    /**
     * 当前Location栈的长度，名字取自history.length
     * @type {number}
     * @memberOf IHistory
     */
    readonly length: number
    
    /**
     * 栈顶的ILocation对象
     * @type {ILocation}
     * @memberOf IHistory
     */
    readonly location: ILocation

    /**
     * 销毁路由。路由是一个单例，必须要将当前实例销毁才能创建新的路由
     * @memberOf IHistory
     */
    destroy(): Promise<void>


    listenURLChange(): ()=>void
    listenBeforeURLChange(): ()=>void

    listenReplce(): ()=>void
    listenBeforeReplce(): ()=>void
    
    listenPush(): ()=>void
    listenBeforePush(): ()=>void
    
    listenReload(): ()=>void
    listenBeforeReload(): ()=>void
    
    listenGoback(): ()=>void
    listenBeforeGoback(): ()=>void
}