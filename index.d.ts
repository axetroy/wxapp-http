/**
 * Created by axetroy on 2017/6/28.
 */

interface RequestTask${
  abort():void
}

declare namespace wx {
  function request(config: RequestConfig$): RequestTask$;
}

interface Wx$ {
  request(config: RequestConfig$): RequestTask$;
}

interface Response$ {
  data: any;
  errMsg: string;
  statusCode: number;
  header: HttpHeader$;
}

interface RequestConfig$ extends RequestCallBack$, Config$ {}

interface RequestCallBack$ {
  success(data: Response$): void;
  fail(error: Response$): void;
  complete(): void;
}

interface HttpHeader$ {
  [s: string]: string;
}

interface Config$ {
  url: string;
  method: string;
  data: Object | string;
  header: HttpHeader$;
  dataType: string;
}

interface Entity$ {
  config: Config$;
  resolve(data: any): void;
  reject(data: any): void;
  response?: any;
}

interface Http$ {
  create(config: HttpConfig$): Http$;
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
  setRequestInterceptor(interceptor: (config: HttpConfig$) => boolean): Http$;
  setResponseInterceptor(
    interceptor: (config: HttpConfig$, response: Response$) => boolean
  ): Http$;
  clean(): void;
}

interface HttpConfig$ {
  maxConcurrent: number;
  timeout: number;
  header: HttpHeader$;
  dataType: string;
}
