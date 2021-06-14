import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import vuetify from '@/plugins/vuetify'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// import jsPDF from 'jspdf'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.config.productionTip = false

Vue.prototype.$http = axios;
// Vue.prototype.$api = 'http://127.0.0.1:8000/api';
Vue.prototype.$api = 'https://atmakoreanbbq.online/public/api';

new Vue({
  vuetify,
  router,  
  render: h => h(App),
}).$mount('#app')
