/**
 * @file
 * 路由配置
 */
import { DestroyStateListener, URLChangeListener, BeforeUpdateListener, BeforeRouteEnterListener } from './IRouterManager';
export interface Route {
    path: string;
    component: any | {
        (): Promise<any>;
    };
    meta?: {
        [propName: string]: any;
    };
}
export interface IRouterConfig {
    mode?: HistoryType;
    routes?: Route[];
    onBeforeURLChange?: BeforeUpdateListener[] | BeforeUpdateListener;
    onURLChange?: URLChangeListener[] | URLChangeListener;
    onBeforeRouteEnter?: BeforeRouteEnterListener[] | BeforeRouteEnterListener;
    onDestroyState?: DestroyStateListener[] | DestroyStateListener;
}
/**
 * 路由使用的类型，目前支持hash和historyapi形式的路由，暂不对外开放内存路由。内存路由仅测试使用
 * @enum {string}
 */
export declare enum HistoryType {
    HASH = "hash",
    BROWSER = "browser",
    MEMORY = "m"
}
