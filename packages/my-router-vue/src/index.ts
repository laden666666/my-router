/**
 * @file
 * 控件封装的vue的实例
 */

import {VueConstructor} from 'vue'
import MyRouterView from './router/router-view/RouterView';

let MyRouterVue = {
    install: function(Vue: VueConstructor){
        Vue.component('MyRouterView', MyRouterView)
    }
}

export {
    MyRouterVue
}
