<!--noindex-->Модуль тулбара управления Сетями<!--/noindex-->
<template>
  <v-toolbar flat class="vjob-tb toolbar-ext" height="50px">
    <v-btn text class="normal-text pl-1 ml-4 pr-2 grey300-border border br-2 grey500 mr-2 fs-m fw-m d-flex align-center" min-width="unset" height="24px">
      <i class="mdi mdi-magnify mr-1 icon-16"></i>Options
    </v-btn>
    <div class="d-flex mx-2 relative">
      <v-menu offset-y ref="menu" v-model="dateMenu" :close-on-content-click="false">
          <template v-slot:activator="{ on }">
              <v-btn v-on="on" text class="normal-text px-0 grey300-border border-bottom br-0 grey500 mr-2 fs-m fw-b monospace" min-width="unset" width="75px" height="24px">
                {{dateCaption}}
              </v-btn>
          </template>
          <v-date-picker :readonly="false" v-model="dateInner" no-title @change="dateMenu=false, changedStartDate()"></v-date-picker>
      </v-menu>
      <v-menu offset-y v-model="timeMenu" :close-on-content-click="false">
          <template v-slot:activator="{ on }">
              <v-btn v-on="on" text class="normal-text px-0 grey300-border border-bottom br-0 grey700 fs-m fw-b monospace" min-width="unset" width="58px" height="24px">
                {{timeCaption}}
              </v-btn>
          </template>
          <time-picker :time="time" @change="time = $event, timeMenu = false, changedStartDate()"/>
      </v-menu>
      <div class="vjob-tb__start-time-title fs-xs grey600">Start time from</div>
    </div>

    <v-spacer></v-spacer>

    <v-toolbar-items :style="{marginLeft: $vuetify.breakpoint.smAndDown ? '' : $vuetify.breakpoint.mdAndDown && glb_showProperty ? '' : '-255px'}">
      <div class="d-flex align-center ml-4">
        <v-btn text class="vjob-tb__first-page-btn normal-text px-0 grey300-border border br-right" :class="{'vjobs-btn-disabled': vjob_page <= 1}" height="24px" @click="vjob_goToFirstPage()" :disabled="vjob_page <= 1">
          <i class="mdi mdi-page-first grey500 icon-20 ml-n1"></i>
        </v-btn>
        <v-btn text class="vjob-tb__back-btn normal-text px-0 grey300-border border br-left" :class="{'vjobs-btn-disabled': vjob_page <= 1}" height="24px" @click="vjob_goToPreviousPage()" :disabled="vjob_page <= 1">
          <i class="mdi mdi-chevron-left grey500 icon-20 ml-n1"></i>
        </v-btn>
        <div class="mx-2">
          <v-tooltip bottom v-model="pageTooltip" content-class="custom-tooltip fs-s">
            <template slot="activator" >
              <input class="vjob-tb__page-input text-center border-bottom grey800 fw-b grey800-border mr-1 fs-ml" v-imask="masks.justDigits" @focus="$event.target.select(), pageTooltip = true" @blur="pageTooltip = false" @complete="updatePages" :value="pageToShow"  v-on:keyup.enter="submitPage">
            </template>
            <span class="custom-tooltip-accent fw-m">Press enter to accept</span>
          </v-tooltip>
          <span class="fw-b grey300 fs-s">/ {{vjob_totalPages}} </span>
        </div>
        <v-btn text class="vjob-tb__next-btn normal-text px-0 grey300-border border br-right" :class="{'vjobs-btn-disabled': vjob_page >= vjob_totalPages}" height="24px" @click="vjob_goToNextPage()" :disabled="vjob_page >= vjob_totalPages">
          <i class="vjob-tb__next-btn-icon mdi mdi-chevron-right grey500 icon-20"></i>
        </v-btn>
        <v-btn text class="vjob-tb__last-page-btn normal-text px-0 grey300-border border br-left" :class="{'vjobs-btn-disabled': vjob_page >= vjob_totalPages}" height="24px" @click="vjob_goToLastPage()" :disabled="vjob_page >= vjob_totalPages">
          <i class="mdi mdi-page-last grey500 icon-20 ml-n1"></i>
        </v-btn>
      </div>
    </v-toolbar-items>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-flex class="align-self-center">
        <v-menu offset-y left width="218px">
            <template v-slot:activator="{ on, value }">
              <v-btn icon tile class="pa-0 control-button br-4 ml-2 mr-1" v-on="on" :class="{'grey100-b': value}">
                <i class="grey500-i icon-Donner icon-18"></i>
              </v-btn>
            </template>
            <v-list width="240px" class="control-combobox py-2 border blue050-border br-4">
                <v-list-item height="32px" class="fs-m" @click="exportCsv()">Export list (CSV)</v-list-item>
                <v-divider class="my-1" />
                <v-list-item height="32px" class="fs-m" @click="exportCsv()"><i class="grey500-i mdi mdi-message-alert-outline icon-16 mr-2"></i>Acknowledge</v-list-item>
            </v-list>
        </v-menu>
      </v-flex>
    </v-toolbar-items>
  </v-toolbar> 
