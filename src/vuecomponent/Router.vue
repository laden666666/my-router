<template>
  <keep-alive>
    <component :is="currentView" :key="pageId">
    </component>
  </keep-alive>
</template>
<script type="text/ecmascript-6">
//  const ERR_OK = 0;
  export default {
    data() {
    },
    created() {
    },
    components: {
    }
  };
</script>
