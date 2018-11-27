/**
 * @file
 * 路由配置
 */
import { DestroyStateListener, URLChangeListener, BeforeUpdateListener, BeforeRouteEnterListener } from './IRouterManager';

export interface Route {
    path: string,
    component: any | {():Promise<any>},
    meta?: {[propName: string]: any}
}

export interface IRouterConfig{
    //路由的模式，包括：hash -> hash路由，browser -> historyState路由，m -> 内存路由（仅测试用，正式环境禁用）
    mode?: HistoryType,
    //route的列表，一个Route包含：path是匹配这个路由的url，component是路由控件，meta是用户的配置
    routes?: Route[],

    //url将要改变事件
    onBeforeURLChange?: BeforeUpdateListener[] | BeforeUpdateListener,
    //url改变事件
    onURLChange?: URLChangeListener[] | URLChangeListener,
    //url改变后，执行路由响应前的事件
    onBeforeRouteEnter?: BeforeRouteEnterListener[] | BeforeRouteEnterListener,
    //缓存的用户的访问信息被消耗的事件
    onDestroyState?: DestroyStateListener[] | DestroyStateListener,
}

/**
 * 路由使用的类型，目前支持hash和historyapi形式的路由，暂不对外开放内存路由。内存路由仅测试使用
 * @enum {string}
 */
export enum HistoryType{
    HASH= 'hash',
    BROWSER= 'browser',
    MEMORY= 'm'
}
