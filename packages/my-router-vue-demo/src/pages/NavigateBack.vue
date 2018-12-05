<template>
    <div >
        <el-input v-model="input" placeholder="输入返回的内容"></el-input>
        <el-button @click="$router.navigateBack()">返回</el-button>
    </div>
</template>

<script>
export default {
    watch: {
        input(){
            this.$router.setBackValue(this.input)
        }
    }
}
</script>

<style scoped>
</style>
