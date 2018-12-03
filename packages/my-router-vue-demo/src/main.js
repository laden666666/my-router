// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import {RouterManager} from 'my-router'
import {MyRouterVue} from 'my-router-vue'
import Home from './pages/Home.vue'
Vue.use(MyRouterVue)
let router = new RouterManager({
    mode: 'hash',
    routes: [{
        path: '/',
        component: Home,
    },]
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
