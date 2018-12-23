<doc>
    <h1>my-reoute-history</h1>

    <p><strong>my-reoute-history</strong>是<a href="../../">my-reoute</a>的一个子项目，用于实现在浏览器上高仿APP式的单页面路由。<strong>my-reoute-history</strong>屏蔽了浏览器记录用户历史记录的行为，劫持用户了用户的返回动作，用于开发仿APP交换的SAP。</p>

    <h2>主要功能</h2>

    <p><strong>my-reoute-history</strong>的主要功能如下：</p>
    <li>向浏览器增加返回劫持记录</li>
    <p><strong>my-reoute-history</strong>会自动的向浏览器增加返回劫持记录，用于监听用户的返回行为。如下图用户进入demo应用后，会自动的增加一条名为“返回”的记录。</p>
    <img src="./GIF.gif" alt=""/>

    <li>用户跳转页面后，不产生浏览记录</li>
    <p>浏览器的地址栏会收集用户跳转页面的记录，<strong>my-reoute-history</strong>屏蔽了这一行为。如下图，用户在地址栏输入地址“/demo”后，浏览器中仅存在“返回”一条记录</p>
    <img src="./GIF2.gif" alt=""/>

    <li>返回上一页，地址栏的前进按钮不可用</li>
    <p>浏览器中，用户返回上一页，地址栏的前进按钮就会变为可点击状态，用户点击前进按钮会回到之前的页面。而<strong>my-reoute-history</strong>屏蔽了这一行为。如下图，用户点击返回后，前进按钮仍然是不可用状态。</p>
    <img src="./GIF3.gif" alt=""/>

    <h2>其他功能</h2>
    <p>浏览器地址栏的用户访问的历史记录是开发者不可访问的，<strong>my-reoute-history</strong>还提供了一个虚拟历史记录的功能，让开发者可以访问虚拟的历史记录，并动态的删除、增加用户的访问记录。</p>


    <h2>原理</h2>
    <p><strong>my-reoute-history</strong>实现原理是返回键劫持，当用户打开页面时候，my-reoute-history会动态插入一个返回键劫持页面，用于监听用户的返回动作。同时使用hashchange事件监听url的hash改变。无论用户前进、后退都会先返回到返回页面，然后再由返回页面进行前进、后台、替换的行为。</p>

    <h3>目标是提升用户体验</h3>
    <p>目前返回键劫持主要用于在页面中嵌入广告等不法的操作，而<strong>my-reoute-history</strong>致力于提升用户体验，希望大家能够正确的使用<strong>my-reoute-history</strong>，不要用其做不利于用户的事情。</p>

    <p>目前Chrome浏览器已经开始准备禁止<strong>返回键劫持</strong>，<strong>my-reoute-history</strong>会持续跟进改进。</p>
</doc>