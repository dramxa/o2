<!--noindex-->Модуль тулбара управления Группами<!--/noindex-->
<template>
  <v-toolbar flat  class="toolbar-ext" height="50px">
    <v-toolbar-items>
      <div class="grp-tb-search align-self-center ml-4 relative gd-tb-search">
        <input 
          v-model="searchText"
          v-on:keyup.enter="onEnter"
          type="text" 
          :style="{width: searchWidth + 'px'}"
          :class="[searchText != '' && searchText != grp_filter.search ? 'blue700 blue000-b': 'grey700']"
          placeholder="Search"
          class="grp-tb-search__input border grey300-border px-2 py-1 br-2 fw-b fs-s gd-tb-search"
          @focus="searchFocus()"
          @blur="searchBlur()"
          >
          <i v-show="searchText != ''" class="grp-tb-search__icon icon-Close py-1 px-1 pointer" :class="[searchText != '' && searchText != grp_filter.search ? 'blue700-i blue000-b': 'grey500-i white']" @click="searchText='', onEnter()"></i>
      </div>
      <v-flex srink  class="align-self-center">
        <v-btn-toggle v-model="filterToggle">        
          <v-btn class="normal-text px-2 mx-4 border-none table-filter-toggle-btn br-4 gd-tb-filter" :class="{'blue600 blue050-b': grp_filter.use, 'grey600 white': !grp_filter.use}" height="24px">
            <i class="icon-filter mr-1" :class="{'blue600-i': grp_filter.use}"></i>
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
        <c-toolbar-btn class="mr-4" btnClass="gd-tb-create" icon="grey500-i icon-Create grey500-i icon-18" tooltip="Create" @click="create" v-if="permission('ft_grpCreate')"/> 
        <v-menu offset-y left width="218px">
            <template v-slot:activator="{ on, value }">
              <v-btn icon tile class="pa-0 control-button br-4 ml-2 mr-1 gd-tb-menu-btn" v-on="on" :class="{'grey100-b': value}">
                <i class="grey500-i icon-Donner grey500-i icon-18"></i>
              </v-btn>
            </template>
            <v-list width="240px" class="control-combobox py-2 border blue050-border br-4 gd-tb-menu">
                <v-list-item height="32px" class="fs-m gd-tb-menu-csv" @click="exportCsv()">Export list (CSV)</v-list-item>
                <v-divider class="my-1"  v-if="permission('ft_grpDelete')" />
                <v-list-item height="32px" v-if="permission('ft_grpDelete')" class="fs-m gd-tb-menu-delete" @click="deleteSelected"><i class="icon-trash grey500-i mr-2"></i>Delete</v-list-item>
            </v-list>
        </v-menu>
      </v-flex>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Vue from 'vue';

export default {

  data(){
    return{
      searchText : '',
      searchWidth: 128
    }
  },

  watch:{
    "grp_filter.search" : {
      handler: function (value){
        this.searchText = value
      },
      immediate: true
    }
  },

  computed:{
    ...mapGetters(['grp_itemsFiltered', 'grp_filter', 'glb_pricePeriod']),

    filterToggle: {
      get: function (){
        return this.grp_filter.use ? 0 : null;
      },

      set: function(value){
        let f = this.grp_filter;
        f.use= isNullOrUndefined(value) ? false : true;     
        this.grp_setFilter(f);
      }
    }
  },

  methods:{
    ...mapActions(['grp_deleteConfirm', 'grp_create', 'grp_setFilter']),

    searchFocus(){
      if(this.$vuetify.breakpoint.mdAndUp)
        this.searchWidth = 200;
    },

    searchBlur(){
      if(this.searchText == '')
        this.searchWidth = 128;
    },

    onEnter(){
      var filter = this.grp_filter;
      filter.search = this.searchText;
      this.grp_setFilter(filter);
    },

    create(){
      this.grp_create();
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
      
      
      var toCsv = this.grp_itemsFiltered.map(m=>{ 
        var price = '';
        if(!isNullOrUndefined(m.prep.prices))
          Object.values(m.prep.prices).forEach(value=>{
            price += value[priceParameter] + ' ';
          }); 

        var res = { 
              NAME        :  m.name, 
              DESCRIPTION :  m.description, 
              PROJECT     :  m.prep.projectName, 
              'VM COUNT'  :  m.prep.vmCount, 
              VM_READY    :  m.prep.vmReady, 
              VM_ERROR    :  m.prep.vmErrors, 
              VM_BUSY     :  m.prep.vmBusy, 
              CPU         :  m.prep.cpuTotal, 
              'RAM(GB)'   :  m.prep.ramTotalFormatted, 
              CREATED     :  m.prep.createDateFormatted 
            } 
        res[`PRICE (${pricePeriod})`] = price;
        return res;
        });

      Vue.prototype.$export.csv(toCsv, 'grpList.csv')
    },

    deleteSelected(){
      this.grp_deleteConfirm();
    }
  }
}
</script>
<style lang="stylus" scoped>
.grp-tb
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