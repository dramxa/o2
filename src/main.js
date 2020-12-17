import Vue      from 'vue'
import store    from '@/modules/_system/vuex-store'


// регистрируем скроллбары  simplebar и vuebar
import 'simplebar' 
import 'simplebar/dist/simplebar.css'
import Vuebar from 'vuebar';
Vue.use(Vuebar);

//particles
import Particles from "particles.vue";
Vue.use(Particles);

// регистрируем модуль работы с локальным хранилищем
import localStorage from 'vue-ls';
var options = { name: 'ls',  storage: 'local' };  
Vue.use(localStorage, options);

// добавляем глобальные функции в пространство
import globalExtensions from './globalExtensions'
globalExtensions();

// регистрируем компоненты
import registerComponents   from './components/_registerComponents'
import registerTableFilters from './components/tableFilters/_registerFilters'
import registerWidgets      from './components/dashboard/_registerWidgets'
import registerDialogs      from './dialogs/_registerDialogs'
registerComponents();
registerTableFilters();
registerWidgets();
registerDialogs();

// импортируем модули
import moduleAuth           from './plugins/auth'
import moduleApi            from './plugins/api'
import moduleNavigation     from './plugins/navigation'
import moduleWebsocket      from './plugins/websocket'
import moduleExportCsv      from './plugins/exportCsv'
import moduleSecurity       from './plugins/security/security'
import moduleFeatures       from './plugins/features/featuresMgr'
import logger               from './plugins/log'
import moduleColorTheme     from './plugins/colorTheme'

// регистрируем модули
logger();
moduleApi();
moduleFeatures();
moduleSecurity();
moduleAuth();
moduleColorTheme();

// добавляем глобальную примесь для всех vue объектов
Vue.mixin({
  methods:{
    permissionPA: function () {
      return Vue.prototype.$security.havePermissionGA();
    },

    permission : function (permissionCode) {
      return Vue.prototype.$security.havePermission(permissionCode)
    },

    anyPermission :function (permissionCodes) {
      return Vue.prototype.$security.anyPermission(permissionCodes)
    },

    permissionObj : function (permissionCode, objId) {
      return Vue.prototype.$security.havePermission(permissionCode, objId)
    },

    anyPermissionObj :function (permissionCodes, objId) {
      return Vue.prototype.$security.anyPermission(permissionCodes, objId)
    },

    isNullOrUndefined: (value, t) => isNullOrUndefined(value, t),
  }
})


// создаем приложение
import vuetify    from './plugins/vuetify'
import router     from './plugins/router'
import App from '@/app/App.vue'

const app = {
  router,
  store,
  vuetify,
  render: h => h(App)
};

// добавляем глобальный доступ к контексту
Vue.prototype[`$context`] = app
new Vue(app).$mount('#app');



moduleNavigation();
moduleWebsocket();
moduleExportCsv();


// регистрируем модули разрешения зависимостей
import storeExt from '@/modules/_system/registrationExtend'
storeExt();

// создаем и регистрируем систему гайдов (отдельное vue приложение с общим vuex)
import guideApp from '@/plugins/guide/guide-app'
guideApp()