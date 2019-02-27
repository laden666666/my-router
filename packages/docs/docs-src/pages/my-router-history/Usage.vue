<template>
    <Doc>
        <H1>使用</H1>

        <H2>创建</H2>
        <P><Strong>my-router-history</Strong>只有在浏览器环境下才可以创建，并且同一时间只能有一个<Strong>my-router-history</Strong>实例存在。使用new语法创建<Strong>my-router-history</Strong>实例：</P>

        <Code :code="`new MyHistory({
    root: '/'
})`"></Code>

        <P>创建<Strong>my-router-history</Strong>实例后，会自创建一个<Strong>返回页面</Strong>，以便监听设置的返回按钮或者是浏览的后退按钮。</P>

        <Demo :demo="returnBtn" :code="`try{
     var myHistory = new MyHistory({})
} catch(e){
    alert(e)
}`" lang="javascript" title="创建my-router-history实例">
            <P>在未创建<Strong>my-router-history</Strong>实例前，浏览器返回键是不可用的；创建了<Strong>my-router-history</Strong>实例后，返回键可用，说明<Strong>history已经push一个页面</Strong>，那个页面就是专门监听返回键的页面。</P>
        </Demo>

        <H2>跳转页面</H2>
        <P><Strong>my-router-history</Strong>提供了类似window.history.push的方法——push，用于实现跳转页面。与window.history.push不同，<Strong>my-router-history</Strong>的push方法，不会增加浏览器地址栏的缓存页面数，但是会对访问记录做保存到其<Strong>stack</Strong>属性中。</P>

        <Demo vertical :demo="push" :code="`var myHistory = new MyHistory({})

// 记录缓存的href
var list = []
// 计数跳转的次数
var count = 0

myHistory.onChange = ()=>{
    list = myHistory.stack.map(item=> item.href)
}

// 注册按钮事件
button.onclick = async ()=>{
    await myHistory.push(count++ + '')
}`" lang="javascript" title="创建my-router-history实例">
        </Demo>
        <Alert>push是异步函数，在执行过程中，my-router-history会处于busy状态，此时不允许push再次运行。</Alert>

        <H2>替换页面</H2>
        <P><Strong>my-router-history</Strong>提供了类似window.history.replace的方法——replace，用于实现替换页面。</P>

        <Demo vertical :demo="replace" :code="`var myHistory = new MyHistory({})

// 记录缓存的href
var list = []
// 计数跳转的次数
var count = 0

myHistory.onChange = ()=>{
    list = myHistory.stack.map(item=> item.href)
}

myHistory.push(count++ + '')

// 注册按钮事件
button.onclick = async ()=>{
    await myHistory.replace(count++ + '')
}`" lang="javascript" title="创建my-router-history实例">
        </Demo>
        <Alert>replace是异步函数，在执行过程中，my-router-history会处于busy状态，此时不允许replace再次运行。</Alert>
        
        <H2>返回上一页面</H2>
        <P><Strong>my-router-history</Strong>提供了类似window.history.back的方法——goback，该方法用于返回上级页面。</P>

        <Demo vertical :demo="goback" :code="`var myHistory = new MyHistory({})

// 记录缓存的href
var list = []
// 计数跳转的次数
var count = 0

myHistory.onChange = ()=>{
    list = myHistory.stack.map(item=> item.href)
}

// 注册跳转页面按钮事件
button.onclick = async ()=>{
    await myHistory.replace(count++ + '')
}
// 注册返回按钮事件
button2.onclick = async ()=>{
    await myHistory.goback()
}`" lang="javascript" title="创建my-router-history实例">
        </Demo>

        <Alert><Strong>my-router-history</Strong>提供的goback方法与window.history.back最终表现一致，不同点在于window.history.back会先返回goback页面，然后再前进到原页面（部分浏览器的地址栏可能会闪一下goback地址），再触发<Strong>my-router-history的goback方法</Strong>。</Alert>
        <Alert>goback是异步函数，在执行过程中，my-router-history会处于busy状态，此时不允许goback再次运行。</Alert>


        <H2>监听改变</H2>
        <P><Strong>my-router-history</Strong>提供监听history变化的钩子——onBeforeChange和onChange。onBeforeChange钩子触发在改变生效之前，该钩子可以阻止改变生效；onChange执行在改变生效后。</P>
        <P>这两个钩子中，我们可以获得history改变的形式——'init' | 'push' | 'goback' | 'replace' | 'reload'。</P>
        <Li>init：初始化</Li>
        <Li>push：push函数执行</Li>
        <Li>goback：goback函数执行</Li>
        <Li>replace：replace函数执行</Li>
        <Li>reload：reload函数执行</Li>
        <P>同时钩子会提供改变后移除和新增的浏览记录。</P>
        <Demo vertical :demo="onChange" :code="`var myHistory = new MyHistory({})

// 记录缓存的href
var list = []
// 计数跳转的次数
var count = 0

myHistory.onChange = (state)=>{
    list = myHistory.stack.map(item=> item.href)
    if(state !== 'init'){
        alert(state)
    }
}

// 注册按钮事件
button.onclick = async ()=>{
    await myHistory.push(count++ + '')
}`" lang="javascript" title="创建my-router-history实例">
        </Demo>

        <H2>阻止改变生效</H2>
        <P>onBeforeChange钩子可以阻止改变生效。只需要返回false，改变就可以禁止执行。</P>
        <Demo vertical :demo="onBeforeChange" :code="`var myHistory = new MyHistory({})

// 记录缓存的href
var list = []
// 计数跳转的次数
var count = 0
// 是否允许执行改变
var enable = true

myHistory.onBeforeChange = (state)=>{
    return enable
}
myHistory.onChange = (state)=>{
    list = myHistory.stack.map(item=> item.href)
}

// 注册按钮事件
button.onclick = async ()=>{
    await myHistory.push(count++ + '')
}

// 注册checkBox的改变事件
checkBox.onchange = ()=>{
    enable = checkBox.checked
}`" lang="javascript" title="创建my-router-history实例">
        </Demo>
    </Doc>
</template>
<script>
import {MyHistory} from 'my-router-history'
import returnBtn from '../../demo/returnBtn'
import push from '../../demo/push'
import replace from '../../demo/replace'
import goback from '../../demo/goback'
import onChange from '../../demo/onChange'
import onBeforeChange from '../../demo/onBeforeChange'

export default {
    data(){
        return {
            returnBtn,
            push,
            replace,
            goback,
            onChange,
            onBeforeChange,
        }
    },
}
</script>
