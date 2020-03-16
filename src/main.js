import Vue from 'vue';
import App from './App';
// 引入路由
import Router from 'vue-router';
import router from './router';

// 引入axios ajax请求
import axios from 'axios';

import { Lazyload } from 'vant';

// 引入JSON配置文件
import configJson from '../static/json/configJson';

// 引入权限框架
import store from './vuex/index';


// 配置axios
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

// 页面刷新时，重新赋值openid,token
store.commit('set_openid', {
  'openid': JSON.stringify(sessionStorage.getItem('openid'))
});
// store.commit('set_token', {
//   'token': sessionStorage.getItem('token')
// });

// 配置默认ajax请求路径  在/config/index.js中配置
axios.defaults.baseURL = process.env.API_ROOT;

// axios请求拦截器
axios.interceptors.request.use(config => {
  // 让每个请求携带自定义token
  config.headers.common[configJson.tokenName] = store.state.userInfo.token;
  return config;
});

// axios响应拦截器
axios.interceptors.response.use(response => {
  // 没有权限 || 非法访问
  if (response.data.status === configJson.badRequestCode) {
    //跳转到非法页面
    router.push({path: '/405'});
  }
  return response;
}, error => {
  // 跳转到错误页面
  //router.push({path: '/500'});
  return error;
});

// 前端路由跳转拦截器
router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.requireAuth)) {
    // 需要登录才能访问
    if (store.state.userInfo.openid && store.state.userInfo.openid != "[object Object]") {
      // 自定义：可以到后台请求查看当前token是否失效
      next();
    } else {
      // 非法访问
      next({
        path: '/405'
      });
    }
  } else {
    next();
  }
});

Vue.use(Lazyload, {
  lazyComponent: true
});

new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});

const originalPush = Router.prototype.push;
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err);
};
