import {Route} from '../RouterManager/IRouterConfig'

/**
 * 使用routeRecognizer匹配的url后的结构
 * @interface IRecognizeResult
 */
export interface IRecognizeResult{
    /**
     * url分解出的query数据
     */
    queryData: any,
    /**
     * url分解出的path数据
     */
    pathData: any,
    /**
     * Route的信息
     */
    route: Route,
    /**
     * 匹配的url
     */
    url: string,
}