export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

// 对window.confirm对回调，用于window上面没有alert等情况？
export function getConfirmation(message, callback) {
  callback(window.confirm(message)); // eslint-disable-line no-alert
}

/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */
// 判断浏览器是否支持HTML5的replaceState、pushSatate、onpopstate等方法
export function supportsHistory() {
  const ua = window.navigator.userAgent;

  // 安装2系列不支持。安装2系列和4.0不支持。Mobile Safari中不带Chrome和Windows Phone不支持，难到有safari跑到了按照和winphoe？？？？
  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  )
    return false;

    //直接看window的history有米有pushState最靠谱
  return window.history && 'pushState' in window.history;
}

/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */
// 经实验除了ie10、ie11外的浏览器都在hashchange的时候触发popstate事件
export function supportsPopStateOnHashChange() {
  return window.navigator.userAgent.indexOf('Trident') === -1;
}

/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */
// 没试验过这种场景
export function supportsGoWithoutReloadUsingHash() {
  return window.navigator.userAgent.indexOf('Firefox') === -1;
}

/**
 * Returns true if a given popstate event is an extraneous WebKit event.
 * Accounts for the fact that Chrome on iOS fires real popstate events
 * containing undefined state when pressing the back button.
 */
// 没遇到过这种情况
export function isExtraneousPopstateEvent(event) {
  event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
}

declare function setImmediate(fn: Function)
/**
 * 在下一个任务队列中执行
 * @export
 * @param {Function} cb         回调函数
 * @param {Object} [ctx] 
 */
export function nextTick (cb: Function, ctx?: Object) {
    let callback = ()=>{
        if(typeof cb === 'function'){
            cb.call(ctx)
        }
    }

    if (typeof setImmediate !== 'undefined') {
        setImmediate(callback)
    } else if (typeof MessageChannel !== 'undefined' 
        && (/native code/.test(MessageChannel.toString()) || MessageChannel.toString() === '[object MessageChannelConstructor]')) {
        const channel = new MessageChannel()
        const port = channel.port2
        channel.port1.onmessage = callback
        port.postMessage(1)
    } else {
        setTimeout(callback, 0)
    }
}