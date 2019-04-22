import { History } from "../API";

// 这是一个状态模式，

/**
 * 一个状态模式，每个状态的功能接口
 * @interface IHistoryState
 */
export interface IHistoryState{
    // 当前history的状态：
    // 0未初始化    history没有完成初始化的时候
    // 1正常        history正常运行中
    // 2修正中      当用户手动修改hash，会被视为一次用户触发的跳转。此次跳转会先退回到goback页面，再前进回跳转的页面（为了保持history在浏览器中仅有两个浏览器记录——当前页面和退回页面），这个过程我们叫修改中
    // 3返回中      当用户要求跳转回退，或者正在回退
    // 4销毁中      在history销毁过程中的状态。
    // 5退出中      当用户要求退出到系统以外，系统会一直触发goback，直到页面刷新为止
    // 6跳转中      当用户要求跳转（包括push、replace、reload）
    // 7跳转中      执行生命周期中
    type: number,
    // 不同状态下，一些方法的实现
    push: History['push']
    replace: History['replace']
    goback: History['goback']
    reload: History['reload']
    hashChange(event: HashChangeEvent): void
}
