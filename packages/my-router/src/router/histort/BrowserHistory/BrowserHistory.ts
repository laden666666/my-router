import createBrowserHistory from 'history/createBrowserHistory';
import {IHistory} from '../IHistory'
import {IRouterURL} from '../IRouterURL'
import {BrowserUrl} from './BrowserUrl'
import IdUtil from '../../util/IdUtil'

export class BrowserHistory implements IHistory{
    //react路由的BrowserHistory实例
    private static history: any;

    //单例实例
    private static _instance: IHistory;
    static instance(): IHistory{
        if(!BrowserHistory._instance){
            BrowserHistory._instance = new BrowserHistory()
        }
        return BrowserHistory._instance
    }

    //注册是location变化监听事件
    private listenFn: {(location:IRouterURL): void}[] = []

    private constructor(){
        BrowserHistory.history = createBrowserHistory();
        
        BrowserHistory.history.listen(location=>{
            let url = new BrowserUrl();
            url.parse(location.pathname + location.search);
            if(!url.id){
                url = new BrowserUrl(url.path, url.queryMap, IdUtil.createId())
                this.replace(url.stringify())
                return
            }
            this.listenFn.forEach(fn => {
                fn(url)
            });
        })
    }

    getURL(): IRouterURL{
        const location = BrowserHistory.history.location
        const url = new BrowserUrl();
        url.parse(location.pathname + location.search);
        return url
    }

    push(url: string){
        BrowserHistory.history.push(url)
    }

    replace(url: string){
        BrowserHistory.history.replace(url)
    }

    go(count: number){
        BrowserHistory.history.go(count)
    }

    goBack(){
        BrowserHistory.history.goBack()
    }

    goForward(){
        BrowserHistory.history.goForward()
    }

    listen(fn: {(location:IRouterURL): void}){
        this.listenFn.push(fn)
    }
    
    //url序列话
    parseURL(url: string){
        const browserUrl = new BrowserUrl();
        browserUrl.parse(url)
        return browserUrl
    }
    
    //url序列话
    createURL(path: string, queryMap: object, id: string){
        return new BrowserUrl(path, queryMap, id)
    }
}