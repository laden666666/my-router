/**
 * 对外暴露的
 * @class RouteData
 */

import {RouterURLState} from '../StateCache/RouterURLState'
import {IRecognizeResult} from '../RouteRecognizer/'
import {Route} from './IRouterConfig'

export class RouteData{

    /**
     * id
     * @type {string}
     */
    id: string
    /**
     * 对应的url的path。不含系统参数
     * @type {string}
     */
    fullPath: string
    /**
     * 路由数据，是path数据和query数据组成
     * @type {{[propName: string]: any}}
     */
    routeData: {[propName: string]: any}
    /**
     * 路由的session的数据
     * @type {{[propName: string]: any}}
     */
    sessionData: {[propName: string]: any}
    /**
     * url分解出的query数据
     */
    queryData: {[propName: string]: any}
    /**
     * url分解出的path数据
     */
    pathData: {[propName: string]: any}
    /**
     * route的配置信息
     */
    routeConfig: Route
    /**
     * 用户自己的缓存信息
     */
    otherData: any

    /**
     * 
     * @param state 
     */
    static state2RouteData(state: RouterURLState):RouteData{
        if(!state){
            return null
        }

        const recognizeResult:IRecognizeResult = state.recognizeResult || {
            queryData: {},
            pathData: {},
            route: null,
            url: '',
        }
        return {
            id: state.routerURL.id,
            fullPath: state.routerURL.stringifyWithoutSystemData(),
            routeData: {...recognizeResult.pathData, ...recognizeResult.queryData},
            sessionData: state.data,
            queryData: recognizeResult.queryData,
            pathData: recognizeResult.pathData,
            routeConfig: recognizeResult.route,
            otherData: state.otherData,
        }
    }
}