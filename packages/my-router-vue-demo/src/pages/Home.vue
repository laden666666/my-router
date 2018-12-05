<template>
    <div class="hello">
        <h1>路由例子</h1>
        <h2>不同形式的跳转</h2>
        <ul class="ul" c2s-class="ul0">
            <li class="ul_li">
                <a class="ul_lip0a1" @click="navigateTo">
                    普通跳转
                </a>
            </li>
            <li class="ul_li">
                <a class="ul_lip0a1" @click="redirectTo">
                    replace页面跳转
                </a>
            </li>
            <li class="ul_li">
                <a class="ul_lip0a1" @click="lazyLoad">
                    异步加载页面
                </a>
            </li>
            <li class="ul_li">
                <a class="ul_lip0a1" @click="navigateBack">
                    带参数返回
                </a>
            </li>
            <li class="ul_li">
                <a class="ul_lip0a1" @click="go404">
                    404页面
                </a>
            </li>
            
        </ul>
    </div>
</template>

<script>
export default {
    methods: {
        async navigateTo(){
            await this.$router.navigateTo('NavigateTo', {
                data: '跳转navigateTo'
            })
            alert('返回成功')
        },
        async redirectTo(){
            await this.$router.navigateTo('RedirectTo', {
                data: '0'
            })
            alert('返回成功')
        },
        async lazyLoad(){
            await this.$router.navigateTo('LazyLoad')
            alert('返回成功')
        },
        async navigateBack(){
            let result = await this.$router.navigateTo('NavigateBack')
            alert('返回成功,传回的值是：' + result)
        },
        go404(){
            this.$router.navigateTo('404')
        },
    },
}
</script>

<style scoped>
    .ul {
        box-sizing : border-box ;
        margin : 1.5em 0px 1.5em 3em ;
        padding-left : 0px ;
        color : rgb(51, 51, 51) ;
        font-family : -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", "Source Han Sans SC", "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif ;
        font-size : 15px ;
    }
    .ul_li {
        box-sizing : border-box ;
        margin : 0.3em 0px ;
    }
    .ul_lip0a1 {
        box-sizing : border-box ;
        background : transparent ;
        color : rgb(0, 154, 97) ;
        text-decoration-line : none ;
        outline : 0px ;
        border-bottom : 1px solid rgba(0, 154, 97, 0.25) ;
        padding-bottom : 1px ;
        cursor: pointer;
    }
</style>
