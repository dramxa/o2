<template>
  <div>
    <router-view name="fullWindowContent"></router-view>
    <div v-if="!$route.meta.fullWindowContent" >
      <router-view name="mainPageContent"></router-view>
    </div>
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
    ...mapGetters(['glb_showProperty']),

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
  
  .slide-fade-leave-to
  /* .slide-fade-leave-active до версии 2.1.8 */ {
    transform: translateX(390px);
    opacity: 0;
  }
</style>

<style>
@import '../assets/mainstyle.css';
@import '../assets/whiteTheme.css';
@import '../assets/darkTheme.css';
</style>
