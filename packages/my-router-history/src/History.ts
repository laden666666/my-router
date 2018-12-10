class MyHistory{
    private constructor(){
        this.initGoBack()
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