declare var require: any

import { RouterManager, RouterAction, Route, RouteData}  from './router/'

//通过DefinePlugin对去package.json的版本
declare const PLUGIN_VERSION: string;
const version = PLUGIN_VERSION

export {
    //路由相关
    RouterManager, RouterAction, Route, RouteData,
    version
}
