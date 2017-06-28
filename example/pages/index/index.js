//index.js

const http = require('../../wxapp-http').default;

http.requestInterceptor(function(config) {
  return true;
});

http.responseInterceptor(function(config) {
  return true;
});

var app = getApp();
Page({
  data: {
    success: 0,
    fail: 0
  },
  onLoad: function() {
    console.log('onload index');
    console.log(http);

    for (let i = 0; i < 100; i++) {
      http
        .get(`https://www.baidu.com?index=${i}`)
        .then(res => {
          console.log(`Request Success: `, res);
          const success = this.data.success + 1;
          this.setData({ success });
        })
        .catch(err => {
          console.error(`Request Error: `, err);
          const fail = this.data.fail + 1;
          this.setData({ fail });
        });
    }
  }
});
