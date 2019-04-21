<template>
    <Doc>
        <H1>API</H1>
        <H2>创建</H2>
        <P>使用new语法创建，如</P>
        <Code :code="`new MyHistory({
    root: '/'
})`"></Code>
        <H3>配置项</H3>
        <Instructions :data="[{
            name: 'gobackName',
            type: 'String',
            default: '\'go back\'',
            describe: '一部分浏览器按住返回按钮，会显示全部历史记录信息。该字段用于配置历史信息中返回页面的名字',
        }, {
            name: 'root',
            type: 'String',
            default: '\'/\'',
            describe: '根路径',
        }, {
            name: 'insertRoot',
            type: 'Boolean',
            default: 'true',
            describe: '当页面访问栈底不是根页面的时候，插入一条根页面到栈底',
        }]"></Instructions>

        <H2>Location</H2>
        <P>一个浏览记录的对象的封装，参考了window.location对象</P>
        <Instructions type="h3" :data="[{
            name: 'hash',
            type: 'string',
            describe: 'hash字段，字段名取自widow.location.hash',
        }, {
            name: 'pathname',
            type: 'string',
            describe: '路径字段，字段名取自widow.location.pathname',
        }, {
            name: 'search',
            type: 'string',
            describe: '查询参数字段，字段名取自widow.location.search',
        }, {
            name: 'key',
            type: 'string',
            describe: '一个id，用于区分href相同的location',
        }, {
            name: 'href',
            type: 'string',
            describe: '获取一个完整的url',
        }]"></Instructions>

        <H2>MyHistory的原型方法</H2>
        <H3>MyHistory.prototype.push(path: string, state?: any): Promise<{{'Location>'}}</H3>
        <Function :data="`
    /**
     * 前进去往一个页面，名字取自history.push
     * @param {string} path                 去往的地址
     * @param {any} state                   跳转的数据，要求可以被JSON.stringify
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf IHistory
     */
        `"></Function>
        <H3>MyHistory.prototype.replace(path: string, state?: any): Promise<{{'Location>'}}</H3>
        <Function :data="`
    /**
     * 用一个URL代替当前的URL，跳转不产生历史记录，名字取自history.replace
     * @param {string} path                 去往的地址
     * @param {any} state                   跳转的数据，要求可以被JSON.stringify
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf IHistory
     */
        `"></Function>
        <H3>MyHistory.prototype.goback(n?: number): Promise<{{'Location>'}}</H3>
        <Function :data="`
    /**
     * 向后回退。如果退回步数，超过了栈的长度，按照栈的长度算，名字取自history.goback
     * @param {number} n                    退回的步数
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf IHistory
     */
        `"></Function>
        <H3>MyHistory.prototype.goback(path: string): Promise<{{'Location>'}}</H3>
        <Function :data="`
    /**
     * 退回到指定的path，如果为找到合适path，跳回到root
     * @param {string} path                 指定的path
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf IHistory
     */
        `"></Function>
        <H3>MyHistory.prototype.goback(fn: (fn: ReadonlgLocation)=>boolean): Promise<{{'Location>'}}</H3>
        <Function :data="`
    /**
     * 退回到符合条件的location，如果为找到合适path，跳回到root
     * @param {(fn: ReadonlgLocation)=>boolean} fn      条件函数
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf IHistory
     */
        `"></Function>
        <H3>MyHistory.prototype.reload(): Promise<{{'Location>'}}</H3>
        <Function :data="`
    /**
     * 刷新当前页面，名字取自location.reload
     * @returns {Promise<Location>}        跳转完成的promise，并返回新创建的ILocation
     * @memberOf IHistory
     */
        `"></Function>
        <H3>MyHistory.prototype.destroy(): Promise<{{'void>'}}</H3>
        <Function :data="`
    /**
     * 销毁路由。路由是一个单例，必须要将当前实例销毁才能创建新的路由
     * @memberOf IHistory
     */
        `"></Function>

        <H2>MyHistory的属性</H2>
        <Instructions type="h3" :data="[{
            name: 'stack',
            type: 'Location[]',
            describe: '当前Location栈。这是一个只读数组',
        }, {
            name: 'length',
            type: 'number',
            describe: '当前Location栈的长度，名字取自history.length',
        }, {
            name: 'location',
            type: 'Location',
            describe: '栈顶的ILocation对象',
        }, {
            name: 'isBusy',
            type: 'boolean',
            describe: '是否空闲，当false时候，push、replace、goback等操作均无法使用',
        }]"></Instructions>

        <H2>钩子函数</H2>
        <H3>onChange</H3>
        <Function :data="`
    /**
     * 注册URLchange监听器，事件支持异步，不允许注册多个事件
     *  @param {'init' | 'push' | 'goback' | 'replace' | 'reload'}    action URL改变的类型
     *  @param {Location}    oldLoction 上一个页面的loction对象
     *  @param {Location}    newLoction 当前页面的location对象
     *  @param {Location[]}    discardLoctions 跳转过程中出栈的location对象
     *  @param {Location[]}    includeLoctions 跳转过程中入栈的location对象
     * @returns {void | Promise<void>}        如果是Promise<void>，路由会处于终止状态，直到事件处理完成，所以尽量不要使用异步
     * @memberOf IHistory
     */
        `"></Function>
        <P>action的可能是'init' | 'push' | 'goback' | 'replace' | 'reload'的一种，每个值的含义如下：</P>
        <Li>init：初始化</Li>
        <Li>push：push函数执行</Li>
        <Li>goback：goback函数执行</Li>
        <Li>replace：replace函数执行</Li>
        <Li>reload：reload函数执行</Li>
        <Function :data="`
    /**
     * 注册BeforeURLURLchange监听器，history的特点是可以监听变化，然后确定是否要应用改变，
     * 因此可以在BeforeChange事件中阻止改变生效，可以实现如阻止回调等功能,
     * 事件支持异步，不允许注册多个事件
     *  @param {'init' | 'push' | 'goback' | 'replace' | 'reload'}    action URL改变的类型
     *  @param {Location}    oldLoction 上一个页面的loction对象
     *  @param {Location}    newLoction 当前页面的location对象
     *  @param {Location[]}    discardLoctions 跳转过程中出栈的location对象
     *  @param {Location[]}    includeLoctions 跳转过程中入栈的location对象
     * @returns {boolean | Promise<boolean>}        如果是Promise<boolean>，路由会处于终止状态，直到事件处理完成。如果boolean值是false（false以外的falsy不可），将阻止改变发生
     * @memberOf IHistory
     */
        `"></Function>
    </Doc>
</template>
<script>
import {MyHistory} from 'my-router-history'

export default {
    data(){
        return {
        }
    },
}
</script>
