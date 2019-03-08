// import {StateCache, RouterURLState} from '../../src/router/StateCache'
// import {MemoryHistory} from '../../src/router/histort/MemoryHistory/MemoryHistory'
// import IdUtil from '../../src/router/util/IdUtil'
// import {RouterAction} from '../../src/router/RouterAction'

// let history, ids

// describe('路由的StateCache模块测试', function() {

//     before(function(){
//         history = MemoryHistory.instance()
//     })
    
//     it('初始化测试', function() {
//         let stateCache = StateCache.instance();
//         ids = [IdUtil.createId(), IdUtil.createId(), IdUtil.createId()]
//     });
    
//     it('设置初始值', function() {
//         let stateCache = StateCache.instance();
//         const defaultValue = new RouterURLState(history.parseURL('/xxx'))
//         stateCache.setURLState(defaultValue)
//         assert.deepEqual(stateCache.currentId, "")
//         assert.equal(stateCache.get(), defaultValue)
//     });
    
//     it('测试前进到某一状态', function() {
//         let stateCache = StateCache.instance();
//         const defaultValue = new RouterURLState(history.parseURL('/xxx'))
//         const nextValue = new RouterURLState(history.createURL('/xxx', {}, ids[1]))
//         stateCache.setURLState(defaultValue)

//         const result = stateCache.setURLState(nextValue)
//         assert.deepEqual(stateCache.currentId, ids[1])
//         assert.deepEqual(result.type, RouterAction.PUSH)
//     });
    
//     it('测试退回至前一状态', function() {
//         let stateCache = StateCache.instance();
//         const defaultValue = new RouterURLState(history.parseURL('/xxx'))
//         const lasetValue = new RouterURLState(history.createURL('/xxx', {}, ids[1]))
//         const nextValue = new RouterURLState(history.createURL('/xxx', {}, ids[2]))
//         stateCache.setURLState(defaultValue)

//         let result = stateCache.setURLState(nextValue)
//         assert.deepEqual(stateCache.currentId, ids[2])
//         assert.deepEqual(result.type, RouterAction.PUSH)
        
//         result = stateCache.setURLState(lasetValue)
//         assert.deepEqual(stateCache.currentId, ids[1])
//         assert.deepEqual(result.type, RouterAction.POP)
//         assert.deepEqual(result.clearedState[0].routerURL.id, ids[2])
//         assert.isUndefined(stateCache.get(ids[2]))
//     });
    
//     it('测试替换', function() {
//         let stateCache = StateCache.instance();
//         const defaultValue = new RouterURLState(history.parseURL('/xxx'))
//         const nextValue = new RouterURLState(history.createURL('/xxx', {}, ids[1]))
//         const relaceValue = new RouterURLState(history.createURL('/xxxyyy', {}, ids[1]))
//         stateCache.setURLState(defaultValue)
//         stateCache.setURLState(nextValue)

//         let result = stateCache.setURLState(relaceValue)
//         assert.deepEqual(stateCache.currentId, ids[1])
//         assert.deepEqual(result.type, RouterAction.REPLACE)
//         assert.deepEqual(result.clearedState[0].routerURL.path, '/xxx')
//         assert.deepEqual(stateCache.get(ids[1]).routerURL.path, '/xxxyyy')
//     });
// })