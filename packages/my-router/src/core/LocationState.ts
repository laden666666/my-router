import { Location } from 'my-router-history'
import { PathRegexpResult } from '../API';
import { Deferred } from './util/Deferred';

export class LocationState {
    
    /**
     * 当前的location
     */
    location: Location

    /**
     * 路由匹配的结果
     */
    recognizeResult: PathRegexpResult

    ///session信息
    /**
     * session数据
     * @type {*}
     */
    data: any
    /**
     * session的promise的控制器
     * @type {Deferred<any>}
     */
    sessionDeferred: Deferred<any>
    
    /**
    * 页面返回值
    * @type {*}
    */
    backValue: any = null
    
    /**
     * 其他信息（如果dom）
     * @type {*}
     */
    otherData: any = {}

    constructor(location: Location){
        this.location = location
    }

    /**
     * 销毁
     * @memberof RouterURLState
     */
    destroy(){
        //如果存在未完成的promise，自动调用用户取消异常完成
        if(this.sessionDeferred && !this.sessionDeferred.isFinished){
            this.sessionDeferred.reject(new Error('destroy'))
        }

        this.data = null;
        this.sessionDeferred = null
        this.backValue = null
        this.otherData = null
    }
}