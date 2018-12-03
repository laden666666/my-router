/**
 * @file
 * 路由控件的逻辑部分，基于my-router的RouterManager，实现路由控件
 */
import { RouterManager, RouteData as CoreRouteData } from 'my-router';
import Vue from 'vue';
/**
 * 继承核心层的RouteData，从新定义otherData数据类型，将页面相关的数据保存到该类型中
 * @interface RouteData
 * @extends {CoreRouteData}
 */
interface RouteData extends CoreRouteData {
    otherData: {
        page: RoutePageData;
    };
}
/**
 * 对核心层的RouteData的包装，增加了若干属性，方便视图渲染使用的，
 * @interface RoutePageData
 * @extends {CoreRouteData}
 */
interface RoutePageData {
    /**
      * id
      * @type {string}
      */
    id: string;
    /**
     * 路由数据，是path数据和query数据组成
     * @type {{[propName: string]: any}}
     */
    routeData: {
        [propName: string]: any;
    };
    /**
     * 是否是第一次访问
     * @type {boolean}
     */
    routeFirstVisit: boolean;
    /**
     * 加载页面的控件
     * @type {any}
     */
    loadComponent: () => Promise<object>;
    /**
     * 页面的控件
     * @type {object}
     */
    pageComponent: object;
    /**
     * 时间戳，为了标记页面唯一性的id，因为id可能重复
     * @type {string}
     */
    name: string;
    /**
     * 关联的dom
     * @type {any}
     */
    dom: any;
}
/**
 * 控件的接口，因为vue使用的是Mixin创建，而不是类，所有这里用Control加原型接口来约束类型。
 * vue在2.5之后支持使用类和typescript创建控件，但是目前为止还不稳定，故仍采用Mixin方式创建
 * @interface RouterView
 */
interface RouterView extends Vue {
    _routerManger: RouterManager;
    _first: boolean;
    visitedRouteMap: {
        [name: string]: boolean;
    };
    cachePageNameList: string[];
    cachePageMap: {
        [name: string]: RoutePageData;
    };
    pageComponent: object;
    oldPageComponent: object;
    loading: boolean;
    hasAnimation: boolean;
    animationName: string;
    createPage: (this: RouterView & Vue, routeData: RouteData) => RoutePageData;
    addPageDom: (this: RouterView & Vue, routeData: RoutePageData) => void;
    deletePageDom: (this: RouterView & Vue, routeData: RoutePageData) => void;
}
declare const _default: {
    props: {
        hasAnimation: {
            type: BooleanConstructor;
            default: boolean;
        };
    };
    data(): {
        visitedRouteMap: {};
        cachePageNameList: any[];
        cachePageMap: {};
        pageComponent: any;
        loading: boolean;
        animationName: string;
    };
    components: {
        'loading-bar': any;
    };
    mounted: (this: RouterView & Vue) => Promise<void>;
    methods: {
        createPage: (this: RouterView & Vue, routeData: RouteData) => RoutePageData;
        addPageDom(this: RouterView & Vue, page: RoutePageData): void;
        deletePageDom(this: RouterView & Vue, page: RoutePageData): void;
    };
};
export default _default;
