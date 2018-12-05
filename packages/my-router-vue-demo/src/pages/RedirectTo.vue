<template>
    <div >
        <p>来自上一个页面的参数data:{{$route.data}}</p>
        <el-button @click="$router.redirectTo($router.getCurrentURL().path, {data: (parseInt($route.data) + 1)})">RedirectTo跳转到当前页面</el-button>
        <el-button @click="$router.navigateBack()">返回</el-button>
    </div>
</template>

<script>
export default {
}
</script>

<style scoped>
</style>