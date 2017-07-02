# wxapp-http
[![Build Status](https://travis-ci.org/axetroy/wxapp-http.svg?branch=master)](https://travis-ci.org/axetroy/wxapp-http)
[![Dependency](https://david-dm.org/axetroy/wxapp-http.svg)](https://david-dm.org/axetroy/wxapp-http)
![License](https://img.shields.io/badge/license-MIT-green.svg)
[![Prettier](https://img.shields.io/badge/Code%20Style-Prettier-green.svg)](https://github.com/prettier/prettier)
![Node](https://img.shields.io/badge/node-%3E=6.0-blue.svg?style=flat-square)
[![npm version](https://badge.fury.io/js/wxapp-http.svg)](https://badge.fury.io/js/wxapp-http)

微信小程序的http模块，机智得“绕过”最大5个http并发的限制.

![sceenshot](https://github.com/axetroy/wxapp-http/raw/master/screenshot.gif)

## Installation
```bash
npm install wxapp-http
```

[example](https://github.com/axetroy/wxapp-http/tree/master/example)

## Features

- [x] 基于typescript构建，更严谨
- [x] 更优雅的API
- [x] http请求的拦截器
- [x] http请求的事件监听器, 发布订阅者模式(基于[@axetroy/event-emitter.js](https://github.com/axetroy/event-emitter.js))
- [x] http请求返回promise
- [x] http请求队列化，规避小程序的并发限制
- [x] 自定义http请求的最高并发数量

## Usage

```javascript

// es6
import http from 'wxapp-http';

// commonJS
const http = require('wxapp-http').default;

http.get('https://www.google.com')
    .then(function(response){
      
    })
    .catch(function(error){
      console.error(error);
    });
```

## API

### Response

Response返回的结构体

```typescript
interface Response${
  data: any,
  errMsg: string,
  header: Object,
  statusCode: number
}
```

#### http.request

```typescript
interface Http${
    request(
      method: string,
      url: string,
      body: Object | string,
      header: Object,
      dataType: string
    ): Promise<any>;
}
```

#### http.get

```typescript
interface Http${
    get(
      url: string,
      body?: Object | string,
      header?: Object,
      dataType?: string
    ): Promise<any>;
}
```

#### http.post

```typescript
interface Http${
    post(
      url: string,
      body?: Object | string,
      header?: Object,
      dataType?: string
    ): Promise<any>;
}
```

...

#### 以及OPTIONS, HEAD, PUT, DELETE, TRACE, CONNECT 请求, 参数同上

**Http**类所有接口
```typescript
interface HttpConfig$ {
  maxConcurrent: number;
  timeout: number;
  header: HttpHeader$;
  dataType: string;
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
  requestInterceptor(interceptor: Function): Http$;
  responseInterceptor(interceptor: Function): Http$;
  clean(): void;
}
```

### 拦截器

配置文件字段

```typescript
interface Config$ {
  url: string;
  method: string;
  data: Object | string;
  header: HttpHeader$;
  dataType: String;
}
```

#### 请求拦截器

返回布尔值，如果为true，则允许发送请求，如果为false，则拒绝发送请求，并且返回的promise进入reject阶段

```typescript
interface Http${
  setRequestInterceptor(interceptor: (config: HttpConfig$) => boolean): Http$;
}

// example
http.setRequestInterceptor(function(config){
  // 只允许发送https请求
  if(config.url.indexOf('https')===0){
    return true;
  }else{
    return false;
  }
});
```

#### 响应拦截器

返回布尔值，如果为true，则返回的promise进入resolve阶段，如果为false，则进入reject阶段

```typescript
interface Http${
  setResponseInterceptor(
    interceptor: (config: HttpConfig$, response: Response$) => boolean
  ): Http$;
}

//example
http.setResponseInterceptor(function(config, response){
  // 如果服务器返回null，则进入reject
  if(response && response.data!==null){
    return true;
  }else{
    return false;
  }
});
```

### 监听器

监听全局的http请求, 事件基于[@axetroy/event-emitter.js](https://github.com/axetroy/event-emitter.js)

```typescript
declare class EventEmitter {
  constructor();

  on(event: string, listener: (...data: any[]) => void): () => void;

  emit(event: string, ...data: any[]): void;

  on(event: string, listener: (...data: any[]) => void): () => void;

  off(event: string): void;

  clear(): void;

  emitting(event: string, dataArray: any[], listener: Function): void;
}

class Http extends EventEmitter{
  
}

// example
http.on('request', function(config){
  
});

http.on('success', function(config, response){
  
});

http.on('fail', function(config, response){
  
});

http.on('complete', function(config, response){
  
});
```

事件: [request, success, fail, complete]

参数: [config, response]

[查看更多事件API](https://github.com/axetroy/event-emitter.js)

### 事件触发顺序

```
        requestInterceptor 
                ↓
            onRequest
            ↙    ↘
     onSuccess    onFail
            ↘    ↙
        responseInterceptor
                ↓
            onComplete
```

### 清除请求队列

适用于小程序页面切换后，取消掉未发出去的http请求.

```typescript
interface Http${
  lean(): void;
}

// example
http.clean();
```

### 自定义一个新的Http实例

```typescript
interface HttpConfig$ {
  maxConcurrent: number;
  timeout: number;
  header: HttpHeader$;
  dataType: string;
}

interface Http${
  create(config: HttpConfig$): Http$;
}

// example
import Http from 'wxapp-http';

const newHttp = Http.create();
```

### 自定义最高并发数量

最高并发数量默认为5个

```javascript
import Http from 'wxapp-http';

const http = Http.create({maxConcurrent:3}); // 设置最高并发3个

http.get('https://www.google.com')
    .then(function(response){
      
    })
    .catch(function(error){
      console.error(error);
    });
```

### 自定义全局的header

每个http请求，都会带有这个header

```javascript
import Http from 'wxapp-http';

const http = Http.create({
  maxConcurrent: 5,
  header: {
    name: 'axetroy'
  }
});

http.get('https://www.google.com')
    .then(function(response){
      
    })
    .catch(function(error){
      console.error(error);
    });
```

## Contributing

```bash
git clone https://github.com/axetroy/wxapp-http.git
cd ./wxapp-http
yarn
yarn run start
```

1. 打开微信web开发者工具， 加载wxapp-http/example目录
2. 修改index.ts

欢迎PR.

You can flow [Contribute Guide](https://github.com/axetroy/wxapp-http/blob/master/contributing.md)

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars1.githubusercontent.com/u/9758711?v=3" width="100px;"/><br /><sub>Axetroy</sub>](http://axetroy.github.io)<br />[💻](https://github.com/gpmer/gpm.js/commits?author=axetroy) 🔌 [⚠️](https://github.com/gpmer/gpm.js/commits?author=axetroy) [🐛](https://github.com/gpmer/gpm.js/issues?q=author%3Aaxetroy) 🎨 |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

The [MIT License](https://github.com/axetroy/wxapp-http/blob/master/LICENSE)
