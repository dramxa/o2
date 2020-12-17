import Vue from 'vue';
import { sections } from '@/consts/menuConsts';

const store = Vue.prototype.$store

const moduleName = 'nav'

const module = {
    showDetailsRoute: function (id){
      // выясняем название раздела из урла
      var router = Vue.prototype.$context.router;
      let aggr = router.currentRoute.fullPath.split('?')[0].split('/').filter(word =>word != '');
     
      if(aggr.length == 0)
        return; 
       // ищем среди констант меню
      let sectionItem = sections.filter(item => item.pathName == aggr[0])[0];
      if(!sectionItem)
        return;
      
      module.setQueryFromArray({
        'propType' : sectionItem.pathName,
        'propObjId': id ,
        'propMode' : 'details'}
      )

      store.dispatch(sectionItem.code + '_setShowProperty', id);       
    },

    showDetailsInNewWindow: function (id){
        // выясняем название раздела из урла
        var router = Vue.prototype.$context.router;
        let aggr = router.currentRoute.fullPath.split('?')[0].split('/').filter(word =>word != '');
    
      if(aggr.length == 0)
        return; 
      // ищем среди констант меню
      let sectionItem = sections.filter(item => item.pathName == aggr[0])[0];
      let pathName = sectionItem.pathName
      module.navigateToNewWindow(`/${pathName}?propType=${pathName}&propObjId=${id}&propMode=details`, false);
    },

    showDetailsRouteClear(){
      module.setQueryFromArray({
        'propType' : null,
        'propObjId': null,
        'propMode' : null}
      )
    },

    navigateToNewWindow: function(url, isFocus){
      if(isNullOrUndefined(isFocus))
        isFocus = false;
      let impersonate = store.getters.glb_impersonatedOrgId == '' ? '' : store.getters.glb_impersonatedOrgName == '' ? `&impersonate=${store.getters.glb_impersonatedOrgId}` : `&impersonate=${store.getters.glb_impersonatedOrgId}&organization=${encodeURIComponent(store.getters.glb_impersonatedOrgName)}`;
      if(isFocus){
        globalThis.open(location.origin + url + impersonate, '_blank');
      }else{
        let newwin = globalThis.open(location.origin + url + impersonate, '_blank');
        newwin.blur();
        globalThis.focus();
      }
    },

    navigateTo: function(section, filter, newWindow){
      return new Promise((resolve) =>
        {      
          if(isNullOrUndefined(newWindow))
            newWindow = false;
          if(isNullOrUndefined(filter))
            filter = {};
          let sectionItem = sections.filter(item => item.pathName == section)[0];
          let currentSection = store.getters.glb_currentSection;
          var module = Vue.prototype['$'+currentSection.code];
          let hasModule = !isNullOrUndefined(module);

          var emtyFilter = store.getters[sectionItem.code + '_emptyFilter'];
          var res =  Object.assign({...emtyFilter}, filter);
          var router = Vue.prototype.$context.router;   
          
          if(newWindow){
            let encodeFilters = stringToHex(JSON.stringify(res));
            let impersonate = store.getters.glb_impersonatedOrgId == '' ? '' : store.getters.glb_impersonatedOrgName == '' ? `&impersonate=${store.getters.glb_impersonatedOrgId}` : `&impersonate=${store.getters.glb_impersonatedOrgId}&organization=${encodeURIComponent(store.getters.glb_impersonatedOrgName)}`;
            globalThis.open(`${location.origin}/${sectionItem.pathName}?filterType=${sectionItem.pathName}&filtersObj=${encodeFilters}${impersonate}`);
            return resolve(true);
          }else{ 
            if(store.getters.guide_show){
              let impersonate = store.getters.glb_impersonatedOrgId == '' ? '' : store.getters.glb_impersonatedOrgName == '' ? `?impersonate=${store.getters.glb_impersonatedOrgId}` : `?impersonate=${store.getters.glb_impersonatedOrgId}&organization=${encodeURIComponent(store.getters.glb_impersonatedOrgName)}`;
              router.push('/' + sectionItem.pathName + impersonate);  
              if(sectionItem.code != 'dshb') 
                store.dispatch(sectionItem.code + '_setFilter', res );
              store.dispatch(currentSection.code + '_setShowProperty'); // закрываем свойства и прекращаем редактирование 
              // setTimeout(Vue.prototype['$' + sectionItem.code].afterEnterSectionInner, 500);
              return resolve(true);
            }
            else{
              if(!hasModule){
                let impersonate = store.getters.glb_impersonatedOrgId == '' ? '' : store.getters.glb_impersonatedOrgName == '' ? `?impersonate=${store.getters.glb_impersonatedOrgId}` : `?impersonate=${store.getters.glb_impersonatedOrgId}&organization=${encodeURIComponent(store.getters.glb_impersonatedOrgName)}`;
                router.push('/' + sectionItem.pathName+impersonate); 
              } else{
                module.canLeaveSection()
                .then(r=>
                  {
                    let impersonate = store.getters.glb_impersonatedOrgId == '' ? '' : store.getters.glb_impersonatedOrgName == '' ? `?impersonate=${store.getters.glb_impersonatedOrgId}` : `?impersonate=${store.getters.glb_impersonatedOrgId}&organization=${encodeURIComponent(store.getters.glb_impersonatedOrgName)}`;
                    router.push('/' + sectionItem.pathName + impersonate); 
                    if(sectionItem.code != 'dshb') 
                      store.dispatch(sectionItem.code + '_setFilter', res );
                    store.dispatch(currentSection.code + '_setShowProperty'); // закрываем свойства и прекращаем редактирование 
                    // setTimeout(Vue.prototype['$' + sectionItem.code].afterEnterSectionInner, 500);
                    return resolve(true);
                  }
                )
                .catch(r=>{
                  return resolve(false);
                });
              }
            }              
          }
        });      
    },

    /** Добавление массива в query url, 
     * без перегрузки роутера и дальнейшее применение параметров в приложении 
     * @query {array} массив параметров запроса
     */
    setQueryFromArray: function(query){
      if(isNullOrUndefined(query))
        return;

      log.debug(query, 'router')

      var params = globalThis.location.search.substring(1).split('&')
          .reduce(function(r, e) {
            var k = e.split('=');
            r[k[0]] = k[1];
            return r;
          }, {});

      var newParams = Object.assign({}, params, query);
      var propToDelete = Object.entries(newParams).filter(f=>isNullOrUndefined(f[1]))
      propToDelete.forEach(f=>{
        delete newParams[f[0]]
      })

      var route = Vue.prototype.$context.router.currentRoute;      

      var path = Object.keys(newParams).length > 0 ?  route.path +
            '?' +
            Object.keys(newParams)
            .map(key => {
                return (
                encodeURIComponent(decodeURIComponent(key)) + '=' + encodeURIComponent(decodeURIComponent(newParams[key]))
                )
            })
            .join('&')
            : route.path
      history.pushState(
        {},
        null,
        path
        );
    
       // module.setAppPropsFromQuery(query);
    },
  
  /** Удаление из строки запроса  
   * @queryNameArray {obj} массив имен параметров, которые удаляем 
   */
  clearQuery: function(){
      var route = Vue.prototype.$context.router.currentRoute;
      log.debug(route, 'router')

      history.pushState(
        {},
        null,
        route.path
        );
  },

  setFilter: function(filter){
    let filterToB64 = stringToHex(JSON.stringify(filter));

    var router = Vue.prototype.$context.router;
    let aggr = router.currentRoute.fullPath.split('?')[0].split('/').filter(word =>word != '');

    let sectionItem = sections.filter(item => item.pathName == aggr[0])[0];
    if(!sectionItem)
      return;
    module.setQueryFromArray({
      'filterType' : sectionItem.pathName,
      'filtersObj' : filterToB64,
    })
  },

  clearFilter: function(){
    module.setQueryFromArray({
      'filterType' : null,
      'filtersObj' : null,
    })
  },
  
  
  /** Применение параметров из массива в приложение
   * @query {obj} массив параметров
  */
  setAppPropsFromQuery: function(query) {
    var type = query['propType'];
    var mode = query['propMode'];
    var id = query['propObjId'];
    var filterType = query['filterType'];
    var filters = query['filtersObj'];
  
    // поскольку мы в область свойств мапим вьюху конкретного объекта
    // не разрешаем вывод свойств не для текущего агрегата
    let section = store.getters['glb_currentSection'];
    if(type!=section.pathName && filterType!=section.pathName)
      return;

    // ищем среди констант меню
    var sectionItem = sections.filter(item => item.pathName == type || item.pathName == filterType)[0];

    if(filterType && filters){
      let filtersDecode = JSON.parse(hexToString(filters));
      store.dispatch(sectionItem.code + '_setFilter', filtersDecode);
    }
    
    // если все параметры существуют
    if(type && mode && id && sectionItem)
    {        
      if(mode == 'details') // выводим панель свойств
        {
          store.dispatch(sectionItem.code + '_setShowProperty', id);
        }
    }
  }
}

  
export default function () {
    let key = `$${moduleName}`;
    Vue.prototype[key] = module
}
  