<template>
    <div class="page">
        <el-form ref="form" label-width="160px">
            <el-form-item label="返回给上一个页面的值">
                <el-input v-model="input" placeholder="输入返回的内容"></el-input>
            </el-form-item>
        </el-form>
        <el-button @click="$router.navigateBack()">返回</el-button>
    </div>
</template>

<script>
export default {
    data(){
        return {
            input: ''
        }
    },
    watch: {
        input(){
            this.$router.setBackValue(this.input)
        }
    }
}
</script>

<style scoped>
</style>
