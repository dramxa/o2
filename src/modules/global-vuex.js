import Vue from 'vue'
import { languages } from '@/lang'
// Модуль vuex. 
// Переменные и действия влияющие на всю страницу (сайт)
const state = {
    _glb_currentSection      : null,// текущий раздел
    _glb_previousSection     : null,// предыдущий раздел
    _glb_loadingCount        : 0,   // счетчик текущих загрузок

    _glb_showFilters         : false,  // флаг - показать фильтры
    _glb_showProperty        : false,  // флаг - показать область свойств

    _glb_mainPageLoading     : true,  // флаг при выставляется при переходе с / на любую страницу до окончания проверки токена
    _glb_serviceUnreachable  : false,  // флаг недоступности сервиса

    _glb_permissions         : [],
    _glb_permissionGA        : false,

    _glb_theme               : 'white',

    _glb_impersonatedOrgId   : '',

    _glb_impersonatedOrgName : '',

    _glb_pricePeriod         : 'MONTH',

    _glb_language            : null,

    _glb_menuExpanded        : false,

    _glb_colorStyleVars      : {}
}

const getters = {
    glb_currentSection      : state => state._glb_currentSection,
    glb_previousSection     : state => state._glb_previousSection,
    glb_showLoading         : state => state._glb_loadingCount > 0,
    glb_showFilters         : state => state._glb_showFilters,
    glb_showProperty        : state => state._glb_showProperty,

    glb_mainPageLoading     : state => state._glb_mainPageLoading,

    glb_serviceUnreachable  : state => state._glb_serviceUnreachable,

    glb_permissionPA        : state => state._glb_permissionGA,
    glb_permissions         : state => state._glb_permissions,

    glb_current_theme       : state => state._glb_theme,

    glb_impersonatedOrgId   : state => state._glb_impersonatedOrgId,

    glb_impersonatedOrgName :  state => state._glb_impersonatedOrgName,

    glb_impersonated        : state => state._glb_impersonatedOrgId != '',

    glb_pricePeriod         : state => state._glb_pricePeriod,
    
    glb_menuExpanded        : state => state._glb_menuExpanded,

    glb_language            : state => state._glb_language,

    glb_colorStyleVars      : state => state._glb_colorStyleVars
}

