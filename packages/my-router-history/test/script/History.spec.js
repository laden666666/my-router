import {MyHistory} from '../../src/History'
import {assert} from 'chai'

let history

describe('history测试', function() {
    this.timeout(2000)

    before(async function() {
        if(history){
            await history.destroy()
        }
    })

    afterEach(async function() {
        if(history){
            await history.destroy()
        }
    });

    it('测试创建', async function() {
        history = new MyHistory({
            root: '/'
        })

        await new Promise(r=>{
            history.onChange = ((action)=>{
                assert.equal(action, 'init')

                if(action === 'init'){
                    r()
                }
            })
        })
    });

    it('不能同时创建2个实例', async ()=>{
        assert.throw(()=>{
            history = new MyHistory({
                root: '/'
            })
            history = new MyHistory({
                root: '/'
            })
        })
    });

    it('测试销毁', async ()=>{
        history = new MyHistory({
            root: '/'
        })
        await history.destroy()
        history = new MyHistory({
            root: '/'
        })
    });
});
