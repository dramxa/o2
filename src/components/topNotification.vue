<template>
  <v-card flat class="c-top-notification white-light gd-error-menu" v-bar>
    <div class="c-top-notification__wrapper" v-if="type != 'errors'">
    <v-layout class="pa-6 c-top-notification__layout c-top-notification__layout--system">
      <v-flex class="c-top-notification__left-icon-wrapper blue700">
        <i class="icon-alert-circle icon-22 blue700-i"></i>
      </v-flex>
      <v-flex class="pl-5">
        <p class="fs-l fw-b blue700 mb-3">Служебное сообщение <v-btn icon tile class="float-right br-4" width="25" height="25"><i class="icon-check icon-20" ></i></v-btn></p>
        <p class="grey700 fs-m">Task VCenter Error. TaskId: 2f465066-b6b9-4b54-b81d-efead54340d8. Error: Fault Type: VMService.VMWareProvider.InvalidPowerState. VCenter Localized Message: The attempted operation cannot be performed in the current state (Powered off).. 
Fault Details: requestedState: poweredOn 
requestedStateSpecified: True 
existingState: poweredOff</p>
      </v-flex>
    </v-layout>
    <v-layout class="pa-6 c-top-notification__layout c-top-notification__layout--warning">
      <v-flex class="c-top-notification__left-icon-wrapper brown700">
        <i class="icon-alert-triangle icon-22 brown800-i"></i>
      </v-flex>
      <v-flex class="pl-5">
        <p class="fs-l fw-b mb-3 brown800">Попытка входа <v-btn icon tile class="float-right br-4" width="25" height="25"><i class="icon-Close icon-20" ></i></v-btn></p>
        <p class="grey700 fs-m">Trying Login. Company: mosplitka2. User Name: Administrator</p>
      </v-flex>
    </v-layout>
    <v-layout class="pa-6 c-top-notification__layout c-top-notification__layout--success">
      <v-flex class="c-top-notification__left-icon-wrapper green700">
        <i class="icon-check-circle icon-22 green700-i"></i>
      </v-flex>
      <v-flex class="pl-5">
        <p class="fs-l fw-b mb-3 green700">Удаление сети <v-btn icon tile class="float-right br-4" width="25" height="25"><i class="icon-check icon-20" ></i></v-btn></p>
        <p class="grey700 fs-m">Сеть pntk удалена</p>
      </v-flex>
    </v-layout>
    <v-layout class="pa-6 c-top-notification__layout c-top-notification__layout--system">
      <v-flex class="c-top-notification__left-icon-wrapper blue700">
        <i class="icon-alert-circle icon-22 blue700-i"></i>
      </v-flex>
      <v-flex class="pl-5">
        <p class="fs-l fw-b blue700 mb-3">Служебное сообщение <v-btn icon tile class="float-right br-4" width="25" height="25"><i class="icon-check icon-20" ></i></v-btn></p>
        <p class="grey700 fs-m">Task VCenter Error. TaskId: 2f465066-b6b9-4b54-b81d-efead54340d8. Error: Fault Type: VMService.VMWareProvider.InvalidPowerState. VCenter Localized Message: The attempted operation cannot be performed in the current state (Powered off).. 
Fault Details: requestedState: poweredOn 
requestedStateSpecified: True 
existingState: poweredOff</p>
      </v-flex>
    </v-layout>
    <v-layout class="pa-6 c-top-notification__layout c-top-notification__layout--error">
      <v-flex class="c-top-notification__left-icon-wrapper red500">
        <i class="icon-x-circle icon-22 red500-i"></i>
      </v-flex>
      <v-flex class="pl-5">
        <p class="fs-l fw-b red500 mb-3">Служебное сообщение <v-btn icon tile class="float-right br-4" width="25" height="25"><i class="icon-check icon-20" ></i></v-btn></p>
        <p class="grey700 fs-m">Task VCenter Error. TaskId: 2f465066-b6b9-4b54-b81d-efead54340d8. Error: Fault Type: VMService.VMWareProvider.InvalidPowerState. VCenter Localized Message: The attempted operation cannot be performed in the current state (Powered off).. 
Fault Details: requestedState: poweredOn 
requestedStateSpecified: True 
existingState: poweredOff</p>
      </v-flex>
    </v-layout>
    </div>
    <div class="c-top-notification__wrapper" v-if="type=='errors'">
      <v-layout class="pa-6 pb-1 c-top-notification__layout c-top-notification__layout--error" v-for="(err, index) in errorMsg" :key="index">
        <v-flex class="c-top-notification__left-icon-wrapper red500">
          <i class="icon-x-circle icon-22 red500-i"></i>
        </v-flex>
        <v-flex class="pl-5">
          <p class="fs-l fw-b red500 mb-2 "><span class="pointer c-top-notification__item-title gd-error-menu-title" @click="gotoTask(err);">{{err.title}}</span> <v-btn icon tile class="float-right br-4 c-top-notification__item-close-btn" width="25" height="25" @click="deleteMsg(err)"><i class="icon-20" :class="[err.kind == 'message' ? 'icon-Close': 'icon-check']" ></i></v-btn></p>
          <p class="grey700 fs-s mb-2 gd-error-menu-caption" v-if="!isNullOrUndefined(err.caption) && err.caption != ''">{{err.caption}}</p>
          <p class="grey700 fs-m gd-error-menu-description" v-html="err.description"></p>
        </v-flex>
      </v-layout>
    </div>
    <v-layout class="pa-6">
      <v-spacer></v-spacer>
      <v-btn text class="normal-text fs-s fw-b grey300 px-2 mr-2 gd-error-menu-confirmAll-btn" height="24px" @click="deleteAllMsg()">Confirm all</v-btn>
      <v-btn text class="normal-text fs-s fw-b blue900 blue050-b px-2" height="24px" @click="gotoErrorTasks()" v-if="permission('ft_tskRead')" >Show all</v-btn>
    </v-layout>
  </v-card>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: [ 'type' ],

  computed:{
    ...mapGetters(['msg_notAcknowledge']),

    errorMsg(){
      return this.msg_notAcknowledge.filter(msg => msg.type == 'error');
    },

  },

  methods:{
    ...mapActions(['msg_deleteMessage', 'msg_deleteAllMessages']),

    deleteMsg(msg){
      this.msg_deleteMessage(msg);
    },

    deleteAllMsg(){
      this.msg_deleteAllMessages();
    },

    gotoErrorTasks(){
        this.$nav.navigateTo('tasks', { use: true, statuses: ['error'] });
        this.$emit('gototask');
    },

    gotoNotificationsTasks(){
        this.$nav.navigateTo('tasks', { use: true, statuses: ['error'] });
        this.$emit('gototask');
    },

    gotoTask(v){
        if(!permission('ft_tskRead'))
          return;
        this.$nav.navigateTo('tasks', { use: true, objectName: v.id.toString() });
        this.$emit('gototask');
    },

  },
  
}
</script>
<style lang="stylus" scoped>
.c-top-notification
  width 760px
  border-radius 0 !important
  &__wrapper
    max-height 400px
  &__layout
    border-bottom 1px solid var(--white-accent050)
    &--system
      border-left 4px solid var(--white-accent500)
    &--warning
      border-left 4px solid #F7D070
    &--success
      border-left 4px solid #66BB6A
    &--error
      border-left 4px solid #CD3033
  &__item-close-btn
    visibility hidden
  &__layout:hover &__item-close-btn
    visibility visible
  &__left-icon-wrapper
    max-width 22px
  &__item-title:hover
    border-bottom 1px dashed #CD3033
</style>