const actions = {
    /** применение параметров текущего раздела 
     * @data {object} объект раздела из массива констант
    */
   glb_setLanguageFrmLs: async ({commit}) => {
        let lang = languages.find(w=>w.isDefault);
        let langLsCode = localStorage.getItem('langCode');
        if(!isNullOrUndefined(langLsCode) && languages.find(w=>w.code == langLsCode) != null){
            lang = languages.find(w=>w.code == langLsCode);
        }

        commit("GLB_SET_LANGUAGE", lang);
    },

    glb_setColorStyleVars({commit}, value){
        commit("GLB_SET_COLOR_STYLE_VARS", value);
    },

    glb_setLanguage: async ({commit}, code) => {
        let lang = languages.find(w=>w.code == code);
        localStorage.setItem('langCode', lang.code);
        commit("GLB_SET_LANGUAGE", lang);
    },

    glb_setCurrentSection: async ({commit, dispatch}, data) => {
        commit("GLB_SET_CURRENT_SECTION", data);
        dispatch("glb_setShowProperties", false);
    },

    glb_setPricePeriod:  async ({commit}, value) => {
        commit("GLB_SET_PRICE_PERIOD", value);
        localStorage.setItem('pricePeriod', value);
    },

    glb_setImpersonatedOrgId:  async ({commit}, value) => {
        commit("GLB_SET_IMPERSONATE_ORG_ID", value);
    },

    glb_setImpersonatedOrgName:  async ({commit}, value) => {
        commit("GLB_SET_IMPERSONATE_ORG_NAME", value);
    },

    glb_setMainPageLoading:  async ({commit}, value) => {
        commit("GLB_SET_MAIN_PAGE_LOADING", value);
    },

    glb_setPermissions :  async ({commit}, value) => {
        commit("GLB_SET_PERMISSIONS", value);
    },

    /** увеличиваем счетчик текущих загрузок */
    glb_incLoading:  async ({commit}) => {
        commit("GLB_INC_LOADING");
    },

    /** уменьшаем счетчик текущих загрузок */
    glb_decLoading:  async ({commit}) => {
        commit("GLB_DEC_LOADING");
    },

    /** задает параметр вывода фильтров 
     * @value {bool} true -показать область, false -скрыть
    */
    glb_setShowFilters: async ({commit}, value) => {
        commit("GLB_SET_SHOW_FILTERS", value);
    },

    /** задает параметр вывода области свойств 
     * @value {bool} true -показать область, false -скрыть
    */
    glb_setShowProperties: async ({commit}, value) => {
        return new Promise((resolve) => {
            commit("GLB_SET_SHOW_PROPERTY", value);
            if(!value)
                setTimeout(()=>{ 
                    if (!isNullOrUndefined(Vue.prototype.$nav))
                        Vue.prototype.$nav.showDetailsRouteClear();
                    resolve(); 
                }, 500);
            else
                return resolve();
          });
    },

    /** Устанавливает параметр недоступности сервиса */
    glb_setServiceUnreachable: async ({commit}) => {
        commit("GLB_SET_SERVICE_UNREACHABLE");
    },

    glb_setTheme: async ({commit}, value) => {
        commit("GLB_SET_THEME", value);
        localStorage.setItem('currentTheme', value);
    },

    glb_setThemeFromLS: ({commit}) => {
        let theme = localStorage.getItem('currentTheme');
        if(!isNullOrUndefined(theme))
            commit("GLB_SET_THEME_FROM_LOCAL_STORAGE", theme);
    },

    glb_setPricePeriodFromLS: ({commit}) => {
        let period = localStorage.getItem('pricePeriod');
        if(!isNullOrUndefined(period))
            commit("GLB_SET_PRICE_PERIOD", period);
    },

    glb_setMenuExpanded: async ({commit}, value) => {
        commit("GLB_SET_MENU_EXPANDED", value);
    },
}

const mutations = {
    GLB_SET_LANGUAGE(state, value){
        state._glb_language = value;
    },

    GLB_SET_COLOR_STYLE_VARS(state, value){
        state._glb_colorStyleVars = value;
    },

    GLB_SET_CURRENT_SECTION(state, data) {
        if(!isNullOrUndefined(state._glb_currentSection))
            state._glb_previousSection =  Object.assign(clone(state._glb_currentSection));
        state._glb_currentSection = data;
    },

    GLB_SET_PERMISSIONS(state, { permissions, globalAdministrator }) {
        state._glb_permissionGA = globalAdministrator; 
        state._glb_permissions = permissions; 
    },

    GLB_SET_PRICE_PERIOD(state, value) {
        state._glb_pricePeriod = value;
    },    

    GLB_SET_IMPERSONATE_ORG_ID(state, value) {
        state._glb_impersonatedOrgId = value;
    }, 

    GLB_SET_IMPERSONATE_ORG_NAME(state, value) {
        state._glb_impersonatedOrgName = value;
    },    

    GLB_SET_MAIN_PAGE_LOADING(state, value) {
        state._glb_mainPageLoading = value;
    },    
    
    GLB_INC_LOADING(state) {
        state._glb_loadingCount = state._glb_loadingCount + 1;
    },

    GLB_DEC_LOADING(state) {
        state._glb_loadingCount = state._glb_loadingCount - 1;
    },

    GLB_SET_SHOW_FILTERS(state, value) {
        state._glb_showFilters = value;
    },    
    
    GLB_SET_SHOW_PROPERTY(state, value) {
        state._glb_showProperty = value;
    },

    GLB_SET_SERVICE_UNREACHABLE(state){
        state._glb_serviceUnreachable = true;
    },

    GLB_SET_THEME(state, value) {
        state._glb_theme = value;
    },

    GLB_SET_THEME_FROM_LOCAL_STORAGE(state, value) {
        state._glb_theme = value;
    },

    GLB_SET_MENU_EXPANDED(state, value){
        state._glb_menuExpanded = value
    }

}

export default {
    state,
    getters,
    actions,
    mutations
}
  