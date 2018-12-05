<template>
    <component :is="pageComponent" :key="name"
        ref="showPage">
    </component>
</template>
<script>
export default {
    props: {
        pageComponent: {
            isRequired: true
        },
        name: {
            isRequired: true
        },
    },
    provide () {
        return {
            myRoutePage: this
        }
    },
    computed: {
        $route(){
            return routeData
        }
    }
}
</script>
