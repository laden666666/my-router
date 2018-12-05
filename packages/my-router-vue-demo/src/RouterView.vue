<template>
    <div class="router-state-view">
        <span class="tip">路由保存的信息</span>
        <div class="card" v-for="route in routeList" 
                :key="route.routerURL.id" 
                :class="{current: currentId == route.routerURL.id}">
            <dl class="dl">
                <dt class="dt">路由ID:</dt>
                <dd class="dd">{{route.routerURL.id}}</dd>
                
                <dt class="dt">当前路径path:</dt>
                <dd class="dd">{{route.routerURL.path}}</dd>
                
                <dt class="dt">查询参数:</dt>
                <dd class="dd">{{JSON.stringify(route.routerURL.queryMap, null, 4)}}</dd>
                
                <dt class="dt">返回值backValue:</dt>
                <dd class="dd">{{route.backValue}}</dd>
            </dl>
        </div>
    </div>
</template>

<script>

function clone(obj){
    return JSON.parse(JSON.stringify(obj))
}

export default {
    data: function(){
        return {
            routeList: [],
            currentId: ''
        }
    },
    created(){
        setInterval(()=>{
            this.update()
        }, 500)
        window.r = this.$router
    },
    methods: {
        update(){
            // stateCache是私有函数，本dom外不可用调用
            var routeList = []
            for(let item of this.$router.stateCache.map){
                routeList.push({
                    backValue: item[1].backValue,
                    routerURL:  clone(item[1].routerURL),
                })
            }
            routeList.sort((item1, item2)=> item1.routerURL > item2.routerURL ? 1 : -1)
            this.routeList = routeList

            this.currentId = this.$router.stateCache.currentId
        }
    },
}
</script>

<style scoped>
    .router-state-view{
        position: fixed;
        bottom: 0;
        left: 0;
        display: flex;
        padding: 10px;
        width: 100%;
        background-color: #fff;
        box-shadow: 0 -1px 5px rgba(0, 0, 0, .6);
    }
    .tip{
        position: absolute;
        top: -13px;
        left: 30px;
        background-color: #fff;
    }
    .card{
        margin: 10px 20px;
        width: 200px;
        padding: 10px;
        box-shadow: 0 0 5px rgb(0, 0, 0);
        font-size: 12px;
    }
    .card.current{
        box-shadow: 0 0 5px rgb(255, 0, 0);
    }
    .dl{
        display: flex;
        flex-wrap: wrap;
    }
    .dt{
        font-weight: bold;
        width: 100%;
    }
    .dd{
        width: 100%;
        padding-left: 15px;
        box-sizing: border-box;
    }
</style>
