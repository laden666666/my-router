// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import {RouterManager} from 'my-router'
import {MyRouterVue} from 'my-router-vue'
import 'my-router-vue/dist/my-router-vue.css'
import NavigateTo from './pages/NavigateTo.vue'
import RedirectTo from './pages/RedirectTo.vue'
import NavigateBack from './pages/NavigateBack.vue'
import Page404 from './pages/404.vue'
const LazyLoad = ()=>import('./pages/LazyLoad.vue')
import Home from './pages/Home.vue'
Vue.use(MyRouterVue)
let router = new RouterManager({
    mode: 'hash',
    routes: [{
        path: '/',
        component: Home,
    },{
        path: '/NavigateTo',
        component: NavigateTo,
    },{
        path: '/RedirectTo',
        component: RedirectTo,
    },{
        path: '/LazyLoad',
        component: LazyLoad,
    },{
        path: '/NavigateBack',
        component: NavigateBack,
    },{
        path: '/**',
        component: Page404,
    }]
})

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import App from './App'
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
