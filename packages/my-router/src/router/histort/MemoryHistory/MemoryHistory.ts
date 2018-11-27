/**
 * @file
 * 内存中对IHistory实现，主要是为测试使用
 */

import createMemoryHistory from 'history/createMemoryHistory';
import {IHistory} from '../IHistory'
import {IRouterURL} from '../IRouterURL'
import {MemoryhUrl} from './MemoryUrl'
import IdUtil from '../../util/IdUtil'

export class MemoryHistory implements IHistory{
    //react路由的BrowserHistory实例
    private static history: any;

    static instance(): IHistory{
        return new MemoryHistory()
    }

    //注册是location变化监听事件
    private listenFn: {(location:IRouterURL): void}[] = []

    private constructor(){
        MemoryHistory.history = createMemoryHistory('/');

        MemoryHistory.history.listen(location=>{
            let url = new MemoryhUrl();
            url.parse(location.pathname + location.search);
            if(!url.id){
                url = new MemoryhUrl(url.path, url.queryMap, IdUtil.createId())
                this.replace(url.stringify())
                return
            }
            this.listenFn.forEach(fn => {
                fn(url)
            });
        })
    }

    getURL(): IRouterURL{
        const location = MemoryHistory.history.location
        const url = new MemoryhUrl();
        url.parse(location.pathname + location.search);
        return url
    }

    push(url: string){
        MemoryHistory.history.push(url)
    }

    replace(url: string){
        MemoryHistory.history.replace(url)
    }

    go(count: number){
        MemoryHistory.history.go(count)
    }

    goBack(){
        MemoryHistory.history.goBack()
    }

    goForward(){
        MemoryHistory.history.goForward()
    }

    listen(fn: {(location:IRouterURL): void}){
        this.listenFn.push(fn)
    }
    
    //url序列话
    parseURL(url: string){
        const hashUrl = new MemoryhUrl();
        hashUrl.parse(url)
        return hashUrl
    }
    
    //url序列话
    createURL(path: string, queryMap: object, id: string){
        return new MemoryhUrl(path, queryMap, id)
    }
}