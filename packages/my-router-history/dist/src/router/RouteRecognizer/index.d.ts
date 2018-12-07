import { IRouterURL } from '../histort/';
import { Route } from '../RouterManager/IRouterConfig';
import { IRecognizeResult } from './IRecognizeResult';
export { IRecognizeResult };
export declare class RouteRecognizer {
    private _routeRecognizer;
    private routes;
    constructor();
    /**
     * 初始化RouteRecognizer
     * @private
     */
    private _initRouteRecognizer;
    /**
     * 增加单个路由配置
     * @param {Route} route
     * @memberof RouteRecognizer
     */
    addRoute(route: Route): void;
    /**
     * 增加一组路由配置
     * @param {Route[]} routes
     * @memberof RouteRecognizer
     */
    addRoutes(routes: Route[]): void;
    recognize(url: string): IRecognizeResult;
    recognize(url: IRouterURL): IRecognizeResult;
}
