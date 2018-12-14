import {ILocation} from './model/ILocation'

/**
 * 增加'/'到path
 * @export
 * @param {string} path 
 * @returns {string} 
 */
export function addLeadingSlash(path: string): string {
    return path.charAt(0) === '/' ? path : '/' + path;
}

/**
 * 移除path的根'/'
 * @export
 * @param {string} path 
 * @returns {string} 
 */
export function stripLeadingSlash(path: string): string {
    return path.charAt(0) === '/' ? path.substr(1) : path;
}

/**
 * 判断path是否是使用baseURL
 * @export
 * @param {string} path 
 * @param {string} prefix 
 * @returns {string} 
 */
export function hasBasename(path: string, prefix: string): boolean {
    return new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i').test(path);
}

/**
 * 移除path中的baseURL
 * @export
 * @param {string} path 
 * @param {string} prefix 
 * @returns {string} 
 */
export function stripBasename(path: string, prefix: string): string {
    return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
}

/**
 * 移除path最后的'/'
 * @export
 * @param {string} path 
 * @returns {string} 
 */
export function stripTrailingSlash(path: string): string {
    return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
}

/**
 * 将一个path转为location对象形式
 * @export
 * @param {string} path 
 * @returns {ILocation} 
 */
export function parsePath(path: string): ILocation {
    let pathname = path || '/';
    let search = '';
    let hash = '';

    const hashIndex = pathname.indexOf('#');
    if (hashIndex !== -1) {
        hash = pathname.substr(hashIndex);
        pathname = pathname.substr(0, hashIndex);
    }

    const searchIndex = pathname.indexOf('?');
    if (searchIndex !== -1) {
        search = pathname.substr(searchIndex);
        pathname = pathname.substr(0, searchIndex);
    }

    let location: ILocation = {
        pathname,
        search: search === '?' ? '' : search,
        hash: hash === '#' ? '' : hash,
        key: '',
        get href(){
            return this.pathname + this.search + this.hash
        }
    };

    return location
}

/**
 * 将一个location对象转为path对象
 * @export
 * @param {ILocation} location 
 * @returns {string} 
 */
export function createPath(location: ILocation): string {
    const { pathname, search, hash } = location;

    let path = pathname || '/';

    if (search && search !== '?')
        path += search.charAt(0) === '?' ? search : `?${search}`;

    if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : `#${hash}`;

    return path;
}
