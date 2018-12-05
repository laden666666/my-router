<template>
    <div class="hello">
        <p>未找到路径是“{{$router.getCurrentURL().path}}”的页面，点击返回<a @click="goHome">首页</a></p>
    </div>
</template>

<script>
export default {
    methods: {
        goHome(){
            // 返回前清除缓存的页面
            this.$router.destroyState()
            this.$router.navigateTo('/')
        },
    },
}
</script>

<style scoped>
    a {
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
