# wxapp-http
[![Build Status](https://travis-ci.org/axetroy/wxapp-http.svg?branch=master)](https://travis-ci.org/axetroy/wxapp-http)
[![Dependency](https://david-dm.org/axetroy/wxapp-http.svg)](https://david-dm.org/axetroy/wxapp-http)
![License](https://img.shields.io/badge/license-MIT-green.svg)
[![Prettier](https://img.shields.io/badge/Code%20Style-Prettier-green.svg)](https://github.com/prettier/prettier)
![Node](https://img.shields.io/badge/node-%3E=6.0-blue.svg?style=flat-square)
[![npm version](https://badge.fury.io/js/@axetroy/wxapp-http.svg)](https://badge.fury.io/js/wxapp-http)

微信小程序的http模块，机智得“绕过”最大5个http并发的限制.

![sceenshot](https://github.com/axetroy/wxapp-http/raw/master/screenshot.gif)

## Installation
```bash
npm install wxapp-http
```

[example](https://github.com/axetroy/wxapp-http/tree/master/example)

## Features

- [x] 更优雅的语法
- [x] http请求的拦截器
- [x] http请求的时间监听器
- [x] http请求返回promise
- [x] http请求队列化，最大并发数量永远不会超过5个，规避小程序的并发限制

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
interface Response{
  data: any,
  errMsg: string,
  header: Object,
  statusCode: number
}
```

#### http.request

```typescript
Http.prototype.request = function(method:string, url:string, body?:Object | string="", headers?: Object={}, dataType?: String="json"): Promise<Response>{
  
}
```

#### http.get

```typescript
Http.prototype.get = function(url:string, body?:Object | string="", headers?: Object={}, dataType?: String="json"): Promise<Response>{
  
}
```

#### http.post

```typescript
Http.prototype.post = function(url:string, body?:Object | string="", headers?: Object={}, dataType?: String="json"): Promise<Response>{
  
}
```

...

#### 以及OPTIONS, HEAD, PUT, DELETE, TRACE, CONNECT 请求, 参数同上

### 拦截器

配置文件字段

```typescript
interface Config${
  method: string,
  url: string,
  data: Object | string,
  header: Object,
  dataType: string
}

```

#### 请求拦截器

返回布尔值，如果为true，则允许发送请求，如果为false，则拒绝发送请求

```typescript
Http.prototype.requestInterceptor = function(func:(config: Config$)=> boolean): void{
  
}
```

#### 响应拦截器

返回布尔值，如果为true，则返回的promise进入resolve阶段，如果为false，则进入reject阶段

```typescript
Http.prototype.responseInterceptor = function(func:(config: Config$)=> boolean): void{
  
}
```

### 监听器

监听全局的http请求

#### 请求发出前

```typescript
Http.prototype.onRequest = function(func:(config: Config$)=> void): void{
  
}

```

#### 请求成功后

```typescript
Http.prototype.onSuccess = function(func:(config: Config$)=> void): void{
  
}

```

#### 请求失败后

```typescript
Http.prototype.onFail = function(func:(config: Config$)=> void): void{
  
}

```

#### 请求完成后，无论成功或者失败

```typescript
Http.prototype.onComplete = function(func:(config: Config$)=> void): void{
  
}

```

#### 错误监听

```typescript
Http.prototype.onError = function(func:(config: Config$)=> void): void{
  
}

```

### 生命周期

```
        requestInterceptor 
                ↓
            onRequest _______________
            ↙    ↘                 ↘
     onSuccess    onFail            onComplete
            ↘    ↙
        responseInterceptor
        
        
        (onError run in hole life circle)
```

### 清除请求队列

适用于小程序页面切换后，取消掉未发出去的http请求.

```typescript
Http.prototype.clean = function() : void{
  
}
```

## Contributing

```bash
git clone https://github.com/axetroy/wxapp-http.git
cd ./wxapp-http
yarn
yarn run build
```

You can flow [Contribute Guide](https://github.com/axetroy/wxapp-http/blob/master/contributing.md)

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars1.githubusercontent.com/u/9758711?v=3" width="100px;"/><br /><sub>Axetroy</sub>](http://axetroy.github.io)<br />[💻](https://github.com/gpmer/gpm.js/commits?author=axetroy) 🔌 [⚠️](https://github.com/gpmer/gpm.js/commits?author=axetroy) [🐛](https://github.com/gpmer/gpm.js/issues?q=author%3Aaxetroy) 🎨 |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

The [MIT License](https://github.com/axetroy/wxapp-http/blob/master/LICENSE)
