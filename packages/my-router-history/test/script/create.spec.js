import {MyHistory} from '../../src/History'
import {assert} from 'chai'

let myHistory

describe('创建和销毁测试', function(){
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
