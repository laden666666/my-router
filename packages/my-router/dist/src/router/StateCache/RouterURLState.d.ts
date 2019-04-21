/**
 * @file
 * 路由的状态参数，包括url、路由匹配的结果、session信息、其他信息（如果dom）
 */
import { IRouterURL } from '../histort/';
import { Deferred } from '../util/Deferred';
import { IPathRegexpResult } from '../IPathRegexp';
/**
 * 对url进一步封装，扩展的url相关的所有状态参数，包括url、路由匹配的结果、session信息、其他信息（如果dom）
 * @export
 */
export declare class RouterURLState {
    /**
     * history的url
     */
    routerURL: IRouterURL;
    /**
     * 路由匹配的结果
     */
    PathRegexpResult: IPathRegexpResult;
    /**
     * 页面路由缓存的信息，页面刷新会失去
     * @type {*}
     */
    data: any;
    /**
     * session的promise的控制器
     * @type {Deferred<any>}
     */
    sessionDeferred: Deferred<any>;
    /**
    * 页面返回值
    * @type {*}
    */
    backValue: any;
    /**
     * 其他信息（如果dom）
     * @type {*}
     */
    otherData: any;
    constructor(routerURL: IRouterURL, data?: any, sessionDeferred?: Deferred<any>);
    /**
     * 销毁
     * @memberof RouterURLState
     */
    destroy(): void;
}
