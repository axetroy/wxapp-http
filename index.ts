/**
 * Created by axetroy on 17-6-23.
 */
/// <reference path="./index.d.ts" />

import EventEmitter from '@axetroy/event-emitter.js';

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
  private requestInterceptor: (config: HttpConfig$) => boolean = (
    config: HttpConfig$
  ) => true;
  private responseInterceptor: (
    config: HttpConfig$,
    response: Response$
  ) => boolean = (config: HttpConfig$, response: Response$) => true;
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

    const { requestInterceptor, responseInterceptor } = this;

    if (requestInterceptor.call(this, config) !== true) {
      let response: Response$ = {
        data: null,
        errMsg: `Request Interceptor: Request can\'t pass the Interceptor`,
        statusCode: 0,
        header: {}
      };
      entity.reject(response);
      return;
    }

    this.emit('request', config);

    this.runningTask = this.runningTask + 1;

    const callBack: RequestCallBack$ = {
      success: (res: Response$): void => {
        entity.response = res;
        this.emit('success', config, res);
        responseInterceptor.call(this, config, res) !== true
          ? entity.reject(res)
          : entity.resolve(res);
      },
      fail: (res: Response$): void => {
        entity.response = res;
        this.emit('fail', config, res);
        responseInterceptor.call(this, config, res) !== true
          ? entity.reject(res)
          : entity.resolve(res);
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
  setRequestInterceptor(interceptor: (config: HttpConfig$) => boolean): Http {
    this.requestInterceptor = interceptor;
    return this;
  }
  setResponseInterceptor(
    interceptor: (config: HttpConfig$, response: Response$) => boolean
  ): Http {
    this.responseInterceptor = interceptor;
    return this;
  }
  clean(): void {
    this.queue = [];
  }
}

export default new Http();
