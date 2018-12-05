<template>
    <div class="page">
        <p>使用navigateTo方法跳转，会将上一个页面保存到起来</p>
        <p>来自上一个页面的参数data：“<strong>{{$route.data}}</strong>”</p>
        <el-button @click="$router.navigateTo($router.getCurrentURL().path, {data: (parseInt($route.data) + 1)})">navigateTo跳转到当前页面</el-button>
        <el-button @click="$router.navigateBack()">返回</el-button>
    </div>
</template>

<script>
export default {
}
</script>

<style scoped>
</style>
