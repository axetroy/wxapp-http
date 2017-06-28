/**
 * Created by axetroy on 2017/6/28.
 */
declare namespace wx {
  function request(config: RequestConfig$): void;
}

interface Wx$ {
  request(config: RequestConfig$): void;
}

interface Response$ {
  data: any;
  errMsg: string;
  statusCode: number;
}

interface RequestConfig$ extends RequestCallBack$, Config$ {}

interface RequestCallBack$ {
  success(data: Response$): void;
  fail(error: Response$): void;
  complete(): void;
}

interface Config$ {
  url: string;
  method: string;
  data: Object | string;
  header: Object;
  dataType: String;
}

interface Entity$ {
  config: Config$;
  resolve(data: any): void;
  reject(data: any): void;
  response?: any;
}

interface Http$ {
  request(
    method: string,
    url: string,
    body: Object | string,
    header: Object,
    dataType: string
  ): Promise<any>;
  get(
    url: string,
    body?: Object | string,
    header?: Object,
    dataType?: string
  ): Promise<any>;
  post(
    url: string,
    body?: Object | string,
    header?: Object,
    dataType?: string
  ): Promise<any>;
  put(
    url: string,
    body?: Object | string,
    header?: Object,
    dataType?: string
  ): Promise<any>;
  ['delete'](
    url: string,
    body?: Object | string,
    header?: Object,
    dataType?: string
  ): Promise<any>;
  options(
    url: string,
    body?: Object | string,
    header?: Object,
    dataType?: string
  ): Promise<any>;
  trace(
    url: string,
    body?: Object | string,
    header?: Object,
    dataType?: string
  ): Promise<any>;
  head(
    url: string,
    body?: Object | string,
    header?: Object,
    dataType?: string
  ): Promise<any>;
  connect(
    url: string,
    body?: Object | string,
    header?: Object,
    dataType?: string
  ): Promise<any>;
  requestInterceptor(interceptor: Function): Http$;
  responseInterceptor(interceptor: Function): Http$;
  clean(): void;
}

declare module '@axetroy/event-emitter.js' {
  export default class EventEmitter {
    on(event: string, handler: Function): Function;
    emit(event: string, ...data: any[]): void;
  }
}
