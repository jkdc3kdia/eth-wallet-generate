// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import web3 from 'web3'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import vueClipboard from 'vue-clipboard2'
// import Blob from './util/excel/Blob'
// import Export2Excel from './util/excel/Export2Excel.js'






Vue.use(ElementUI);
Vue.use(vueClipboard)
// Vue.use(Blob);
// Vue.use(Export2Excel);



Vue.prototype.web3 = web3

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
