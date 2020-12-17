<template>
  <div>
      <left-menu></left-menu>
      <v-main :class="drawerPadding">
        <router-view name="fullContentView"></router-view>
        <v-row class="mr-0" v-if="!$route.meta.fullContentView" >
          <v-col class="p-content" :class="{ 'p-content-with-prop': glb_showProperty, 'p-content-animation':  !guide_show}">
            <top class="blue050-border sticky-header" ></top>
            <v-card flat class="p-content-inner br-0"> 
              <router-view name="contentView"></router-view>
            </v-card>
          </v-col>
          <transition name="slide-fade">
            <v-col class="p-prop pa-0 border-left blue050-border gd-prop" :class="{'p-prop-animation': !guide_show}" :style="{right: glb_showProperty ? '0px' : '-390px'}">
              <router-view v-if="showPropertyInner" name="propertyView"></router-view>
            </v-col>
          </transition>
        </v-row>
      </v-main>
  </div>
</template>

<script>
import leftMenu from '@/app/mainPageBlocks/menu';
import top from  '@/app/mainPageBlocks/top';
import { mapGetters, mapActions } from 'vuex';
import Vue from 'vue'

export default {
  name: 'mainContent',
  data(){
    return{
      propWidth: 0,
      showPropertyInner : false
    }
  },
 
  components: {
    leftMenu,
    top
  },

  watch:{
    glb_showProperty : function (newValue, oldValue){
      if(!isNullOrUndefined(oldValue) && newValue != oldValue && !newValue){
        var self = this;
        setTimeout(()=>{ self.showPropertyInner = false; }, 500);
        return;
      }
      this.showPropertyInner = newValue;
    },
  },

    
  computed:{
    ...mapGetters(['glb_showProperty', 'guide_show']),

    drawerPadding(){
      if(this.$vuetify.breakpoint.smAndDown)
        return 'mini-drawer-padding'
      else
        return 'drawer-padding'
    }
  },

  methods:{
    ...mapActions(['lctn_getDefaultResourceProfile']),


  },

  mounted(){
    this.lctn_getDefaultResourceProfile()
  }
};
</script>


<style scoped>
  .p-prop{
    z-index: 2;
    position: absolute;
    top:0px;
    padding-left: 0;
    padding-top: 0;
    max-height: 100vh;
    overflow: initial;
    width: 390px;
    min-width: 390px;
    max-width: 390px;
    min-height:100vh;
  }  
  .p-prop-animation{
    transition-property: right;
    transition-duration: .3s;
    transition-timing-function: linear;
  }
  .p-content{
    padding-right: 0;
    padding-top: 0;
    padding-bottom: 0;
    height: 100vh;
    overflow: hidden;
  }
  .p-content-inner{
    border:none;
    overflow-y: auto;
    min-height:100vh;
  }
  .p-content-animation{
    transition-property: max-width;
    transition-duration: .3s;
    transition-timing-function: linear;
  }
  .p-content-with-prop{
    width: calc(100% - 390px) !important;
    max-width: calc(100% - 390px) !important;
  }

  .drawer-padding{padding-left:200px !important;}
  .mini-drawer-padding{padding-left:60px !important;}

  .slide-fade-leave-active {
    transition: all .3s linear;
  }
  
  .slide-fade-leave-to{
    transform: translateX(390px);
    opacity: 0;
  }
</style>

<style>
@import '../assets/mainstyle.css';
@import '../assets/whiteTheme.css';
@import '../assets/darkTheme.css';
</style>
