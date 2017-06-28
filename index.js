/**
 * Created by axetroy on 17-6-23.
 */

const METHODS = [
  'OPTIONS',
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'DELETE',
  'TRACE',
  'CONNECT'
];

function requireArgument(argv) {
  throw new Error(`${argv} is required!Please make sure it is not a undefined`);
}

function isFunction(func) {
  return typeof func === 'function';
}

/**
 * http对象
 * @param maxConcurrent   最大http并发数量
 * @constructor
 */
export function Http(maxConcurrent) {
  this.__ctx = typeof wx === 'object' ? wx : {};
  this.__queue = [];
  this.__maxConcurrent = maxConcurrent;
  this.__runningTask = 0;
}

Http.prototype.request = function(
  method = requireArgument('method'),
  url = requireArgument('url'),
  body = '',
  header = {},
  dataType = 'json'
) {
  const _this = this;
  const config = {
    method,
    url,
    data: body,
    header,
    dataType
  };
  return new Promise(function(resolve, reject) {
    _this.__queue.push({ config, promise: this, resolve, reject });
    _this.__next();
  });
};

Http.prototype.__next = function() {
  const _this = this;
  const queue = _this.__queue;

  if (queue.length && _this.__runningTask < _this.__maxConcurrent) {
    const entity = queue.shift();
    const config = entity.config;

    const requestInterceptor = _this.__requestInterceptor;
    const responseInterceptor = _this.__responseInterceptor;
    const onError = _this.__onError;
    const onRequest = _this.__onRequest;
    const onSuccess = _this.__onSuccess;
    const onComplete = _this.__onComplete;
    const onFail = _this.__onFail;

    if (
      isFunction(requestInterceptor) &&
      requestInterceptor.call(_this, config) !== true
    ) {
      entity.reject(
        new Error(`Request Interceptor: Request can\'t pass the Interceptor`)
      );
      return;
    }

    if (isFunction(onRequest)) {
      try {
        onRequest.call(_this, config);
      } catch (err) {
        isFunction(onError) && onError.call(_this, err);
      }
    }

    _this.__runningTask = _this.__runningTask + 1;
    _this.__ctx.request({
      ...entity.config,
      ...{
        success(res) {
          if (isFunction(onSuccess)) {
            try {
              onSuccess.call(_this, null, config, res);
            } catch (err) {
              isFunction(onError) && onError.call(_this, err);
            }
          }
          if (
            isFunction(responseInterceptor) &&
            responseInterceptor.call(_this, config) !== true
          ) {
            entity.reject(res);
          } else {
            entity.resolve(res);
          }
        },
        fail(err) {
          if (isFunction(onFail)) {
            try {
              onFail.call(_this, err, config);
            } catch (error) {
              isFunction(onError) && onError.call(_this, error);
            }
          }
          if (
            isFunction(responseInterceptor) &&
            responseInterceptor.call(_this, config) === true
          ) {
            entity.resolve(err);
          } else {
            entity.reject(err);
          }
        },
        complete() {
          if (isFunction(onComplete)) {
            try {
              onComplete.call(_this, null, config);
            } catch (err) {
              isFunction(onError) && onError.call(_this, err);
            }
          }
          _this.__next();
          _this.__runningTask = _this.__runningTask - 1;
        }
      }
    });
  } else {
  }
};

METHODS.forEach(method => {
  Http.prototype[method.toLowerCase()] = function(url, body, header, dataType) {
    return this.request(method, url, body, header, dataType);
  };
});

Http.prototype.requestInterceptor = function(func) {
  this.__requestInterceptor = func;
};

Http.prototype.responseInterceptor = function(func) {
  this.__responseInterceptor = func;
};

Http.prototype.onRequest = function(func) {
  this.__onRequest = func;
};

Http.prototype.onSuccess = function(func) {
  this.__onSuccess = func;
};

Http.prototype.onFail = function(func) {
  this.__onFail = func;
};

Http.prototype.onError = function(func) {
  this.__onError = func;
};

Http.prototype.onComplete = function(func) {
  this.__onComplete = func;
};

Http.prototype.clean = function() {
  this.__queue = [];
};

export default new Http(5);
