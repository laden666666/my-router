<template>
    <keep-alive>
        <component :is="currentView" :key="key">
            <!-- 非活动组件将被缓存！ -->
        </component>
    </keep-alive>
</template>

<script>
    export default {
    }
</script>