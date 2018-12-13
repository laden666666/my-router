import resolvePathname from 'resolve-pathname';
import valueEqual from 'value-equal';

import { parsePath } from './PathUtils';

/**
 * 
 * @export
 * @param {any} path href字符串或者location对象
 * @param {any} state history的state
 * @param {any} key 猜测是一个标记location的key
 * @param {any} currentLocation 当前的location对象，用于解析出相对路径
 * @returns 
 */
export function createLocation(path, state, key, currentLocation) {
  let location;
  // 如果path是字符串，将其封装成location
  if (typeof path === 'string') {
    // Two-arg form: push(path, state)
    location = parsePath(path);
    location.state = state;
  } else {
    // 如果path不是字符串，认为他是location，
    // One-arg form: push(location)
    location = { ...path };

    // 规范化传入的location的pathname、search、hash。如果存在这些数据，索性置为“”，反正后面会根据
    if (location.pathname === undefined) location.pathname = '';

    if (location.search) {
      if (location.search.charAt(0) !== '?')
        location.search = '?' + location.search;
    } else {
      location.search = '';
    }

    if (location.hash) {
      if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
    } else {
      location.hash = '';
    }

    if (state !== undefined && location.state === undefined)
      location.state = state;
  }

  try {
    // 将不符合URL规范的字符做URL编码。如果不能做URL编码抛出异常
    location.pathname = decodeURI(location.pathname);
  } catch (e) {
    if (e instanceof URIError) {
      throw new URIError(
        'Pathname "' +
          location.pathname +
          '" could not be decoded. ' +
          'This is likely caused by an invalid percent-encoding.'
      );
    } else {
      throw e;
    }
  }

  // location的key应该是自定义的内容，用于标记location使用
  if (key) location.key = key;

  if (currentLocation) {
    // Resolve incomplete/relative pathname relative to current location.
    // 如果传入的当前的location对象，需要用其解析出先对路径
    if (!location.pathname) {
      location.pathname = currentLocation.pathname;
    } else if (location.pathname.charAt(0) !== '/') {
      location.pathname = resolvePathname(
        location.pathname,
        currentLocation.pathname
      );
    }
  } else {
    // When there is no prior location and pathname is empty, set it to /
    // 如果没有pathname，就用根路径
    if (!location.pathname) {
      location.pathname = '/';
    }
  }

  return location;
}

/**
 * 判断两个location对象是否相等。这里的key是增加的功能，用于区分两个完全一样的url
 * @export
 * @param {any} a 
 * @param {any} b 
 * @returns 
 */
export function locationsAreEqual(a, b) {
  return (
    a.pathname === b.pathname &&
    a.search === b.search &&
    a.hash === b.hash &&
    a.key === b.key &&
    valueEqual(a.state, b.state)
  );
}
