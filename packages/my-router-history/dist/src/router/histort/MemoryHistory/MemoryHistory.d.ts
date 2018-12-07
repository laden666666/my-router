/**
 * @file
 * 内存中对IHistory实现，主要是为测试使用
 */
import { IHistory } from '../IHistory';
import { IRouterURL } from '../IRouterURL';
import { MemoryhUrl } from './MemoryUrl';
export declare class MemoryHistory implements IHistory {
    private static history;
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
    parseURL(url: string): MemoryhUrl;
    createURL(path: string, queryMap: object, id: string): MemoryhUrl;
}
