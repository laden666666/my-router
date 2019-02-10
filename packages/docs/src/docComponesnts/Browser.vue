<template>
    <div class="browser">
        <div class="browser-location">
            <div class="browser-box">
                <button aria-label="Go Back" @click="back" :disabled="data.current == 0" class="browser-btn">
                    <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40">
                        <g>
                            <path d="m26.5 12.1q0 0.3-0.2 0.6l-8.8 8.7 8.8 8.8q0.2 0.2 0.2 0.5t-0.2 0.5l-1.1 1.1q-0.3 0.3-0.6 0.3t-0.5-0.3l-10.4-10.4q-0.2-0.2-0.2-0.5t0.2-0.5l10.4-10.4q0.3-0.2 0.5-0.2t0.6 0.2l1.1 1.1q0.2 0.2 0.2 0.5z"></path>
                        </g>
                    </svg>
                </button>
                <button aria-label="Go Forward" @click="forward" :disabled="data.current == data.pages.length - 1" class="browser-btn">
                    <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40">
                        <g>
                            <path d="m26.3 21.4q0 0.3-0.2 0.5l-10.4 10.4q-0.3 0.3-0.6 0.3t-0.5-0.3l-1.1-1.1q-0.2-0.2-0.2-0.5t0.2-0.5l8.8-8.8-8.8-8.7q-0.2-0.3-0.2-0.6t0.2-0.5l1.1-1.1q0.3-0.2 0.5-0.2t0.6 0.2l10.4 10.4q0.2 0.2 0.2 0.5z"></path>
                        </g>
                    </svg>
                </button>
                <button aria-label="Refresh" class="browser-btn">
                    <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40">
                        <g>
                            <path d="m29.5 10.5l3.9-3.9v11.8h-11.8l5.4-5.4c-1.8-1.8-4.3-3-7-3-5.5 0-10 4.5-10 10s4.5 10 10 10c4.4 0 8.1-2.7 9.5-6.6h3.4c-1.5 5.7-6.6 10-12.9 10-7.3 0-13.3-6.1-13.3-13.4s6-13.4 13.3-13.4c3.7 0 7 1.5 9.5 3.9z"></path>
                        </g>
                    </svg>
                </button>
            </div>
            <div class="browser-address">
                <div class="browser-address-box">
                    <input spellcheck="false" readonly aria-label="Address Bar Input" :value="data.pages[data.current].url" class="browser-address_value">
                </div>
            </div>
        </div>
        <div>
            <slot></slot>
        </div>
        <pre :style="{color: index == data.current ? 'red' : '#000'}"
            v-for="(page, index) in data.pages" :key="index">第{{index + 1}}页:
{{JSON.stringify(page, null, 4)}}</pre>
    </div>
