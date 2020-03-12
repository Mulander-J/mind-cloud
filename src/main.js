// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import InfiniteScroll from 'vue-infinite-scroll'
import App from './App'
import router from './router'
import api from './api/index'

import 'iview/dist/styles/iview.css'
import iview from 'iview'
Vue.use(iview)

Vue.use(VueResource)
Vue.use(InfiniteScroll)
Vue.prototype.$api = api;
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  directives: {InfiniteScroll},
  components: { App },
  template: '<App/>',
  created(){
    let IOC_CACHE = sessionStorage.getItem('IOC_CACHE');
    if(!IOC_CACHE){
      sessionStorage.setItem('IOC_CACHE',JSON.stringify({
        version:'v0.0.1',
        userInfo:null
      }));
    }
  }
})
