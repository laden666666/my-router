/**
 * 一个浏览记录的对象的封装，参考了window.location对象
 * @export
 * @interface ILocation
 */
export interface ILocation {
    hash: string;
    pathname: string;
    search: string;
    key: string;
    readonly href: string;
}
