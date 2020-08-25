import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'

import Login from '@/components/login'
import Home from '@/components/home'
import Auth from '@/components/views/authority/authority'
import AddAuth from '@/components/views/authority/addAuth'
import SelectAuth from '@/components/views/authority/selectAllAuth'
import Fristpage from '@/components/views/fristPage/fristPage'
import MyWork from '@/components/views/markTool/markTool'
import MyTask from '@/components/views/myTask/myTask'
import AllotTask from '@/components/views/allotTask/allotTask'
import FilesHandle from '@/components/views/filesHandle/filesHandle'
import TabGroup from '@/components/views/tabGroup/tabGroup'

Vue.use(Router)
const router = new Router({
// export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requireAuth: false,
        keepAlive: false,
        allowBack: false
      }
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
          requireAuth: true,
          keepAlive: true,
          allowBack: false
      },
      children: [
        {
          path:'/home/fristPage',
          component: Fristpage,
          meta: {
            keepAlive: false,
            allowBack: false
          }
        },
        {
          path:'/home/myWork', 
          component: MyWork,
          meta: {
            keepAlive: false,
            allowBack: false
          }
        },
        {
          path:'/home/myTask', 
          component: MyTask,
          meta: {
            keepAlive: false,
            allowBack: false
          }
        },
        {
          path:'/home/AllotTask', 
          component: AllotTask,
          meta: {
            keepAlive: false,
            allowBack: false
          }
        },
        {
          path:'/home/filesHandle', 
          component: FilesHandle,
          meta: {
            keepAlive: false,
            allowBack: false
          }
        },
        {
          path: '/home/tabGroup',
          component: TabGroup,
          meta: {
            keepAlive: false,
            allowBack: false
          }
        },
        {
          path:'/home/auth',
          component:Auth,
          children:[
            {
              path:'/home/auth/', 
              component: SelectAuth,
              meta: {
                keepAlive: false,
                allowBack: false
              }
            },
            {
              path:'/home/auth/addAuth', 
              component: AddAuth,
              meta: {
                keepAlive: true,
                allowBack: false
              }
            }
          ]
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => { //全局钩子函数
  to.matched.some((route) => {
    // console.log('route=-==-=', route)
      // to.matched.forEach((route) => {
      if (route.meta.requireAuth) { //通过此操作可以判断哪些页面需要登录
          if (JSON.parse(sessionStorage.getItem('loginAuth'))) {
              next()
              let allowBack = true    //    给个默认值true
              if (to.meta.allowBack !== undefined) {
                  allowBack = to.meta.allowBack
              }
              if (!allowBack) {
                  history.pushState(null, null, location.href)
              }
              // store.dispatch('updateAppAllowBackSetting', {
              //     allowBack: allowBack
              // })
              store.dispatch({
                type: 'route/updateAppAllowBackSetting',
                allowBack: allowBack
              })
          } else {
              next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
          }
      } else {
          next();
      }
  });

})
export default router;