/**
 * url虚拟化的接口
 * 规定了一个url的定义,要求有两部分组成,1是路径,2是查询参数。并且baseurl可以将这两部分序列化为一个字符串,当字符串一直的时候,视为两个url是相等的
 */

export interface IRouterURL{
    //路径,这是个相对路径,相对于我们的web程序而言
    path : string
    //查询参数
    queryMap : {}
    //url的id
    id : any

    //将实例序列化为一个url字符串，包含系统变量
    stringify(): string;

    //将实例序列化为一个url字符串，但是不好含系统变量
    stringifyWithoutSystemData(): string;
}

export abstract class ARouterURL implements IRouterURL{
    //路径,这是个相对路径,相对于我们的web程序而言
    public path : string
    //查询参数
    public queryMap : {}
    //url的id
    public id : any

    //将实例序列化为一个url字符串，包含系统变量
    abstract stringify(): string;

    //将实例序列化为一个url字符串，但是不好含系统变量
    abstract stringifyWithoutSystemData(): string;
    
    //通过一个url给当前对象初始化
    abstract parse(url: string): void;
}

//在url参数中的系统参数
export const TIME_STAMP_KEY = "_"