import {MyHistory} from '../../src/History'
import {assert} from 'chai'

let myHistory

describe('history的push', function(){
    this.timeout(3000)
    beforeEach(async function() {
        // console.log('beforeEach-before', location.href, history.state, sessionStorage)
        if(myHistory){
            await myHistory.destroy()
            myHistory = null
        }
        location.href = '#/'
        await new Promise(r=>setTimeout(r, 100))
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

        await Promise.all([promise, new Promise(r=>{
            myHistory.push('test')
                .catch(e=>{
                    if(e.isCancelled){
                        r(e)
                    }
                })
        })])

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

        await Promise.all([promise, myHistory.push('test')])

        assert.equal(myHistory.location.href, '/test')
        assert.equal(myHistory.stack.length, 2)

    });
});
