import IdUtil from './IdUtil';
import RouterAction from '../RouterAction';

/**
 * 缓存访问历史信息的map
 */
class HistoryCache{

    constructor(){
        //保存路由信息的堆栈。以id(时间戳)value形式,BrowserUrl对象和对应的data做缓存的对象
        this.map = {};

        //当前的历史信息
        this.currentId = "";
    }

    get(id=this.currentId){
        return this.map[this.currentId];
    }

	/**
     * 根据id和currentId关系,判断用户是压入新地址历史数据、替换当前历史数据、退回历史数据,具体算法是:
     * id等于currentId,表示替换地址,仅是将新url替换掉老url,并移除对应的session
     * id大于currentId,且id不在map中,表示压入新的历史数据,会把比当前key大的id都清除掉。这主要是因为用户未必在history栈的栈顶,当用户不在栈顶而压入新url的时候,会将之前栈顶上层的历史遗弃掉
     * id大于currentId,且id在map中,逻辑与id小于currentId相同,是前进,不对url做改变
     * id小于currentId,表示退回操作。如果map里面没有对应id的数据,还会创建(如果有就不会创建了,不管url是否相等)。
     */
    setUrl(id="0", url){
        if(this.currentId == id){
            //替换
            this.map[this.currentId] = {
                url: url,
                data: {},
            }
            return RouterAction.REPLACE;
        } else if(id > this.currentId && !this.map[id]){
            //压入新历史
            var map = {};
            for(let _id in this.map){
                if(IdUtil.compareId(this.currentId, _id) >= 0){
                    map[_id] = this.map[_id]
                }
            }
            map[id] = {url ,data: {}};
            this.currentId = id;
            this.map = map;
            return RouterAction.PUSH;
        } else if(id > this.currentId && this.map[id]){
            //前进
            this.currentId = id;
            if(!this.map[id]){
                this.map[id] = {
                    url: url,
                    data: {},
                }
            }
            return RouterAction.FORWARD;
        } else if(id < this.currentId){
            //回退
            this.currentId = id;
            if(!this.map[id]){
                this.map[id] = {
                    url: url,
                    data: {},
                }
            }
            return RouterAction.POP;
        }
    }

    iterator(fn){
        for (var id in this.map){
            fn(this.map[id], id)
        }
    }
}

export default HistoryCache;
