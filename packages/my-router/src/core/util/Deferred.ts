/**
 * 反转promise的异步控制的对象模型——Deferred
 * @returns
 */
export class Deferred<T>{
    /**
     * promise是否已经完成
     * @type {boolean}
     */
    private $isFinished: boolean = false
    get isFinished(){
        return this.$isFinished
    }

    /**
     * 控制的promise
     * @type {Promise<T>}
     */
    promise: Promise<T>

    /**
     * promise正常完成
     * @type {{(args:T):void}}
     */
    private $resolve: {(args:T):void}

    /**
     * promise异常结束
     * @type {{(args:any):void}}
     */
    private $reject: {(args:any):void}

    /**
     * 对外暴露的接口，promise正常完成
     * @param {T} args
     */
    resolve(args:T){
        this.$isFinished = true;
        this.$resolve(args)
    }


    /**
     * 对外暴露的接口，promise异常结束
     * @param {any} args
     */
    reject(args:any){
        this.$isFinished = true;
        this.$reject(args)
    }

    constructor(){
        //返回的参数
        this.promise = new Promise<T>((resolve, reject)=>{
            this.$resolve = resolve;
            this.$reject = reject;
        });
    }
}
