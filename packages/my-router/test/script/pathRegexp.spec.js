import {PathRegexp} from '../../src/core/PathRegexp'

describe('路由的PathRegexp模块测试', function() {

    it('初始化测试', function() {
        const pathRegexp = new PathRegexp();
    });

    it('增加路由配置测试', function() {
        const pathRegexp = new PathRegexp();
        
        pathRegexp.addRoute({
            path: '/xxx',
            meta: 1
        })

        let routeRsult = pathRegexp.recognize('/xxx')
        assert.deepEqual(routeRsult.routeConfig.meta, 1)
        
    });
    
    it('查询参数测试', function() {
        const pathRegexp = new PathRegexp();
        
        pathRegexp.addRoute({
            path: '/xxx',
            meta: 1
        })

        let routeRsult = pathRegexp.recognize('/xxx?a=1')
        assert.deepEqual(routeRsult.queryData, {a: '1'})
        assert.deepEqual(routeRsult.routeConfig.meta, 1)
        
    });
    
    it('路径参数测试', function() {
        const pathRegexp = new PathRegexp();
        
        pathRegexp.addRoute({
            path: '/xxx/:a',
            meta: 1
        })

        let routeRsult = pathRegexp.recognize('/xxx/1')
        assert.deepEqual(routeRsult.pathData, {a: '1'})
        assert.deepEqual(routeRsult.routeConfig.meta, 1)

        routeRsult = pathRegexp.recognize('/xxx/1/1')
        assert.deepEqual(routeRsult, null)
    });

    it('*表示无限级路径测试', function() {
        const pathRegexp = new PathRegexp();
        
        pathRegexp.addRoute({
            path: '/xxx/*',
            meta: 1
        })

        let routeRsult = pathRegexp.recognize('/xxx/1')
        assert.isNotNull(routeRsult)

        routeRsult = pathRegexp.recognize('/xxx/1/1')
        assert.isNotNull(routeRsult)
        
        routeRsult = pathRegexp.recognize('/xxx/')
        assert.isNull(routeRsult)
    });
    
    it('配置优先级测试，后配置的先匹配了', function() {
        const pathRegexp = new PathRegexp();
        
        pathRegexp.addRoutes([{
            path: '/xxx/:a',
            meta: 1
        }, {
            path: '/xxx/1',
            meta: 2
        }, {
            path: '*',
            meta: 3
        }, {
            path: '/xxx/*',
            meta: 4
        }, {
            path: '/xxx/1',
            meta: 5
        }, ])


        let routeRsult = pathRegexp.recognize('/xxx/a')
        assert.deepEqual(routeRsult.pathData, {a:'a'})
        assert.deepEqual(routeRsult.routeConfig.meta, 1)

        routeRsult = pathRegexp.recognize('/xxx/1')
        assert.deepEqual(routeRsult.pathData, {})
        assert.deepEqual(routeRsult.routeConfig.meta, 5)

        routeRsult = pathRegexp.recognize('/xxx')
        assert.deepEqual(routeRsult.pathData, {})
        assert.deepEqual(routeRsult.routeConfig.meta, 3)
        
        routeRsult = pathRegexp.recognize('/xxx/aaa/sfsd')
        assert.deepEqual(routeRsult.pathData, {})
        assert.deepEqual(routeRsult.routeConfig.meta, 4)
        
        routeRsult = pathRegexp.recognize('/aaa/sfsd')
        assert.deepEqual(routeRsult.pathData, {})
        assert.deepEqual(routeRsult.routeConfig.meta, 3)
    });

});
