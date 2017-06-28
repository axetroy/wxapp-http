/**
 * Created by axetroy on 17-6-23.
 */
import EventEmitter from '@axetroy/event-emitter.js';

function requireArgument(argv) {
  throw new Error(`${argv} is required!Please make sure it is not a undefined`);
}

function isFunction(func) {
  return typeof func === 'function';
}

class Http extends EventEmitter {
  constructor(maxConcurrent) {
    super();
    this.__ctx = typeof wx === 'object' ? wx : {};
    this.__queue = [];
    this.__maxConcurrent = maxConcurrent;
    this.__runningTask = 0;
  }
  __next() {
    const _this = this;
    const queue = _this.__queue;

    if (queue.length && _this.__runningTask < _this.__maxConcurrent) {
      const entity = queue.shift();
      const config = entity.config;

      const requestInterceptor = _this.__requestInterceptor;
      const responseInterceptor = _this.__responseInterceptor;

      if (
        isFunction(requestInterceptor) &&
        requestInterceptor.call(_this, config) !== true
      ) {
        entity.reject(
          new Error(`Request Interceptor: Request can\'t pass the Interceptor`)
        );
        return;
      }

      _this.emit('request', config);

      _this.__runningTask = _this.__runningTask + 1;
      _this.__ctx.request({
        ...entity.config,
        ...{
          success(res) {
            entity.__response = res;
            _this.emit('success', config, res);
            if (
              isFunction(responseInterceptor) &&
              responseInterceptor.call(_this, config, res) !== true
            ) {
              entity.reject(res);
            } else {
              entity.resolve(res);
            }
          },
          fail(err) {
            entity.__response = err;
            _this.emit('fail', config, err);
            if (
              isFunction(responseInterceptor) &&
              responseInterceptor.call(_this, config, err) === true
            ) {
              entity.resolve(err);
            } else {
              entity.reject(err);
            }
          },
          complete() {
            _this.emit('complete', config, entity.__response);
            _this.__next();
            _this.__runningTask = _this.__runningTask - 1;
          }
        }
      });
    } else {
    }
  }
  request(
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
  }
  head(url, body, header, dataType) {
    return this.request('HEAD', url, body, header, dataType);
  }
  options(url, body, header, dataType) {
    return this.request('OPTIONS', url, body, header, dataType);
  }
  get(url, body, header, dataType) {
    return this.request('GET', url, body, header, dataType);
  }
  post(url, body, header, dataType) {
    return this.request('POST', url, body, header, dataType);
  }
  put(url, body, header, dataType) {
    return this.request('PUT', url, body, header, dataType);
  }
  ['delete'](url, body, header, dataType) {
    return this.request('DELETE', url, body, header, dataType);
  }
  trace(url, body, header, dataType) {
    return this.request('TRACE', url, body, header, dataType);
  }
  connect(url, body, header, dataType) {
    return this.request('CONNECT', url, body, header, dataType);
  }
  requestInterceptor(func) {
    this.__requestInterceptor = func;
  }
  responseInterceptor(func) {
    this.__responseInterceptor = func;
  }
  clean() {
    this.__queue = [];
  }
}

export default new Http(5);
export { Http };
