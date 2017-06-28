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
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Created by axetroy on 17-6-23.
 */

var METHODS = ['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT'];

function requireArgument(argv) {
  throw new Error(argv + ' is required!Please make sure it is not a undefined');
}

/**
 * http对象
 * @param maxConcurrent   最大http并发数量
 * @constructor
 */
function Http(maxConcurrent) {
  this.ctx = (typeof wx === 'undefined' ? 'undefined' : _typeof(wx)) === 'object' ? wx : {};
  this.queue = [];
  this.maxConcurrent = maxConcurrent;
  this.runningTask = 0;
}

Http.prototype.request = function () {
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
    dataType: dataType,
    timestamp: new Date().getTime(),
    id: Math.random()
  };
  return new Promise(function (resolve, reject) {
    _this.queue.push({ config: config, promise: this, resolve: resolve, reject: reject });
    _this.__next();
  });
};

Http.prototype.__next = function () {
  var _this = this;
  if (this.queue.length && this.runningTask < this.maxConcurrent) {
    var entity = this.queue.shift();
    this.runningTask = this.runningTask + 1;
    this.ctx.request(_extends({}, entity.config, {
      success: function success(res) {
        entity.resolve(res);
      },
      fail: function fail(err) {
        entity.reject(err);
      },
      complete: function complete() {
        _this.__next();
        _this.runningTask = _this.runningTask - 1;
      }
    }));
  } else {}
};

METHODS.forEach(function (method) {
  Http.prototype[method.toLowerCase()] = function (url, body, header, dataType) {
    return this.request(method, url, body, header, dataType);
  };
});

/* harmony default export */ __webpack_exports__["default"] = (new Http(5));

/***/ })
/******/ ]);
});