<template>
    <div class="loading-bar">
        <div v-if="justFinished || !finish" class="loading-bar_bar" :style="{width: `${barWidth}%`}"></div>
    </div>
</template>

<script>
    export default {
        props:{
            finish: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                //加载的时间
                time: 0,
                //加载的id
                id: 0,
                //加载完成
                justFinished: false,
            }
        },
        watch:{
            finish(newValue, oldValue){
                if(oldValue == false && newValue == true){
                    //当finish由true变为false时候，开始显示加载动画
                    this.complate()
                    
                } else if(oldValue == true && newValue == false){
                    //当finish由false变为true时候，显示加载完成，渐渐隐藏动画
                    this.timer()
                } 
            }
        },
        computed: {
            barWidth(){
                if(this.finish){
                    return 100
                } else {
                    return (1 - Math.pow(1.1, (-Math.max(this.time - 200, 0) / 1000))) * 90
                }
            }
            
        },
        methods: {
            clearTimer(){
                clearInterval(this._timer)
                clearTimeout(this._closeTimer)
            },
            timer(){
                this.clearTimer()
                this.justFinished = false;
                this.time = 0
                this.$nextTick(()=>{
                    ++this.id
                    this._timer = setInterval(()=>{
                        this.time += 100
                    }, 100)
                })
            },
            complate(){
                this.justFinished = true
                this.clearTimer()
                this._closeTimer =setTimeout(()=>{
                    this.justFinished = false
                    this.time = 0
                }, 300)
            },
        },
    }
</script>

<style lang="scss" scoped>
    .loading-bar{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        z-index: 100000;
    }
    .loading-bar_bar{
        position: absolute;
        top: 0;
        left: 0;
        height: 1px;
        width: 0;
        background-color: #66CCFF;
        transition: width .2s;
    }
</style>


