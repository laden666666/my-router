/**
 * @file
 * 控件封装的vue的实例
 */

import {VueConstructor} from 'vue'
import MyRouterView from './router/router-view/RouterView';

var installed = false
let MyRouterVue = {
    install: function(Vue: VueConstructor){
        Vue.component('MyRouterView', MyRouterView)
        Vue.mixin({
            beforeCreate(){
                if (!installed) {
                    this.$root.$options['router'].reload()
                    installed = true
                }
            },
        })
    },
}

export {
    MyRouterVue
}