</template>
<script>
import jsdom from 'jsdom'
let createWindow = function(){
    let dom = window.dom = new jsdom.JSDOM('<div></div>', {
        url: "https://example.org/",
        contentType: "text/html",
    })

    let _window = window.win = {
        data: {
            pages: [{
                url: dom.window.location.href,
                title: dom.window.document.title
            }],
            current: 0,
        },
        addEventListener(...arg){
            return dom.window.addEventListener(...arg)
        },
        removeEventListener(...arg){
            return dom.window.removeEventListener(...arg)
        },
        document: {
            get title(){
                return dom.window.document.title
            },
            set title(value){
                dom.window.document.title = value
            },
        },
        history: {
            get length(){
                return dom.window.history.length
            },
            get state(){
                return dom.window.history.state
            },
            back(){
                return this.go(-1)
            },
            forward(){
                return this.go(1)
            },
            go(n){
                let index = n + _window.data.current
                index = Math.max(0, index)
                index = Math.min(_window.data.pages.length - 1, index)
                dom.window.history.go(index - _window.data.current)
                _window.data.current = index
            }, 
            pushState(...arg){
                dom.window.history.pushState(...arg)
                let title = dom.window.document.title
                _window.data.pages.splice(_window.data.current + 1, Infinity)
                
                _window.data.pages.push({
                    url: dom.window.location.href,
                    title,
                })
                _window.data.current++
            }, 
            replaceState(...arg){
                dom.window.history.replaceState(...arg)
                
                _window.data.pages.splice(_window.data.current, 1, {
                    url: dom.window.location.href,
                    title: dom.window.document.title
                })
            }
        },
        location: {
            get ancestorOrigins(){
                return dom.window.location.ancestorOrigins
            },
            get hash(){
                return dom.window.location.hash
            },
            set hash(value){
                this.assign(value)
            },
            get host(){
                return dom.window.location.host
            },
            get hostname(){
                return dom.window.location.hostname
            },
            get href(){
                return dom.window.location.href
            },
            set href(value){
                this.assign(value)
            },
            get origin(){
                return dom.window.location.origin
            },
            get pathname(){
                return dom.window.location.pathname
            },
            get port(){
                return dom.window.location.port
            },
            get protocol(){
                return dom.window.location.protocol
            },
            get search(){
                return dom.window.location.search
            },
            reload(){

            },
            replace(...arg){
                dom.window.location.replace(...arg)
                _window.data.pages.splice(_window.data.current, 1, {
                    url: dom.window.location.href,
                    title: dom.window.document.title
                })
            },
            assign(url){
                let _dom = new jsdom.JSDOM('<div></div>', {
                    url: dom.window.location.href,
                    contentType: "text/html",
                })
                _dom.window.location.assign(url)
                if(_dom.window.history.length == 2){
                    let title = dom.window.document.title
                    dom.window.location.assign(url)
                    _window.data.pages.splice(_window.data.current + 1, Infinity)
                    _window.data.pages.push({
                        url: dom.window.location.href,
                        title
                    })
                    _window.data.current++
                }
            },
        }
    }

    return _window
}


export default {
    data(){
        this._window = createWindow()
        return {
            data: this._window.data
        }
    },
    computed: {
        window(){
            return this._window
        }
    },
    methods: {
        forward(){
            this._window.history.forward()
        },
        back(){
            this._window.history.back()
        },
    }
}
</script>

<style scoped>
.browser {
    width: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    font-family: Roboto, sans-serif;
    position: relative;
    flex: 1 1 0%;
    user-select: initial;
}

.browser-location {
    display: flex;
    color: rgb(204, 204, 204);
    background-color: rgb(242, 242, 242);
    padding: 0.5rem;
    -webkit-box-align: center;
    align-items: center;
    line-height: 1;
    box-shadow: rgb(221, 221, 221) 0px 1px 3px;
    height: 2.5rem;
    min-height: 2.5rem;
    box-sizing: border-box;
    z-index: 2;
    cursor: move;
    user-select: initial;
}

.browser-box {
    display: flex;
}

.browser-btn > svg {
    vertical-align: middle;
}

.browser-btn {
    font-family: sans-serif;
    font-size: 1.5rem;
    line-height: 0.5;
    margin: 0px 0.1rem;
    overflow: visible;
    border-width: initial;
    border-style: none;
    border-color: initial;
    color: rgb(135, 135, 135);
    background-color: transparent;
    vertical-align: middle;
    padding: 0px;
    outline: none;
}

.browser-btn:hover {
    background-color: rgb(226, 226, 226);
    cursor: pointer;
}

.browser-btn:disabled {
    background-color: transparent;
    cursor: default;
    font-family: sans-serif;
    font-size: 1.5rem;
    line-height: 0.5;
    margin: 0px 0.1rem;
    overflow: visible;
    border-width: initial;
    border-style: none;
    border-color: initial;
    color: rgb(192, 192, 192);
    vertical-align: middle;
    padding: 0px;
    outline: none;
}


.browser-address {
    flex: 1;
    box-sizing: border-box;
    margin: 0px 0.5rem;
}

.browser-address-box {
    position: relative;
    color: rgb(153, 153, 153);
    vertical-align: middle;
    font-size: 1rem;
}

.browser-address_value {
    font-family: Roboto, sans-serif;
    font-size: 16px;
    line-height: 1.15;
    margin: 0px;
    width: 100%;
    overflow: visible;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: transparent;
    text-rendering: optimizeLegibility;
    border-radius: 4px;
    outline: none;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(204, 204, 204);
    padding: 0.2rem 0.5rem;
    color: rgba(0, 0, 0, 0.8);
    box-sizing: border-box;
}

</style>
