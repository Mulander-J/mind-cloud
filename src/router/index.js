import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/view/Login'
import Home from '@/view/Home'


Vue.use(Router)


export default new Router({
  // mode:'history',//'history'地址栏不带#号；'hash'-地址栏带#号
  routes: [
    {
      path: '/',
      name: 'index',
      redirect:'/home'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    }
  ]
})
