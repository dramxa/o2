<!--noindex-->Модуль тулбара управления Сетями<!--/noindex-->
<template>
    <v-toolbar flat  class="toolbar-ext blue050-border" height="50px">
    <v-toolbar-items>
      <div class="tmpl-tb-search align-self-center ml-4 relative gd-tb-search">
        <input 
          v-model="searchText"
          v-on:keyup.enter="onEnter"
          type="text"
          :style="{width: searchWidth + 'px'}"
          :class="[searchText != '' && searchText != tmpl_filter.search ? 'blue700 blue000-b': 'grey700']"
          placeholder="Search"
          class="tmpl-tb-search__input border grey300-border px-2 py-1 br-2 fw-b fs-s gd-tb-search"
          @focus="searchFocus()"
          @blur="searchBlur()"
          >
          <i v-show="searchText != ''" class="tmpl-tb-search__icon icon-Close py-1 px-1 pointer" :class="[searchText != '' && searchText != tmpl_filter.search ? 'blue700-i blue000-b': 'grey500-i white']" @click="searchText='', onEnter()"></i>
      </div>
      <v-flex class="d-flex align-self-center ml-6 fs-m relative">
        <div class="tmpl-tb__tab px-4 pointer blue700-border" :class="[tmpl_tepmplateType == 'public' ? 'tmpl-tb__tab--active blue000-b blue600 fw-b' : 'grey700']" @click="tmpl_setTemplateType('public')">Public templates</div>
        <div class="tmpl-tb__tab px-4 pointer blue700-border" :class="[tmpl_tepmplateType == 'user' ? 'tmpl-tb__tab--active blue000-b blue600 fw-b' : 'grey700']"   @click="tmpl_setTemplateType('user')" >User templates</div>
        <div class="tmpl-tb__tabs-border grey200-b"></div>
      </v-flex>
      <v-flex srink  class="align-self-center">
        <v-btn-toggle v-model="filterToggle">        
          <v-btn class="normal-text px-2 mx-4 border-none gd-tb-filter" :class="{'blue600 blue050-b': tmpl_filter.use, 'grey600 white': !tmpl_filter.use}" height="24px" text>
            <i class="icon-filter mr-1" :class="{'blue600-i': tmpl_filter.use}"></i>
            <span>Filters</span>
          </v-btn>
        </v-btn-toggle>
      </v-flex>
      
    </v-toolbar-items>

     <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-flex class="align-self-center">
        <!-- <c-toolbar-btn class="mr-4" icon="icon-Import" tooltip="Import" @click="create"/>  ДЛЯ МВП -->
        <v-menu offset-y left width="218px">
            <template v-slot:activator="{ on, value }">
              <v-btn icon tile class="pa-0 control-button br-4 ml-2 mr-1 gd-tb-menu-btn" v-on="on" :class="{'grey100-b': value}">
                <i class="grey500-i icon-Donner icon-18"></i>
              </v-btn>
            </template>
            <v-list width="240px" class="control-combobox py-2 border blue050-border br-4 gd-tb-menu">
                <v-list-item height="32px" class="fs-m gd-tb-menu-csv" @click="exportCsv()">Export list (CSV)</v-list-item>
                <v-divider class="my-1" v-if="permission('ft_templDelete')"/>
                <v-list-item height="32px" class="fs-m gd-tb-menu-delete" @click="deleteSelected" v-if="permission('ft_templDelete')"><i class="grey500-i icon-trash mr-2"></i>Delete</v-list-item>
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
      sleceted   : [],
      searchText : '',
      searchWidth: 128
    }
  },

  watch:{
    "tmpl_filter.search" : {
      handler: function (value){
        this.searchText = value
      },
      immediate: true
    }
  },

  computed:{
    ...mapGetters(['tmpl_itemsFiltered', 'tmpl_filter', 'tmpl_itemsFiltered', 'tmpl_tepmplateType']),

    filterToggle: {
      get: function (){
        return this.tmpl_filter.use ? 0 : null;
      },

      set: function(value){
        let f = this.tmpl_filter;
        f.use= isNullOrUndefined(value) ? false : true;     
        this.tmpl_setFilter(f);
      }
    }
  },
  methods:{
    ...mapActions(['tmpl_deleteConfirm', 'tmpl_create', 'tmpl_setFilter', 'tmpl_setTemplateType']),

    searchFocus(){
      if(this.$vuetify.breakpoint.mdAndUp)
        this.searchWidth = 200;
    },

    searchBlur(){
      if(this.searchText == '')
        this.searchWidth = 128;
    },

    onEnter(){
      var filter = this.tmpl_filter;
      filter.search = this.searchText;
      this.tmpl_setFilter(filter);
    },


    create(){
      this.net_create();
    },

    exportCsv(){
      var toCsv = this.tmpl_itemsFiltered.map(m=>{ return { 
        VM_NAME    : m.name, 
        STATUS     : m.statusCode, 
        CPU        : m.cpu,
        RAM_GB     : localeString(m.prep.ramTotal, false),
        STORAGE_GB : localeString(m.prep.storageTotal, false),
        CREATE     : m.prep.createDateFormatted,

        // PRICE_RUB: (m.priceListCurrency == 'RUB' ? localePrice(m.priceTotal || 0) : 0),
        // PRICE_USD: (m.priceListCurrency == 'USD' ? localePrice(m.priceTotal || 0) : 0),
        // PRICE_EUR: (m.priceListCurrency == 'EUR' ? localePrice(m.priceTotal || 0) : 0),  

      } });

      Vue.prototype.$export.csv(toCsv, 'vmList.csv')
    },

    deleteSelected(){
      this.tmpl_deleteConfirm();
    }
  }
}
</script>
<style lang="stylus" scoped>
.tmpl-tb
  &__tab
    line-height 23px
    &--active
      border-bottom 2px solid
  &__tabs-border
    position absolute
    left 0
    right 0
    bottom 0
    height 1px
    z-index -1
  &-search
    &__input
      height 24px
      transition all 0.5s
    &__icon
      position absolute
      right 1px
      top 3px
      font-size 16px
      width 24px
      height 22px
</style>