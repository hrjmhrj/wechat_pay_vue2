import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import FinanceClassRoom from '../views/financeclassroom/FinanceClassRoom'
import notFound from '../views/404'
import notAllowed from '../views/405'
import serverError from '../views/500'


export default new Router({
  routes: [
    {
      path: '/FinanceClassRoom',
      name: 'FinanceClassRoom',
      meta: {
        title: '财税小讲堂首页',
        requireAuth: false // 判断该路由的访问是否需要登录
      },
      component: FinanceClassRoom
    },{
      path: "/404",
      name: "notFound",
      component: notFound
    },{
      path: "/405",
      name: "notAllowed",
      component: notAllowed
    },{
      path: "/500",
      name: serverError,
      component: serverError
    }, {
      path: "*", // 此处需特别注意置于最底部
      redirect: "/404"
    }
  ]
});
