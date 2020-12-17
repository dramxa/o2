// Модуль управления диалогами

import Bus from './windowBus';
import Vue from 'vue'

const moduleName = 'windows'

const module = new Vue({
    data:()=>({
        dialogs: [],

        openedDialogs: [],

        openedDialogNow: null,

        messages: [],

        openedMessages: [],

        openedMessageNow: null

    }),

    methods:{
        showDialog(options){
            var item = this.dialogs.find(f=>f.dialogCode == options.dialogCode);
            if(!isNullOrUndefined(item)){
                {                    
                var id = `f${(+new Date).toString(16)}`;
                var data =  { ...item, id, props: options.props };
                Bus.$on('accept-'+ id, (f)=>{ if(!isNullOrUndefined(options.onAccept)) options.onAccept(f) })
                Bus.$on('cancel-'+ id, (f)=>{ if(!isNullOrUndefined(options.onCancel)) options.onCancel(f) })
                Bus.$on('close-' + id, (f)=>{ if(!isNullOrUndefined(options.onClose )) options.onClose(f); this.closedDialog(id); })
                this.openedDialogs.push(data);
                this.openedDialogNow = data;
                }
            }
        },

        closedDialog(id){
            var ik = this.openedDialogs.map(m=>m.id).indexOf(id);
            this.openedDialogs.splice(ik, 1);
            if(this.openedDialogs.length>0)
            {
                this.openedDialogNow = this.openedDialogs[this.openedDialogs.length-1];
            }else{
                this.openedDialogNow = null
            }
        },

        registerDialog(componentData){
            this.dialogs.push(componentData);
        },





        showMessage(options){
            var item = this.messages.find(f=>f.messageCode == options.messageCode);
            if(!isNullOrUndefined(item)){
                {                    
                var id = `f${(+new Date).toString(16)}`;
                var data =  { ...item, id, props: options.props };
                Bus.$on('accept-'+ id, f=>{ if(!isNullOrUndefined(options.onAccept)) options.onAccept() })
                Bus.$on('cancel-'+ id, f=>{ if(!isNullOrUndefined(options.onCancel)) options.onCancel() })
                Bus.$on('close-' + id, f=>{ if(!isNullOrUndefined(options.onClose )) options.onClose(), this.closedMessage(id) })
                this.openedMessages.push(data);
                this.openedMessageNow = data;
                }
            }
        },

        closedMessage(id){
            var ik = this.openedMessages.map(m=>m.id).indexOf(id);
            this.openedMessages.splice(ik, 1);
            if(this.openedMessages.length>0)
            {
                this.openedMessageNow = this.openedMessages[this.openedMessages.length-1];
            }
        },

        registerMessage(componentData){
            this.messages.push(componentData);
        }
    },

    watch:{
        openedDialogNow: function(data){
            Bus.$emit('showInstanceDialog', data);
        },

        openedMessageNow: function(data){
            Bus.$emit('showInstanceMessage', data);
        }
    },

    created(){
        Bus.$on('InstanceDialogReady', (id)=>{
            Bus.$emit('open-' + id);
        });

        Bus.$on('InstanceMessageReady', (id)=>{
            Bus.$emit('open-' + id);
        });
    }

})

  
export default function () {
    let key = `$${moduleName}`;
    Vue.prototype[key] = module;
  }
  