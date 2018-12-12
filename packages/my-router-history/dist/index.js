(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["my-router-history"] = factory();
	else
		root["my-router-history"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(5)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 3 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(17);
var IE8_DOM_DEFINE = __webpack_require__(18);
var toPrimitive = __webpack_require__(20);
var dP = Object.defineProperty;

exports.f = __webpack_require__(0) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function __export(m) {
    for (var p in m) {
        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(7));

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _classCallCheck2 = __webpack_require__(8);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(9);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });

var MyHistory = function () {
    function MyHistory() {
        var _this = this;

        (0, _classCallCheck3.default)(this, MyHistory);

        this._state = 0;
        this.list = [];
        this.initGoBack();
        // 初始化时间
        var now = Date.now();
        // uid
        var uid = 0;
        var list = this.list;
        // 初始化
        history.replaceState(now - 1, '返回', '#goback');
        document.title = '返回';
        list.push({
            time: now - 1,
            url: '#goback'
        });
        history.pushState(now, '初始化完成', '#/_=' + uid);
        document.title = '';
        list.push({
            time: now,
            url: '#/'
        });
        sessionStorage.inited = true;
        this._state = 1;
        // 路由事件消化
        var eventList = [];
        var timeout = void 0;
        function nextTick(fn) {
            eventList.push(fn);
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                eventList = eventList.filter(function (fn) {
                    try {
                        fn();
                    } catch (error) {
                        console.log(error);
                    }
                    return false;
                });
            }, 50);
        }
        window.onpopstate = function () {
            clearTimeout(timeout);
            eventList = eventList.filter(function (fn) {
                try {
                    fn();
                } catch (error) {
                    console.error(error);
                }
                return false;
            });
        };
        var issafariBrowser = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        // 是否
        window.onhashchange = function () {
            if (_this._state == 2 || _this._state == 3) {
                return;
            } else if (_this._state == 1) {
                var hash = location.hash;
                if (hash == '#goback' && history.state && history.state == list[0].time) {
                    if (list.length > 2) {
                        var page = list[list.length - 2];
                        history.pushState('', page.time, page.url);
                        list.splice(list.length - 1);
                    } else {
                        var _page = list[1];
                        history.pushState('', _page.time, _page.url);
                    }
                } else if (!~hash.indexOf('_=') || hash.split('_=')[1] != uid + '' || !history.state) {
                    // 判断是否是合法生成的hash，主要看系统变量。判断方法如下：
                    // 1.没有系统变量一定是不合法的hash。
                    // 2.如果系统变量有，但是id部分不等于当前的uid，表示不是现生成的，且没有state（生成时间）。
                    // 3.如果系统变量等于当前的uid，但是不等于hash，表示是修改过的。
                    // 当遇到这种情况，后退到两步到goback页面，然后再将url生成系统的url，前进到该地址。这个过程中忽略其他路由
                    var _hash = hash.split('_=')[0];
                    _this._state = 3;
                    if (!issafariBrowser) {
                        history.go(-2);
                        nextTick(function () {
                            var now = Date.now();
                            history.pushState(now, '', (_hash || '#') + '_=' + ++uid);
                            list.push({
                                time: now,
                                url: (_hash || '#') + '_=' + uid
                            });
                            _this._state = 1;
                        });
                    } else {
                        history.back();
                        nextTick(function () {
                            setTimeout(function () {
                                history.back();
                                nextTick(function () {
                                    var now = Date.now();
                                    history.pushState(now, '', (_hash || '#') + '_=' + ++uid);
                                    list.push({
                                        time: now,
                                        url: (_hash || '#') + '_=' + uid
                                    });
                                    _this._state = 1;
                                });
                            });
                        });
                    }
                }
            }
        };
    }

    (0, _createClass3.default)(MyHistory, [{
        key: "initGoBack",

        // 初始化goBack
        value: function initGoBack() {
            if (!sessionStorage.getItem('initGoBack') || typeof history.state != 'number') {
                // 让goback页面比当前页面的时间戳小,这样能够判断出是后退
                history.replaceState(Date.now() - 1, '', '#goback');
                // 使用时间戳做页面的state
                history.pushState(Date.now(), '');
                sessionStorage.setItem('initGoBack', 'true');
            }
        }
        // 初始化URL

    }, {
        key: "initURL",
        value: function initURL() {
            if (!location.hash || !this._testHash(location.hash)) {
                history.replaceState(Date.now() - 1, '', this._hash2URL(location.hash || '#'));
            }
        }
    }, {
        key: "baseURL",
        value: function baseURL() {
            return location.pathname + location.search;
        }
    }, {
        key: "_testHash",
        value: function _testHash(hash) {
            return (/^#(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?/.test(hash) && (~hash.indexOf('?_') || ~hash.indexOf('&_'))
            );
        }
    }, {
        key: "_hash2URL",
        value: function _hash2URL(hash) {
            if (~hash.indexOf('?')) {
                return hash + '&_=' + this._sysID++;
            } else {
                return hash + '?_=' + this._sysID++;
            }
        }
        // 初始化

    }, {
        key: "init",
        value: function init() {
            // 记录用户跳转页面的时间
            var now;
            // 
            var hash;
            window.addEventListener('popstate', function () {
                // 如果页面没有state,说明用户直接输入URL前进.忽略这个页面
                if (history.state) {
                    // 比较
                    if (Date.now() - now < 100) {
                        console.log(Date.now(), '', hash);
                        history.pushState(Date.now(), '', hash + '?=' + now);
                    }
                }
            }, true);
            window.addEventListener('hashchange', function () {
                // 当hash发生变化的时候,认为是用户直接输入的url.然后向后跳转2个位置,并记录一下跳转发生的时间
                now = Date.now();
                // 
                hash = location.hash;
                if (!~hash.indexOf('_')) {
                    history.go(-2);
                }
            }, false);
        }
    }, {
        key: "assign",
        value: function assign(url) {}
    }, {
        key: "goback",
        value: function goback() {}
    }, {
        key: "replace",
        value: function replace() {}
    }, {
        key: "reload",
        value: function reload() {}
    }], [{
        key: "instance",
        value: function instance() {
            if (!this._instance) {
                this._instance = new MyHistory();
            }
            return this._instance;
        }
    }]);
    return MyHistory;
}();

exports.MyHistory = MyHistory;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(10);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(11), __esModule: true };

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(12);
var $Object = __webpack_require__(3).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(13);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(0), 'Object', { defineProperty: __webpack_require__(4).f });


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var core = __webpack_require__(3);
var ctx = __webpack_require__(14);
var hide = __webpack_require__(16);
var has = __webpack_require__(22);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(15);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(4);
var createDesc = __webpack_require__(21);
module.exports = __webpack_require__(0) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(1);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(0) && !__webpack_require__(5)(function () {
  return Object.defineProperty(__webpack_require__(19)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(1);
var document = __webpack_require__(2).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(1);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map