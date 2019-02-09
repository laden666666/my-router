import { ILocation } from './model/ILocation';
/**
 *
 * @export
 * @param {string | ILocation} path href字符串或者location对象
 * @param {any} key 猜测是一个标记location的key
 * @param {ILocation} currentLocation 当前的location对象，用于解析出相对路径
 * @returns
 */
export declare function createLocation(path: string | ILocation, key?: string, currentLocation?: ILocation): ILocation;
/**
 * 创建location的ID
 * @export
 * @param {number} _timeStamp
 * @returns
 */
export declare function crateNo(_timeStamp: number): number;
