/**
 * @file
 * 控件封装的vue的实例
 */
import Vue, { VueConstructor } from 'vue';
import { RouterManager, RouteData } from 'my-router';
declare let MyRouterVue: {
    install: (Vue: VueConstructor<Vue>) => void;
};
declare module 'vue/types/vue' {
    interface Vue {
        $router: RouterManager;
        $route: RouteData;
    }
}
export { MyRouterVue };