</template>
  
<script>
import { mapActions, mapGetters } from 'vuex';
import masks from '@/consts/maskConst'
import {IMaskDirective} from 'vue-imask';
import timePicker from './components/timePicker'
//console.log(parseISOString)


export default {
  components:{ timePicker },
  directives: { imask: IMaskDirective },

  data(){
    return{
      sleceted   : [],
      searchText : '',
      searchWidth: 128,
      dateInner  : null,
      dateMenu   : false,
      timeMenu   : false,
      masks,
      time       : null,
      pageToShow : 1,
      maxPage    : 121,
      pageTooltip: false,      
    }
  },

  watch:{
    "vjob_filter.search" : {
      handler: function (value){
        this.searchText = value
      },
      immediate: true
    },

    vjob_startDate:{
      handler: function (value){
        if(value==null)
          return
        this.dateInner = value.split('T')[0];
        this.time = value;
      },
      immediate: true    
    },

    vjob_page:{
      handler: function (value){
        if(value==null)
          return
        this.pageToShow = value;
      },
      immediate: true    
    },
  },

  computed:{
    ...mapGetters([
      'vjob_filter', 
      'vjob_itemsFiltered', 
      'vjob_startDate', 
      'vjob_itemsAll',
      'vjob_page',
      'vjob_totalPages',
      'glb_showProperty'
    ]),

    page(){ 
      return this.vjob_page > 0 ? this.vjob_page : '';
    },

    timeCaption(){
      if(this.vjob_startDate==null)
        return '23:59:59'
      else
        return formatTime(this.time);
    },

    dateCaption(){
        return isNullOrUndefined(this.dateInner) || this.dateInner=='' ? 'Set date' : formatDate(this.dateInner); 
    },

    filterToggle: {
      get: function (){
        return this.vjob_filter.use ? 0 : null;
      },

      set: function(value){
        let f = this.vjob_filter;
        f.use= isNullOrUndefined(value) ? false : true;     
        this.vjob_setFilter(f);
      }
    }
  },
  methods:{
    ...mapActions([
      'vjob_create', 
      'vjob_setFilter',
      'vjob_getItems',

      'vjob_goToPage',
      'vjob_goToFirstPage',
      'vjob_goToLastPage',
      'vjob_goToNextPage',
      'vjob_goToPreviousPage',
      'vjob_acknowledge',
      'vjob_setPage'

    ]),

    submitPage(){
      this.vjob_goToPage(this.pageToShow);
      this.pageTooltip = false
    },

    updatePages(e){
      let newValue = e.detail.value
      if(newValue > this.vjob_totalPages)
        newValue = this.vjob_totalPages
      if(newValue <= 0)
        newValue = 1
      this.pageToShow = newValue
    },

    changedStartDate(){
      let time = this.time.split('T')[1].split('.')[0];
      let dateTime = `${this.dateInner}T${time}.000Z`;
      this.vjob_getItems({ dateStartTo : dateTime, pageNum: 1 });
    },

    searchFocus(){
      if(this.$vuetify.breakpoint.mdAndUp)
        this.searchWidth = 200;
    },

    searchBlur(){
      if(this.searchText == '')
        this.searchWidth = 128;
    },

    onEnter(){
      var filter = this.vjob_filter;
      filter.search = this.searchText;
      this.vjob_setFilter(filter);
    },

    exportCsv(){
      var toCsv = this.vjob_itemsFiltered.map(m=>{ return { 
        OBJECT_NAME   : m.objectName, 
        OBJECT_TYPE   : m.objectType, 
        STATUS        : m.statusCode, 
        MESSAGE       : m.message,
        CREATE        : m.createDateFormatted,
        USER_LOGIN    : m.userLogin      
      } });

      this.$export.csv(toCsv, 'taskList.csv')
    }
  }
}
</script>
<style lang="stylus" scoped>
.vjob-tb
  &__start-time-title
    position absolute
    top -10px
  &__first-page-btn
    min-width 28px !important
    width 28px !important
  &__back-btn
    min-width 24px !important
    width 24px !important
    margin-left -1px
  &__page-input
    width 25px
    height 20px
  &__next-btn
    min-width 24px !important
    width 24px !important
  &__last-page-btn
    min-width 28px !important
    width 28px !important
    margin-left -1px
  &__next-btn-icon
    margin-left -2px
</style>
<style scoped>
.br-right{border-radius:2px 0 0 2px;}
.br-left{border-radius:0 2px 2px 0;}
.vjobs-btn-disabled{opacity:0.6;}
</style>