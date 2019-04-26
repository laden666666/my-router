import {MyHistory} from '../../src/History'
import {assert} from 'chai'

let myHistory


describe('history的生命周期', function(){
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

    it('busy测试', async function() {
        myHistory = new MyHistory({
            root: '/'
        })

        myHistory.push('test')
        assert.equal(myHistory.isBusy, true)
        assert.throw(()=> {
            console.error(myHistory.push('test1'))
        })
    });

    it('checkBusy测试', async function() {
        myHistory = new MyHistory({
            root: '/'
        })

        myHistory.push('test')
        assert.throw(()=>myHistory.checkBusy())
    });

    it('onChange生命周期跳转', async function() {
        myHistory = new MyHistory({
            root: '/'
        })

        await new Promise(r=>{
            myHistory.onChange = ()=>{
                if(myHistory.location.pathname == '/test'){
                    // 在生命周期中执行跳转
                    myHistory.push('test1')
                } else if(myHistory.location.pathname == '/test1'){
                    r()
                }
            }
            myHistory.push('test')
        })
    });

    it('onChange生命周期跳转，不可跳转第二次', async function() {
        myHistory = new MyHistory({
            root: '/'
        })

        let resolve, errorPromise = new Promise(r=>{resolve = r})

        await new Promise(r=>{
            myHistory.onChange = ()=>{
                if(myHistory.location.pathname == '/test'){
                    // 在生命周期中执行跳转
                    myHistory.push('test1')

                    // 这二次跳转要抛出异常
                    try{
                        myHistory.push('test1')
                    } catch(e){
                        if(e.isBusy){
                            resolve()
                        }
                    }
                } else if(myHistory.location.pathname == '/test1'){
                    r()
                }
            }
            myHistory.push('test')
        })
        await errorPromise
    });


    it('onChange和onBeforeChange', async function() {
        myHistory = new MyHistory({
            root: '/'
        })

        let p1 = new Promise(r=>{
            myHistory.onChange = ()=>{
                r()
            }
        })

        let p2 = new Promise(r=>{
            myHistory.onBeforeChange = ()=>{
                r()
            }
        })

        myHistory.push('test')

        await Promise.all([p1, p2])
    });
})
