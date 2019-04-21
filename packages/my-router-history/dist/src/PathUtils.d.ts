import { Location } from './model/Location';
/**
 * 增加'/'到path
 * @export
 * @param {string} path
 * @returns {string}
 */
export declare function addLeadingSlash(path: string): string;
/**
 * 将一个path转为location对象形式
 * @export
 * @param {string} path
 * @param {any} state
 * @returns {ILocation}
 */
export declare function parsePath(path: string): Location;
