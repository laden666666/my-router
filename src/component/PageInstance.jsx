/**
 * Created by njz on 17/3/8.
 */
import React, {Component, PropTypes} from 'react';

function onceAnimation(el, animationClass, startEvent, endEvent) {
    if(!el || el.nodeType != 1){
        throw TypeError("el is not element!");
    }

    function animationstart() {
        try {
            typeof startEvent === "function" && startEvent();
        } catch (e){
            console.error(e)
        }
        el.removeEventListener("animationstart", animationstart);
    }

    function animationend() {
        try {
            typeof endEvent === "function" && endEvent();
        } catch (e){
            console.error(e)
        }
        el.removeEventListener("animationend", animationend);
        el.classList.remove(animationClass);
    }

    el.addEventListener("animationstart", animationstart, false);
    el.addEventListener("animationend", animationend, false);
    el.classList.add(animationClass);
}

class PageInstance extends Component{
    static defaultProps = {
        className: "",
        page: null
    }

    static propTypes = {
        className: PropTypes.string,
        page: PropTypes.any.isRequired,
    }

    constructor(props){
        super(props);

        this.state={
            hide: false,
        }
    }

    render(){
        var pageProps = this.props.page.pageProps;
        var PageComponent = this.props.page.pageComponent;

        return <div ref="div" className={this.props.className + " c-router-page "
            + (this.state.hide ? " s-hide" : "" )}>
            <PageComponent ref="pageComponent" {...pageProps}></PageComponent>
        </div>
    }

    async hide(){
        await this.setState({
            hide: true,
        })
        if(this.refs.pageComponent && typeof this.refs.pageComponent.onRouteHide == "function"){
            await this.refs.pageComponent.onRouteHide();
        }
    }

    async show(){
        await this.setState({
            hide: false,
        })
        if(this.refs.pageComponent && typeof this.refs.pageComponent.onRouteShow == "function"){
            await this.refs.pageComponent.onRouteShow();
        }
    }

    forward() {
        return new Promise((resovle,reject)=>{
            if(this.refs.div){
                var div = this.refs.div;
                onceAnimation(div, 's-forward', null, function () {
                    resovle()
                })
            } else {
                reject("未初始化完成,无法执行动画");
            }
        })
    }

    back() {
        return new Promise((resovle,reject)=>{
            if(this.refs.div){
                var div = this.refs.div;
                onceAnimation(div, 's-back', null, function () {
                    resovle()
                })
            } else {
                reject("未初始化完成,无法执行动画");
            }
        })
    }
}



export default PageInstance;
