/**
 * Created by axetroy on 17-6-23.
 */
/// <reference path="./index.d.ts" />

import EventEmitter from '@axetroy/event-emitter.js';

function isFunction(func: any): boolean {
  return typeof func === 'function';
}

const DEFAULT_CONFIG: HttpConfig$ = {
  maxConcurrent: 5,
  timeout: 0,
  header: {},
  dataType: 'json'
};

class Http extends EventEmitter implements Http$ {
  private ctx: Wx$ = typeof wx === 'object' ? wx : { request() {} };
  private queue: Entity$[] = [];
  private runningTask: number = 0;
  private maxConcurrent = DEFAULT_CONFIG.maxConcurrent;
  constructor(private config: HttpConfig$ = DEFAULT_CONFIG) {
    super();
    this.maxConcurrent = config.maxConcurrent;
  }
  create(config: HttpConfig$ = DEFAULT_CONFIG): Http {
    return new Http(config);
  }
  private next(): void {
    const queue: Entity$[] = this.queue;

    if (!queue.length || this.runningTask >= this.maxConcurrent) return;

    const entity: Entity$ = queue.shift();
    const config: Config$ = entity.config;

    if (
      isFunction(this.requestInterceptor) &&
      this.requestInterceptor.call(this, config) !== true
    ) {
      entity.reject({
        data: null,
        errMsg: `Request Interceptor: Request can\'t pass the Interceptor`,
        statusCode: 100
      });
      return;
    }

    this.emit('request', config);

    this.runningTask = this.runningTask + 1;

    const callBack: RequestCallBack$ = {
      success: (res: any): void => {
        entity.response = res;
        this.emit('success', config, res);
        if (
          isFunction(this.responseInterceptor) &&
          this.responseInterceptor.call(this, config, res) !== true
        ) {
          entity.reject(res);
        } else {
          entity.resolve(res);
        }
      },
      fail: (err: any): void => {
        entity.response = err;
        this.emit('fail', config, err);
        if (
          isFunction(this.responseInterceptor) &&
          this.responseInterceptor.call(this, config, err) === true
        ) {
          entity.resolve(err);
        } else {
          entity.reject(err);
        }
      },
      complete: (): void => {
        this.emit('complete', config, entity.response);
        this.next();
        this.runningTask = this.runningTask - 1;
      }
    };

    const requestConfig: RequestConfig$ = Object.assign(config, callBack);
    this.ctx.request(requestConfig);
  }
  request(
    method: string,
    url: string,
    data: Object | string = '',
    header: HttpHeader$ = {},
    dataType: string = 'json'
  ): Promise<Response$> {
    const config: Config$ = {
      method,
      url,
      data,
      header: { ...header, ...this.config.header },
      dataType: dataType || this.config.dataType
    };
    return new Promise((resolve, reject) => {
      const entity: Entity$ = { config, resolve, reject, response: null };
      this.queue.push(entity);
      this.next();
    });
  }
  head(
    url: string,
    data?: Object | string,
    header?: HttpHeader$,
    dataType?: string
  ): Promise<Response$> {
    return this.request('HEAD', url, data, header, dataType);
  }
  options(
    url: string,
    data?: Object | string,
    header?: HttpHeader$,
    dataType?: string
  ): Promise<Response$> {
    return this.request('OPTIONS', url, data, header, dataType);
  }
  get(
    url: string,
    data?: Object | string,
    header?: HttpHeader$,
    dataType?: string
  ): Promise<Response$> {
    return this.request('GET', url, data, header, dataType);
  }
  post(
    url: string,
    data?: Object | string,
    header?: HttpHeader$,
    dataType?: string
  ): Promise<Response$> {
    return this.request('POST', url, data, header, dataType);
  }
  put(
    url: string,
    data?: Object | string,
    header?: HttpHeader$,
    dataType?: string
  ): Promise<Response$> {
    return this.request('PUT', url, data, header, dataType);
  }
  ['delete'](
    url: string,
    data?: Object | string,
    header?: HttpHeader$,
    dataType?: string
  ): Promise<Response$> {
    return this.request('DELETE', url, data, header, dataType);
  }
  trace(
    url: string,
    data?: Object | string,
    header?: HttpHeader$,
    dataType?: string
  ): Promise<Response$> {
    return this.request('TRACE', url, data, header, dataType);
  }
  connect(
    url: string,
    data?: Object | string,
    header?: HttpHeader$,
    dataType?: string
  ): Promise<Response$> {
    return this.request('CONNECT', url, data, header, dataType);
  }
  requestInterceptor(func): Http {
    this.requestInterceptor = func;
    return this;
  }
  responseInterceptor(func): Http {
    this.responseInterceptor = func;
    return this;
  }
  clean(): void {
    this.queue = [];
  }
}

export default new Http();
