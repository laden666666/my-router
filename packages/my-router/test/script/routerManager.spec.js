// import { RouterManager, RouterAction } from '../../src/router/'

// describe('路由的模块测试', function() {
//     this.timeout(8000);

//     it('初始化测试', function() {
//         return new Promise((resolve, reject)=>{
//             const routerManager = new RouterManager({
//                 //用内存history模拟浏览器路由
//                 mode: 'm',
//                 routes: [{
//                     path: '/',
//                     meta: {
//                         id: 1
//                     }
//                 }],
//                 onURLChange: (result, from, to, clears)=>{
//                     try{
//                         assert.deepEqual(result, RouterAction.PUSH)
//                         assert.isArray(clears)
//                         assert.isEmpty(clears)
//                         assert.isNull(from)
//                         assert.deepEqual(to.routeConfig.path, '/')
//                         resolve()
//                     } catch(e){
//                         reject(e)
//                     }
//                 }
//             })
//         })
//     });

//     it('设置路由，匹配路由', function() {
//         return new Promise((resolve, reject)=>{
//             const routerManager = new RouterManager({
//                 //用内存history模拟浏览器路由
//                 mode: 'm',
//                 routes: [{
//                     path: '/xxx',
//                     meta: {
//                         id: 1
//                     }
//                 }],
//                 onURLChange: (result, from, to)=>{
//                     try{
//                         if(to && to.routeConfig && to.routeConfig.path == '/xxx'){
//                             assert.deepEqual(result, RouterAction.PUSH)
//                             assert.deepEqual(to.queryData.test, 'testQuery')
//                             assert.deepEqual(to.sessionData.test, 'testSession')
//                             resolve()
//                         }
//                     } catch (e){
//                         reject(e)
//                     }
//                 }
//             })
//             routerManager.navigateTo('/xxx', {test: 'testQuery'}, {test: 'testSession'})
//         })
//     });

//     it('路由getCurrentRouteData函数和RouteData测试', function() {
//         return new Promise((resolve, reject)=>{
//             const routerManager = new RouterManager({
//                 //用内存history模拟浏览器路由
//                 mode: 'm',
//                 routes: [{
//                     path: '/xxx/:testPath',
//                     meta: {
//                         id: 1
//                     }
//                 }],
//                 onURLChange: ()=>{
//                     var routeData = routerManager.getCurrentRouteData()


//                     //获取url全路径
//                     assert.deepEqual(routeData.fullPath, '/xxx/testPath?testQuery=testQuery')
//                     //获取查询参数
//                     assert.deepEqual(routeData.queryData.testQuery, 'testQuery')
//                     //获取session参数
//                     assert.deepEqual(routeData.sessionData.testSession, 'testSession')
//                     //获取路径参数
//                     assert.deepEqual(routeData.pathData.testPath, 'testPath')
//                     //获取查询参数和路径参数的混合参数
//                     assert.deepEqual(routeData.routeData.testQuery, 'testQuery')
//                     assert.deepEqual(routeData.routeData.testPath, 'testPath')
//                     //获取当前页信息对应的配置
//                     assert.deepEqual(routeData.routeConfig, {
//                         path: '/xxx/:testPath',
//                         meta: {
//                             id: 1
//                         }
//                     })
//                     resolve()
//                 }
//             })
//             routerManager.navigateTo('/xxx/testPath', {testQuery: 'testQuery'}, {testSession: 'testSession'})
//         })
//     });



//     it('测试路由session的navigateTo', ()=> {
//         const routerManager = new RouterManager({
//             //用内存history模拟浏览器路由
//             mode: 'm',
//             routes: [{
//                 path: '/xxx',
//             }],
//             onURLChange: (result, from, to)=>{
//                 try{
//                     console.log(result, from && from.routeConfig && from.routeConfig.path, to && to.routeConfig && to.routeConfig.path)
//                     if(to && to.routeConfig && to.routeConfig.path == '/xxx'){
//                         routerManager.navigateBack()
//                     }
//                 } catch (e){
//                     console.error(e)
//                 }
//             }
//         })
//         return new Promise(async (resolve, reject)=>{
//             await routerManager.navigateTo('/xxx')
//             resolve()
//         })
//     });

