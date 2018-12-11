/**
 * url虚拟化的接口
 * 规定了一个url的定义,要求有两部分组成,1是路径,2是查询参数。并且baseurl可以将这两部分序列化为一个字符串,当字符串一直的时候,视为两个url是相等的
 */
export interface IRouterURL {
    path: string;
    queryMap: {};
    id: any;
    stringify(): string;
    stringifyWithoutSystemData(): string;
}
export declare abstract class ARouterURL implements IRouterURL {
    path: string;
    queryMap: {};
    id: any;
    abstract stringify(): string;
    abstract stringifyWithoutSystemData(): string;
    abstract parse(url: string): void;
}
export declare const TIME_STAMP_KEY = "_";
