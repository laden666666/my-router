<template>
    <div class="router-view">
        <loading-bar :finish="!loading"></loading-bar>

        <!-- 不启动动画，就不创建animationName节点 -->
        <template v-if="hasAnimation">
            <transition :name="animationName">
                <keep-alive :include="cachePageNameList">
                    <component v-if="pageComponent" :is="pageComponent" :key="pageComponent.name"
                         ref="showPage">
                    </component>
                </keep-alive>
            </transition>
        </template>
        <template v-else>
            <keep-alive :include="cachePageNameList">
                <component v-if="pageComponent" :is="pageComponent" :key="pageComponent.name"
                    ref="showPage">
                </component>
            </keep-alive>
        </template>
    </div>
</template>

<script>
    import RouterView from "./RouterView.ts";
    export default RouterView
</script>

<style lang="scss" scoped>
    .router-view{
        position: relative;
    }

    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .pop-enter-active, .push-enter-active {
        transition: all .3s ease;
    }
    .pop-enter {
        transform: translateX(-100%);
        opacity: 0;
    }
    .push-enter {
        transform: translateX(100%);
        opacity: 0;
    }
</style>