//     it('测试路由session的navigateTo，浏览器退回', ()=> {
//         const routerManager = new RouterManager({
//             //用内存history模拟浏览器路由
//             mode: 'm',
//             routes: [{
//                 path: '/xxx',
//             }],
//             onURLChange: (result, from, to)=>{
//                 try{
//                     console.log(result, from && from.routeConfig && from.routeConfig.path, to && to.routeConfig && to.routeConfig.path)
//                     if(to && to.routeConfig && to.routeConfig.path == '/xxx'){
//                         routerManager.history.go(-1)
//                     }
//                 } catch (e){
//                     console.error(e)
//                 }
//             }
//         })
//         return new Promise(async (resolve, reject)=>{
//             await routerManager.navigateTo('/xxx')
//             resolve()
//         })
//     });

//     it('测试路由session的redirectTo', function() {
//         const routerManager = new RouterManager({
//             //用内存history模拟浏览器路由
//             mode: 'm',
//             routes: [{
//                 path: '/xxx',
//             }, {
//                 path: '/yyy',
//             }],
//             onURLChange: (result, from, to, clearList)=>{
//                 try{
//                     console.log(result, from && from.routeConfig && from.routeConfig.path, to && to.routeConfig && to.routeConfig.path)
//                     if(to && to.routeConfig && to.routeConfig.path == '/xxx'){
//                         routerManager.redirectTo('yyy')
//                     } else if(to && to.routeConfig && to.routeConfig.path == '/yyy'){
//                         assert.equal(clearList.length, 1)
//                         routerManager.navigateBack()
//                     }
//                 } catch (e){
//                     console.error(e)
//                 }
//             }
//         })

//         return new Promise(async (resolve, reject)=>{
//             await routerManager.navigateTo('/xxx')
//             resolve()
//         })
//     });

//     it('测试路由session的reload', function() {
//         let count = 0
//         const routerManager = new RouterManager({
//             //用内存history模拟浏览器路由
//             mode: 'm',
//             routes: [{
//                 path: '/xxx',
//             }],
//             onURLChange: (result, from, to, clearList)=>{
//                 try{
//                     console.log(result, from && from.routeConfig && from.routeConfig.path, to && to.routeConfig && to.routeConfig.path)
//                     if(to && to.routeConfig && to.routeConfig.path == '/xxx' && count == 0){
//                         count++
//                         routerManager.reload()
//                     } else if(to && to.routeConfig && to.routeConfig.path == '/xxx' && count == 1){
//                         // assert.equal(clearList.length, 1)
//                         routerManager.navigateBack()
//                     }
//                 } catch (e){
//                     console.error(e)
//                 }
//             }
//         })

//         return new Promise(async (resolve, reject)=>{
//             await routerManager.navigateTo('/xxx')
//             resolve()
//         })
//     });

//     it('测试路由缓存移除', function() {
//         return new Promise((resolve, reject)=>{
//             const routerManager = new RouterManager({
//                 //用内存history模拟浏览器路由
//                 mode: 'm',
//                 routes: [{
//                     path: '/',
//                 }, {
//                     path: '/xxx',
//                 }],
//                 onURLChange: (result, from, to, clearState)=>{
//                     try{
//                         if(to && to.routeConfig && to.routeConfig.path == '/xxx'){
//                             routerManager.navigateBack()
//                         } else if(clearState.length == 1 && clearState[0].routeConfig == from.routeConfig && from.routeConfig.path == '/xxx'){
//                             resolve()
//                         }
//                     } catch (e){
//                         reject(e)
//                     }
//                 },
//             })

//             routerManager.navigateTo('/xxx')
//         })
//     });

