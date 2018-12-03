/**
 * @file
 * 路由控件的逻辑部分，基于my-router的RouterManager，实现路由控件
 */

import {
    RouterManager,
    RouteData as CoreRouteData,
} from 'my-router'
import Vue from 'vue'

declare function require(name: string): any;

//禁用浏览器自带的滚动条响应事件，由框架帮助页面处理滚动条位置。这样好处是兼容性好
history.scrollRestoration = 'manual'

/**
 * 继承核心层的RouteData，从新定义otherData数据类型，将页面相关的数据保存到该类型中
 * @interface RouteData
 * @extends {CoreRouteData}
 */
interface RouteData extends CoreRouteData{
    otherData: {
        //vue控件，页面的实例
        page: RoutePageData
    },
}

/**
 * 对核心层的RouteData的包装，增加了若干属性，方便视图渲染使用的，
 * @interface RoutePageData
 * @extends {CoreRouteData}
 */
interface RoutePageData{
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
    routeFirstVisit: boolean,
    /**
     * 加载页面的控件
     * @type {any}
     */
    loadComponent: ()=>Promise<object>,
    /**
     * 页面的控件
     * @type {object}
     */
    pageComponent: object,
    /**
     * 时间戳，为了标记页面唯一性的id，因为id可能重复
     * @type {string}
     */
    name: string
    /**
     * 关联的dom
     * @type {any}
     */
    dom: any,
}

/**
 * 控件的接口，因为vue使用的是Mixin创建，而不是类，所有这里用Control加原型接口来约束类型。
 * vue在2.5之后支持使用类和typescript创建控件，但是目前为止还不稳定，故仍采用Mixin方式创建
 * @interface RouterView
 */
interface RouterView extends Vue{

    //非data属性：
    //路由核心层实例，由门面实例创建，他负责真正管理路由
    _routerManger: RouterManager
    //是否是路由访问的第一页，如果是不显示动画
    _first: boolean

    //data属性：
    //记录页面是否是第一次加载
    visitedRouteMap: {[name: string]: boolean};
    //缓存路由名
    cachePageNameList: string[]
    //缓存路由
    cachePageMap: {[name: string]: RoutePageData}
    //当前页面的控件
    pageComponent: object
    //老页面的控件
    oldPageComponent: object
    //加载中
    loading: boolean
    //动画的动作
    hasAnimation: boolean,
    //动画的动作
    animationName: string,

    //方法：
    createPage: (this: RouterView & Vue, routeData: RouteData)=> RoutePageData;
    addPageDom: (this: RouterView & Vue, routeData: RoutePageData)=> void;
    deletePageDom: (this: RouterView & Vue, routeData: RoutePageData)=> void;
}

//用于标记页面的id种子
var pageIDSeek = 0

