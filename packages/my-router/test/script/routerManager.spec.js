import { MyRouter } from '../../src/core/MyRouter'

const RouterAction = {
    PUSH: 'push',
    INIT: 'init',
}

describe('路由的模块测试', function() {
    this.timeout(4000);

    let routerManager = new MyRouter()
    beforeEach(async function() {
        if(routerManager){
            await routerManager.destroy()
            routerManager = null
        }
        location.href = '#/'
        await new Promise(r=>setTimeout(r, 100))
    });
    afterEach(async function() {
        if(routerManager){
            await routerManager.destroy()
            routerManager = null
        }
        await new Promise(r=>setTimeout(r, 100))
    });

    it('初始化测试', function() {
        return new Promise((resolve, reject)=>{
            routerManager = new MyRouter({

                routes: [{
                    path: '/',
                    meta: {
                        id: 1
                    }
                }],
                onURLChange: (result, from, to, clears, news)=>{
                    try{
                        assert.deepEqual(result, RouterAction.INIT)
                        assert.isArray(clears)
                        assert.isEmpty(clears)
                        assert.isNull(from)
                        assert.equal(result, 'init')
                        assert.deepEqual(to.path, '/')
                        resolve()
                    } catch(e){
                        reject(e)
                    }
                }
            })
        })
    });

    it('设置路由，匹配路由', function() {
        return new Promise((resolve, reject)=>{
            routerManager = new MyRouter({

                routes: [{
                    path: '/xxx',
                    meta: {
                        id: 1
                    }
                }],
                onURLChange: (result, from, to, clears, news)=>{
                    try{
                        if(to && to.path == '/xxx'){
                            assert.deepEqual(result, RouterAction.PUSH)
                            assert.deepEqual(to.query.test, 'testQuery')
                            assert.deepEqual(to.session.test, 'testSession')
                            resolve()
                        }
                    } catch (e){
                        reject(e)
                    }
                }
            })
            routerManager.push('/xxx?test=testQuery', {test: 'testSession'})
        })
    });

    it('路由currentRoute函数和route测试', function() {
        return new Promise((resolve, reject)=>{
            routerManager = new MyRouter({

                routes: [{
                    path: '/xxx/:testPath',
                    meta: {
                        id: 1
                    }
                }],
                onURLChange: (action)=>{
                    try{
                        if(action != 'push'){
                            return
                        }

                        var routeData = routerManager.currentRoute

                        // 获取url全路径
                        assert.deepEqual(routeData.fullPath, '/xxx/testPath?testQuery=testQuery')
                        // 获取查询参数
                        assert.deepEqual(routeData.query.testQuery, 'testQuery')
                        // 获取session参数
                        assert.deepEqual(routeData.session.testSession, 'testSession')
                        // 获取路径参数
                        assert.deepEqual(routeData.params.testPath, 'testPath')
                        // 获取当前页信息对应的配置
                        assert.deepEqual(routeData.routeConfig, {
                            path: '/xxx/:testPath',
                            meta: {
                                id: 1
                            }
                        })
                        resolve()
                    } catch (e){
                        reject(e)
                    }
                }
            })
            routerManager.push('/xxx/testPath?testQuery=testQuery', {testSession: 'testSession'})
        })
    });

    it('测试路由session的push', ()=> {
        routerManager = new MyRouter({
            routes: [{
                path: '/xxx',
            }],
            onURLChange: (result, from, to, clears, news)=>{
                try{
                    if(to && to.routeConfig && to.routeConfig.path == '/xxx'){
                        routerManager.goback()
                    }
                } catch (e){
                    console.error(e)
                }
            }
        })
        return new Promise(async (resolve, reject)=>{
            await routerManager.push('/xxx')
            resolve()
        })
    });

    // it('测试路由session的push，浏览器退回', ()=> {
    //     routerManager = new MyRouter({
    //

    //         routes: [{
    //             path: '/xxx',
    //         }],
    //         onURLChange: (result, from, to, clears, news)=>{
    //             try{
    //                 console.log(result, from && from.routeConfig && from.routeConfig.path, to && to.routeConfig && to.routeConfig.path)
    //                 if(to && to.routeConfig && to.routeConfig.path == '/xxx'){
    //                     routerManager.history.go(-1)
    //                 }
    //             } catch (e){
    //                 console.error(e)
    //             }
    //         }
    //     })
    //     return new Promise(async (resolve, reject)=>{
    //         await routerManager.push('/xxx')
    //         resolve()
    //     })
    // });

    // it('测试路由session的redirectTo', function() {
    //     routerManager = new MyRouter({
    //

    //         routes: [{
    //             path: '/xxx',
    //         }, {
    //             path: '/yyy',
    //         }],
    //         onURLChange: (result, from, to, clears, news, clearList)=>{
    //             try{
    //                 console.log(result, from && from.routeConfig && from.routeConfig.path, to && to.routeConfig && to.routeConfig.path)
    //                 if(to && to.routeConfig && to.routeConfig.path == '/xxx'){
    //                     routerManager.redirectTo('yyy')
    //                 } else if(to && to.routeConfig && to.routeConfig.path == '/yyy'){
    //                     assert.equal(clearList.length, 1)
    //                     routerManager.goback()
    //                 }
    //             } catch (e){
    //                 console.error(e)
    //             }
    //         }
    //     })

    //     return new Promise(async (resolve, reject)=>{
    //         await routerManager.push('/xxx')
    //         resolve()
    //     })
    // });

    // it('测试路由session的reload', function() {
    //     let count = 0
    //     routerManager = new MyRouter({
    //         //用内存history模拟浏览器路由

    //         routes: [{
    //             path: '/xxx',
    //         }],
    //         onURLChange: (result, from, to, clears, news, clearList)=>{
    //             try{
    //                 console.log(result, from && from.routeConfig && from.routeConfig.path, to && to.routeConfig && to.routeConfig.path)
    //                 if(to && to.routeConfig && to.routeConfig.path == '/xxx' && count == 0){
    //                     count++
    //                     routerManager.reload()
    //                 } else if(to && to.routeConfig && to.routeConfig.path == '/xxx' && count == 1){
    //                     // assert.equal(clearList.length, 1)
    //                     routerManager.goback()
    //                 }
    //             } catch (e){
    //                 console.error(e)
    //             }
    //         }
    //     })

    //     return new Promise(async (resolve, reject)=>{
    //         await routerManager.push('/xxx')
    //         resolve()
    //     })
    // });

    // it('测试路由缓存移除', function() {
    //     return new Promise((resolve, reject)=>{
    //         routerManager = new MyRouter({
    //             //用内存history模拟浏览器路由

    //             routes: [{
    //                 path: '/',
    //             }, {
    //                 path: '/xxx',
    //             }],
    //             onURLChange: (result, from, to, clears, news, clearState)=>{
    //                 try{
    //                     if(to && to.routeConfig && to.routeConfig.path == '/xxx'){
    //                         routerManager.goback()
    //                     } else if(clearState.length == 1 && clearState[0].routeConfig == from.routeConfig && from.routeConfig.path == '/xxx'){
    //                         resolve()
    //                     }
    //                 } catch (e){
    //                     reject(e)
    //                 }
    //             },
    //         })

    //         routerManager.push('/xxx')
    //     })
    // });

    // it('测试路由监听beforeUpdateListener', function() {
    //     var hasToken = false
    //     return new Promise((resolve, reject)=>{
    //         routerManager = new MyRouter({
    //             //用内存history模拟浏览器路由

    //             routes: [{
    //                 path: '/',
    //                 meta: {
    //                     hasToken: true
    //                 }
    //             }, {
    //                 path: '/token',
    //                 meta: {
    //                 }
    //             }],
    //             onURLChange: (result, from, to, clears, news, clearState)=>{
    //                 console.log(result, from && from.routeConfig && from.routeConfig.path, to && to.routeConfig && to.routeConfig.path)
    //                 try{
    //                     if(to && to.routeConfig && to.routeConfig.path == '/token'){
    //                         hasToken = true;
    //                         routerManager.goback()
    //                     } else if(to && to.routeConfig && to.routeConfig.path == '/'){
    //                         resolve()
    //                     }
    //                 } catch (e){
    //                     reject(e)
    //                 }
    //             },

    //             onBeforeURLChange: (from, to)=>{
    //                 try{
    //                     if(to.routeConfig.meta.hasToken){
    //                         return routerManager.push('/token')
    //                     }
    //                 } catch (e){
    //                     reject(e)
    //                 }

    //             },
    //         })
    //     })
    // });

    // it('测试路由监听beforeRouteEnterListener', function() {
    //     var hasToken = false
    //     return new Promise((resolve, reject)=>{
    //         routerManager = new MyRouter({
    //             //用内存history模拟浏览器路由

    //             routes: [{
    //                 path: '/',
    //                 meta: {
    //                     hasToken: true
    //                 }
    //             }, {
    //                 path: '/token',
    //                 meta: {
    //                 }
    //             }],
    //             onURLChange: (result, from, to, clears, news, clearState)=>{
    //                 console.log(result, from && from.routeConfig && from.routeConfig.path, to && to.routeConfig && to.routeConfig.path)
    //                 try{
    //                     if(to && to.routeConfig && to.routeConfig.path == '/token'){
    //                         console.log('go login')
    //                         hasToken = true;
    //                         routerManager.goback()
    //                     } else if(to && to.routeConfig && to.routeConfig.path == '/' && hasToken){
    //                         console.log('has login')
    //                         resolve()
    //                     }
    //                 } catch (e){
    //                     reject(e)
    //                 }
    //             },

    //             onBeforeRouteEnter: (result, from, to, clears, news, clearState)=>{
    //                 try{
    //                     if(to.routeConfig.meta.hasToken && !hasToken){
    //                         setTimeout(()=>{
    //                             routerManager.push('/token')
    //                         })
    //                         return false
    //                     }
    //                 } catch (e){
    //                     reject(e)
    //                 }
    //             },
    //         })
    //     })
    // });

    // it('测试路由监听clearCacheListener', function() {
    //     var step = 0
    //     return new Promise((resolve, reject)=>{
    //         routerManager = new MyRouter({
    //             //用内存history模拟浏览器路由

    //             routes: [{
    //                 path: '/',
    //                 meta: {
    //                     hasToken: true
    //                 }
    //             }, {
    //                 path: '/xxx',
    //             }, {
    //                 path: '/yyy',
    //             }],
    //             onDestroyState: (clearState)=>{
    //                 // console.log(routerManager.getCurrentURL().path)
    //                 // console.log(clearState.length)
    //                 if(routerManager.getCurrentURL().path != '/yyy'){
    //                     step++
    //                     assert.equal(clearState.length, 0)
    //                 } else {
    //                     if(clearState.length != 0){
    //                         assert.equal(step, 3)
    //                         assert.equal(clearState.length, 2)
    //                         resolve()
    //                     } else {
    //                         step++
    //                     }
    //                 }
    //             },
    //             onURLChange: (result, from, to, clears, news, clearState)=>{
    //                 try{
    //                     if(to.routeConfig.path == '/'){
    //                         setTimeout(()=>{
    //                             routerManager.push('/xxx')
    //                         }, 1)
    //                     } else if(to.routeConfig.path == '/xxx'){
    //                         setTimeout(()=>{
    //                             routerManager.push('/yyy')
    //                         }, 1)
    //                     } else if(to.routeConfig.path == '/yyy'){
    //                         setTimeout(()=>{
    //                             routerManager.destroyState()
    //                         }, 100)
    //                     }
    //                 } catch (e){
    //                     reject(e)
    //                 }
    //             },
    //         })
    //     })
    // });
});
