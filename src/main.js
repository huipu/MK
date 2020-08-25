// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from '@/store'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
// import debounce from 'lodash.debounce'
import 'element-ui/lib/theme-chalk/index.css'
import qs from 'qs'
import Msg from 'vue-message'
// import gDBox from 'gdbox'


Vue.use(Msg, {text: 'Hello world', duration: 3000, background: 'rgba(7,17,27,0.6)'})
Vue.use(ElementUI)

// Vue.use(gDBox)

// Vue.prototype._debounce = debounce
Vue.config.productionTip = false
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/json';
// Vue.prototype.$gDBox = gDBox

Vue.prototype.qs = qs 
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
