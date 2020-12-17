<!--noindex-->Общий тулбар - название раздела, кники событий и залогиненного пользователя<!--/noindex-->
<template>
  <v-toolbar flat  max-height="112px" class="pl-2">
    <!-- <template #extension > extension-height="50px"
      <router-view name="tbExtentionView"></router-view>
    </template> -->

    <v-toolbar-title style="line-height: 20px; font-size:20px" class="grey500 d-flex align-center nonselect">
      <i :class="glb_currentSection.icon" class="mr-3 grey500-i icon-22"></i>
      <span>{{glb_currentSection.name}}</span>
      <v-chip v-if="showImpersonation" close close-icon="icon-Close icon-14 impersonation-chip-close-button br-4"  style="height:24px;" class="ml-4 br-4 grey700 grey100-b fs-m fw-b">DT Company/m.lazar - encapsulation</v-chip>
    </v-toolbar-title>
    
    <div class="flex-grow-1"></div>

    <v-menu offset-y left :close-on-content-click="false" v-model="notificationMenu">
      <template v-slot:activator="{ on, value }">
        <v-btn v-if="permission('ft_uploadManager')" class="br-4 pl-2 mx-2 d-flex align-center"  v-on="on" :class="{'grey100-b': value}" height="36" width="36" icon tile>
          <v-progress-circular  size="30" 
            :indeterminate="true" 
            width="1" class="grey500 fs-xs fw-b mr-2">
            <i class="mdi mdi-arrow-up-bold icon-24 grey500-i mt-n1"></i>
          </v-progress-circular> 
        </v-btn>
      </template>
      <c-upload-list />
    </v-menu>
    <v-btn v-if="permissionPA()" class="br-4 mx-2" height="36" width="36" icon tile @click="openFeaturesDialog()">
      <i class="mdi mdi-code-tags-check icon-24 grey500-i"></i>
    </v-btn>
    <v-btn v-if="debugBtnShow" class="br-4 mx-2" height="36" width="36" icon tile @click="openDebugDialog()">
      <i class="mdi mdi-bug-outline icon-24 grey500-i"></i>
    </v-btn>
    <v-menu offset-y left :close-on-content-click="false" v-if="errorMsg.length" v-model="errorMenu">
      <template v-slot:activator="{ on, value }">
        <v-btn  class="br-4 mx-2 gd-error-menu-btn" v-on="on" height="36" width="36" :class="{'grey100-b': value}" icon tile :disabled="!errorMsg.length">
          <i class="icon-alert icon-20 grey500-i"></i>
          <div class="alert-dot red500-b" v-show="errorMsg.length"></div>
        </v-btn>
      </template>
      <c-top-notification type="errors" @gototask="errorMenu = false"></c-top-notification>
    </v-menu>
    <!-- <v-menu offset-y left :close-on-content-click="false" v-model="notificationMenu">
      <template v-slot:activator="{ on, value }">
        <v-btn class="br-4 mx-2" style="transition: .2s ease-out; transition-delay: 0.25s;" v-on="on" height="36" width="36" :class="{'grey100-b': value}"  icon tile>
          <i class="icon-Bells icon-20 grey500-i"></i>
          <div class="alert-dot green500-b"></div>
        </v-btn>
      </template>
      <c-top-notification type="notifications" @gototask="notificationMenu = false"></c-top-notification>
    </v-menu> -->
    
    <transition name="user-menu-button-translate">
    <v-menu offset-y left :close-on-content-click="true" class="mt-4" v-if='!glb_showProperty'>
      <template v-slot:activator="{ on, value }">
        <v-btn text v-on="on" :ripple="false" class="pa-0 ml-4 account-btn gd-account-menu-btn">
          <v-avatar class="mr-3 grey200-b grey300-border border" size="34">
            <span class="white--text ">{{userLetters}}</span>
          </v-avatar>
          <!-- <img src="/img/user_avatar.png" class="mr-3 user-avatar" alt="avatar"> -->
          <div class="account text-left grey500">
            <div class="account-title">{{userTitle}}</div>
            <div class="account-subtitle">{{userDomain}}</div>
          </div>
          <i class="grey500-i icon-ChDown ml-2 default-border-radius user-arrow-btn" :class="{'grey100-b icon-ChUP': value}"></i>
        </v-btn>
      </template>
      <v-list width="300px" class="control-combobox py-2 grey500 border blue050-border br-4 gd-account-menu">
          <v-list-item height="32px" class="fs-m gd-account-menu-profile" @click="showProfile()">
            <span class="grey700">Profile</span>
            <v-spacer/>
            <span v-if="usr_currentUser != null" class="fw-b border-bottom-dashed grey900 grey900-border">{{usr_currentUser.login}}</span>
          </v-list-item>
          <v-list-item height="32px" class="fs-m gd-account-menu-location d-flex" @click="changeLocation">
            <div class="grey700 ws-pre" style="flex:2 0 50%;">Default location</div>
            <v-tooltip bottom v-if="!isNullOrUndefined(lctn_defaultResourceProfile)" nudge-width="200px" content-class="custom-tooltip fs-s">
              <template v-slot:activator="{ on }">
                <div v-on="on" class="ws-pre text-right" style="flex:50%;">
                  <span class="fw-b border-bottom-dashed grey900 grey900-border">{{lctn_defaultResourceProfile.resourceProfile.name}}</span>
                </div>
              </template>
              <div>
                  <div class="text-center fw-m custom-tooltip-accent mb-1">LOCATION</div>
                  <div class="d-flex">
                      <div class="custom-tooltip-color mr-4">
                          <div>Service Provider:</div>
                          <div>Datacenter:</div>
                          <div>Resource Profile:</div>
                      </div>
                      <div class="text-right custom-tooltip-accent fw-m">
                          <div>{{lctn_defaultResourceProfile.serviceProvider.name}}</div>
                          <div>{{lctn_defaultResourceProfile.datacenter.name}}</div>
                          <div>{{lctn_defaultResourceProfile.resourceProfile.name}}</div>
                      </div>
                  </div>
              </div>
            </v-tooltip>
            <span v-else class="fw-b border-bottom-dashed grey900 grey900-border">unset</span>
          </v-list-item>
          <v-list-item v-if="glb_current_theme=='white'" height="32px" class="fs-m gd-account-menu-changeTheme" @click="changeToDarkTheme()" >
            <span class="grey700">Theme</span>
            <v-spacer/>
            <span class="fw-b border-bottom-dashed grey900 grey900-border">change to dark</span>
          </v-list-item>
          <v-list-item v-if="glb_current_theme=='dark'"  height="32px" class="fs-m gd-account-menu-changeTheme" @click="changeTowhiteTheme()">
            <span class="grey700">Theme</span>
            <v-spacer/>
            <span class="fw-b border-bottom-dashed grey900 grey900-border">change to white</span>
          </v-list-item>
          <v-divider v-if="permission('ft_guideShow')" class="my-1" />
          <v-list-item v-if="permission('ft_guideShow')" height="32px" class="fs-m gd-account-menu-guides" @click="platformGuideClick()">
            <span class="grey700">Platform guide</span>
          </v-list-item>
          <v-divider class="my-1" />
          <v-list-item height="32px" class="fs-m gd-account-menu-logout" @click="logOut()">
            <i class="grey500-i icon-logOut mr-2"></i><span class="grey700">Exit</span>
          </v-list-item>
      </v-list>
    </v-menu>
    </transition>
  </v-toolbar>    
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Vue from 'vue'

