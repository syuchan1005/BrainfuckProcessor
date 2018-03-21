// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

/* eslint-disable import/first */
import Vue from 'vue';
import vueMaterial from 'vue-material';
import vueCodeMirror from 'vue-codemirror-lite';
import App from './App';
import router from './router';
import store from './store';

import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import 'material-design-icons/iconfont/material-icons.css';

Vue.use(vueMaterial);
Vue.use(vueCodeMirror);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
