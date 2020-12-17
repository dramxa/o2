<!--noindex-->Модуль переключения между страницей авторизации и основной рабочей страницей<!--/noindex-->
<template>
  <v-app :class="[glb_current_theme == 'dark' ? 'dark-theme' : 'white-theme']" :style="glb_colorStyleVars">
    <c-title v-if="!isNullOrUndefined(glb_currentSection)" :title="glb_currentSection.name"></c-title>
    <c-title v-else title="Loading"></c-title>
    <loadingPage v-if="loading"  />
    <router-view v-if="!loading"/>
    <dialogsView></dialogsView>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import loadingPage from './_loadingPage'
import dialogsView from  '@/dialogs/_registerDialogsView';

export default {
  components:{
    loadingPage,
    dialogsView    
  },

  data(){
    return {
      loading: false,
    }
  },

  watch:{
    glb_current_theme: function(value){
      this.loading = true;
      setTimeout(()=>{ this.loading = false; }, 300)
    },

    glb_mainPageLoading: {
     handler: function(value){
        this.loading = value;
      },
      immediate : true
    }
  },
  
  computed:{
    ...mapGetters([
      'glb_mainPageLoading', 
      'glb_current_theme', 
      'glb_currentSection',
      'glb_colorStyleVars'])
  },

  methods:{
    ...mapActions([
      'glb_setTheme', 
      'glb_setThemeFromLS', 
      'glb_setPricePeriodFromLS',
      'glb_setLanguageFrmLs'
      ]),


  },


  mounted(){
    this.glb_setLanguageFrmLs();
    this.glb_setThemeFromLS();
    this.glb_setPricePeriodFromLS();
  }
}
</script>








