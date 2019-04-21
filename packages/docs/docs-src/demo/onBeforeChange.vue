<template>
    <div>
        <Button @click="push">跳转页面{{count}}</Button>
        <P>
            enable:
            <input type="checkbox" v-model="enable" />
        </P>
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
            list: [],
            enable: true
        }
    },
    methods: {
        async push(){
            await this.myHistory.push(this.count++ + '')
        }
    },
    mounted(){
        this.myHistory = new MyHistory({}, this.$refs.Browser.window)
        this.myHistory.onChange = ()=>{
            this.list = this.myHistory.stack.map(item=> item.href)
        }
        this.myHistory.onBeforeChange = ()=>{
            return this.enable
        }

    }
}
</script>
