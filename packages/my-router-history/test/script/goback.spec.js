import {MyHistory} from '../../src/History'
import {assert} from 'chai'

let myHistory


describe('history的goback', function(){
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

        await Promise.all( [myHistory.goback(2), promise])
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
                    console.error('测试onBeforeChange的goback(n)监听器，false取消', e, action, oldLocation, location, discardLoctions, newLocation)
                }
            }
        })

        await new Promise(r=>{
            myHistory.goback(2)
                .catch(e=>{
                    if(e.isCancelled){
                        r(e)
                    }
                    console.log(333, myHistory.stack)
                })
        })

        await promise
        console.log(444, myHistory.stack)
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

    // it('测试onBeforeChange的goback(n)监听器', async function() {
    //     myHistory = new MyHistory({
    //         root: '/'
    //     })

    //     await myHistory.push('test1')
    //     await myHistory.push('test2')
    //     await myHistory.push('test3')

    //     let promise = new Promise(r=>{
    //         myHistory.onBeforeChange = (action, oldLocation, location, discardLoctions, newLocation)=>{
    //             try{
    //                 if(action === 'init'){
    //                     return
    //                 }
    //                 assert.equal(action, 'goback')
    //                 assert.equal(oldLocation.href, '/test3')
    //                 assert.equal(location.href, '/test1')
    //                 assert.equal(discardLoctions.length, 2)
    //                 assert.equal(newLocation.length, 0)
    //                 assert.deepEqual(discardLoctions[0].href, '/test3')
    //                 assert.deepEqual(discardLoctions[1].href, '/test2')
    //                 assert.equal(myHistory.location.href, '/test3')

    //                 r(false)

    //                 myHistory.onBeforeChange = null
    //             } catch(e){
    //                 console.error('测试onBeforeChange的goback(n)监听器2', e, action, oldLocation, location, discardLoctions, newLocation)
    //             }
    //         }
    //     })

    //     await myHistory.goback(2)

    //     await promise
    // });
});