//     it('测试路由监听beforeUpdateListener', function() {
//         var hasToken = false
//         return new Promise((resolve, reject)=>{
//             const routerManager = new RouterManager({
//                 //用内存history模拟浏览器路由
//                 mode: 'm',
//                 routes: [{
//                     path: '/',
//                     meta: {
//                         hasToken: true
//                     }
//                 }, {
//                     path: '/token',
//                     meta: {
//                     }
//                 }],
//                 onURLChange: (result, from, to, clearState)=>{
//                     console.log(result, from && from.routeConfig && from.routeConfig.path, to && to.routeConfig && to.routeConfig.path)
//                     try{
//                         if(to && to.routeConfig && to.routeConfig.path == '/token'){
//                             hasToken = true;
//                             routerManager.navigateBack()
//                         } else if(to && to.routeConfig && to.routeConfig.path == '/'){
//                             resolve()
//                         }
//                     } catch (e){
//                         reject(e)
//                     }
//                 },

//                 onBeforeURLChange: (from, to)=>{
//                     try{
//                         if(to.routeConfig.meta.hasToken){
//                             return routerManager.navigateTo('/token')
//                         }
//                     } catch (e){
//                         reject(e)
//                     }

//                 },
//             })
//         })
//     });

//     it('测试路由监听beforeRouteEnterListener', function() {
//         var hasToken = false
//         return new Promise((resolve, reject)=>{
//             const routerManager = new RouterManager({
//                 //用内存history模拟浏览器路由
//                 mode: 'm',
//                 routes: [{
//                     path: '/',
//                     meta: {
//                         hasToken: true
//                     }
//                 }, {
//                     path: '/token',
//                     meta: {
//                     }
//                 }],
//                 onURLChange: (result, from, to, clearState)=>{
//                     console.log(result, from && from.routeConfig && from.routeConfig.path, to && to.routeConfig && to.routeConfig.path)
//                     try{
//                         if(to && to.routeConfig && to.routeConfig.path == '/token'){
//                             console.log('go login')
//                             hasToken = true;
//                             routerManager.navigateBack()
//                         } else if(to && to.routeConfig && to.routeConfig.path == '/' && hasToken){
//                             console.log('has login')
//                             resolve()
//                         }
//                     } catch (e){
//                         reject(e)
//                     }
//                 },

//                 onBeforeRouteEnter: (result, from, to, clearState)=>{
//                     try{
//                         if(to.routeConfig.meta.hasToken && !hasToken){
//                             setTimeout(()=>{
//                                 routerManager.navigateTo('/token')
//                             })
//                             return false
//                         }
//                     } catch (e){
//                         reject(e)
//                     }
//                 },
//             })
//         })
//     });

//     it('测试路由监听clearCacheListener', function() {
//         var step = 0
//         return new Promise((resolve, reject)=>{
//             const routerManager = new RouterManager({
//                 //用内存history模拟浏览器路由
//                 mode: 'm',
//                 routes: [{
//                     path: '/',
//                     meta: {
//                         hasToken: true
//                     }
//                 }, {
//                     path: '/xxx',
//                 }, {
//                     path: '/yyy',
//                 }],
//                 onDestroyState: (clearState)=>{
//                     // console.log(routerManager.getCurrentURL().path)
//                     // console.log(clearState.length)
//                     if(routerManager.getCurrentURL().path != '/yyy'){
//                         step++
//                         assert.equal(clearState.length, 0)
//                     } else {
//                         if(clearState.length != 0){
//                             assert.equal(step, 3)
//                             assert.equal(clearState.length, 2)
//                             resolve()
//                         } else {
//                             step++
//                         }
//                     }
//                 },
//                 onURLChange: (result, from, to, clearState)=>{
//                     try{
//                         if(to.routeConfig.path == '/'){
//                             setTimeout(()=>{
//                                 routerManager.navigateTo('/xxx')
//                             }, 1)
//                         } else if(to.routeConfig.path == '/xxx'){
//                             setTimeout(()=>{
//                                 routerManager.navigateTo('/yyy')
//                             }, 1)
//                         } else if(to.routeConfig.path == '/yyy'){
//                             setTimeout(()=>{
//                                 routerManager.destroyState()
//                             }, 100)
//                         }
//                     } catch (e){
//                         reject(e)
//                     }
//                 },
//             })
//         })
//     });
// });
