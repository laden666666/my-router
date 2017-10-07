/**
 * 一个路由的跟组件,他的下面会有很多小组件。原则上来讲Router组件一个app(单页)只能有一个。
 */

import React, {Component, PropTypes} from 'react'
var ReactDOM = require('react-dom');
import browserHistoryFactory from '../history/browserHistoryFactory'
import PageInstance from './PageInstance'
import RouterAction from '../RouterAction'
import Control from '../service/Control'
import util from '../../../utils/util'
const path = require('path');

import styles from "./styles.scss"

const {any, string} = PropTypes

class Router extends Component{

    static defaultProps = {
        children: null,
        subPath: "/",
    }

    static propTypes = {
        children: any,
        subPath: string,
    }

    constructor(props){
        super(props);
        this.history = browserHistoryFactory();
        this.state = {
            pages : {},
        }
        Control.setSubPath(this.props.subPath)
    }

    async componentDidMount() {
        this._unlisten = this.history.listen(async (result, currentHistory, oldHistory) => {

            try{
                var pages = await this.updatePage(currentHistory, oldHistory);

                var nextPage = this.refs["page" + currentHistory.url.id];
                var previousPage = this.refs["page" + oldHistory.url.id];

                if(result == RouterAction.FORWARD || result == RouterAction.PUSH){
                    await nextPage.show()
                    await nextPage.forward();
                    await previousPage.hide();
                } else if(result == RouterAction.REPLACE){
                    await nextPage.show()
                } else {
                    await nextPage.show()
                    await previousPage.back();
                    await previousPage.hide();
                }
            } catch (e){
                console.error(e, "路由错误!")
            }
        });

        var history = this.history.historyCache.get();
        var page = this.createPage(history);
        if(page){
            var pages = {...this.state.pages};
            pages[page.id] = page;
            await this.setState({
                pages : pages
            });
            if(this.state.pages[page.id] && this.refs["page" + page.id]){
                await this.refs["page" + page.id].show();
            }
        }
    }

    render(){
        return (<div>
            {this.renderPage()}
        </div>);
    }

    renderPage(){
        var pages = [];
        for (var key in this.state.pages){
            pages.push(this.state.pages[key])
        }

        return pages.map(page=>{
            return (
                <PageInstance key={page.id + page.key} page={page} ref={"page" + page.id}></PageInstance>);
        });
    }

    //移除已经不再历史栈中的页面
    async updatePage(currentHistory, oldHistory){

        //去除已经淘汰的页面
        var newPageMap = {};
        this.history.historyCache.iterator((history)=>{
            //如果是刷新(currentHistory和 oldHistory的id相对),和oldHistory的id一样的页面也不要
            if(this.state.pages[history.url.id] && !(currentHistory.url.id == oldHistory.url.id && oldHistory.url.id == history.url.id)){
                newPageMap[history.url.id] = this.state.pages[history.url.id]
            }
        });

        // 如果当前页面未缓存,创建当前页面
        if(!newPageMap[currentHistory.url.id]){
            var page = this.createPage(currentHistory);
            if(page){
                newPageMap[page.id] = page;
            }

            //如果是刷新,还加上时间戳,强制更新
            if(currentHistory.url.id == oldHistory.url.id){
                page.key = Date.now();
            }
        }

        await this.setState({
            pages : newPageMap,
        })
    }

    createPage(history){
        var url = history.url;
        var navData = history.data.$navigateData || {};
        if(!this.props.children){
            return null;
        }
        var matchRoute, notFoundRoute, indexRoute;

        for(let i = 0; i < this.props.children.length; i++){
            let route = this.props.children[i];

            if(route.props.hasOwnProperty("notFound") && route.props["notFound"] !== false){
                notFoundRoute = route;
            }
            if(route.props.hasOwnProperty("index") && route.props["index"] !== false
                && path.normalize(this.props.subPath) == path.normalize(url.path)){
                indexRoute = route;
            }
            if(path.join(this.props.subPath, route.props.path) == path.normalize(url.path)){
                matchRoute = route;
            }
        }

        function createPageByRoute(route) {
            var pageProps = route.props.pageProps || {};
            pageProps["params"] = { ...url.queryMap, ...(navData.data || {}), };
            var PageComponent = route.props.component;

            return {
                pageProps : pageProps,
                pageComponent : PageComponent,
                id: url.id,
                key: ""
            }
        }
        var route = matchRoute || indexRoute || notFoundRoute;
        if(route){
            return createPageByRoute(route);
        } else {
            return null;
        }
    }

    componentWillUnmount() {
        if (this._unlisten)
            this._unlisten()
    }
}

export default Router
