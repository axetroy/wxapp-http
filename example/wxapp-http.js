(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["wxHttp"] = factory();
	else
		root["wxHttp"] = factory();
})(this, function() {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Http", function() { return Http; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axetroy_event_emitter_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__axetroy_event_emitter_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__axetroy_event_emitter_js__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by axetroy on 17-6-23.
 */


function requireArgument(argv) {
  throw new Error(argv + ' is required!Please make sure it is not a undefined');
}

function isFunction(func) {
  return typeof func === 'function';
}

var Http = function (_EventEmitter) {
  _inherits(Http, _EventEmitter);

  function Http(maxConcurrent) {
    _classCallCheck(this, Http);

    var _this2 = _possibleConstructorReturn(this, (Http.__proto__ || Object.getPrototypeOf(Http)).call(this));

    _this2.__ctx = (typeof wx === 'undefined' ? 'undefined' : _typeof(wx)) === 'object' ? wx : {};
    _this2.__queue = [];
    _this2.__maxConcurrent = maxConcurrent;
    _this2.__runningTask = 0;
    return _this2;
  }

  _createClass(Http, [{
    key: '__next',
    value: function __next() {
      var _this = this;
      var queue = _this.__queue;

      if (queue.length && _this.__runningTask < _this.__maxConcurrent) {
        var entity = queue.shift();
        var config = entity.config;

        var requestInterceptor = _this.__requestInterceptor;
        var responseInterceptor = _this.__responseInterceptor;

        if (isFunction(requestInterceptor) && requestInterceptor.call(_this, config) !== true) {
          entity.reject(new Error('Request Interceptor: Request can\'t pass the Interceptor'));
          return;
        }

        _this.emit('request', config);

        _this.__runningTask = _this.__runningTask + 1;
        _this.__ctx.request(_extends({}, entity.config, {
          success: function success(res) {
            entity.__response = res;
            _this.emit('success', config, res);
            if (isFunction(responseInterceptor) && responseInterceptor.call(_this, config, res) !== true) {
              entity.reject(res);
            } else {
              entity.resolve(res);
            }
          },
          fail: function fail(err) {
            entity.__response = err;
            _this.emit('fail', config, err);
            if (isFunction(responseInterceptor) && responseInterceptor.call(_this, config, err) === true) {
              entity.resolve(err);
            } else {
              entity.reject(err);
            }
          },
          complete: function complete() {
            _this.emit('complete', config, entity.__response);
            _this.__next();
            _this.__runningTask = _this.__runningTask - 1;
          }
        }));
      } else {}
    }
  }, {
    key: 'request',
    value: function request() {
      var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requireArgument('method');
      var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requireArgument('url');
      var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var header = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var dataType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'json';

      var _this = this;
      var config = {
        method: method,
        url: url,
        data: body,
        header: header,
        dataType: dataType
      };
      return new Promise(function (resolve, reject) {
        _this.__queue.push({ config: config, promise: this, resolve: resolve, reject: reject });
        _this.__next();
      });
    }
  }, {
    key: 'head',
    value: function head(url, body, header, dataType) {
      return this.request('HEAD', url, body, header, dataType);
    }
  }, {
    key: 'options',
    value: function options(url, body, header, dataType) {
      return this.request('OPTIONS', url, body, header, dataType);
    }
  }, {
    key: 'get',
    value: function get(url, body, header, dataType) {
      return this.request('GET', url, body, header, dataType);
    }
  }, {
    key: 'post',
    value: function post(url, body, header, dataType) {
      return this.request('POST', url, body, header, dataType);
    }
  }, {
    key: 'put',
    value: function put(url, body, header, dataType) {
      return this.request('PUT', url, body, header, dataType);
    }
  }, {
    key: 'delete',
    value: function _delete(url, body, header, dataType) {
      return this.request('DELETE', url, body, header, dataType);
    }
  }, {
    key: 'trace',
    value: function trace(url, body, header, dataType) {
      return this.request('TRACE', url, body, header, dataType);
    }
  }, {
    key: 'connect',
    value: function connect(url, body, header, dataType) {
      return this.request('CONNECT', url, body, header, dataType);
    }
  }, {
    key: 'requestInterceptor',
    value: function requestInterceptor(func) {
      this.__requestInterceptor = func;
    }
  }, {
    key: 'responseInterceptor',
    value: function responseInterceptor(func) {
      this.__responseInterceptor = func;
    }
  }, {
    key: 'clean',
    value: function clean() {
      this.__queue = [];
    }
  }]);

  return Http;
}(__WEBPACK_IMPORTED_MODULE_0__axetroy_event_emitter_js___default.a);

/* harmony default export */ __webpack_exports__["default"] = (new Http(5));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["EventEmitter"] = factory();
	else
		root["EventEmitter"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

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

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * Created by axetroy on 2017/3/6.
 */
var name = '@axetroy/event-emitter.js';
var id_Identifier = '__id__';

function randomId() {
  return Math.random().toString(36).substr(2, 16);
}

function findIndexById(id) {
  return this.findIndex(function (callback) {
    return callback[id_Identifier] === id;
  });
}

var defineProperty = Object.defineProperty;

function EventEmitter() {
  this[name] = {};
  defineProperty && defineProperty(this, name, { enumerable: false, configurable: false });
}

var prototype = EventEmitter.prototype;

prototype.constructor = EventEmitter;

prototype.on = function (event, listener) {
  var events = this[name],
      container = events[event] = events[event] || [],
      id = randomId(),
      index = void 0;
  listener[id_Identifier] = id;
  container.push(listener);
  return function () {
    index = findIndexById.call(container, id);
    index >= 0 && container.splice(index, 1);
  };
};

prototype.off = function (event) {
  this[name][event] = [];
};

prototype.clear = function () {
  this[name] = {};
};

prototype.once = function (event, listener) {
  var self = this,
      events = self[name],
      container = events[event] = events[event] || [],
      id = randomId(),
      index = void 0,
      callback = function callback() {
    index = findIndexById.call(container, id);
    index >= 0 && container.splice(index, 1);
    listener.apply(self, arguments);
  };
  callback[id_Identifier] = id;
  container.push(callback);
};

prototype.emit = function () {
  var self = this,
      argv = [].slice.call(arguments),
      event = argv.shift(),
      events = self[name];
  (events['*'] || []).concat(events[event] || []).forEach(function (listener) {
    return self.emitting(event, argv, listener);
  });
};

prototype.emitting = function (event, dataArray, listener) {
  listener.apply(this, dataArray);
};

module.exports = EventEmitter;

/***/ })
/******/ ]);
});

/***/ })
/******/ ]);
});