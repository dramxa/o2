// Плагин VUE-ROUTER
// Маршрутизация

// Три области:
//       contentView       - область контента/таблицы
//       propertyView    - область свойств выбранного объекта

import Vue    from 'vue'
import Router from 'vue-router'
import { sections } from '@/consts/menuConsts'

// модули Организации
import orgContent     from '@/modules/orgs/orgs-view-content'
import orgProperty    from '@/modules/orgs/orgs-view-property'

// модули Пользователей
import usrContent     from '@/modules/users/users-view-content'
import usrProperty    from '@/modules/users/users-view-property'
// модуль профиля пользователя
import usrProfile from '@/modules/users/users-view-profile'

// модули Проектов
import prjContent     from '@/modules/projects/projects-view-content'
import prjProperty    from '@/modules/projects/projects-view-property'

// модули Групп
import grpContent     from '@/modules/groups/grp-view-content'
import grpProperty    from '@/modules/groups/grp-view-property'

// модули Виртуальных машин
import vmContent      from '@/modules/vms/vms-view-index'
import vmProperty     from '@/modules/vms/vms-view-property'
import vmMonitoring   from '@/modules/vms/vms-view-monitoring'

// модули Сетей
import netContent     from '@/modules/networks/networks-view-content'
import netProperty    from '@/modules/networks/networks-view-property'

// модули Медиа
import medContent     from '@/modules/media/media-view-content'
import medProperty    from '@/modules/media/media-view-property'

// модули Шаблонов
import tmplContent     from '@/modules/templates/templates-view-content'
import tmplProperty    from '@/modules/templates/templates-view-property'

// модуль Tasks list
import vjobContent     from '@/modules/virtualJobs/vjobs-view-content'
import vjobProperty    from '@/modules/virtualJobs/vjobs-view-property'

// модуль локации
import locationContent from '@/modules/locations/locations-view-content'

// модуль dashboard
import dashboardContent from '@/modules/dashboard/dashboard'

// модули Прайслистов
import prcContent     from '@/modules/pricelists/pricelists-view-content'
import prcProperty    from '@/modules/pricelists/pricelists-view-property'

// модули Лимитов
import lmtContent     from '@/modules/limits/limits-view-content'
import lmtProperty    from '@/modules/limits/limits-view-property'

// модули Ролей
import roleContent     from '@/modules/roles/roles-view-content'
import roleProperty    from '@/modules/roles/roles-view-property'

// модули Датасторов
import datastoreContent     from '@/modules/datastores/ds-view-content'
import datastoreProperty    from '@/modules/datastores/ds-view-property'

// модули типов Датасторов
import dstContent     from '@/modules/datastoreTypes/dst-view-content'
import dstProperty    from '@/modules/datastoreTypes/dst-view-property'


import loginPage       from '@/app/_loginPage'
import loginPageNew    from '@/app/_loginPageNew'
import mainPage        from '@/app/_mainPage'
import mainPageContent from '@/app/_mainPageContent'
const store = Vue.prototype.$store

Vue.use(Router)

