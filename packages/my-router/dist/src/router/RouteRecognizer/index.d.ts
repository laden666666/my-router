import { IRouterURL } from '../histort/';
import { Route } from '../RouterManager/IRouterConfig';
import { IPathRegexpResult } from './IPathRegexpResult';
export { IPathRegexpResult };
export declare class IPathRegexp {
    private _PathRegexp;
    private routes;
    constructor();
    /**
     * 初始化PathRegexp
     * @private
     */
    private _initPathRegexp;
    /**
     * 增加单个路由配置
     * @param {Route} route
     * @memberof IPathRegexp
     */
    addRoute(route: Route): void;
    /**
     * 增加一组路由配置
     * @param {Route[]} routes
     * @memberof IPathRegexp
     */
    addRoutes(routes: Route[]): void;
    recognize(url: string): IPathRegexpResult;
    recognize(url: IRouterURL): IPathRegexpResult;
}
