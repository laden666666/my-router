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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var LocationUtils_1 = __webpack_require__(4);
var PathUtils_1 = __webpack_require__(1);
var DOMUtils_1 = __webpack_require__(6);
var Deferred_1 = __webpack_require__(10);
var MY_ROUTER_HISTORY_GOBACK_INIT = 'MyRouterHistory:initGoback';
// 记录MyHistory在默认window上的实例数，确保constructor仅能够运行一个实例
var MY_ROUTER_HISTORY_WINDOW_INIT = 'MyRouterHistory:window';
var locationKey = Symbol('location');
/**
 * 用于mixin的基类
 */
var baseHistoryState = {
    push: null,
    replace: null,
    goback: null,
    reload: null
};

var MyHistory = function () {
    function MyHistory(_config) {
        var _window = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;

        _classCallCheck(this, MyHistory);

        this._config = _config;
        // 当前history的状态：
        // 0未初始化    history没有完成初始化的时候
        // 1正常        history正常运行中
        // 2修正中      当用户手动修改hash，会被视为一次用户触发的跳转。此次跳转会先退回到goback页面，再前进回跳转的页面（为了保持history在浏览器中仅有两个浏览器记录——当前页面和退回页面），这个过程我们叫修改中
        // 3返回中      当用户要求跳转回退，或者正在回退
        // 4销毁中      在history销毁过程中的状态。
        // 5退出中      当用户要求退出到系统以外，系统会一直触发goback，直到页面刷新为止
        // 6跳转中      当用户要求跳转（包括push、replace、reload）
        // 7跳转中      执行生命周期中
        this._state = Object.assign({}, baseHistoryState, { type: 0, hashChange: function hashChange() {}
        });
        // 保存location数据的栈
        this._stateStack = [];
        /**
         * 如果在beforeChange生命周期，出现了跳转，会在路由重新回归1的时候执行。
         * 如果_notBusyDef已经存在，即使是在beforeChange生命周期（state为7）的时候，也不可以跳转
         * @private
         * @type {Deferred}
         * @memberOf MyHistory
         */
        this._notBusyDef = null;
        this.onBeforeChange = null;
        this.onChange = null;
        this._win = _window;
        if (this._win[MY_ROUTER_HISTORY_WINDOW_INIT]) {
            // 同一时刻，在默认的window上面，不允许有两个history实例运行
            throw new Error('There are already other undestroyed history instances. Please destroy them before you can create a new history instance.');
        }
        this._config = Object.assign({ gobackName: 'go back', root: '/', insertRoot: true }, _config);
        this._hashchangeHandler = this._hashchangeHandler.bind(this);
        this._initHistory();
    }

    _createClass(MyHistory, [{
        key: "_initGoback",

        /**
         * 初始化goback的location
         * goback的location有2个作用：
         * 1.用于监听用户的返回事件，当用户点击地址栏的返回按钮，会退回到goback的location。由goback去处理用户注册的goback事件
         * 2.当用户手动修改浏览器的location的hash时候，history会增加一条location记录，这时候myhistory会先退回到goback的location，再前进到用户输入的lactation中，这样可以清除浏览器地址栏的前进按钮
         * @private
         * @param {number} now      初始化时候的时间戳
         * @returns {boolean}       是否是goback处于上一页。返回false表示当前就是goback页面。
         * @memberOf MyHistory
         */
        value: function _initGoback(now) {
            // 先查看是否已经创建好了一个goback的location，因为浏览器中无法查看history对象里面保存的历史记录，所以使用history.state保存这个状态。
            // state里面用于记录当前是否处于goback的下一页。
            // 让goback比当前时间戳小，这样能够判断出是后退
            this._gobackState = this._pathToState('/goback', undefined, 'GOBACK', now - 1);
            var state = this._win.history.state;
            if (state && state.type === 'GOBACK' && sessionStorage[MY_ROUTER_HISTORY_GOBACK_INIT]) {
                // 如果当前页面是goback，表示goback已经初始化完成
                return false;
            } else if (state && state.type === 'NORMAL' && sessionStorage[MY_ROUTER_HISTORY_GOBACK_INIT]) {
                // 因为目前还处于goback页面，所有返回false
                return true;
            } else {
                sessionStorage[MY_ROUTER_HISTORY_GOBACK_INIT] = true;
                this._replaceState(this._gobackState);
                return false;
            }
        }
        // 初始化URL

    }, {
        key: "_initHistory",
        value: function _initHistory() {
            var _this = this;

            // 创建hash路由
            if (!DOMUtils_1.canUseDOM) {
                throw new Error('Hash history needs a DOM');
            }
            // 获取当前时间戳
            var timeStamp = Date.now();
            // 获取当前的路径，将其转换为合法路径后，
            var initialPath = this._decodePath(this._getHrefToPath());
            var initialLocationState = this._pathToState(initialPath, undefined, 'NORMAL', timeStamp);
            // 初始化goback
            var isGobackNextLocation = this._initGoback(timeStamp);
            // 将当前路径压入栈中
            this._push(initialLocationState, !isGobackNextLocation);
            // 如果第一个节点不等于根的路径，插入根节点到栈底
            if (this._config.insertRoot && this._stackTop.location.href !== this._config.root) {
                this._stateStack.unshift(this._pathToState(this._config.root, undefined, 'NORMAL', timeStamp));
            }
            // 初始化监听器
            this._initEventListener();
            // 全部初始化完成，记录初始化成功
            this._win[MY_ROUTER_HISTORY_WINDOW_INIT] = true;
            this._switchState(1);
            // 使用微队列，用于异步初始化
            Promise.resolve().then(function () {
                var newState = _this._readonlyLocation(initialLocationState);
                _this._execCallback(_this.onChange)('init', null, newState, [], [newState]);
            });
        }
        /**
         * 注册到HashChange事件的监听器。这个函数会在构造器中bind，以在addEventListener保持this不变
         * @private
         * @param {HashChangeEvent} event
         * @memberOf MyHistory
         */

    }, {
        key: "_hashchangeHandler",
        value: function _hashchangeHandler(event) {
            this._state.hashChange(event);
        }
    }, {
        key: "_initEventListener",
        value: function _initEventListener() {
            // 注册
            this._win.addEventListener('hashchange', this._hashchangeHandler);
        }
    }, {
        key: "_destroyEventListener",
        value: function _destroyEventListener() {
            this._win.removeEventListener('hashchange', this._hashchangeHandler);
        }
        /**
         * 切换状态
         * @private
         * @param {any} stateType
         * @memberOf MyHistory
         */

    }, {
        key: "_switchState",
        value: function _switchState(stateType) {
            var _this3 = this;

            // 处理beforeChange中的取消逻辑。如果用户返回false、Error、Function都视为取消跳转。其中Function会在跳转结束后自执行
            var handleCancell = function handleCancell(result) {
                var _this2 = this;

                var isFalse = result === false,
                    isFunction = typeof result === 'function';
                if (isFalse || isFunction) {
                    // 这里用任务队列而不用微任务队列，希望整个promise执行完再执行result
                    if (isFunction) {
                        DOMUtils_1.nextTick(function () {
                            result.call(_this2);
                        });
                    }
                    // 抛出用户取消异常
                    var error = new Error('User cancelled');
                    error.isCancelled = true;
                    throw error;
                } else if (result instanceof Error) {
                    throw result;
                }
            };
            // 简单原型函数名，增加压缩效率
            var toReadonly = this._readonlyLocation.bind(this);
            switch (stateType) {
                case 1:
                    this._state = {
                        type: 1,
                        push: function () {
                            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(path, data) {
                                var state, newLocation, oldLocation, result;
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                _this3._checkData(data);
                                                // 先切换到状态6，保护在跳转过程中不受其他操作影响
                                                _this3._switchState(6);
                                                _context.prev = 2;
                                                state = _this3._pathToState(path, data, 'NORMAL');
                                                newLocation = toReadonly(state);
                                                oldLocation = toReadonly(_this3._stackTop);
                                                _context.next = 8;
                                                return _this3._execCallback(_this3.onBeforeChange)('push', oldLocation, newLocation, [], [newLocation]);

                                            case 8:
                                                result = _context.sent;

                                                // 处理取消情况
                                                handleCancell(result);
                                                _this3._push(state);
                                                // 确保跳转完成
                                                _context.next = 13;
                                                return new Promise(function (r) {
                                                    return DOMUtils_1.nextTick(r);
                                                });

                                            case 13:
                                                _context.next = 15;
                                                return _this3._execCallback(_this3.onChange)('push', oldLocation, newLocation, [], [newLocation]);

                                            case 15:
                                                _this3._switchState(1);
                                                return _context.abrupt("return", _this3._readonlyLocation(state));

                                            case 19:
                                                _context.prev = 19;
                                                _context.t0 = _context["catch"](2);

                                                // 完成后切换状态1
                                                _this3._switchState(1);
                                                throw _context.t0;

                                            case 23:
                                            case "end":
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, _this3, [[2, 19]]);
                            }));

                            return function push(_x2, _x3) {
                                return _ref.apply(this, arguments);
                            };
                        }(),
                        replace: function () {
                            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(path, data) {
                                var now, state, newLocation, oldLocation, result;
                                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                    while (1) {
                                        switch (_context2.prev = _context2.next) {
                                            case 0:
                                                _this3._checkData(data);
                                                _this3._switchState(6);
                                                _context2.prev = 2;
                                                now = Date.now();
                                                state = _this3._pathToState(path, data, 'NORMAL', now);
                                                newLocation = toReadonly(state);
                                                oldLocation = toReadonly(_this3._stackTop);
                                                _context2.next = 9;
                                                return _this3._execCallback(_this3.onBeforeChange)('replace', oldLocation, newLocation, [oldLocation], [newLocation]);

                                            case 9:
                                                result = _context2.sent;

                                                // 处理取消情况
                                                handleCancell(result);
                                                _this3._replace(state);
                                                // 确保跳转完成
                                                _context2.next = 14;
                                                return new Promise(function (r) {
                                                    return DOMUtils_1.nextTick(r);
                                                });

                                            case 14:
                                                _this3._switchState(1);
                                                _context2.next = 17;
                                                return _this3._execCallback(_this3.onChange)('replace', oldLocation, newLocation, [oldLocation], [newLocation]);

                                            case 17:
                                                return _context2.abrupt("return", _this3._readonlyLocation(state));

                                            case 20:
                                                _context2.prev = 20;
                                                _context2.t0 = _context2["catch"](2);

                                                // 完成后切换状态1
                                                _this3._switchState(1);
                                                throw _context2.t0;

                                            case 24:
                                            case "end":
                                                return _context2.stop();
                                        }
                                    }
                                }, _callee2, _this3, [[2, 20]]);
                            }));

                            return function replace(_x4, _x5) {
                                return _ref2.apply(this, arguments);
                            };
                        }(),
                        goback: function () {
                            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                                var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
                                var oldLocation, discardLoctions, newState, newLocation, needInclude, fn, index, result;
                                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
                                            case 0:
                                                // 先执行生命周期
                                                _this3._switchState(3);
                                                _context3.prev = 1;

                                                // 当前页面
                                                oldLocation = void 0;
                                                // 丢弃的页面

                                                discardLoctions = void 0;
                                                // 退回到的页面

                                                newState = void 0;
                                                // 新建页面

                                                newLocation = void 0;
                                                // 是否有符合退回条件的页面，如果没有插入一条

                                                needInclude = false;
                                                // 判断是否符合页面的条件

                                                fn = void 0;

                                                if (!(typeof n === 'number')) {
                                                    _context3.next = 16;
                                                    break;
                                                }

                                                if (!(n <= 0)) {
                                                    _context3.next = 13;
                                                    break;
                                                }

                                                return _context3.abrupt("return", null);

                                            case 13:
                                                if (n >= _this3._stateStack.length) {
                                                    fn = function fn() {
                                                        return false;
                                                    };
                                                } else {
                                                    fn = function fn(location, index) {
                                                        return _this3._stateStack.length - index - 1 === n;
                                                    };
                                                }

                                            case 14:
                                                _context3.next = 17;
                                                break;

                                            case 16:
                                                if (typeof n === 'string') {
                                                    // 查询有没有href等于n的页面，如果没有就退回到起点，然后插入一条记录
                                                    fn = function fn(location) {
                                                        return location.href === _this3._pathToLocation(n).href;
                                                    };
                                                } else if (typeof n === 'function') {
                                                    fn = n;
                                                }

                                            case 17:
                                                index = _this3._stateStack.findIndex(function (item, index) {
                                                    return fn(toReadonly(item), index);
                                                });

                                                oldLocation = toReadonly(_this3._stackTop);
                                                if (index === -1) {
                                                    // 如果没有找到，就插入一条根节点进去。但是如果查询的是指定页面，就将指定页面放进去
                                                    newState = _this3._pathToState(_this3._pathToLocation(typeof n === 'string' ? n : _this3._config.root), 'NORMAL', undefined);
                                                    newLocation = toReadonly(newState);
                                                    discardLoctions = _this3._stateStack.map(function (item) {
                                                        return toReadonly(item);
                                                    });
                                                    needInclude = true;
                                                } else {
                                                    // 取出退回位置的state
                                                    newState = _this3._stateStack[index];
                                                    newLocation = toReadonly(newState);
                                                    discardLoctions = _this3._stateStack.slice(index + 1).map(function (item) {
                                                        return toReadonly(item);
                                                    }).reverse();
                                                }
                                                _context3.next = 22;
                                                return _this3._execCallback(_this3.onBeforeChange)('goback', oldLocation, newLocation, discardLoctions, needInclude ? [newLocation] : []);

                                            case 22:
                                                result = _context3.sent;

                                                // 处理取消情况
                                                handleCancell(result);
                                                _this3._goback(discardLoctions.length, needInclude ? newState : null, false);
                                                // 确保跳转完成
                                                _context3.next = 27;
                                                return new Promise(function (r) {
                                                    return DOMUtils_1.nextTick(r);
                                                });

                                            case 27:
                                                _this3._switchState(1);
                                                _context3.next = 30;
                                                return _this3._execCallback(_this3.onChange)('goback', oldLocation, newLocation, discardLoctions, needInclude ? [newLocation] : []);

                                            case 30:
                                                return _context3.abrupt("return", _this3._readonlyLocation(newState));

                                            case 33:
                                                _context3.prev = 33;
                                                _context3.t0 = _context3["catch"](1);

                                                // 完成后切换状态1
                                                _this3._switchState(1);
                                                throw _context3.t0;

                                            case 37:
                                            case "end":
                                                return _context3.stop();
                                        }
                                    }
                                }, _callee3, _this3, [[1, 33]]);
                            }));

                            return function goback() {
                                return _ref3.apply(this, arguments);
                            };
                        }(),
                        reload: function reload() {
                            return _this3._state.replace(_this3._stackTop.location.href);
                        },
                        hashChange: function hashChange(event) {
                            var state = _this3._win.history.state;
                            if (state && state.type === 'GOBACK') {
                                // 用户手动退回，前进一个页面，让history的修正
                                _this3._pushState(_this3._stackTop);
                                _this3._state.goback(1);
                            } else if (!state && _this3._getHrefToPath(event.oldURL) === _this3._stateStack[_this3._stateStack.length - 1].location.href) {
                                // 判断是否是用户手动修改hash跳转，或者a标签切换hash。判断方法如下：
                                // 1.当前history没有state，或者state不等于State变量
                                // 2.oldURL等于当前_stateStack栈顶的href（即使这样也不能确定该页面是从系统页面栈顶跳转过来的，但是没有其他更好的方式）
                                // 先切户到手动修正用户修改url的状态2，保留用户要跳转的url
                                _this3._switchState(2);
                                _this3._stateData = _this3._getHrefToPath(event.newURL);
                                // 后退两次，退回到goback页面
                                _this3._win.history.go(-2);
                            } else {
                                // 如果不是从栈顶的url转跳转到该状态，就无法确定返回页面就在当前页面的前面，因此触发修正
                                _this3._correct();
                                // 纠正后重新后退
                                _this3._win.history.back();
                            }
                        }
                    };
                    // 重新置回1，设置_notBusyDef为resolve
                    if (this._notBusyDef) {
                        this._notBusyDef.resolve(undefined);
                        this._notBusyDef = null;
                    }
                    break;
                case 2:
                    this._state = Object.assign({ type: 2 }, baseHistoryState, { hashChange: function hashChange(event) {
                            // 对纠正的处理步骤
                            // 1. 一直后退，直到后退到goback页面
                            // 2. 前进到gobackNext页面，把用户给出的地址放到gobackNext页面中。
                            var state = _this3._win.history.state;
                            if (state && state.type === 'NORMAL') {
                                // 如果当前处于gobackNext页面，表示上一页就是goback，则退回，这主要是为了修改ios的safari那种无法使用go(-2)的浏览器时候的处理方式
                                _this3._win.history.back();
                            } else if (state && state.type === 'GOBACK') {
                                // 如果已经在goback页面了，则跳转到用户手输入的地址
                                var now = Date.now();
                                var _location = _this3._pathToLocation(_this3._stateData, now);
                                // 切回正在状态，这样就完成了对页面的修正
                                _this3._switchState(1);
                                _this3._pushState(_this3._stackTop);
                                _this3._state.push(_location.href);
                            } else {
                                // 在纠正的时候，如果跳转到了goback和gobackNext以外的页面，视为异常，进行异常纠正
                                _this3._correct();
                                // 纠正后重新后退
                                _this3._win.history.back();
                            }
                        } });
                    break;
                case 3:
                case 6:
                    this._state = Object.assign({ type: stateType }, baseHistoryState, { hashChange: function hashChange(event) {
                            if (!_this3._win.history.state && _this3._getHrefToPath(event.oldURL) === _this3._stateStack[_this3._stateStack.length - 1].location.href) {
                                // 如果用户在此期间手动修改url，直接纠正
                                _this3._correct();
                            } else {
                                // 用户手动退回，前进一个页面，让history的修正
                                _this3._pushState(_this3._stackTop);
                            }
                        } });
                    break;
                case 4:
                case 5:
                    this._state = Object.assign({ type: stateType }, baseHistoryState, { hashChange: function hashChange(event) {
                            _this3._win.history.back();
                        } });
                    break;
                case 7:
                    this._state = {
                        type: stateType,
                        hashChange: function hashChange(event) {
                            _this3._win.history.back();
                        },
                        push: function () {
                            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(path, state) {
                                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                    while (1) {
                                        switch (_context4.prev = _context4.next) {
                                            case 0:
                                                _this3._notBusyDef = new Deferred_1.Deferred();
                                                return _context4.abrupt("return", _this3._notBusyDef.promise.then(function () {
                                                    return _this3.push(path, state);
                                                }));

                                            case 2:
                                            case "end":
                                                return _context4.stop();
                                        }
                                    }
                                }, _callee4, _this3);
                            }));

                            return function push(_x7, _x8) {
                                return _ref4.apply(this, arguments);
                            };
                        }(),
                        replace: function () {
                            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(path, state) {
                                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                    while (1) {
                                        switch (_context5.prev = _context5.next) {
                                            case 0:
                                                _this3._notBusyDef = new Deferred_1.Deferred();
                                                return _context5.abrupt("return", _this3._notBusyDef.promise.then(function () {
                                                    return _this3.replace(path, state);
                                                }));

                                            case 2:
                                            case "end":
                                                return _context5.stop();
                                        }
                                    }
                                }, _callee5, _this3);
                            }));

                            return function replace(_x9, _x10) {
                                return _ref5.apply(this, arguments);
                            };
                        }(),
                        goback: function () {
                            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(arg) {
                                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                                    while (1) {
                                        switch (_context6.prev = _context6.next) {
                                            case 0:
                                                _this3._notBusyDef = new Deferred_1.Deferred();
                                                return _context6.abrupt("return", _this3._notBusyDef.promise.then(function () {
                                                    return _this3.goback(arg);
                                                }));

                                            case 2:
                                            case "end":
                                                return _context6.stop();
                                        }
                                    }
                                }, _callee6, _this3);
                            }));

                            return function goback(_x11) {
                                return _ref6.apply(this, arguments);
                            };
                        }(),
                        reload: function () {
                            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                                    while (1) {
                                        switch (_context7.prev = _context7.next) {
                                            case 0:
                                                _this3._notBusyDef = new Deferred_1.Deferred();
                                                return _context7.abrupt("return", _this3._notBusyDef.promise.then(function () {
                                                    return _this3.reload();
                                                }));

                                            case 2:
                                            case "end":
                                                return _context7.stop();
                                        }
                                    }
                                }, _callee7, _this3);
                            }));

                            return function reload() {
                                return _ref7.apply(this, arguments);
                            };
                        }()
                    };
                    break;
            }
        }
        /**
         * 将用户给定的path转为系统显示的path
         * @private
         * @param {string} path         用户给定的path
         * @returns {string}            系统显示的path
         * @memberOf MyHistory
         */

    }, {
        key: "_encodePath",
        value: function _encodePath(path) {
            return PathUtils_1.addLeadingSlash(path);
        }
        /**
         * 将系统显示的path转为用户给定的path
         * @private
         * @param {string} path         系统显示的path
         * @returns {string}            用户给定的path
         * @memberOf MyHistory
         */

    }, {
        key: "_decodePath",
        value: function _decodePath(path) {
            return PathUtils_1.addLeadingSlash(path);
        }
        // 获取hash中保存的路径。

    }, {
        key: "_getHrefToPath",
        value: function _getHrefToPath() {
            var href = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._win.location.href;

            // We can't use window.location.hash here because it's not
            // consistent across browsers - Firefox will pre-decode it!
            var hashIndex = href.indexOf('#');
            return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
        }
        // 检查data，确保data可以序列化

    }, {
        key: "_checkData",
        value: function _checkData(data) {
            if (data != null) {
                JSON.stringify(data);
            }
        }
        // 检查路由是否处于可以跳转状态（state为1或7，如果处于7仅能跳转1次）

    }, {
        key: "_checkState",
        value: function _checkState() {
            if (this.isBusy) {
                var error = new Error('MyHistory busy');
                error.isBusy = true;
                throw error;
            }
        }
        /**
         * 将给定的path封装成一个location
         * @private
         * @param {string} path
         * @param {number} [timeStamp=Date.now()]
         * @returns
         * @memberOf MyHistory
         */

    }, {
        key: "_pathToLocation",
        value: function _pathToLocation(path) {
            var timeStamp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Date.now();

            path = this._decodePath(path);
            // 创建的location
            return LocationUtils_1.createLocation(path, timeStamp + '');
        }
    }, {
        key: "_pathToState",
        value: function _pathToState(path) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var type = arguments[2];
            var timeStamp = arguments[3];

            var location = void 0;
            if ((typeof path === "undefined" ? "undefined" : _typeof(path)) === 'object') {
                location = path;
            } else {
                location = this._pathToLocation(path, timeStamp);
            }
            return {
                location: location,
                type: type,
                timeStamp: timeStamp,
                data: JSON.parse(JSON.stringify(data))
            };
        }
    }, {
        key: "_readonlyLocation",
        value: function _readonlyLocation(state) {
            var data = state.data;
            var location = Object.assign({}, state.location, { state: data });
            // 只读对象
            var readonlyLocation = _defineProperty({}, locationKey, location);
            // 通过只设置getter不设置setter实现只读。不使用freeze是因为freeze在严格模式下赋值会抛出错误。
            Object.keys(location).forEach(function (key) {
                Object.defineProperty(readonlyLocation, key, {
                    get: function get() {
                        return this[locationKey][key];
                    },
                    set: function set() {},

                    enumerable: true
                });
            });
            return readonlyLocation;
        }
    }, {
        key: "_push",
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(state) {
                var push = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                var tempTitle;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                if (push) {
                                    tempTitle = this._win.document.title;
                                    // 修改title为gobackName，这样地址栏显示的时候会是一个给定的gobackName，而不是页面的title

                                    this._win.document.title = this._config.gobackName;
                                    this._pushState(state);
                                    this._win.document.title = tempTitle;
                                } else {
                                    this._replaceState(state);
                                }
                                this._stateStack.push(state);

                            case 2:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function _push(_x15) {
                return _ref8.apply(this, arguments);
            }

            return _push;
        }()
    }, {
        key: "_replace",
        value: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(state) {
                var push = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                var tempTitle;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                this._stateStack.pop();
                                this._stateStack.push(state);
                                if (push) {
                                    tempTitle = this._win.document.title;
                                    // 修改title为gobackName，这样地址栏显示的时候会是一个给定的gobackName，而不是页面的title

                                    this._win.document.title = this._config.gobackName;
                                    this._pushState(state);
                                    this._win.document.title = tempTitle;
                                } else {
                                    this._replaceState(state);
                                }

                            case 3:
                            case "end":
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function _replace(_x17) {
                return _ref9.apply(this, arguments);
            }

            return _replace;
        }()
    }, {
        key: "_goback",
        value: function _goback(n) {
            var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var push = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            if (n <= 0) {
                return;
            }
            this._stateStack.splice(Math.max(0, this._stateStack.length - n));
            if (state) {
                this._stateStack.push(state);
            }
            var lastState = this._stateStack[this._stateStack.length - 1];
            if (push) {
                this._pushState(lastState);
            } else {
                this._replaceState(lastState);
            }
        }
    }, {
        key: "_replaceState",
        value: function _replaceState(state) {
            this._win.history.replaceState(state, null, '#' + this._encodePath(state.location.href));
        }
    }, {
        key: "_pushState",
        value: function _pushState(state) {
            this._win.history.pushState(state, null, '#' + this._encodePath(state.location.href));
        }
        /**
         * 当用处于未知页面（既不是goback页面，也不是normal页面时候），触发纠正
         */

    }, {
        key: "_correct",
        value: function _correct() {
            // 暂时先记录日志
            console.error('异常', this._stateStack, this._win.history.state, location.hash);
            // 初始化goback
            var isGobackNextLocation = this._initGoback(this._gobackState.timeStamp);
            // 初始化当前页面
            this._push(this._stackTop, !isGobackNextLocation);
        }
    }, {
        key: "push",
        value: function push(path, data) {
            this._checkState();
            return this._state.push(path, data);
        }
    }, {
        key: "replace",
        value: function replace(path, data) {
            this._checkState();
            return this._state.replace(path, data);
        }
    }, {
        key: "goback",
        value: function goback(n) {
            this._checkState();
            return this._state.goback(n);
        }
    }, {
        key: "reload",
        value: function reload() {
            this._checkState();
            return this._state.reload();
        }
    }, {
        key: "destroy",
        value: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                var error, state;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                this._destroyEventListener();
                                this.onBeforeChange = null;
                                this.onChange = null;
                                if (this._notBusyDef) {
                                    error = new Error('User cancelled');

                                    error.isCancelled = true;
                                    this._notBusyDef.reject(error);
                                    this._notBusyDef = null;
                                }
                                state = this._win.history.state;

                                sessionStorage[MY_ROUTER_HISTORY_GOBACK_INIT] = false;

                                if (!(state && state.type === 'NORMAL')) {
                                    _context10.next = 10;
                                    break;
                                }

                                this._win.history.back();
                                // 延时，等back执行完
                                _context10.next = 10;
                                return new Promise(function (r) {
                                    return DOMUtils_1.nextTick(r);
                                });

                            case 10:
                                console.log(666, this._stackTop.location.href, history.state);
                                this._win.history.replaceState(null, null, this._stackTop.location.href);
                                // 延时，等pushState执行完
                                _context10.next = 14;
                                return new Promise(function (r) {
                                    return DOMUtils_1.nextTick(r);
                                });

                            case 14:
                                this._stateStack = null;
                                this._config = null;
                                this._stateData = null;
                                this._state = null;
                                if (this._win === window) {
                                    delete this._win[MY_ROUTER_HISTORY_WINDOW_INIT];
                                }
                                this._win = null;
                                console.log(history.state);

                            case 21:
                            case "end":
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function destroy() {
                return _ref10.apply(this, arguments);
            }

            return destroy;
        }()
    }, {
        key: "_execCallback",
        value: function _execCallback(callback) {
            var _this4 = this;

            if (typeof callback === 'function') {
                return function () {
                    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
                        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                            args[_key] = arguments[_key];
                        }

                        var state, result;
                        return regeneratorRuntime.wrap(function _callee11$(_context11) {
                            while (1) {
                                switch (_context11.prev = _context11.next) {
                                    case 0:
                                        state = _this4._state.type;
                                        _context11.prev = 1;

                                        _this4._switchState(7);
                                        _context11.next = 5;
                                        return callback.apply(_this4, args);

                                    case 5:
                                        result = _context11.sent;

                                        _this4._switchState(state);
                                        return _context11.abrupt("return", result);

                                    case 10:
                                        _context11.prev = 10;
                                        _context11.t0 = _context11["catch"](1);

                                        _this4._switchState(state);
                                        throw _context11.t0;

                                    case 14:
                                    case "end":
                                        return _context11.stop();
                                }
                            }
                        }, _callee11, _this4, [[1, 10]]);
                    }));

                    return function () {
                        return _ref11.apply(this, arguments);
                    };
                }();
            } else {
                return function () {
                    return Promise.resolve();
                };
            }
        }
    }, {
        key: "_stackTop",
        get: function get() {
            if (this._stateStack.length) {
                return this._stateStack[this._stateStack.length - 1];
            } else {
                return null;
            }
        }
    }, {
        key: "stack",
        get: function get() {
            var _this5 = this;

            return this._stateStack.map(function (state) {
                return _this5._readonlyLocation(state);
            });
        }
    }, {
        key: "length",
        get: function get() {
            return this._stateStack.length;
        }
    }, {
        key: "isBusy",
        get: function get() {
            return this._state.type !== 1 && this._state.type !== 7 || this._notBusyDef && this._state.type === 7;
        }
    }, {
        key: "location",
        get: function get() {
            return this._readonlyLocation(this._stackTop);
        }
    }]);

    return MyHistory;
}();

