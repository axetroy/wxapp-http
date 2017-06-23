# wxapp-http

[![Greenkeeper badge](https://badges.greenkeeper.io/axetroy/wxapp-http.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/axetroy/wxapp-http.svg?branch=master)](https://travis-ci.org/axetroy/wxapp-http)
[![Dependency](https://david-dm.org/axetroy/wxapp-http.svg)](https://david-dm.org/axetroy/wxapp-http)
![License](https://img.shields.io/badge/license-MIT-green.svg)
[![Prettier](https://img.shields.io/badge/Code%20Style-Prettier-green.svg)](https://github.com/prettier/prettier)
![Node](https://img.shields.io/badge/node-%3E=6.0-blue.svg?style=flat-square)
[![npm version](https://badge.fury.io/js/@axetroy/wxapp-http.svg)](https://badge.fury.io/js/wxapp-http)

微信小程序的http模块，机智得“绕过”最大5个http并发的限制.

## Installation
```bash
npm install wxapp-http
```

## Features

- [x] 更优雅的语法
- [x] http请求返回promise
- [x] 限制最大并发数为5，无论发出多少个http请求

## Usage

```javascript
// es6
import http from 'wxapp-http';
```

## API

#### http.request

发送http请求

```flow js
http.request = function(
  method: string,
  url: string,
  body?: Object | string,
  header?: Object,
  dataType?: string
) {
  // ...send request
};
```

#### http.get

发送GET请求

```flow js
http.get = function(
  url: string,
  body?: Object | string,
  header?: Object,
  dataType?: string
) {
  // ...send request
};
```

#### http.post

发送POST请求

```flow js
http.get = function(
  url: string,
  body?: Object | string,
  header?: Object,
  dataType?: string
) {
  // ...send request
};
```

...

#### 以及OPTIONS, HEAD, PUT, DELETE, TRACE, CONNECT 请求

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