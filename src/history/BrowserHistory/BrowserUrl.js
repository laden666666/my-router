/**
 * 一个url的工具类,是对url的抽象
 * BaseUrl规定了一个url的定义,要求有两部分组成,1是路径,2是查询参数。并且baseurl可以将这两部分序列化为一个字符串,当字符串一直的时候,
 * 视为两个url是相等的
 */

//在url参数中的系统参数
const TIME_STAMP_KEY = "_"

function isEmptyObject(obj){
    var count = 0;
    for(var key in obj){
        count++;
    }
    return !count;
};


class BrowserUrl{
    constructor(path = "/", queryMap={}, id){
        //路径,这是个相对路径,相对于我们的web程序而言
        this.path = path;
        //查询参数
        this.queryMap = queryMap;
        //url的id
        this.id = id;
    }

    //url序列话
    stringify(){
        if(isEmptyObject(this.queryMap)){
            return this.path + (this.id ? `?${TIME_STAMP_KEY}=` + this.id : "");
        } else {
            return this.path+ "?" + this._parseUrlParam(this.queryMap) + (this.id ? `&${TIME_STAMP_KEY}=` + this.id : "");
        }

    }

    //url序列话
    parse(url){
        if(!url){
            throw new TypeError("url is not string!")
        }

        url = url.split("#")[0];

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
            return a > b;
        })

        return paramStr.join("&");
    };
}

export default BrowserUrl;