var lp = stand.isDevelop === undefined || !stand.isDevelop ? loginPage : loginPageNew;

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes:[
    { 
      path: '/', 
      redirect: '/dashboard',
      component: mainPage,
      children:[
          {
            path: '/login',
            redirect: '/login/enter/',
            components: { fullWindowContent : lp },
            children:[
              {  path: "enter"           , component: lp, meta: { fullWindowContent : true }  },
              {  path: "reset"           , component: lp, meta: { fullWindowContent : true }  },
              {  path: "reset/:resetCode", component: lp, meta: { fullWindowContent : true }  }       
            ],
            
          },

          {
            path: "projects", // раздел Проектов
            components: { mainPageContent },
            children: [
              { path: '', alias: ":id", components: { contentView : prjContent, propertyView: prjProperty } }
            ]
          },

          {
            path: "groups", // раздел Групп
            components: { mainPageContent },
            children: [
              { path: '', alias: ":id",   components: { contentView : grpContent, propertyView: grpProperty } }
            ]
          },

          {
            path: "vms",    // раздел Виртуальных машин
            components: { mainPageContent },
            children: [
              { path: '', alias: ":id", components: { contentView : vmContent, propertyView: vmProperty } },
              { path: ':id/monitoring', components: { fullContentView: vmMonitoring } , meta: { fullContentView : true} },                
            ]
          },

          {
            path: "orgs",     // раздел Организаций
            components: { mainPageContent },
            children: [
              { path: '', alias: ":id", components: { contentView : orgContent, propertyView: orgProperty } }
            ]
          },

          {
            path: "users",    // раздел Пользователей
            components: { mainPageContent },
            children: [
              { path: '', alias: ":id",   components: { contentView : usrContent, propertyView: usrProperty } }
            ]
          },

          {
            path: "networks",  // раздел Сетей
            components: { mainPageContent },
            children: [
              { path: '', alias: ":id", components: { contentView : netContent, propertyView: netProperty } }
            ]
          },
       
          {
            path: "media",     // раздел ISO одразов
            components: { mainPageContent },
            children: [
              { path: '', alias: ":id", components: { contentView : medContent, propertyView: medProperty } }
            ]
          },

          {
            path: "location", 
            components: { mainPageContent },
            children: [
              { path: '', alias: ":id", components: { contentView: locationContent } }
            ]
          },

          {
            path: "dashboard", 
            components: { mainPageContent },
            children: [
              { path: '', alias: ":id", components: { contentView: dashboardContent } }
            ]
          },
          
          {
            path: "templates", 
            components: { mainPageContent },
            children: [
              { path: '', alias: ":id", components: { contentView : tmplContent, propertyView: tmplProperty } }
            ]
          },
          
          {
            path: "virtual-jobs", 
            components: { mainPageContent },
            children: [
              { path: '', alias: ":id", components: { contentView : vjobContent, propertyView: vjobProperty } }
            ]
          },
          
          {
            path: "profile", 
            components: { mainPageContent },
            children: [
              { path: '', alias: ":id", components: { contentView: usrProfile } }
            ]
          },
          
          {
            path: "pricelists", 
            components: { mainPageContent },
            children: [
              { path: '', alias: ":id", components: { contentView : prcContent, propertyView: prcProperty } }
            ]
          },

          {
            path: "limits", 
            components: { mainPageContent },
            children: [
              { path: '', alias: ":id", components: { contentView : lmtContent, propertyView: lmtProperty } }
            ]
          },

          {
            path: "roles", 
            components: { mainPageContent },
            children: [
              { path: '', alias: ":id", components: { contentView : roleContent, propertyView: roleProperty } }
            ]
          },

          {
            path: "datastores", 
            components: { mainPageContent },
            children: [
              { path: '', alias: ":id", components: { contentView : datastoreContent, propertyView: datastoreProperty } }
            ]
          },

          {
            path: "dstypes", 
            components: { mainPageContent },
            children: [
              { path: '', alias: ":id", components: { contentView : dstContent, propertyView: dstProperty } }
            ]
          },
        ]     
    }
  ]
});

/**
 *  Два пути воздействия на сайт
 *     1) При клике в интерфейсе
 *     действие на сайте ->  правка url (setQueryFromArray) -> применение параметров в приложении (setAppPropsFromQuery) -> ф-ии VUEX
 *        ** правка url (setQueryFromArray), потому что Query добавляется к существующему пути, 
 *              избегаем ошибки DuplicatePath
 * 
 *     2) При переходе по ссылке
 *     ссылка -> хук перехода router.beforeEach -> применение параметров в приложении (setAppPropsFromQuery) -> ф-ии VUEX
 * 
 */

router.beforeEach((to, from, next)=>{
  // let sectionTo = to.path.substr(1)
  // let featureCodeTo = sections.find(s=>s.pathName==sectionTo).featureCode
  let params = globalThis.location.search
  .replace('?','')
  .split('&')
  .reduce(
      function(p,e){
          var a = e.split('=');
          p[ decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
          return p;
      },
      {}
  );
  var impersonate = '';
  if(!isNullOrUndefined(params.impersonate)){
    store.dispatch('glb_setImpersonatedOrgId', params.impersonate);
    impersonate = `?impersonate=${params.impersonate}`
    if(!isNullOrUndefined(params.organization)){
      store.dispatch('glb_setImpersonatedOrgName', params.organization);
      impersonate += `&organization=${params.organization}`
    }
  }

  if(from.path =='/' && !to.path.includes('/login'))
  {
    log.info(`START Read token`, 'router', arguments)
    Vue.prototype.$auth.readTokens().then(res=>{
      store.dispatch('glb_setMainPageLoading', false);
      if(!res){
        log.info('moveTo login', 'router', arguments)
         next(`/login/${impersonate}`);
      }
      // if(!store.getters.glb_permissions.includes(featureCodeTo)){
      //   next('/vms')
      // }
      
      next();
    })
  }else{
    store.dispatch('glb_setMainPageLoading', false);
    next();
  }
});


/** Хук при переходе на новую страницу */
router.afterEach((to, from) => {
  // выясняем название раздела из урла
  let aggr = to.fullPath.split('?')[0].split('/').filter(word =>word != '');
  if(aggr.length == 0)
    {  next();  return; }
  // ищем среди констант меню
  log.info(`Change section to '${aggr[0]}'`, 'router', arguments)

  let sectionItem = sections.find(item => item.pathName == aggr[0]);
  if(!sectionItem)
    sectionItem = { name : "Login"}
    // задаем выбранный раздел
  store.dispatch('glb_setCurrentSection', sectionItem)
    .then(()=>{
      // применяем параметры строки запроса в приложении
      Vue.prototype.$nav.setAppPropsFromQuery(to.query);
    })

  // store.dispatch('vm_setFilter');
  // store.dispatch('grp_setFilter');
  // store.dispatch('prj_setFilter');
  // передаем на следующий хук, если есть
  // next();
});


Vue.prototype.$routerStatic = router
export default router;
