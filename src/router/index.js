import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import MyInfo from '../views/myinfo/MyInfo'

import notFound from '../views/404'
import notAllowed from '../views/405'
import serverError from '../views/500'

import VideoClassRoom from '../views/VideoClassRoom/VideoClassRoom'
import VideoPlay from '../views/VideoClassRoom/VideoPlay'
import FinanceClassRoom from  '../views/financeclassroom/FinanceClassRoom'
export default new Router({
  routes: [
    {
      path: '/',
      name: 'FinanceClassRoom',
      meta: {
        title: '我的',
        requireAuth: false // 判断该路由的访问是否需要登录
      },
      component: FinanceClassRoom
    },
    {
      path: '/MyInfo',
      name: 'MyInfo',
      meta: {
        title: '我的',
        requireAuth: true // 判断该路由的访问是否需要登录
      },
      component: MyInfo
    }, {
      path: '/VideoClassRoom',
      name: 'VideoClassRoom',
      meta: {
        title: '财税小讲堂视频',
        requireAuth: false, // 判断该路由的访问是否需要登录
        keepAlive:false
      },
      component: VideoClassRoom
    }, {
      path: '/VideoPlay/:VIDEOID/:GOFLAG',
      name: 'VideoPlay',
      meta: {
        title: '视频播放',
        requireAuth: true // 判断该路由的访问是否需要登录
      },
      component: VideoPlay
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
