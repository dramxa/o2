import Vue from 'vue';
import configAuth from '@/authConfig'
import axios from "axios";
import authVuexModule from './auth-vuex'
import { mapGetters, mapActions } from 'vuex';
import { Observable } from '@/utilites'

const store = Vue.prototype.$store
const moduleName = 'auth'
const ROLE_KEY = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

const moduleObj = {
  store,

  data(){
    return {
      firstStart              : false,
      impersonatedOrgId       : '',
      impersonatedOrgName     : '',
      impersonatedOrgIdPrefix : '',

      observCheckAndRefresh   : null // единый пул наблюдателей при множестве запросов к ф-ии
    }
  },

  computed:{
    ...mapGetters(['auth_accessToken', 'auth_accessTokenInfo', 'auth_refreshToken'])
  },

  created(){
    let params = globalThis.location.search.replace('?','').split('&')
    .reduce((p,e)=>{
            var a = e.split('=');
            p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
            return p;
        }, {}
    );

    if(!isNullOrUndefined(params.impersonate) && params.impersonate != ''){
      this.impersonatedOrgId = params.impersonate;
      this.impersonatedOrgIdPrefix = `${params.impersonate}_`;
      if(!isNullOrUndefined(params.organization) && params.organization != ''){
        this.impersonatedOrgName = params.organization;
      }
    }

    // ставим хуки на обновления записей в локалсторе
    Vue.ls.on(`${this.impersonatedOrgIdPrefix}tokens` , this.onChangeTokens);
  },
    
  methods:{
    ...mapActions([
      'auth_setData',
      'auth_setSuccess',
      'usr_setCurrentUserId'
    ]),

    backUrl: function(postfix){
      if(!isNullOrUndefined(stand.url))
        return stand.url(postfix);

      return globalThis.location.origin + `/api/${postfix}`;          
    },  

    /** 
      обновляет данные в vuex
      срабатывает при изменении в локалсторе
    */
    onChangeTokens: function(tokens){
      if(tokens == null && this.auth_accessToken == null)
        return;

      if(tokens == null && this.auth_accessToken != null){
        this.logout();
        return
      }

      if (tokens.accessToken != this.auth_accessToken){
        this.saveTokens(tokens.accessToken, tokens.refreshToken);
        return;
      }
    },



    /** очищает переменные и удаляет данные из хранилища */
    clearTokens: function(){
      console.log('clearTokens')
      this.auth_setSuccess(false); 
      this.auth_setData({accessToken: null, refreshToken: null, accessTokenInfo : null });
      store.dispatch('usr_setCurrentUserId', null); 
      delete axios.defaults.headers.common['Authorization'];
      
      Vue.ls.remove(this.impersonatedOrgIdPrefix + 'tokens');
    },

    /** сохраняет данные в переменные и помещает данные в хранилище */
    saveTokens: function(accessToken, refreshToken){
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      let accessTokenInfo = JSON.parse(atob(accessToken.split('.')[1]));
      this.auth_setData({accessToken, refreshToken, accessTokenInfo });
      this.usr_setCurrentUserId(accessTokenInfo.user_id);
      this.auth_setSuccess(true);     

      Vue.ls.set(this.impersonatedOrgIdPrefix + 'tokens' , { accessToken, refreshToken });
      Vue.prototype.$security.fillPermissions();
    },


    logout: function(){
      this.clearTokens();
      var section = globalThis.location.pathname.split('/')[1];
      if(section!='login' && !isNullOrUndefined(Vue.prototype.$context)){
        let impersonate = this.impersonatedOrgId == '' ? '' : this.impersonatedOrgName == '' ? `?impersonate=${this.impersonatedOrgId}` : `?impersonate=${this.impersonatedOrgId}&organization=${encodeURI(this.impersonatedOrgName)}`
        Vue.prototype.$context.router.push({ path: `/login/${impersonate}` });
      }
      document.location.reload(true);
    },

    /** читает данные из хранилища и помещает их в переменные */
    readTokens: async function (){
      log.debug('readTokens', 'auth');
      var { accessToken,  refreshToken} = Vue.ls.get(this.impersonatedOrgIdPrefix + 'tokens') || {};

      if(isNullOrUndefined(accessToken) || isNullOrUndefined(refreshToken))
      {
        this.logout();
        return false;     
      }

      this.firstStart = true;
      this.saveTokens(accessToken, refreshToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      var isCheckTrue = await this.checkAndRefresh();//   await this.tryRefresh();     
      log.info(`Refresh token complete, result: ${isCheckTrue}`, 'auth');
      this.firstStart = false;
      if(isCheckTrue){
        store.dispatch('usr_setCurrentUserId', this.auth_accessTokenInfo.user_id); 
        return true;
      }
      
      this.logout();
      return false;
    },

    /** аутентивикация на сервере */
    login: function(username, password){
      username = encodeURIComponent(username);
      password = encodeURIComponent(password);
      var impersonatedOrgId = encodeURIComponent(this.impersonatedOrgId);

      return new Promise((resolve, reject) => {
        var data = Object.keys(configAuth.data).map(key => key + '=' + encodeURIComponent(configAuth.data[key])).join('&');
        data += `&username=${username}&password=${password}&target_org_id=${impersonatedOrgId}`;
        this.request('POST', configAuth.urlToken, data, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'})
          .then(res=>{
            var { access_token, refresh_token } = res.response;
            let accessTokenInfo = JSON.parse(atob(access_token.split('.')[1]));
            // если идет имперсонация
            if(!isNullOrUndefined(impersonatedOrgId) && impersonatedOrgId != '' ){
              // если авторизировался не в целевую организацию
              if(impersonatedOrgId != accessTokenInfo.org_id){
                console.log('если авторизировался не в целевую организацию');
                return reject(res);
              }
              // если нет прав PlatformAdmin
              if(!accessTokenInfo[ROLE_KEY].includes('PlatformAdministrator')){
                console.log('если нет прав PlatformAdmin');
                return reject(res);
              }
            }

            this.saveTokens(access_token, refresh_token)  
            return resolve();
          })
          .catch(res=>{
            this.clearTokens(); // сомнительная необходимость
            return reject(res);
          });
        });
    },
    
    /** проверяет валидность текущего токена (с пулом)*/
    checkAndRefresh: function(){
      log.info('auth-checkAndRefresh start', 'auth');
      if(this.observCheckAndRefresh == null || this.observCheckAndRefresh.finished){
        this.observCheckAndRefresh = new Observable(this.checkAndRefreshNative);
        this.observCheckAndRefresh.run();
      }
      return this.observCheckAndRefresh.observPromise();
    },

    /** проверяет валидность текущего токена (без пула)*/
    checkAndRefreshNative: function(){
      return new Promise((resolve) => {
        this.request('get', configAuth.urlCheckToken)
        .then(()=>resolve(true))
        .catch(res=>{            
            if(res.code == 401)
            {
              this.refresh()
                .then (() => resolve(true))
                .catch(() => resolve(false));
            }
            else
              return resolve(false);
          });
      });
    },

    /** обновляем токены через токен рефреша */
    refresh: function(){
      log.info('auth-refresh start', 'auth');
      return new Promise((resolve, reject) => {  
        var authCls = {...configAuth.data};
        authCls.grant_type = 'refresh_token';
        authCls['refresh_token']=this.auth_refreshToken;
        
        var data = Object.keys(authCls).map(key => key + '=' + authCls[key]).join('&');
        this.request('POST', configAuth.urlToken, data, {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'})
        .then(res=>{
              var { access_token, refresh_token } = res.response;
              axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
              this.saveTokens(access_token, refresh_token);
              return resolve();
            })
        .catch(res=>{
            this.logout();
            return reject(res);
          });
      });
    },

    // используется при получении сигнала о изменении данных о пользователе
    tryRefresh: function(){
      return new Promise((resolve)=>{
        this.refresh()
          .then(res=>{
            return resolve(true);
          })
          .catch(res =>{            
            return resolve(false); 
          });
      });
    },

    /** нативный запрос */
    request: function(method, url, data, headers = {}){
        return new Promise((resolve, reject) => {
          axios({
            method: method,
            url: this.backUrl(url),
            data: data,
            headers
          })
          
          .then(res => resolve({ hasError: false,  code: res.status,  response: res.data  }))

          // в случае ошибки
          .catch(error => {
            log.error(error, 'auth')
            // если вернулась ошибка с сервера
            if (error.response) {
              return reject ({ hasError: true,  code: error.response.status,  response: error.response.data  });
            } 
            // если сервер недоступен (или проблема с выполнением запроса)
            else if (error.request) {
              return reject ({ hasError: true,  code: 523,  response: error  });
            } 
            // если совсем неизвестная ошибка
            else {
              return reject ({ hasError: true,  code: null,  response: error  });
            }
        }); // <-- catch
      }) // <-- promise
    }
  },

  
}

  
export default function () {
  store.registerModule(moduleName, authVuexModule);
  let key = `$${moduleName}`;
  Vue.prototype[key] = new Vue(moduleObj);
}
