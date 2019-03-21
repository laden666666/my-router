import {MyRouteConfig, IPathRegexp, PathRegexpResult} from '../API'
declare function require(name: string): any
let path = require('path')
import RouteRecognizer from '../lib/route-recognizer'

export class PathRegexp implements IPathRegexp{
    //路由匹配实现
    private _routeRecognizer: RouteRecognizer

    //保存的路由
    private routes: MyRouteConfig[] = []

    constructor(){
        this.precisionMatch()
    }

    /**
     * 初始化RouteRecognizer
     * @private
     */
    precisionMatch(): void{
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

        this._routeRecognizer = new RouteRecognizer();
        routes.forEach(item => {
            this._routeRecognizer.add([{
                path: item.path,
                handler: item
            }])
        });
    }
    
    /**
     * 增加单个路由配置
     * @param {MyRouteConfig} route 
     * @memberof RouteRecognizer
     */
    addRoute(route: MyRouteConfig): void{
        this.routes.push(route)
        this.precisionMatch();
    }
    
    /**
     * 增加一组路由配置
     * @param {MyRouteConfig[]} routes 
     * @memberof RouteRecognizer
     */
    addRoutes(routes: MyRouteConfig[]): void{
        this.routes = this.routes.concat(routes)
        this.precisionMatch();
    }


    /**
     * 根据url匹配出缓存的路由信息
     * @param {string|IRouterURL} url 
     * @returns {PathRegexpResult} 
     */
    recognize(url: string): PathRegexpResult {

        //使用recognizeResult实现url匹配，并将匹配结果封装成RecognizeResult返回
        const routeList = this._routeRecognizer.recognize(url)

        if(routeList){
            const route = routeList ? Array.from(routeList)[0] : null
            
            const recognizeResult : PathRegexpResult = {} as PathRegexpResult
            recognizeResult.routeConfig = route.handler as any
            recognizeResult.pathData = (route ? route.params : {}) as any
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
