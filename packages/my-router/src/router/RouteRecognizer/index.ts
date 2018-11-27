declare const require: any

const $RouteRecognizer = require("route-recognizer").default
const path = require("path")

import {
    IRouterURL
} from '../histort/'
import {
    Route
} from '../RouterManager/IRouterConfig'
import {
    IRecognizeResult
} from './IRecognizeResult'

export {
    IRecognizeResult
}

export class RouteRecognizer{
    //路由匹配实现
    private _routeRecognizer

    //保存的路由
    private routes: Route[] = []

    constructor(){
        this._initRouteRecognizer()
    }

    /**
     * 初始化RouteRecognizer
     * @private
     */
    private _initRouteRecognizer(): void{
        const routes = [...this.routes].sort((route1, route2)=>{

            const paths1 = path.join('/', route1.path).split('/')
            const paths2 = path.join('/', route2.path).split('/')

            for(let i = 0; i < Math.min(paths1.length, paths2.length); i++){
                //带**的需要放到最后面
                if(paths1[i][0] != '**' && paths2[i][0] == '**'){
                    return -1
                } else if(paths1[i][0] == '**' && paths2[i][0] != '**'){
                    return 1
                }
                //带*的需要放到后面
                else if(paths1[i][0] != '*' && paths2[i][0] == '*'){
                    return -1
                } else if(paths1[i][0] == '*' && paths2[i][0] != '*'){
                    return 1
                }
                //带:也需要放到后面
                else if(paths1[i][0] != ':' && paths2[i][0] == ':'){
                    return -1
                } else if(paths1[i][0] == ':' && paths2[i][0] != ':'){
                    return 1
                }
                //否则安装字典序比较
                else if(paths1[i] > paths2[i]){
                    return -1
                } else if(paths1[i] < paths2[i]){
                    return 1
                }
            }

            //之后再比较path的长度，长度长的放前面
            if(paths1.length > paths2.lenght){
                return 1
            } else if(paths1.length < paths2.lenght){
                return -1
            }
            
            return 0
        })

        this._routeRecognizer = new $RouteRecognizer();
        routes.forEach(item => {
            this._routeRecognizer.add([{
                path: item.path,
                handler: item
            }])
        });
    }
    
    /**
     * 增加单个路由配置
     * @param {Route} route 
     * @memberof RouteRecognizer
     */
    addRoute(route:Route): void{
        this.routes.push(route)
        this._initRouteRecognizer();
    }
    
    /**
     * 增加一组路由配置
     * @param {Route[]} routes 
     * @memberof RouteRecognizer
     */
    addRoutes(routes:Route[]): void{
        this.routes = this.routes.concat(routes)
        this._initRouteRecognizer();
    }

    recognize(url: string): IRecognizeResult 
    recognize(url: IRouterURL): IRecognizeResult 

    /**
     * 根据url匹配出缓存的路由信息
     * @param {string|IRouterURL} url 
     * @returns {IRecognizeResult} 
     */
    recognize(url: string|IRouterURL): IRecognizeResult {
        if(typeof url != 'string' ){
            url = (url as IRouterURL).stringify()
        }

        //使用recognizeResult实现url匹配，并将匹配结果封装成RecognizeResult返回
        const routeList = this._routeRecognizer.recognize(url)

        if(routeList){
            const route = routeList ? Array.from(routeList)[0] : null
            
            const recognizeResult : IRecognizeResult = {} as IRecognizeResult
            recognizeResult.route = route['handler']
            recognizeResult.pathData = route ? route['params'] : {}
            //删除掉*相关的参数，仅保留:xx的参数
            delete recognizeResult.pathData['*']
            delete recognizeResult.pathData['']
            recognizeResult.queryData = routeList.queryParams
            recognizeResult.url = url
            
            return recognizeResult;
        } else {
            return null
        }
    }
}