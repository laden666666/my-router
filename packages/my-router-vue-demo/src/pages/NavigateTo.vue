<template>
    <div >
        <p>来自上一个页面的参数data:{{$route.data}}</p>
        <el-button @click="$router.navigateBack()">返回</el-button>
    </div>
</template>

<script>
export default {
}
</script>

<style scoped>
</style>
