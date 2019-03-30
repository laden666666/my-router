import { MyRouteConfig, IPathRegexp, PathRegexpResult } from '../API';
export declare class PathRegexp implements IPathRegexp {
    private needSort;
    private _routeRecognizer;
    private routes;
    constructor(needSort?: boolean);
    /**
     * 初始化RouteRecognizer
     * @private
     */
    precisionMatch(): void;
    /**
     * 增加单个路由配置
     * @param {MyRouteConfig} route
     * @memberof RouteRecognizer
     */
    addRoute(route: MyRouteConfig): void;
    /**
     * 增加一组路由配置
     * @param {MyRouteConfig[]} routes
     * @memberof RouteRecognizer
     */
    addRoutes(routes: MyRouteConfig[]): void;
    /**
     * 根据url匹配出缓存的路由信息
     * @param {string|IRouterURL} url
     * @returns {PathRegexpResult}
     */
    recognize(url: string): PathRegexpResult;
}
