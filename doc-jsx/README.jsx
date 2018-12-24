<doc>
    <h1>my-router</h1>
    <p>在服务器端，路由是根据不同的Url路由，拼接出对应的视图页面。前后分离后，路由概念慢慢渗透到客户端，现在连Reac Native、flutter、微信小程序等APP框架也引入了路由的概念。</p>

    <h2>更接近App的WebApp路由系统——my-router</h2>
    <p>目前主流的WebApp路由，都是基于浏览器的地址栏开发的。因为浏览器地址栏将URL暴露给用户，WebApp的路由无法限制（引导）用户的工作流，也无法监听移动设备的返回键，甚至无法阻止用户从缓存的历史记录中跳来跳去。</p>

    <img src="./location.png" alt=""/>
    <img src="./cache.png" alt=""/>

    
    <p><strong>my-router</strong>设计的目的就是寻找一套接近App的WebApp路由系统，我们试图进一步抽象history对象和location对象，屏蔽了浏览器地址栏的一些鸡肋而且容易出现漏洞的功能，限制了用户的一部分自由，但是提高了用户体验，使用户享受到更接近原生APP的的路由系统。而对于程序员，my-router会提供更全面的API，同时让开发者不再受浏览器的束缚，让大家享受路由开发工作。</p>

    <p>WebApp、App与my-router的比较。</p>
    <table>
        <tr>
            <th></th>
            <th>webapp路由</th>
            <th>app路由</th>
            <th>my-router</th>
        </tr>
        <tr>
            <td>URL可见</td>
            <td>是</td>
            <td>否</td>
            <td>是</td>
        </tr>
        <tr>
            <td>URL可改</td>
            <td>能</td>
            <td>不能</td>
            <td><strong>可选</strong></td>
        </tr>
        <tr>
            <td>查看浏览记录</td>
            <td>按住返回键可查看历史记录</td>
            <td>无</td>
            <td><strong>无</strong></td>
        </tr>
        <tr>
            <td>可以前进</td>
            <td>可以</td>
            <td>不可以</td>
            <td><strong>不可以</strong></td>
        </tr>
        <tr>
            <td>可以后退</td>
            <td>可以</td>
            <td>安卓可以，IOS不提供全局返回键</td>
            <td>可以</td>
        </tr>
        <tr>
            <td>可以监听后退事件</td>
            <td>不能</td>
            <td>能</td>
            <td><strong>能</strong></td>
        </tr>
        <tr>
            <td>用户可以刷新</td>
            <td>可以</td>
            <td>不可用</td>
            <td>可以</td>
        </tr>
    </table>

    <h2><a href="./packages/my-router-history">my-router-history</a></h2>
    <p>一个屏蔽了浏览器地址栏的诸多特性的history库，用于实现在浏览器上高仿APP式的单页面路由。<strong>my-reoute-history</strong>屏蔽了浏览器记录用户历史记录的行为，劫持用户了用户的返回动作，用于开发仿APP交换的SAP</p>
    <p>该项目并不依赖<strong>my-router</strong>，因此如果你感兴趣开发一个APP式的路由，可以直接参考甚至使用<strong>my-reoute-history</strong>。</p>
</doc>