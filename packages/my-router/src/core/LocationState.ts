import { PathRegexpResult, Location } from '../API';
import { Deferred } from './util/Deferred';
import { Location as HistoryLocation } from 'my-router-history';
import { LocationKey } from './../API';

/**
 * 地址栏search字符串转map
 * @param {string} search
 * @returns {Record<string, string>}
 */
function search2Map(search: string): Record<string, string>{
    return search && search[0] === '?' ? search.substr(1).split('&')
        .map(str=> str.split('=')).reduce((map, arr)=>{
            map[arr[0]] = arr[1]
            return map
        }, {}) : {}
}

export class LocationState {

    /**
     * 当前的location
     */
    hLocation: HistoryLocation

    /**
     * 路由匹配的结果
     */
    recognizeResult: PathRegexpResult

    ///session信息
    /**
     * session数据
     * @type {*}
     */
    data: any

    /**
     * session的promise的控制器
     * @type {Deferred<any>}
     */
    sessionDeferred: Deferred<any>

    /**
    * 页面返回值
    * @type {*}
    */
    backValue: any = null

    /**
     * 其他信息（如果dom）
     * @type {*}
     */
    otherData: any = {}

    constructor(historyLocation: HistoryLocation){
        this.hLocation = historyLocation
    }

    /**
     * 销毁
     * @memberof RouterURLState
     */
    destroy(){
        //如果存在未完成的promise，自动调用用户取消异常完成
        if(this.sessionDeferred && !this.sessionDeferred.isFinished){
            this.sessionDeferred.reject(new Error('destroy'))
        }

        this.data = null;
        this.sessionDeferred = null
        this.backValue = null
        this.otherData = null
    }

    /**
     * 将LocationState转为Location对象
     * @static
     * @param {LocationState} state
     * @returns {Location}
     * @memberof LocationState
     */
    static toLocation(state: LocationState): Location{
        let {recognizeResult, hLocation} = state
        return {
            hash: hLocation.hash,
            fullPath: hLocation.href,
            query: search2Map(hLocation.search),
            params: recognizeResult ? state.recognizeResult.pathData : {},
            path: hLocation.pathname,
            session: state.data,
            routeConfig: recognizeResult ? recognizeResult.routeConfig : null,
            routeConfigPath: recognizeResult ? recognizeResult.routeConfigPath : null,
            [LocationKey]: state.otherData
        }
    }
}
