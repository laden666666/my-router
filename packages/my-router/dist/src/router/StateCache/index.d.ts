import { RouterAction } from '../RouterAction';
import { RouterURLState } from './RouterURLState';
export interface IStateCacheResult {
    type: RouterAction;
    clearedState: RouterURLState[];
}
export { RouterURLState };
/**
 * 缓存访问历史信息。他将被访问的页面缓存起来，并提供了一个页面session，使得用户跳转后再返回能够回去之前页面缓存的数据
 */
export declare class StateCache {
    map: Map<string, RouterURLState>;
    currentId: string;
    private constructor();
    static instance(): StateCache;
    /**
     * 根据id，获取缓存的url及其session数据
     * @param {any} [id=this.currentId]
     * @returns {RouterURLState}
     */
    get(id?: string): RouterURLState;
    /**
     * 清除一段id区间内的缓存的url数据（除当前页面）
     * @param {string} [toId=this.currentId]                要删除的id
     * @param {string} [formId='']                         从上面id开始删除，默认是从头开始删除
     * @returns                                             被删除页面的id
     */
    clear(toId?: string, formId?: string): RouterURLState[];
    /**
     * 根据id和currentId关系,判断用户是压入新地址历史数据、替换当前历史数据、退回历史数据,具体算法是:
     * id等于currentId,表示替换地址,仅是将新url替换掉老url,并移除对应的session
     * id大于currentId,且id不在map中,表示压入新的历史数据,会把比当前key大的id都清除掉。这主要是因为用户未必在history栈的栈顶,当用户不在栈顶而压入新url的时候,会将之前栈顶上层的历史遗弃掉
     * id大于currentId,且id在map中,逻辑与id小于currentId相同,是前进,不对url做改变
     * id小于currentId,表示退回操作。如果map里面没有对应id的数据,还会创建(如果有就不会创建了,不管url是否相等)。
     */
    setURLState(url: RouterURLState): IStateCacheResult;
}
