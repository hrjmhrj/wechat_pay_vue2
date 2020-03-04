## Vue
>Vue Initial Project
```
  已集成：
  vue         2.6.10
  axios       0.19.0
  vant        2.4.2-beta.2
  vue-router  3.0.1
  vuex        3.1.1
  
  限制：
  在index.html文件中已设置只允许手机访问和微信访问。
```

## File Directory
```
  -project name
    -build        // 构建配置文件
    -config       // 配置文件
    -node_modules // 依赖模块
    -src          // 项目文件
      -assets     // 放一些图片，如logo
      -components // 自定义组件
      -router     // 路由配置
      -views      // 项目页面
      -vuex       // 全局数据配置
      -App.vue    // 入口vue
      -main.js    // 全局配置
    -static       // 静态资源，如：图片，js，css，json
    -index.html   // 首页入口文件
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
