<template>
    <div>
        <Button @click="replace">替换页面{{count}}</Button>
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
        async replace(){
            await this.myHistory.replace(this.count++ + '')
        }
    },
    mounted(){
        this.myHistory = new MyHistory({}, this.$refs.Browser.window)
        this.myHistory.onChange = ()=>{
            this.list = this.myHistory.stack.map(item=> item.href)
        }
        this.myHistory.push(this.count++ + '')

    }
}
</script>
