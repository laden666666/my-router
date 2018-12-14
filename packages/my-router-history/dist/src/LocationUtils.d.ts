import { ILocation } from './model/ILocation';
/**
 *
 * @export
 * @param {string | ILocation} path href字符串或者location对象
 * @param {any} state history的state
 * @param {any} key 猜测是一个标记location的key
 * @param {ILocation} currentLocation 当前的location对象，用于解析出相对路径
 * @returns
 */
export declare function createLocation(path: string | ILocation, key?: string, currentLocation?: ILocation): ILocation;
/**
 * 判断两个location对象是否相等。这里的key是增加的功能，用于区分两个完全一样的url
 * @export
 * @param {any} a
 * @param {any} b
 * @returns
 */
export declare function locationsAreEqual(a: ILocation, b: ILocation): boolean;
