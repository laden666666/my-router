<template>
    <div class="page">
        <p>使用redirectTo方法跳转，新页面会代替当前页面</p>
        <p>来自上一个页面的参数data：“<strong>{{$route.data}}</strong>”</p>
        <el-button @click="$router.redirectTo($router.getCurrentURL().path, {data: (parseInt($route.data) + 1)})">redirectTo跳转到当前页面</el-button>
        <el-button @click="$router.navigateBack()">返回</el-button>
    </div>
</template>

<script>
export default {
}
</script>

<style scoped>
</style>