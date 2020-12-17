import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex';
import extBus from '@/modules/_system/_extension/_bus'
import { wsObjectTypes, wsStatusCodes } from '@/consts/websocketConsts'

const store = Vue.prototype.$store

const moduleName = 'websocket'
const api_url = 'v1.0/reactive';

const SOCKET_STATE_CONNECTING = 0;
const SOCKET_STATE_OPEN       = 1;
const SOCKET_STATE_CLOSING    = 2;
const SOCKET_STATE_CLOSED     = 3;


const moduleObj = {
    store,

    data(){
        return {
            socket : null
        }
    },

    watch:{
        auth_success:{
            handler: function(value){
                log.debug(`change state auth_success ${value}`, 'websocket') 
                this.startConnection(); // при любом изменении выполняем. Если false то подключение закроется
                },
            immediate: true       
        }       
    },

    computed:{
        ...mapGetters(['auth_success', 'auth_accessToken']),

        url(){
            var url = this.backUrl(api_url)
                        .replace('http', 'ws')
                        .replace('https', 'wss');

            if(stand.isLocal)            
                url = stand.websocket(api_url);             
            
            return url;
        }
    },

    methods:{
        backUrl: function(postfix){
            if(!isNullOrUndefined(stand.url))
                return stand.url(postfix);
    
            return globalThis.location.origin + `/api/${postfix}`;   
        },  

        startConnection(){
            if(stand.isLocal && !stand.useWebsocket){
                log.debug('websocket disabled', 'websocket')
                return;
            }
                
            log.debug('websocket-startConnection', 'websocket')
            log.debug({
                socket     : this.socket,
                readyState : isNullOrUndefined(this.socket) ? null : this.socket.readyState
            }, 'websocket')
            if(!isNullOrUndefined(this.socket) 
                // && this.socket.readyState == SOCKET_STATE_CONNECTING
                // && this.socket.readyState == SOCKET_STATE_OPEN
                ){
                /*
                https://tools.ietf.org/html/rfc6455#section-7.4.1
                1001 indicates that an endpoint is "going away", such as a server going down or a browser having navigated away from a page.
                */
               log.debug('websocket-startConnection Close', 'websocket')
               this.socket.close(3000 , "User change token");
            }

            if(!this.auth_success)
                return;

            log.info('websocket-startConnection CreateConnect', 'websocket', this.auth_accessToken)
            try {
                this.socket = new WebSocket(this.url, [this.auth_accessToken]);  
                this.socket.onclose   = this.onClose;
                this.socket.onerror   = this.onError;
                this.socket.onmessage = this.onMessage;
                this.socket.onopen    = this.onConnect;                
            } catch (error) {
                console.log(error)
            }
        },

        onMessage(event){       
            // отключаем реактивность, если запущен гайд     
            if(store.getters.guide_show)
                return
            let data =JSON.parse(event.data);            
            log.debug(data, 'websocket')
           // console.log(data)
            if(!isNullOrUndefined(data.objectCode))      
                extBus.$emit('websocket-message-' + wsObjectTypes[data.objectCode], data.object)
    
        },

        onError(event){
            log.error(event, 'websocket')
        },

        onConnect(event){
            log.debug(event, 'websocket')
        },

        onClose: async function(event){
            if(!isNullOrUndefined(event) && event.code==3000)
                return;
            
            var codeDescription = wsStatusCodes[event.code];
            var msg = { code: event.code, reason: event.reason, details : null }
            if(!isNullOrUndefined(codeDescription))
                msg.details = codeDescription;
            log.debug(msg, 'websocket')
            var self = this;
            await this.$auth.checkAndRefresh();
            setTimeout(()=>{self.startConnection();}, 5000);
        },

        
        emulate : function(module, object){
            extBus.$emit('websocket-message-' + module, object);
        }
    }

};




export default function () {
    let key = `$${moduleName}`;
    Vue.prototype[key] = new Vue(moduleObj);
}
  


