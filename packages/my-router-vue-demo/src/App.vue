<template>
    <div id="app">
        <my-router-view></my-router-view>
        <RouterView></RouterView>
    </div>
</template>

<script>
    import RouterView from "./RouterView.vue";
    export default {
        name: 'app',
        components: {
            RouterView
        }
    }
</script>

<style>
    body {
        background-color: #fbf9fe;
    }

    .page{
        padding: 5px 20px;
    }
</style>