export default {
    props: {
        hasAnimation: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return  {
            //记录路由出现过的路由
            visitedRouteMap : {},
            //缓存页面名称
            cachePageNameList: [],
            //缓存路由
            cachePageMap: {},
            //当前路由的名称
            pageComponent: null,
            //加载中
            loading: false,
            //动画的动作
            animationName: '',
        };
    },
    components: {
        'loading-bar': require('../loading-bar/loading-bar.vue').default
    },
    mounted: async function (this: RouterView & Vue) {
         //获取vue实例中的路由对象
        this._routerManger = this.$root.$options['router'];

        //创建RouteRecognizer对象，配置路由信息
        if (! this._routerManger) {
            throw new TypeError("router is not intalled");
        }

        //增添事件监听
        this._routerManger.addURLChangeListener(async (result, from: RouteData, to: RouteData, clearState: RouteData[])=>{
            //关闭键盘，去除ipad中，删除获得焦点的input的产生的键盘不消失的bug
            document.activeElement && typeof document.activeElement['blur'] == 'function' && document.activeElement['blur']();
            window.focus();

            try {
                //老页面
                var oldPage:RoutePageData = from && from.otherData ? from.otherData.page : undefined;
                //新页面
                var newPage:RoutePageData = to && to.otherData ? to.otherData.page : undefined;

                //创建动画名称，是否是路由访问的第一页，如果是不显示动画
                if(!this._first){
                    this._first = true
                } else {
                    this.animationName = result.toLowerCase()
                }


                if(oldPage && oldPage.dom && typeof oldPage.dom.$emit === 'function'){
                    // 执行beforeRouteLeave
                    oldPage.dom.$emit("beforeRouteLeave", {...from, otherData: undefined}, {...to, otherData: undefined});
                }

                // 查看老页面是否存在，不存在就创建新页面
                if(!newPage){
                    // 创建新页面
                    newPage = this.createPage(to)
                    to.otherData.page = newPage

                    // 等待控件渲染完成（包括异步控件）
                    this.loading = true
                    this.pageComponent = null
                    await newPage.loadComponent()
                    this.loading = false


                    // 加载页面
                    this.addPageDom(newPage)
                } else {
                    // 加载页面
                    this.pageComponent = newPage.pageComponent
                    // 修复红土航空 #6119
                    this.cachePageMap[newPage.name] = newPage
                }

                // 执行afterRouteEnter
                // this.$nextTick(()=>{
                    //将新的url加入以访问的url中
                    // this.visitedRouteMap[currentHistory.url.stringifyWithoutSystemData()] = true;

                    // eventBus.$emit("afterRouteEnter", previousPage, currentHistory, oldHistory);
                // })

            } catch (e) {
                console.error(e, "router error!")
            }
        })

        //增加移除事件监听
        this._routerManger.addDestroyStateListener(clearState => {
            clearState.forEach(item=>{
                // 销毁过期页面
                if(item.otherData.page){
                    this.deletePageDom(item.otherData.page)
                }
            })
            this.$forceUpdate()
        })
    },
    methods: {

        //创建新页面
        createPage: function(this: RouterView & Vue, routeData: RouteData): RoutePageData{

            if(routeData.routeConfig == null){
                return null
            }

            //生成一个随机且唯一的控件名。同时也作为RoutePageData的key
            var name = 'URL' + routeData.fullPath.split('?')[0].replace(/[^\w^\d/]+/g, '').replace(/[/]+/g, '') + pageIDSeek++

            var routeFirstVisit = !this.visitedRouteMap[routeData.fullPath]
            this.visitedRouteMap[routeData.fullPath] = true

            //获取路由配置的注册的控件
            let pageComponent = routeData.routeConfig.component;

            //将用户配置的多种view的控件注册方式，都改为Promise形式
            let loadComponent: ()=>Promise<object>;

            if(typeof pageComponent == 'function'){
                //如果PageComponent是function，说明是异步函数，要在异步加载成功时候回调。
                loadComponent = ()=>new Promise((resolve, reject)=>{
                    //如果返回的是promise，则集成
                    const result = pageComponent(resolve, reject)
                    if(result instanceof Promise){
                        result.then(resolve, reject)
                    }

                })
            } else if(pageComponent instanceof Promise) {
                loadComponent = ()=>pageComponent
            } else if(pageComponent instanceof Object){
                //如果是一个对象，直接返回对象
                loadComponent = ()=>Promise.resolve( pageComponent)
            }

            //加载pageComponent后，将name增添到pageComponent对象中
            loadComponent = (loadComponent=>{
                return ()=>loadComponent().then(pageComponent=> {

                    page.pageComponent = {...pageComponent, name}

                    // page.pageComponent = {template: `<div>${name}</div>`, name}
                    return page.pageComponent
                })
            })(loadComponent)

            var page = {
                id: routeData.id,
                routeData: routeData.routeData || {},
                loadComponent: loadComponent,
                routeFirstVisit: routeFirstVisit,
                pageComponent: null,
                name: name,
                dom: null
            }
            return page
        },
        //将具体dom关联到page上面
        addPageDom(this: RouterView & Vue, page: RoutePageData){
            if(page){
                this.pageComponent = page.pageComponent
                this.cachePageMap[page.name] = page
                this.cachePageNameList.push(page.name)
                this.$nextTick(()=>{
                    page.dom = this.$refs.showPage
                })
            }
        },
        //移除页面的dom元素
        deletePageDom(this: RouterView & Vue, page: RoutePageData){
            this.cachePageNameList.splice(Array.from(this.cachePageNameList).indexOf(page.name), 1)
            this.$delete( this.cachePageMap, page.name )
            if(page.dom && page.dom.$destroy && page.dom.$options.name == page.name){
                page.dom.$destroy()
            }
        },
    },
}
