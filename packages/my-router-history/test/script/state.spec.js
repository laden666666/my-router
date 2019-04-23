import {MyHistory} from '../../src/History'
import {assert} from 'chai'

let myHistory

describe('history的state', function(){
    this.timeout(3000)
    beforeEach(async function() {
        // console.log('beforeEach-before', location.href, history.state, sessionStorage)
        if(myHistory){
            await myHistory.destroy()
            myHistory = null
        }
        location.href = '#/'
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

    it('修改字符串', async function() {
        myHistory = new MyHistory({
            root: '/'
        })

        await myHistory.replace('test', 'test')

        assert.equal(myHistory.location.state, 'test')
        myHistory.location.state = 'test2'
        assert.equal(myHistory.location.state, 'test')
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
