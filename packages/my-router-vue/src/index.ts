/**
 * @file
 * 控件封装的vue的实例
 */

import Vue, {VueConstructor} from 'vue'
import {RouterManager, RouteData} from 'my-router'
import MyRouterView from './router/router-view/RouterView';


var installed = false
let MyRouterVue = {
    install: function(Vue: VueConstructor){
        Vue.component('MyRouterView', MyRouterView)
        Vue.mixin({
            inject: {
                'myRoutePage': { default: null }
            },
            beforeCreate(){
                if (!installed) {
                    this.$root.$options['router'].reload()
                    installed = true
                }
            },
            computed: {
                $router(){
                    return this.$root.$options['router']
                },
                $route(){
                    if(this.myRoutePage){
                        return this.myRoutePage.$route
                    }
                }
            }
        })
    },
}

declare module 'vue/types/vue' {
    interface Vue {
        $router: RouterManager
        $route: RouteData
    }
}

export {
    MyRouterVue
}