exports.MyHistory = MyHistory;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 增加'/'到path
 * @export
 * @param {string} path
 * @returns {string}
 */
function addLeadingSlash(path) {
    return path.charAt(0) === '/' ? path : '/' + path;
}
exports.addLeadingSlash = addLeadingSlash;
// /**
//  * 移除path的根'/'
//  * @export
//  * @param {string} path
//  * @returns {string}
//  */
// export function stripLeadingSlash(path: string): string {
//     return path.charAt(0) === '/' ? path.substr(1) : path;
// }
// /**
//  * 移除path最后的'/'
//  * @export
//  * @param {string} path
//  * @returns {string}
//  */
// export function stripTrailingSlash(path: string): string {
//     return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
// }
/**
 * 将一个path转为location对象形式
 * @export
 * @param {string} path
 * @param {any} state
 * @returns {ILocation}
 */
function parsePath(path) {
    var pathname = path || '/';
    var search = '';
    var hash = '';
    var hashIndex = pathname.indexOf('#');
    if (hashIndex !== -1) {
        hash = pathname.substr(hashIndex);
        pathname = pathname.substr(0, hashIndex);
    }
    var searchIndex = pathname.indexOf('?');
    if (searchIndex !== -1) {
        search = pathname.substr(searchIndex);
        pathname = pathname.substr(0, searchIndex);
    }
    return {
        pathname: pathname,
        search: search === '?' ? '' : search,
        hash: hash === '#' ? '' : hash,
        key: '',
        get href() {
            return this.pathname + this.search + this.hash;
        }
    };
}
exports.parsePath = parsePath;
// /**
//  * 将一个location对象转为path对象
//  * @export
//  * @param {ILocation} location
//  * @returns {string}
//  */
// export function createPath(location: ILocation): string {
//     const { pathname, search, hash } = location;
//     let path = pathname || '/';
//     if (search && search !== '?')
//         path += search.charAt(0) === '?' ? search : `?${search}`;
//     if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : `#${hash}`;
//     return path;
// }

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function __export(m) {
    for (var p in m) {
        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(0));
var History_1 = __webpack_require__(0);
exports.default = History_1.MyHistory;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var resolve_pathname_1 = __webpack_require__(5);
var PathUtils_1 = __webpack_require__(1);
/**
 *
 * @export
 * @param {string | _Location} path href字符串或者location对象
 * @param {any} key 猜测是一个标记location的key
 * @param {_Location} currentLocation 当前的location对象，用于解析出相对路径
 * @returns
 */
function createLocation(path) {
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var currentLocation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var location = void 0;
    // 如果path是字符串，将其封装成location
    if (typeof path === 'string') {
        location = PathUtils_1.parsePath(path);
    } else {
        // 如果path不是字符串，认为他是location，
        // One-arg form: push(location)
        location = Object.assign({}, path);
        // 规范化传入的location的pathname、search、hash。如果存在这些数据，索性置为“”，反正后面会根据
        if (location.pathname === undefined) location.pathname = '';
        if (location.search) {
            if (location.search.charAt(0) !== '?') location.search = '?' + location.search;
        } else {
            location.search = '';
        }
        if (location.hash) {
            if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
        } else {
            location.hash = '';
        }
    }
    try {
        // 将不符合URL规范的字符做URL编码。如果不能做URL编码抛出异常
        location.pathname = decodeURI(location.pathname);
    } catch (e) {
        if (e instanceof URIError) {
            throw new URIError('Pathname "' + location.pathname + '" could not be decoded. ' + 'This is likely caused by an invalid percent-encoding.');
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
            location.pathname = resolve_pathname_1.default(location.pathname, currentLocation.pathname);
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
exports.createLocation = createLocation;
// /**
//  * 判断两个location对象是否相等。这里的key是增加的功能，用于区分两个完全一样的url
//  * @export
//  * @param {any} a
//  * @param {any} b
//  * @returns
//  */
// export function locationsAreEqual(a: _Location, b: _Location) {
//     return a.href === b.href
// }
var timeStamp = void 0;
var count = 0;
/**
 * 创建location的ID
 * @export
 * @param {number} _timeStamp
 * @returns
 */
function crateNo(_timeStamp) {
    if (timeStamp !== _timeStamp) {
        timeStamp = _timeStamp;
        count = 0;
    }
    return timeStamp * 100 + count++;
}
exports.crateNo = crateNo;

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
function isAbsolute(pathname) {
  return pathname.charAt(0) === '/';
}

// About 1.5x faster than the two-arg version of Array#splice()
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
    list[i] = list[k];
  }

  list.pop();
}

// This implementation is based heavily on node's url.parse
function resolvePathname(to) {
  var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var toParts = to && to.split('/') || [];
  var fromParts = from && from.split('/') || [];

  var isToAbs = to && isAbsolute(to);
  var isFromAbs = from && isAbsolute(from);
  var mustEndAbs = isToAbs || isFromAbs;

  if (to && isAbsolute(to)) {
    // to is absolute
    fromParts = toParts;
  } else if (toParts.length) {
    // to is relative, drop the filename
    fromParts.pop();
    fromParts = fromParts.concat(toParts);
  }

  if (!fromParts.length) return '/';

  var hasTrailingSlash = void 0;
  if (fromParts.length) {
    var last = fromParts[fromParts.length - 1];
    hasTrailingSlash = last === '.' || last === '..' || last === '';
  } else {
    hasTrailingSlash = false;
  }

  var up = 0;
  for (var i = fromParts.length; i >= 0; i--) {
    var part = fromParts[i];

    if (part === '.') {
      spliceOne(fromParts, i);
    } else if (part === '..') {
      spliceOne(fromParts, i);
      up++;
    } else if (up) {
      spliceOne(fromParts, i);
      up--;
    }
  }

  if (!mustEndAbs) for (; up--; up) {
    fromParts.unshift('..');
  }if (mustEndAbs && fromParts[0] !== '' && (!fromParts[0] || !isAbsolute(fromParts[0]))) fromParts.unshift('');

  var result = fromParts.join('/');

  if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';

  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (resolvePathname);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
/**
 * 在下一个任务队列中执行
 * @export
 * @param {Function} cb         回调函数
 * @param {Object} [ctx]
 */
function nextTick(cb, ctx) {
    var callback = function callback() {
        if (typeof cb === 'function') {
            cb.call(ctx);
        }
    };
    if (typeof setImmediate !== 'undefined') {
        setImmediate(callback);
    } else if (typeof MessageChannel !== 'undefined' && (/native code/.test(MessageChannel.toString()) || MessageChannel.toString() === '[object MessageChannelConstructor]')) {
        var channel = new MessageChannel();
        var port = channel.port2;
        channel.port1.onmessage = callback;
        port.postMessage(1);
    } else {
        setTimeout(callback, 0);
    }
}
exports.nextTick = nextTick;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7).setImmediate))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(8);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(9)))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 反转promise的异步控制的对象模型——Deferred
 * @returns
 */

var Deferred = function () {
    function Deferred() {
        var _this = this;

        _classCallCheck(this, Deferred);

        /**
         * promise是否已经完成
         * @type {boolean}
         */
        this.$isFinished = false;
        //返回的参数
        this.promise = new Promise(function (resolve, reject) {
            _this.$resolve = resolve;
            _this.$reject = reject;
        });
    }

    _createClass(Deferred, [{
        key: "resolve",

        /**
         * 对外暴露的接口，promise正常完成
         * @param {T} args
         */
        value: function resolve(args) {
            this.$isFinished = true;
            this.$resolve(args);
        }
        /**
         * 对外暴露的接口，promise异常结束
         * @param {any} args
         */

    }, {
        key: "reject",
        value: function reject(args) {
            this.$isFinished = true;
            this.$reject(args);
        }
    }, {
        key: "isFinished",
        get: function get() {
            return this.$isFinished;
        }
    }]);

    return Deferred;
}();

exports.Deferred = Deferred;

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map