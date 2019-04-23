import { History } from "../API";
/**
 * 一个状态模式，每个状态的功能接口
 * @interface IHistoryState
 */
export interface IHistoryState {
    type: number;
    push: History['push'];
    replace: History['replace'];
    goback: History['goback'];
    reload: History['reload'];
    hashChange(event: HashChangeEvent): void;
}
