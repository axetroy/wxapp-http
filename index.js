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

/**
 * http对象
 * @param maxConcurrent   最大http并发数量
 * @constructor
 */
function Http(maxConcurrent) {
  this.ctx = typeof wx === 'object' ? wx : {};
  this.queue = [];
  this.maxConcurrent = maxConcurrent;
  this.runningTask = 0;
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
    dataType,
    timestamp: new Date().getTime(),
    id: Math.random()
  };
  return new Promise(function(resolve, reject) {
    _this.queue.push({ config, promise: this, resolve, reject });
    _this.__next();
  });
};

Http.prototype.__next = function() {
  const _this = this;
  if (this.queue.length && this.runningTask < this.maxConcurrent) {
    const entity = this.queue.shift();
    this.runningTask = this.runningTask + 1;
    this.ctx.request({
      ...entity.config,
      ...{
        success(res) {
          entity.resolve(res);
        },
        fail(err) {
          entity.reject(err);
        },
        complete() {
          _this.__next();
          _this.runningTask = _this.runningTask - 1;
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

export default new Http(5);
