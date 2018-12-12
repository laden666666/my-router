export class MyHistory{

    private _state = 0;

    private list = []

    private constructor(){
        this.initGoBack()
                
        // 初始化时间
        var now = Date.now()

        // uid
        var uid = 0

        let list = this.list

        // 初始化
        history.replaceState(now - 1, '返回', '#goback')
        document.title = '返回'
        list.push({
            time: now - 1,
            url: '#goback'
        })
        history.pushState(now, '初始化完成', '#/_=' + uid)
        document.title = ''
        list.push({
            time: now,
            url: '#/'
        })
        sessionStorage.inited = true

        this._state = 1

        // 路由事件消化
        var eventList = []
        let timeout
        function nextTick(fn){
            eventList.push(fn)
            clearTimeout(timeout)
            timeout = setTimeout(()=>{
                eventList = eventList.filter(fn=>{
                    try {
                        fn()
                    } catch (error) {
                        console.log(error)
                    }
                    return false
                })
            }, 50)
        }
        window.onpopstate = ()=>{
            clearTimeout(timeout)
            eventList = eventList.filter(fn=>{
                try {
                    fn()
                } catch (error) {
                    console.error(error)
                }
                return false
            })
        }

        var issafariBrowser = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

        // 是否
        window.onhashchange = ()=>{

            if(this._state == 2 || this._state == 3){
                return
            } else if(this._state == 1){
                let hash = location.hash
                if(hash == '#goback' && history.state && history.state == list[0].time){
                    if(list.length > 2){
                        let page = list[list.length - 2]
                        history.pushState('', page.time, page.url)
                        list.splice(list.length - 1)
                    } else {
                        let page = list[1]
                        history.pushState('', page.time, page.url)
                    }
                    
                } else if(!~hash.indexOf('_=') || hash.split('_=')[1] != (uid + '') || !history.state){
                    // 判断是否是合法生成的hash，主要看系统变量。判断方法如下：
                    // 1.没有系统变量一定是不合法的hash。
                    // 2.如果系统变量有，但是id部分不等于当前的uid，表示不是现生成的，且没有state（生成时间）。
                    // 3.如果系统变量等于当前的uid，但是不等于hash，表示是修改过的。
                    // 当遇到这种情况，后退到两步到goback页面，然后再将url生成系统的url，前进到该地址。这个过程中忽略其他路由
                    let _hash =  hash.split('_=')[0]
                    this._state = 3
                    if(!issafariBrowser){
                        history.go(-2)
                        nextTick(()=>{
                            let now = Date.now()
                            history.pushState(now, '', (_hash || '#') + '_=' + ++uid)
                            list.push({
                                time: now,
                                url: (_hash || '#') + '_=' + uid
                            })
                            this._state = 1
                        })
                    } else {
                        history.back()
                        nextTick(()=>{
                            setTimeout(()=>{
                                history.back()
                                nextTick(()=>{
                                    let now = Date.now()
                                    history.pushState(now, '', (_hash || '#') + '_=' + ++uid)
                                    list.push({
                                        time: now,
                                        url: (_hash || '#') + '_=' + uid
                                    })
                                    this._state = 1
                                })
                            })
                        })
                    }
                }
            }
        }
    }

    static _instance: MyHistory
    
    private _sysID: 0

    static instance(): MyHistory{
        if(!this._instance){
            this._instance = new MyHistory
        }  
        return this._instance
    }
    
    // 初始化goBack
    initGoBack(){
        if(!sessionStorage.getItem('initGoBack') || typeof history.state != 'number'){
            // 让goback页面比当前页面的时间戳小,这样能够判断出是后退
            history.replaceState(Date.now() - 1, '', '#goback')
            // 使用时间戳做页面的state
            history.pushState(Date.now(), '')
            sessionStorage.setItem('initGoBack', 'true')
        }
    }
    
    // 初始化URL
    initURL(){
        if(!location.hash || !this._testHash(location.hash)){
            history.replaceState(Date.now() - 1, '', this._hash2URL(location.hash || '#'))
        }
    }

    baseURL(){
        return location.pathname + location.search
    }

    private _testHash(hash: string){
        return /^#(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?/.test(hash) && (~hash.indexOf('?_') || ~hash.indexOf('&_'))
    }

    private _hash2URL(hash: string){
        if(~hash.indexOf('?')){
            return hash + '&_=' + this._sysID++
        } else{
            return  hash + '?_=' + this._sysID++
        }
    }
        
    // 初始化
    init(){
        // 记录用户跳转页面的时间
        var now
        // 
        var hash
        window.addEventListener('popstate', ()=>{
            // 如果页面没有state,说明用户直接输入URL前进.忽略这个页面
            if(history.state){
                // 比较
                if(Date.now() - now < 100){
                    console.log(Date.now(), '', hash)
                    history.pushState(Date.now(), '', hash + '?=' + now)
                }
            }
        }, true)
        window.addEventListener('hashchange', ()=>{
            // 当hash发生变化的时候,认为是用户直接输入的url.然后向后跳转2个位置,并记录一下跳转发生的时间
            now = Date.now()
            // 
            hash = location.hash
            if(!~hash.indexOf('_')){
                history.go(-2)
            }
        }, false)
    }
    
    assign(url){

    }
    goback(){
    }
    replace(){
    }
    reload(){
    }
    
    
// 				base					
// 				hash
// 				host
// 				hostname
// 				href
// 				origin
// 				pathname
// 				port
// 				protocol
// 				search
    
}