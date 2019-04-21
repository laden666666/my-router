/**
 * 一个浏览记录的对象的封装，参考了window.location对象
 * @export
 * @interface Location
 */
export interface Location{
    // hash字段，字段名取自widow.location.hash
    hash: string,
    // 路径字段，字段名取自widow.location.pathname
    pathname: string,
    // 查询参数字段，字段名取自widow.location.search
    search: string,
    // 一个id，用于区分href相同的location
    key: string,
    // 获取一个完整的url
    readonly href: string,
}