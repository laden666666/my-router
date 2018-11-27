import { IHistory } from '../IHistory';
import { IRouterURL } from '../IRouterURL';
import { BrowserUrl } from './BrowserUrl';
export declare class BrowserHistory implements IHistory {
    private static history;
    private static _instance;
    static instance(): IHistory;
    private listenFn;
    private constructor();
    getURL(): IRouterURL;
    push(url: string): void;
    replace(url: string): void;
    go(count: number): void;
    goBack(): void;
    goForward(): void;
    listen(fn: {
        (location: IRouterURL): void;
    }): void;
    parseURL(url: string): BrowserUrl;
    createURL(path: string, queryMap: object, id: string): BrowserUrl;
}
