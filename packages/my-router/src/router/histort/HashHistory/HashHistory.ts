import createHashHistory from 'history/createHashHistory';
import {IHistory} from '../IHistory'
import {IRouterURL} from '../IRouterURL'
import {HashUrl} from './HashUrl'
import IdUtil from '../../util/IdUtil'

export class HashHistory implements IHistory{
    //react路由的BrowserHistory实例
    private static history: any;

    //单例实例
    private static _instance: IHistory;
    static instance(): IHistory{
        if(!HashHistory._instance){
            HashHistory._instance = new HashHistory()
        }
        return HashHistory._instance
    }

    //注册是location变化监听事件
    private listenFn: {(location:IRouterURL): void}[] = []

    private constructor(){
        HashHistory.history = createHashHistory();

        HashHistory.history.listen(location=>{
            let url = new HashUrl();
            url.parse(location.pathname + location.search);
            if(!url.id){
                url = new HashUrl(url.path, url.queryMap, IdUtil.createId())
                this.replace(url.stringify())
                return
            }
            this.listenFn.forEach(fn => {
                fn(url)
            });
        })
    }

    getURL(): IRouterURL{
        const location = HashHistory.history.location
        const url = new HashUrl();
        url.parse(location.pathname + location.search);
        return url
    }

    push(url: string){
        HashHistory.history.push(url)
    }

    replace(url: string){
        HashHistory.history.replace(url)
    }

    go(count: number){
        HashHistory.history.go(count)
    }

    goBack(){
        HashHistory.history.goBack()
    }

    goForward(){
        HashHistory.history.goForward()
    }

    listen(fn: {(location:IRouterURL): void}){
        this.listenFn.push(fn)
    }

    //url序列话
    parseURL(url: string){
        const hashUrl = new HashUrl();
        hashUrl.parse(url)
        return hashUrl
    }

    //url序列话
    createURL(path: string, queryMap: object, id: string){
        return new HashUrl(path, queryMap, id)
    }
}
