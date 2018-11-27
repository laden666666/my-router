declare var require: any

var path = require('path');

import {ARouterURL, TIME_STAMP_KEY} from '../IRouterURL';

function isEmptyObject(obj){
    var count = 0;
    for(var key in obj){
        count++;
    }
    return !count;
};


export class HashUrl extends ARouterURL{
    constructor(pathStr = "/", queryMap={}, id=''){
        super()

        //当前的url路径，无hash
        //路径,这是个相对路径,相对于我们的web程序而言
        this.path = path.join("/", pathStr);
        //查询参数
        this.queryMap = queryMap;
        //url的id
        this.id = id;
    }

    //url序列话
    stringify(): string{
        if(isEmptyObject(this.queryMap)){
            return this.path + (this.id ? `?${TIME_STAMP_KEY}=` + this.id : "");
        } else {
            return this.path+ "?" + this._parseUrlParam(this.queryMap) + (this.id ? `&${TIME_STAMP_KEY}=` + this.id : "");
        }

    }

    //url系列化，但是不好含系统变量
    stringifyWithoutSystemData(): string{
        if(isEmptyObject(this.queryMap)){
            return this.path;
        } else {
            return this.path+ "?" + this._parseUrlParam(this.queryMap);
        }
    }

    //url序列话
    parse(url: string){
        if(!url){
            throw new TypeError("url is not string!")
        }

        if(url.indexOf("?") > -1){
            var urls = url.split("?");

            this.path = urls[0];
            urls[1].split("&").map(arg=>{
                var argStr = arg.split("=");
                var key = decodeURIComponent(argStr[0]);
                var value = decodeURIComponent(argStr[1]);

                if(TIME_STAMP_KEY == key){
                    this.id = value;
                    return
                }

                if(this.queryMap.hasOwnProperty(key)){
                    if(!(this.queryMap[key] instanceof Array)){
                        this.queryMap[key] = [this.queryMap[key]];
                    }
                    this.queryMap[key].push(value)
                } else {
                    this.queryMap[key] = value;
                }
            });
        } else {
            this.path = url;
        }
    }

    //私有方法
    /**
     * json转url参数
     * @param param         要解析的json数组。
     * @returns {string}    返回解析好的字符串
     * @private
     */
    _parseUrlParam(param) {
        var paramStr = [];
        for(var key in param){
            if(param[key] instanceof Array){
                for(var index in param[key]){
                    paramStr.push(encodeURIComponent(key) + "=" + encodeURIComponent( param[key][index]));

                }
            } else {
                paramStr.push(encodeURIComponent(key) + "=" + encodeURIComponent( param[key]));
            }
        }

        //按字典序排序
        paramStr = paramStr.sort(function (a, b) {
            if(a > b){
                return 1
            } else if(a < b){
                return -1
            } else {
                return 0
            }
        })

        return paramStr.join("&");
    };
}
