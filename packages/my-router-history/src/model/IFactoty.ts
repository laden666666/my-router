/**
 * 创建history实例，需要注意的是，history是一个单例(因为location和URL一个页面只能有一个，当一个history获得这个资源后，不应该再允许下一个history对象试图获取这个资源)，必须要将当前的history对象销毁，才能再创建下一个history对象
 * @export
 * @interface IFactory
 */
export interface IFactory{

}