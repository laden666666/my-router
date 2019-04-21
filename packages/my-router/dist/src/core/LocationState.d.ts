import { Location } from 'my-router-history';
import { PathRegexpResult } from '../API';
import { Deferred } from './util/Deferred';
export declare class LocationState {
    /**
     * 当前的location
     */
    location: Location;
    /**
     * 路由匹配的结果
     */
    recognizeResult: PathRegexpResult;
    /**
     * session数据
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
    constructor(location: Location);
    /**
     * 销毁
     * @memberof RouterURLState
     */
    destroy(): void;
}
