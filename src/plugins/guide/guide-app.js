import Vue      from 'vue'
import vuetify    from '@/plugins/vuetify'

const store = Vue.prototype.$store

import guideMgr         from '@/plugins/guide/guideMgr'
import guideView        from './guide-view'

import mouseSimulation from '@/plugins/guide/mouseSimulation'
mouseSimulation()

export default function (){
  guideMgr()
  Vue.prototype.$guide.init();

  const guide = {
    store,
    vuetify,
    render: h => h(guideView)
  };

  Vue.prototype[`$guideContext`] = guide
  new Vue(guide).$mount('#guide');
}