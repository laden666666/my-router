<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>卡片名称</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
                {{'列表内容 ' + o }}
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data: function(){
        return {
            routeList: []
        }
    },
    created(){
        this.$router.addBeforeUpdateListener(()=>{
            this.$nextTick(()=>{
                var routeList = []
                for(let item of this.$router.stateCache.map){
                    routeList.push(item )
                }
            })

            routeList.sort((item1, item2)=> item1.routerURL > item2.routerURL ? 1 : -1)
        })

        this.routeList = routeList
    },
}
</script>

<style scoped>

</style>
