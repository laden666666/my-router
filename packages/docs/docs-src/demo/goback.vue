<template>
    <div>
        <Button @click="push">跳转页面{{count}}</Button>
        <Button @click="goback">返回上一页</Button>
        <Browser ref="Browser">
        list: {{list}}
        </Browser>
    </div>
</template>
<script>
import {MyHistory} from 'my-router-history'

export default {
    data(){
        return {
            count: 0,
            list: []
        }
    },
    methods: {
        async push(){
            await this.myHistory.push(this.count++ + '')
        },
        async goback(){
            await this.myHistory.goback()
        }
    },
    mounted(){
        this.myHistory = new MyHistory({}, this.$refs.Browser.window)
        this.myHistory.onChange = ()=>{
            this.list = this.myHistory.stack.map(item=> item.href)
        }
    }
}
</script>
