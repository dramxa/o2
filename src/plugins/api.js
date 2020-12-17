// базовый модуль REST запросов
import Vue from 'vue'
import axios from "axios";
import { httpErrors, methodError } from '@/consts/errorConsts'
import { Observable } from '@/utilites'

const store = Vue.prototype.$store

const moduleName = 'api';

var module = function() {
  var backUrl = function(postfix, noApiInUrl = false){   
    if(!isNullOrUndefined(stand.url))
      return stand.url(postfix, noApiInUrl);    
    let origin = globalThis.location.origin + (noApiInUrl ? '' : '/api');
    return `${origin}/${postfix}`;   
  };

  this.getItemsObservers = {};
  
  /**  выполняется в случае недоступности сервиса при запросе */
  this.serviceUnreachable = function(){
    log.error('serviceUnreachable', 'api');
    store.dispatch('glb_setServiceUnreachable', {value: true})
  };


  /**  попытка обновления токена  */
  this.refreshAuthToken = async function(){
      // выполнение внешней ф-ии обновления токена   
    var isRefreshSuccess = await Vue.prototype.$auth.checkAndRefresh();      
    return isRefreshSuccess; 
  };

  /** ф-я выполняется в случае невозможности получения нового токена
    и переключает приложение в режим ввода логина/пароля 

    TODO: возможно излишняя, поскольку модуль аутентификации уже не смог 
    обновить токен и может сам принять необходимые действия*/
  this.appAuthStatusUnauthorized = async function(){
    Vue.prototype.$context.router.push({ path: '/login' })
  };


  /** ф-я выполняется в случае возникновения ошибки в ходе выполнения запроса к серверу*/
  this.catchError = async function(error, url, method, data){
      if([401,  523].some(f=>f == error.code)) //404, 405,
        return;
        
      log.error('catchError', 'api', arguments);
      console.log(error)
      var codeDescription = httpErrors[error.code];
      var header = '';
      var caption = '';
      var description = '';   
      if(isNullOrUndefined(error.response.error))
      {
        caption = error.code;
        description = codeDescription.description;
        header = codeDescription.header;
      }
      else
      {
        caption = error.code;
        description = error.response.error;
      }
      showMessage('serverError', { caption: caption, message: description, subjectName: header });

      try{
        var objName = !isNullOrUndefined(data) && !isNullOrUndefined(data.name) ? `${data.name}\r\n` : '';
        if(objName=='')
          objName = !isNullOrUndefined(data) && !isNullOrUndefined(data.nameShort) ? `${data.nameShort}\r\n` : '';
        var errConst = methodError[method];

        let msg = { 
          id         : Date.now() / 1000|0,
          type       : 'error', 
          kind       : 'message',
          title      : errConst.caption,
          caption    : objName + url, 
          description: description, 
        wasShown : false,  acknowledge: false }
        store.dispatch('msg_pushNewMessage', msg)        
      }catch(error){
        log.error(error, 'api');
      }
  };
  
  /** Получаем список объектов
   * @url  {Function} метод получения url
   * @filter {Array} Массив параметров для фильтрации результата
   * @return {Object} Массив объектов, вернувшийся с сервера
  */
  this.getItems = function(url, noApiInUrl = false, filter = null){
    var key = url + store.getters.auth_accessToken;
    if(isNullOrUndefined(this.getItemsObservers[key]) || this.getItemsObservers[key].finished)
    {
      this.getItemsObservers[key] = new Observable(async () => await this.getItemsNative(url, noApiInUrl, filter));
      this.getItemsObservers[key].run();
    }

    return this.getItemsObservers[key].observPromise();
  };

  /** Получаем список объектов
   * @url  {Function} метод получения url
   * @filter {Array} Массив параметров для фильтрации результата
   * @return {Object} Массив объектов, вернувшийся с сервера
  */
  this.getItemsNative = function(url, noApiInUrl = false, filter = null){
    var queryString = filter == null ? '' : "?" + Object.keys(filter).map(key =>`${key}=${filter[key]}`).join('&')
    return new Promise((resolve, reject)=>{
      this.request(url + queryString, "GET", null, noApiInUrl).then(res=>{ return res.hasError ? reject(res) : resolve(res.response); })
    });    
  };    
    /**  Получаем конкретный объект по идентификатору 
     * @url  {Function} метод получения url
     * @return {Object} Объект вернувшийся с сервера
    */
  this.getItem = function(url, noApiInUrl = false){
      return new Promise((resolve, reject)=>{
        this.request(url, "GET", null, noApiInUrl)
          .then(res=>{ return res.hasError ? reject(res) : resolve(res.response); })
      });
  };

    /**  Создание нового объекта
     * @url  {Function} метод получения url
     * @item {Object} объект передаваемый на сервер
     * @return {Object} Объект вернувшийся с сервера
    */
  this.postItem = function(url, item, noApiInUrl = false){
      return new Promise((resolve, reject)=>{
        this.request(url, "POST", item, noApiInUrl)
        .then(res=>{ return res.hasError ? reject(res) : resolve(res.response); })
      });
  };

    /**  Изменение всего объекта 
     * @url  {Function} метод получения url
     * @item {Object} объект передаваемый на сервер
     * @return {Object} Объект вернувшийся с сервера
    */
  this.putItem = function(url, item, noApiInUrl = false){
      return new Promise((resolve, reject)=>{
        this.request(url, "PUT", item, noApiInUrl)
          .then(res=>{ return res.hasError ? reject(res) : resolve(res.response); })
      });
  };

    /**  Изменение только указанных полей объекта 
     * @url  {Function} метод получения url
     * @item {Object} объект передаваемый на сервер
     * @return {Object} Объект вернувшийся с сервера
    */
  this.patchItem = function(url, item, noApiInUrl = false){
      return new Promise((resolve, reject)=>{
        this.request(url, "PATCH", item, noApiInUrl)
          .then(res=>{ return res.hasError ? reject(res) : resolve(res.response); })
      });
  };

    /**  Удаление объекта 
     * @url  {Function} метод получения url
     * @item {Object} объект над которым производится действие
     * @return {*} null
    */
  this.deleteItem = function(url, noApiInUrl = false){
        return new Promise((resolve, reject)=>{
          this.request(url, "DELETE")
          .then(res=>{ return res.hasError ? reject(res) : resolve(res.response); })
      });
  };



  /** ф-я выполнения запроса  
   * @url    {Srting} Url постфикс запроса на сервер
   * @method {String} Метод запроса (GET,PUT,POST etc.)
   * @data   {Object} Объект встраиваемый в запрос
   * @return {Object} Результат запроса в виде класса { hasError: (bool),  code: (int), response: (object) }    
  */
  this.request = async function(url, method, data = null, noApiInUrl = false){
    // отправляем запрос  
    var res = await this.requestNative(url, method, data, noApiInUrl);
    // запрос вернулся без ошибок
    if (!res.hasError) return res;

    // если есть ошибка, пробуем переполучить токен
    if (res.code && res.code == 401) {
        var refreshTokenRes = await this.refreshAuthToken(); 
        // если токен успешно обновлен, переотправляем запрос     
        if(refreshTokenRes) 
        {
            res = await this.requestNative(url, method, data);
            if (!res.hasError) 
              return res;               
        }

        // если переаутентифицироваться неудалось, оповещаем приложение
        if(!refreshTokenRes || res.code && res.code == 401)
            await this.appAuthStatusUnauthorized();
    }

    // возврат с информацией об ошибке
    this.catchError(res, url, method, data);
    return res;        
  };


  /** запрос на сервер (внутренняя ф-я, не для использования напрямую)  
   * @url    {Srting} Url постфикс запроса на сервер
   * @method {String} Метод запроса (GET,PUT,POST etc.)
   * @data   {Object} Объект встраиваемый в запрос
   * @return {Object} Результат запроса в виде класса { hasError: (bool),  code: (int), response: (object) }    
  */
  this.requestNative = function(url, method, data, noApiInUrl = false) {
    // формируем header
    let headers = {};
    headers["Content-Type"] = "application/json; charset=utf-8";
    headers["Access-Control-Allow-Origin"] = "*";

    // сам запрос
    return axios({
      method: method,
      url: backUrl(url, noApiInUrl),
      data: data != null ? JSON.stringify(data) : null,
      headers: headers
    })   

      /* все ответы заворачиваем в класс 
            {
                hasError: (bool),
                code:     (int),
                response: (object)
            }      
      */
      .then(Response => {
        if((typeof Response.data) == 'string' && Response.data.startsWith('<!DOCTYPE html>'))
          return { hasError: true, code: 405, response: Response };
        return { hasError: false,  code: Response.status,  response: Response.data  };
       })

      // в случае ошибки
      .catch(error => {
        // если вернулась ошибка с сервера
        if (error.response) {
          let res = { hasError: true,  code: error.response.status,  response: error.response.data  };
          return res;
        } 

        // если сервер недоступен (или проблема с выполнением запроса)
        else if (error.request) {
          this.serviceUnreachable();          
          let res = { hasError: true, code: 523, response: error };
          return res;
        } 
        
        // если совсем неизвестная ошибка
        else {
          let res = { hasError: true, code: null, response: error };
          return res;
        }
      }); // <-- catch
  }
};
  
export default function () {
  let key = `$${moduleName}`;
  Vue.prototype[key] = new module();
}
