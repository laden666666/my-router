<template>
    <div>
        <Button @click="create">创建</Button>

        <Browser ref="Browser">
        </Browser>
    </div>
</template>
<script>
import {MyHistory} from 'my-router-history'

export default {
    methods: {
        async create(){
            try{
                this.myHistory = new MyHistory({}, this.$refs.Browser.window)
            } catch(e){
                alert(e)
            }
        }
    }
}
</script>