export default {
  data(){
    return{
      showImpersonation : false,
      errorMenu         : false,
      notificationMenu  : false,
      debugBtnShow      : stand.isLocal
    }
  },
  
  watch:{
    errorMsg:{
      handler:function(value){
        if(!value.length)
          this.errorMenu = false;
      }
    }
  },

  computed:{
    ...mapGetters([
      'glb_showProperty', 
      'glb_currentSection', 
      'lctn_defaultResourceProfile', 
      'usr_currentUser', 
      'msg_notAcknowledge', 
      'glb_current_theme',
      'vm_edited'
      ]),

    errorMsg(){
      return this.msg_notAcknowledge.filter(msg => msg.type == 'error');
    },

    locationBtnText(){
      var location = this.lctn_defaultResourceProfile;
      if(isNullOrUndefined(location))
        return 'Default Location Unset'
      else {
        return location.serviceProvider.name + " / "
                + location.datacenter.name   + " / "
                + location.resourceProfile.name 
      }
    },


    userLetters(){
      var user = this.usr_currentUser;
      return isNullOrUndefined(user) ? '-' :   user.prep.userLetters;  
    },

    userTitle(){
      var user = this.usr_currentUser;
      return isNullOrUndefined(user) ? '-' :   user.prep.nameShort;  
    },

    userDomain(){
      var user = this.usr_currentUser;
      return isNullOrUndefined(user) ? '-' :   user.domain;  
    },
  },


  methods:{
    ...mapActions(['glb_setTheme', 'vm_setEdited', 'vm_setMonitoringState']),

    closeVmMonitoring(){
      this.vm_setEdited();
      this.vm_setMonitoringState();
    },

    platformGuideClick(){
      Vue.prototype.$windows.showDialog({ dialogCode: 'platformGuideDialog' } );
    },
  
    showProfile(){
      this.$nav.navigateTo('profile')
    },

    logOut(){
      Vue.prototype.$auth.logout();
    },

    changeLocation(){
      Vue.prototype.$windows.showDialog({ dialogCode: 'locationDialog' });   
    },

    changeToDarkTheme(){
      this.glb_setTheme('dark');
    },

    changeTowhiteTheme(){
      this.glb_setTheme('white');
    },

    openDebugDialog(){
      Vue.prototype.$windows.showDialog({ dialogCode: 'debugDialog' });   
    },

    openFeaturesDialog(){
      Vue.prototype.$windows.showDialog({ dialogCode: 'featuresDialog' });   
    },

    openUploadDialog(){
      Vue.prototype.$windows.showDialog({ dialogCode: 'uploadDialog' });   
    },
  }

}
</script>

<style>
 .toolbar-ext .v-toolbar__content{
   height: 50px !important;
   padding: 0 8px;
 }
 .user-arrow-btn{width: 24px;height: 24px;line-height: 24px;}
 .v-menu__content{border-radius:0 !important;}
 .alert-dot{position:absolute;top:-3px;right:3px;border-radius:100%; width:6px;height:6px;}
 .user-avatar{width:34px; height:34px;}
 .account-btn:hover::before{opacity: 0 !important;}
 .user-arrow-btn{transition: 0.5s;}
 .user-arrow-btn .v-ripple__container{display: none !important;}
 .account-btn:hover .user-arrow-btn{background-color: #ECEFF1 !important;}
 .v-chip__close.v-icon.impersonation-chip-close-button{font-size: 14px;padding: 2px;}
 .v-chip__close.v-icon.impersonation-chip-close-button:hover{background: #B0BEC5;}
</style>
<style scoped>
.user-menu-button-translate-enter-active, .suser-menu-button-translate-leave-active {
    transition: all 5s linear;
  }
  
  .suser-menu-button-translate-enter, .user-menu-button-translate-leave-active {
    transform: translateX(208px);
    opacity: 0;
  }
</style>
