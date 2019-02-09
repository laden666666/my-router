export declare const canUseDOM: boolean;
/**
 * 在下一个任务队列中执行
 * @export
 * @param {Function} cb         回调函数
 * @param {Object} [ctx]
 */
export declare function nextTick(cb: Function, ctx?: Object): void;
