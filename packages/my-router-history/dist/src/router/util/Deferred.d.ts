/**
 * 反转promise的异步控制的对象模型——Deferred
 * @returns
 */
export declare class Deferred<T> {
    /**
     * promise是否已经完成
     * @type {boolean}
     */
    private $isFinished;
    readonly isFinished: boolean;
    /**
     * 控制的promise
     * @type {Promise<T>}
     */
    promise: Promise<T>;
    /**
     * promise正常完成
     * @type {{(args:T):void}}
     */
    private $resolve;
    /**
     * promise异常结束
     * @type {{(args:any):void}}
     */
    private $reject;
    /**
     * 对外暴露的接口，promise正常完成
     * @param {T} args
     */
    resolve(args: T): void;
    /**
     * 对外暴露的接口，promise异常结束
     * @param {any} args
     */
    reject(args: any): void;
    constructor();
}
