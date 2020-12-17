<!--noindex-->Модуль тулбара управления Проектами<!--/noindex-->
<template>
  <v-toolbar flat  class="toolbar-ext" height="50px">
    <v-toolbar-items>
      <div class="prj-tb-search align-self-center ml-4 relative gd-tb-search">
        <input 
          v-model="searchText"
          v-on:keyup.enter="onEnter"
          type="text" 
          :style="{width: searchWidth + 'px'}"
          :class="[searchText != '' && searchText != prj_filter.search ? 'blue700 blue000-b': 'grey700']"
          placeholder="Search"
          class="prj-tb-search__input border grey300-border px-2 py-1 br-2 fw-b fs-s gd-tb-search"
          @focus="searchFocus()"
          @blur="searchBlur()"
          >
          <i v-show="searchText != ''" class="prj-tb-search__icon icon-Close py-1 px-1 pointer" :class="[searchText != '' && searchText != prj_filter.search ? 'blue700-i blue000-b': 'grey500-i white']" @click="searchText='', onEnter()"></i>
      </div>
      <v-flex srink  class="align-self-center">
        <v-btn-toggle v-model="filterToggle">        
          <v-btn class="normal-text px-2 mx-4 table-filter-toggle-btn border-none br-4 gd-tb-filter" :class="{'blue600 blue050-b': prj_filter.use, 'grey600 white': !prj_filter.use}" height="24px">
            <i class="icon-filter mr-1" :class="{'blue600-i': prj_filter.use}"></i>
            <span>Filters</span>
          </v-btn>
        </v-btn-toggle>
      </v-flex>     
        
      <!-- 
        --- MVP ---
        
        <v-flex class="align-self-center"> 
        <c-toolbar-btn class="ml-0-25" icon="icon-play"     tooltip="Run"/>
        <c-toolbar-btn class="ml-0-25" icon="icon-pause"       tooltip="Pause"/>
        <c-toolbar-btn class="ml-0-25" icon="icon-stop-circle" tooltip="Stop"/>
        <c-toolbar-btn class="ml-0-25" icon="icon-refresh-ccw" tooltip="Restart"/> 
      </v-flex> -->
    </v-toolbar-items>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-flex class="align-self-center">
        <!-- <c-toolbar-btn class="mr-4" icon="grey900-i icon-Create" tooltip="TESTDATA" @click="send_test_data"/>  -->
        <c-toolbar-btn class="mr-4" btnClass="gd-tb-create" icon="grey500-i icon-Create icon-18" tooltip="Create" @click="create" v-if="permission('ft_prjCreate')"/> 
        <v-menu offset-y left width="218px">
            <template v-slot:activator="{ on, value }">
              <v-btn icon tile class="pa-0 control-button br-4 ml-2 mr-1  gd-tb-menu-btn" v-on="on" :class="{'grey100-b': value}">
                <i class="grey500-i icon-Donner icon-18"></i>
              </v-btn>
            </template>
            <v-list width="240px" class="control-combobox py-2 border blue050-border br-4 gd-tb-menu">
                <v-list-item height="32px" class="fs-m gd-tb-menu-csv" @click="exportCsv()">Export list (CSV)</v-list-item>
                <v-divider class="my-1" v-if="permission('ft_prjDelete')"/>
                <v-list-item height="32px" class="fs-m gd-tb-menu-delete" @click="deleteSelected" v-if="permission('ft_prjDelete')"><i class="grey500-i icon-trash mr-2"></i>Delete</v-list-item>
            </v-list>
        </v-menu>
      </v-flex>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Vue from 'vue';

import extBus from '@/modules/_system/_extension/_bus'
import { wsObjectTypes } from '@/consts/websocketConsts'

export default {

  data(){
    return{
      searchText : '',
      searchWidth: 128
    }
  },

  watch:{
    "prj_filter.search" : {
      handler: function (value){
        this.searchText = value
      },
      immediate: true
    }
  },
  
  computed:{
    ...mapGetters(['prj_itemsFiltered', 'prj_filter', 'glb_pricePeriod']),

    filterToggle: {
      get: function (){
        return this.prj_filter.use ? 0 : null;
      },

      set: function(value){
        let f = this.prj_filter;
        f.use= isNullOrUndefined(value) ? false : true;     
        this.prj_setFilter(f);
      }
    }
  },
  methods:{
    ...mapActions(['prj_deleteConfirm', 'prj_create', 'prj_setFilter']),

    send_test_data(){
      let data = '{"id":"f6bd18c9-2516-4d5e-9b96-4a78a567f557","orgId":"ab97aecf-adee-43a6-8777-56aa4c53b4a9","name":"Project 4","description":"e3rgerg","comment":"gergerg","createDate":"2020-03-12T10:47:48.211Z","expiryDate":null,"groupsCount":0,"isDeleted":false}';      
      extBus.$emit('websocket-message-prj', JSON.parse(data))
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
      var filter = this.prj_filter;
      filter.search = this.searchText;
      this.prj_setFilter(filter);
    },


    create(){
      this.prj_create();
    },

    exportCsv(){
      var pricePeriod = this.glb_pricePeriod;

      var priceParameter = '';
      switch(this.glb_pricePeriod){
        case 'HOUR' : priceParameter = 'priceTotalPerHourFormatted'; break;
        case 'DAY' : priceParameter = 'priceTotalPerDayFormatted'; break;
        case 'MONTH' : priceParameter = 'priceTotalPerMonthFormatted'; break;   
        default: priceParameter = 'priceTotalPerMonthFormatted'; break;   
      }



      var toCsv = this.prj_itemsFiltered.map(m=>{ 
        var price = '';
        if(!isNullOrUndefined(m.prep.prices))
          Object.values(m.prep.prices).forEach(value=>{
            price += value[priceParameter] + ' ';
          });        
        var res = { 
        NAME          : m.name, 
        DESCRIPTION   : m.description, 
        'GROUPS COUNT': m.prep.groupCount, 
        'VM COUNT'    : m.prep.vmCount, 
        VM_READY      : m.prep.vmReady, 
        VM_ERROR      : m.prep.vmErrors, 
        VM_BUSY       : m.prep.vmBusy, 
        CPU           : m.prep.cpuTotal, 
        'RAM(GB)'     : m.prep.ramTotalFormatted, 
        CREATED       : m.prep.createDateFormatted, 
        EXPIRED       : m.prep.expiryDateFormatted || '', 
      } 
      res[`PRICE (${pricePeriod})`] = price
      return res;
      
      });

      Vue.prototype.$export.csv(toCsv, 'prjList.csv')
    },

    deleteSelected(){
      this.prj_deleteConfirm();
    }
  }
}
</script>
<style lang="stylus" scoped>
.prj-tb
  &-search
    &__input
      height: 24px
      transition: all 0.5s
    &__icon
      position:absolute
      right: 1px
      top: 3px
      font-size: 16px
      width: 24px
      height: 22px
</style>
<style>
.v-list-item{min-height: 32px;}
</style>