import { _Location } from './API';
/**
 *
 * @export
 * @param {string | _Location} path href字符串或者location对象
 * @param {any} key 猜测是一个标记location的key
 * @param {_Location} currentLocation 当前的location对象，用于解析出相对路径
 * @returns
 */
export declare function createLocation(path: string | _Location, key?: string, currentLocation?: _Location): _Location;
/**
 * 创建location的ID
 * @export
 * @param {number} _timeStamp
 * @returns
 */
export declare function crateNo(_timeStamp: number): number;
