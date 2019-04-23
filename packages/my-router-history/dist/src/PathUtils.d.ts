import { _Location } from "./API";
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
export declare function parsePath(path: string): _Location;
