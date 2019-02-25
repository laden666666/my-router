<template>
    <Doc>
        <H1>my-router</H1>
        <P>在服务器端，路由是根据不同的Url路由，拼接出对应的视图页面技术。前后分离后，路由概念慢慢渗透到前端，现在连Reac Native、flutter、微信小程序等App框架也引入了路由的概念。</P>

        <H2>安装</H2>
        <P>暂未开放npm安装</P>
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
}
</script>
