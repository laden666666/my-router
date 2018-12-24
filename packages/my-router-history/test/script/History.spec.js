import {MyHistory} from '../../src/History'
import {assert} from 'chai'

let myHistory

describe('测试history', function(){
    
    this.timeout(2000)

    beforeEach(async function() {
        if(myHistory){
            await myHistory.destroy()
        }
        history.replaceState(null, null, '/')
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
                    } catch(e){
                        console.error('测试创建', e)
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
                        console.error('测试onChange的push监听器', e)
                    }
                }
            })
            
            myHistory.push('test')

            await promise
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

                        return Promise.resolve(false)
                    } catch(e){
                        console.error('测试onBeforeChange的push监听器', e)
                    }
                }
            })

            await new Promise(r=>{
                myHistory.push('test')
                    .catch(e=>{
                        r(e)
                    })
            })

            await promise

            assert.equal(myHistory.location.href, '/')
            assert.equal(myHistory.stack.length, 1)

        });
        

        it('测试onBeforeChange的push监听器2', async function() {
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
                        console.error('测试onBeforeChange的push监听器2', e)
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
                        console.error(e)
                    }
                }
            })
            
            myHistory.replace('test')
            assert.equal(myHistory.stack.length, 1)

            await promise
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

                        return Promise.resolve(false)
                    } catch(e){
                        console.error('测试onBeforeChange的replace监听器', e)
                    }
                }
            })
            
            await new Promise(r=>{
                myHistory.replace('test')
                    .catch(e=>{
                        r(e)
                    })
            })

            await promise

            assert.equal(myHistory.location.href, '/')
            assert.equal(myHistory.stack.length, 1)

        });
        

        it('测试onBeforeChange的replace监听器2', async function() {
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
                        console.error('测试onBeforeChange的replace监听器2', e)
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
            await new Promise(r=>{
                myHistory.onChange = ()=>{
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
                        console.error('测试goback 浏览器back', e)
                    }
                }
            })
            window.history.back()
            
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
                        console.error('测试onChange的goback(n)监听器', e)
                    }
                }
            })
            
            await myHistory.goback(2)

            await promise
        });

        it('测试onBeforeChange的goback(n)监听器1', async function() {
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
                        console.error('测试onBeforeChange的goback(n)监听器1', e)
                    }
                }
            })

            await new Promise(r=>{
                myHistory.goback(2)
                    .catch(e=>{
                        r(e)
                    })
            })

            await promise
        });

        it('测试onBeforeChange的goback(n)监听器2', async function() {
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
                        console.error('测试onBeforeChange的goback(n)监听器2', e)
                    }
                }
            })
            
            await myHistory.goback(2)

            await promise
        });
    });

})
