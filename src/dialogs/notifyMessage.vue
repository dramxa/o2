<template> <!-- v-snackbar  -> class="pa-0 custom-snackbar relative" -->
 <v-snackbar
      v-model="showWindow"
      color="white"
      class="d-notify-message pa-0 custom-snackbar"  
      :timeout="-1"
      multi-line
    >
      <v-layout :class="'d-notify-message__wrapper px-6 py-4 ' + colorClass + '-border'" @mouseenter="mouseEnter()" @mouseleave="pause=false" class="gd-dlg-notifyMsg">
        <v-flex class="d-notify-message__left-icon">
          <i :class="icon +' icon-30 ' + colorClass + '-i'"></i>
        </v-flex>
        <v-flex class="pl-5 mt-1">
          <p :class="['fs-l fw-b mb-3', colorClass]">
            <span class="gd-dlg-notifyMsg-caption">{{caption}}</span>
            <v-btn text class="pa-0 elevation-0 snackbar-close-hover gd-dlg-notifyMsg-close float-right" min-width="25" width="25" height="25" @click="cancelClick">
              <i class="icon-Close grey500-i icon-20" ></i>
            </v-btn>
          </p>
          <p class="gd-dlg-notifyMsg-subjectName grey700 fs-m fw-b mb-0">{{ isNullOrUndefined(subjectName) ? '' : subjectName}}</p>
          <p class="gd-dlg-notifyMsg-message grey700 fs-m" v-html="message"></p>
        </v-flex>
        <v-progress-linear class="d-notify-message__progressbar notify-message-progressbar" height="2px" :value="counter"></v-progress-linear>
      </v-layout>
    </v-snackbar>
</template>

<script>
import { async } from 'q';
import bus from '@/dialogs/windows/windowBus';
import Vue from 'vue';

const component = {
    props: [
      'value', 
      'id',     
      'caption', 
      'message', 
      'subjectName', 
      'colorClass', 
      'type',
      'noTimeout'
      ],

    data(){
      return{
        pause: false,
        counter: 100,
        showWindow: false
      }
    },

    computed:{
      icon(){
        switch(this.type){
          case 'error'  : return 'icon-x-circle';
          case 'info'   : return 'icon-alert-circle';
          case 'warning': return 'icon-alert-triangle';
          case 'success': return 'icon-check-circle';
        } 
      }
    },

    methods:{

      mouseEnter(){
        this.pause = true;
        this.counter = 100;
        console.log(this.pause, this.counter)
      },

      timeout(ms){
         return new Promise(resolve => setTimeout(resolve, ms));
      },

      async timeoutCheck() {
        if(this.noTimeout)
          return;

        while(this.counter>0){
          await this.timeout(100);
          if(!this.pause)
            this.counter--;
        }
        this.showWindow = false;
        bus.$emit('close-' + this.id);
      },

      acceptClick(){
          bus.$emit('close-' + this.id);  // кидаем в шину - закрыть окно
          bus.$emit('accept-' + this.id); // кидаем в шину - ответить что результат Accepted
      },

      cancelClick(){
          this.showWindow = false;
          bus.$emit('close-' + this.id);  // кидаем в шину - закрыть окно
          bus.$emit('cancel-' + this.id); // кидаем в шину - ответить что результат Cancel
      }
    },

    watch:{
      value:function(show){
        this.showWindow = this.value;
        if(show){
          this.timeoutCheck();
        }
      }
    },

    created(){  
        this.showWindow = this.value;
        bus.$on('open-'   + this.id, f=>{ this.showWindow = true; this.timeoutCheck(); })
        bus.$on('close-'  + this.id, f=>{ this.showWindow = false; })             
        bus.$on('accept-' + this.id, f=>{ this.showWindow = false; })             
        bus.$on('cancel-' + this.id, f=>{ this.showWindow = false; })             
    },

    mounted(){
      this.showWindow = this.value;
      if(this.value){
        this.timeoutCheck(this);
      }
    }

}

export function register(){
    Vue.prototype.$windows.registerMessage({ messageCode: 'notifyMessage', component})
}

export default component
</script>
<style lang="stylus">
.d-notify-message
  bottom 1.5cm !important
  &__wrapper
    border-left 4px solid
    position relative
  &__left-icon
    max-width 30px
  &__progressbar
    position absolute !important
    bottom 0 !important
    left 0 !important
    right 0 !important
</style>
<style>
.v-progress-linear.d-notify-message__progressbar .v-progress-linear__determinate{background-color: #B0BEC5 !important;}
.v-progress-linear.d-notify-message__progressbar .v-progress-linear__background{background-color: #ECEFF1 !important;}
</style>