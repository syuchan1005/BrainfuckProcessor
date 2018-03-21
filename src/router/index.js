import Vue from 'vue';
import Router from 'vue-router';
import Encode from '@/components/Encode';
import Decode from '@/components/Decode';
import Setting from '@/components/Setting';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/encode',
      alias: '/',
      name: 'Encode',
      component: Encode,
    },
    {
      path: '/decode',
      name: 'Decode',
      component: Decode,
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting,
    },
  ],
});
