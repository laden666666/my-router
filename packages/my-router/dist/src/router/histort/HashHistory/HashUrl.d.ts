import { ARouterURL } from '../IRouterURL';
export declare class HashUrl extends ARouterURL {
    constructor(pathStr?: string, queryMap?: {}, id?: string);
    stringify(): string;
    stringifyWithoutSystemData(): string;
    parse(url: string): void;
    /**
     * json转url参数
     * @param param         要解析的json数组。
     * @returns {string}    返回解析好的字符串
     * @private
     */
    _parseUrlParam(param: any): string;
}
