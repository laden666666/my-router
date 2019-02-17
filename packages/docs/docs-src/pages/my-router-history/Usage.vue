<template>
    <Doc>
        <H1>test</H1>
        <Browser ref="Browser1">
            <Button @click="goTest">跳转到test</Button>
            my栈：
            
            <pre 
                v-for="(page, index) in pages" :key="index">第{{index + 1}}页:
{{JSON.stringify(page, null, 4)}}</pre>
        </Browser>
    </Doc>
</template>
<script>
import {MyHistory} from 'my-router-history'

export default {
    data(){
        return {
            pages: []
        }
    },
    mounted(){
        this.myHistory = window.myHistory = new MyHistory({}, this.$refs.Browser1.window)
        this.pages = JSON.parse(JSON.stringify( this.myHistory.stack))

        this.myHistory.onChange = ()=>{
            this.pages = JSON.parse(JSON.stringify( this.myHistory.stack))
        }
    },
    methods: {
        async goTest(){
            await this.myHistory.push('/test')
        }
    }
}
</script>
