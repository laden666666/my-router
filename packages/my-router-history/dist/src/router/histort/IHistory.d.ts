/**
 * @file
 * 抽象浏览器的history对象，实现对于不同路由模式下对浏览器实现统一抽象
 */
import { IRouterURL } from './IRouterURL';
/**
 * 对浏览器history对象的抽象
 */
export interface IHistory {
    getURL(): IRouterURL;
    push(url: string): void;
    replace(url: string): void;
    go(count: number): void;
    goBack(): void;
    goForward(): void;
    parseURL(url: string): IRouterURL;
    createURL(path: string, queryMap: object, id: string): IRouterURL;
    listen(fn: {
        (location: IRouterURL): void;
    }): any;
}
