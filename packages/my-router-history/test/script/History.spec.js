import {MyHistory} from '../../src/History'
import {assert} from 'chai'

let myHistory


describe('测试history', function(){
    this.timeout(3000)
    beforeEach(async function() {
        // console.log('beforeEach-before', location.href, history.state, sessionStorage)
        if(myHistory){
            await myHistory.destroy()
            myHistory = null
        }
        history.replaceState(null, null, '#/')
        // console.log('beforeEach-after', location.href, history.state, sessionStorage)

    });
    afterEach(async function() {
        // console.log('afterEach-before', location.href, history.state, sessionStorage)
        if(myHistory){
            await myHistory.destroy()
            myHistory = null
        }
        history.replaceState(null, null, '#/')
        // console.log('afterEach-after', location.href, history.state, sessionStorage)

        await new Promise(r=>setTimeout(r, 100))
    });
    
    describe('创建和销毁测试', function() {

        it('测试创建', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            await new Promise(r=>{
                myHistory.onChange = ((action, oldLocation, location, discardLoctions, newLocation)=>{
                    try{
                        // 监听init事件触发
                        assert.equal(action, 'init')

                        assert.isNull(oldLocation)
                        assert.equal(location.href, '/')
                        assert.equal(discardLoctions.length, 0)
                        assert.equal(newLocation.length, 1)
                        assert.deepEqual(newLocation[0], location)

                        r()

                        myHistory.onChange = null
                    } catch(e){
                        console.error('测试创建', e, action, oldLocation, location, discardLoctions, newLocation)
                    }
                })
            })
        });

        it('不能同时创建2个实例', async ()=>{
            // 同时创建两个会抛出异常
            assert.throw(()=>{
                myHistory = new MyHistory({
                    root: '/'
                })
                myHistory = new MyHistory({
                    root: '/'
                })
            })
        });

        it('测试销毁', async ()=>{
            myHistory = new MyHistory({
                root: '/'
            })
            await myHistory.destroy()

            // 销毁后，可以再正常创建对象
            myHistory = new MyHistory({
                root: '/'
            })
        });

        it('自动插入root', async ()=>{
            myHistory = new MyHistory({
                root: '/test',
                insertRoot: false
            })

            assert.equal(myHistory.stack.length, 1)
            assert.equal(myHistory.stack[0].href, '/')
        });

        it('自动插入root2', async ()=>{
            myHistory = new MyHistory({
                root: '/test',
                insertRoot: true
            })

            assert.equal(myHistory.stack.length, 2)
            assert.equal(myHistory.location.href, '/')
            assert.equal(myHistory.stack[0].href, '/test')
        });

    });

    describe('history的push', function() {
        it('测试push', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            await myHistory.push('test')

            assert.equal(myHistory.stack.length, 2)
            assert.deepEqual(myHistory.stack[1], myHistory.location)
            assert.equal(myHistory.location.href, '/test')
        });

        it('测试push state', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            await myHistory.push('test', 'test')

            assert.equal(myHistory.stack.length, 2)
            assert.deepEqual(myHistory.stack[1], myHistory.location)
            assert.equal(myHistory.location.href, '/test')
            assert.equal(myHistory.location.state, 'test')
        });

        it('测试onChange的push监听器', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            let promise = new Promise(r=>{
                myHistory.onChange = (action, oldLocation, location, discardLoctions, newLocation)=>{
                    try{
                        if(action === 'init'){
                            return
                        }

                        assert.equal(action, 'push')
                        assert.equal(oldLocation.href, '/')
                        assert.equal(location.href, '/test')
                        assert.equal(discardLoctions.length, 0)
                        assert.equal(newLocation.length, 1)
                        assert.deepEqual(newLocation[0], location)
                        assert.equal(myHistory.location.href, '/test')
        
                        r()

                        myHistory.onChange = null
                    } catch(e){
                        console.error('测试onChange的push监听器', e, action, oldLocation, location, discardLoctions, newLocation)
                    }
                }
            })
            
            myHistory.push('test')

            await promise
        });

        it('测试onBeforeChange的push监听器，false取消', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            let promise = new Promise(r=>{
                myHistory.onBeforeChange = (action, oldLocation, location, discardLoctions, newLocation)=>{
                    try{
                        if(action === 'init'){
                            return
                        }

                        assert.equal(action, 'push')
                        assert.equal(oldLocation.href, '/')
                        assert.equal(location.href, '/test')
                        assert.equal(discardLoctions.length, 0)
                        assert.equal(newLocation.length, 1)
                        assert.deepEqual(newLocation[0], location)
                        assert.equal(myHistory.location.href, '/')
        
                        r()

                        myHistory.onBeforeChange = null

                        return Promise.resolve(false)
                    } catch(e){
                        console.error('测试onBeforeChange的push监听器，false取消', e, action, oldLocation, location, discardLoctions, newLocation)
                    }
                }
            })

            await new Promise(r=>{
                myHistory.push('test')
                    .catch(e=>{
                        if(e.isCancelled){
                            r(e)
                        }
                    })
            })

            await promise

            assert.equal(myHistory.location.href, '/')
            assert.equal(myHistory.stack.length, 1)

        });

        it('测试onBeforeChange的push监听器，function取消', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            let promise = new Promise(r=>{
                myHistory.onBeforeChange = (action, oldLocation, location, discardLoctions, newLocation)=>{
                    try{
                        if(action === 'init'){
                            return
                        }

                        assert.equal(action, 'push')
                        assert.equal(oldLocation.href, '/')
                        assert.equal(location.href, '/test')
                        assert.equal(discardLoctions.length, 0)
                        assert.equal(newLocation.length, 1)
                        assert.deepEqual(newLocation[0], location)
                        assert.equal(myHistory.location.href, '/')
        
                        myHistory.onBeforeChange = null

                        return Promise.resolve(r)
                    } catch(e){
                        console.error('测试onBeforeChange的push监听器，function取消', e, action, oldLocation, location, discardLoctions, newLocation)
                    }
                }
            })

            await new Promise(r=>{
                myHistory.push('test')
                    .catch(e=>{
                        if(e.isCancelled){
                            r(e)
                        }
                    })
            })

            await promise

            assert.equal(myHistory.location.href, '/')
            assert.equal(myHistory.stack.length, 1)

        });

        it('测试onBeforeChange的push监听器', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            let promise = new Promise(r=>{
                myHistory.onBeforeChange = (action, oldLocation, location, discardLoctions, newLocation)=>{
                    try{
                        if(action === 'init'){
                            return
                        }

                        assert.equal(action, 'push')
                        assert.equal(oldLocation.href, '/')
                        assert.equal(location.href, '/test')
                        assert.equal(discardLoctions.length, 0)
                        assert.equal(newLocation.length, 1)
                        assert.deepEqual(newLocation[0], location)
                        assert.equal(myHistory.location.href, '/')
        
                        r()

                        myHistory.onBeforeChange = null

                        return Promise.resolve()
                    } catch(e){
                        console.error('测试onBeforeChange的push监听器', e, action, oldLocation, location, discardLoctions, newLocation)
                    }
                }
            })
            
            myHistory.push('test')

            await promise

            assert.equal(myHistory.location.href, '/test')
            assert.equal(myHistory.stack.length, 2)

        });
    });

    describe('history的replace', function() {

        it('测试replace', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            await myHistory.replace('test')

            assert.equal(myHistory.stack.length, 1)
            assert.deepEqual(myHistory.stack[0], myHistory.location)
            assert.equal(myHistory.location.href, '/test')
        });

        it('测试replace state', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            await myHistory.replace('test', 'test')

            assert.equal(myHistory.stack.length, 1)
            assert.deepEqual(myHistory.stack[0], myHistory.location)
            assert.equal(myHistory.location.href, '/test')
            assert.equal(myHistory.location.state, 'test')
        });

        it('测试onChange的replace监听器', async function() {
            myHistory = new MyHistory({
                root: '/'
            })
            let promise = new Promise(r=>{
                myHistory.onChange = (action, oldLocation, location, discardLoctions, newLocation)=>{
                    try{
                        if(action === 'init'){
                            return
                        }

                        assert.equal(action, 'replace')
                        assert.equal(oldLocation.href, '/')
                        assert.equal(location.href, '/test')
                        assert.equal(discardLoctions.length, 1)
                        assert.equal(newLocation.length, 1)
                        assert.deepEqual(discardLoctions[0], oldLocation)
                        assert.deepEqual(newLocation[0], location)
                        assert.equal(myHistory.location.href, '/test')
        
                        r()

                        myHistory.onChange = null
                    } catch(e){
                        console.error('测试onChange的replace监听器', e, action, oldLocation, location, discardLoctions, newLocation)
                    }
                }
            })
            
            myHistory.replace('test')
            assert.equal(myHistory.stack.length, 1)

            await promise
        });

        it('测试onBeforeChange的replace监听器，false取消', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            let promise = new Promise(r=>{
                myHistory.onBeforeChange = (action, oldLocation, location, discardLoctions, newLocation)=>{
                    try{
                        if(action === 'init'){
                            return
                        }

                        assert.equal(action, 'replace')
                        assert.equal(oldLocation.href, '/')
                        assert.equal(location.href, '/test')
                        assert.equal(discardLoctions.length, 1)
                        assert.equal(newLocation.length, 1)
                        assert.deepEqual(discardLoctions[0], oldLocation)
                        assert.deepEqual(newLocation[0], location)
                        assert.equal(myHistory.location.href, '/')
        
                        r()

                        myHistory.onBeforeChange = null

                        return Promise.resolve(false)
                    } catch(e){
                        console.error('测试onBeforeChange的replace监听器，false取消', e, action, oldLocation, location, discardLoctions, newLocation)
                    }
                }
            })
            
            await new Promise(r=>{
                myHistory.replace('test')
                    .catch(e=>{
                        if(e.isCancelled){
                            r(e)
                        }
                    })
            })

            await promise

            assert.equal(myHistory.location.href, '/')
            assert.equal(myHistory.stack.length, 1)

        });

        it('测试onBeforeChange的replace监听器，function取消', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            let promise = new Promise(r=>{
                myHistory.onBeforeChange = (action, oldLocation, location, discardLoctions, newLocation)=>{
                    try{
                        if(action === 'init'){
                            return
                        }

                        assert.equal(action, 'replace')
                        assert.equal(oldLocation.href, '/')
                        assert.equal(location.href, '/test')
                        assert.equal(discardLoctions.length, 1)
                        assert.equal(newLocation.length, 1)
                        assert.deepEqual(discardLoctions[0], oldLocation)
                        assert.deepEqual(newLocation[0], location)
                        assert.equal(myHistory.location.href, '/')
        
                        myHistory.onBeforeChange = null

                        return Promise.resolve(r)
                    } catch(e){
                        console.error('测试onBeforeChange的replace监听器，function取消', e, action, oldLocation, location, discardLoctions, newLocation)
                    }
                }
            })
            
            await new Promise(r=>{
                myHistory.replace('test')
                    .catch(e=>{
                        if(e.isCancelled){
                            r(e)
                        }
                    })
            })

            await promise

            assert.equal(myHistory.location.href, '/')
            assert.equal(myHistory.stack.length, 1)

        });
        

        it('测试onBeforeChange的replace监听器', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            let promise = new Promise(r=>{
                myHistory.onBeforeChange = (action, oldLocation, location, discardLoctions, newLocation)=>{
                    try{
                        if(action === 'init'){
                            return
                        }

                        assert.equal(action, 'replace')
                        assert.equal(oldLocation.href, '/')
                        assert.equal(location.href, '/test')
                        assert.equal(discardLoctions.length, 1)
                        assert.equal(newLocation.length, 1)
                        assert.deepEqual(discardLoctions[0], oldLocation)
                        assert.deepEqual(newLocation[0], location)
                        assert.equal(myHistory.location.href, '/')
        
                        r()

                        myHistory.onBeforeChange = null

                        return Promise.resolve()
                    } catch(e){
                        console.error('测试onBeforeChange的replace监听器', e, action, oldLocation, location, discardLoctions, newLocation)
                    }
                }
            })
            
            myHistory.replace('test')

            await promise

            assert.equal(myHistory.location.href, '/test')
            assert.equal(myHistory.stack.length, 1)

        });
    });

    describe('history的goback', function() {

        it('测试goback(n)', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            await myHistory.push('test1')
            await myHistory.push('test2')
            await myHistory.push('test3')

            assert.equal(myHistory.stack.length, 4)

            await myHistory.goback(3)
            assert.equal(myHistory.stack.length, 1)
            assert.deepEqual(myHistory.stack[0], myHistory.location)
            assert.equal(myHistory.location.href, '/')
        });

        it('测试goback(n)2', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            await myHistory.push('test1')
            await myHistory.push('test2')
            await myHistory.push('test3')

            assert.equal(myHistory.stack.length, 4)

            await myHistory.goback(5)
            assert.equal(myHistory.stack.length, 1)
            assert.deepEqual(myHistory.stack[0], myHistory.location)
            assert.equal(myHistory.location.href, '/')
        });

        it('测试goback(path)', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            await myHistory.push('test1')
            await myHistory.push('test2')
            await myHistory.push('test3')

            assert.equal(myHistory.stack.length, 4)

            await myHistory.goback('test1')
            assert.equal(myHistory.stack.length, 2)
            assert.deepEqual(myHistory.stack[1], myHistory.location)
            assert.equal(myHistory.location.href, '/test1')
        });

        it('测试goback(path)2', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            await myHistory.push('test1')
            await myHistory.push('test2')
            await myHistory.push('test3')

            assert.equal(myHistory.stack.length, 4)

            await myHistory.goback('test4')
            assert.equal(myHistory.stack.length, 1)
            assert.equal(myHistory.location.href, '/test4')
        });

        it('测试goback(fn)', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            await myHistory.push('test1')
            await myHistory.push('test2')
            await myHistory.push('test3')

            assert.equal(myHistory.stack.length, 4)

            await myHistory.goback(location=> location.href === '/test1')
            assert.equal(myHistory.stack.length, 2)
            assert.deepEqual(myHistory.stack[1], myHistory.location)
            assert.equal(myHistory.location.href, '/test1')
        });

        it('测试goback(fn)2', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            await myHistory.push('test1')
            await myHistory.push('test2')
            await myHistory.push('test3')

            assert.equal(myHistory.stack.length, 4)

            await myHistory.goback(location=> location.href === '/test4')
            assert.equal(myHistory.stack.length, 1)
            assert.equal(myHistory.location.href, '/')
        });

        
        it('测试goback 浏览器back', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            await myHistory.push('test1')
            await myHistory.push('test2')
            await myHistory.push('test3')

            assert.equal(myHistory.stack.length, 4)
            let promise = new Promise(r=>{
                myHistory.onChange = (action, oldLocation, location, discardLoctions, newLocation)=>{
                    try{
                        if(action === 'init'){
                            return
                        }
    
                        assert.equal(action, 'goback')
                        assert.equal(oldLocation.href, '/test3')
                        assert.equal(location.href, '/test2')
                        assert.equal(discardLoctions.length, 1)
                        assert.equal(newLocation.length, 0)
                        assert.deepEqual(discardLoctions[0], oldLocation)
                        assert.equal(myHistory.stack.length, 3)
                        assert.equal(myHistory.location.href, '/test2')
                        r()
    
                        myHistory.onChange = null
    
                        return Promise.resolve()
                    } catch(e){
                        console.error('测试goback 浏览器back', e, action, oldLocation, location, discardLoctions, newLocation)
                    }
                }
            })
            window.history.back()

            await promise
            
        });

        it('测试onChange的goback(n)监听器', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            await myHistory.push('test1')
            await myHistory.push('test2')
            await myHistory.push('test3')

            let promise = new Promise(r=>{
                myHistory.onChange = (action, oldLocation, location, discardLoctions, newLocation)=>{
                    try{

                        if(action === 'init'){
                            return
                        }

                        assert.equal(action, 'goback')
                        assert.equal(oldLocation.href, '/test3')
                        assert.equal(location.href, '/test1')
                        assert.equal(discardLoctions.length, 2)
                        assert.equal(newLocation.length, 0)
                        assert.deepEqual(discardLoctions[0].href, '/test3')
                        assert.deepEqual(discardLoctions[1].href, '/test2')
                        assert.equal(myHistory.location.href, '/test1')
        
                        r()

                        myHistory.onChange = null
                    } catch(e){
                        console.error('测试onChange的goback(n)监听器', e, action, oldLocation, location, discardLoctions, newLocation)
                    }
                }
            })
            
            await myHistory.goback(2)

            await promise
        });

        it('测试onBeforeChange的goback(n)监听器，false取消', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            await myHistory.push('test1')
            await myHistory.push('test2')
            await myHistory.push('test3')

            let promise = new Promise(r=>{
                myHistory.onBeforeChange = (action, oldLocation, location, discardLoctions, newLocation)=>{
                    try{

                        if(action === 'init'){
                            return
                        }

                        assert.equal(action, 'goback')
                        assert.equal(oldLocation.href, '/test3')
                        assert.equal(location.href, '/test1')
                        assert.equal(discardLoctions.length, 2)
                        assert.equal(newLocation.length, 0)
                        assert.deepEqual(discardLoctions[0].href, '/test3')
                        assert.deepEqual(discardLoctions[1].href, '/test2')
                        assert.equal(myHistory.location.href, '/test3')
                        r()

                        myHistory.onBeforeChange = null

                        return false
                    } catch(e){
                        console.error('测试onBeforeChange的goback(n)监听器1', e, action, oldLocation, location, discardLoctions, newLocation)
                    }
                }
            })

            await new Promise(r=>{
                myHistory.goback(2)
                    .catch(e=>{
                        if(e.isCancelled){
                            r(e)
                        }
                    })
            })

            await promise
        });
        
        it('测试onBeforeChange的goback(n)监听器，function取消', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            await myHistory.push('test1')
            await myHistory.push('test2')
            await myHistory.push('test3')

            let promise = new Promise(r=>{
                myHistory.onBeforeChange = (action, oldLocation, location, discardLoctions, newLocation)=>{
                    try{

                        if(action === 'init'){
                            return
                        }

                        assert.equal(action, 'goback')
                        assert.equal(oldLocation.href, '/test3')
                        assert.equal(location.href, '/test1')
                        assert.equal(discardLoctions.length, 2)
                        assert.equal(newLocation.length, 0)
                        assert.deepEqual(discardLoctions[0].href, '/test3')
                        assert.deepEqual(discardLoctions[1].href, '/test2')
                        assert.equal(myHistory.location.href, '/test3')

                        myHistory.onBeforeChange = null

                        return Promise.resolve(r)
                    } catch(e){
                        console.error('测试onBeforeChange的goback(n)监听器，function取消', e, action, oldLocation, location, discardLoctions, newLocation)
                    }
                }
            })

            await new Promise(r=>{
                myHistory.goback(2)
                    .catch(e=>{
                        if(e.isCancelled){
                            r(e)
                        }
                    })
            })

            await promise
        });

        it('测试onBeforeChange的goback(n)监听器', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            await myHistory.push('test1')
            await myHistory.push('test2')
            await myHistory.push('test3')

            let promise = new Promise(r=>{
                myHistory.onBeforeChange = (action, oldLocation, location, discardLoctions, newLocation)=>{
                    try{
                        if(action === 'init'){
                            return
                        }
                        assert.equal(action, 'goback')
                        assert.equal(oldLocation.href, '/test3')
                        assert.equal(location.href, '/test1')
                        assert.equal(discardLoctions.length, 2)
                        assert.equal(newLocation.length, 0)
                        assert.deepEqual(discardLoctions[0].href, '/test3')
                        assert.deepEqual(discardLoctions[1].href, '/test2')
                        assert.equal(myHistory.location.href, '/test3')
        
                        r(false)

                        myHistory.onBeforeChange = null
                    } catch(e){
                        console.error('测试onBeforeChange的goback(n)监听器2', e, action, oldLocation, location, discardLoctions, newLocation)
                    }
                }
            })
            
            await myHistory.goback(2)

            await promise
        });
    });

    describe('history的state', function() {
        it('修改字符串', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            await myHistory.replace('test', 'test')

            assert.equal(myHistory.location.state, 'test')
            myHistory.location.state = 'test2'
            assert.equal(myHistory.location.state, 'test2')
        });

        it('修改对象', async function() {
            myHistory = new MyHistory({
                root: '/'
            })

            await myHistory.replace('test', {test: 'test'})

            assert.deepEqual(myHistory.location.state, {test: 'test'})
            myHistory.location.state.test = 'test2'
            assert.equal(myHistory.location.state.test, 'test2')
        });
    })
})
