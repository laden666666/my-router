/**
 * @file
 * 控件封装的vue的实例
 */
import { VueConstructor } from 'vue';
declare let MyRouterVue: {
    install: (Vue: VueConstructor<import("vue").default>) => void;
};
export { MyRouterVue };
