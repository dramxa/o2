<!--noindex-->Модуль тулбара управления Лимитами<!--/noindex-->
<template>
    <v-toolbar flat  class="toolbar-ext blue050-border" height="50px">
    <v-toolbar-items>
      <div class="lmt-tb-search align-self-center ml-4 relative gd-tb-search">
        <input 
          v-model="searchText"
          v-on:keyup.enter="onEnter"
          type="text" 
          :style="{width: searchWidth + 'px'}"
          :class="[searchText != '' && searchText != lmt_filter.search ? 'blue700 blue000-b': 'grey700']"
          placeholder="Search"
          class="lmt-tb-search__input border grey300-border px-2 py-1 br-2 fw-b fs-s gd-tb-search"
          @focus="searchFocus()"
          @blur="searchBlur()"
          >
          <i v-show="searchText != ''" class="lmt-tb-search__icon icon-Close py-1 px-1 pointer" :class="[searchText != '' && searchText != lmt_filter.search ? 'blue700-i blue000-b': 'grey500-i white']" @click="searchText='', onEnter()"></i>
      </div>
      <v-flex srink  class="align-self-center">
        <v-btn-toggle v-model="filterToggle">        
          <v-btn class="normal-text px-2 mx-4 border-none gd-tb-filter" :class="{'blue600 blue050-b': lmt_filter.use, 'grey600 white': !lmt_filter.use}" height="24px" text>
            <i class="icon-filter mr-1" :class="{'blue600-i': lmt_filter.use}"></i>
            <span>Filters</span>
          </v-btn>
        </v-btn-toggle>
      </v-flex>
      
    </v-toolbar-items>

     <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-flex class="align-self-center">
        <c-toolbar-btn class="mr-4" btnClass="gd-tb-create" icon="grey500-i icon-Create icon-18" tooltip="Create" @click="create" v-if="permission('ft_lmtCreate')"/> 
        <v-menu offset-y left width="218px">
            <template v-slot:activator="{ on, value }">
              <v-btn icon tile class="pa-0 control-button br-4 ml-2 mr-1 gd-tb-menu-btn" v-on="on" :class="{'grey100-b': value}">
                <i class="grey500-i icon-Donner icon-18"></i>
              </v-btn>
            </template>
            <v-list width="240px" class="control-combobox py-2 border blue050-border br-4 gd-tb-menu">
                <v-list-item height="32px" class="fs-m gd-tb-menu-csv" @click="exportCsv()">Export list (CSV)</v-list-item>
                <v-divider class="my-1" v-if="permission('ft_lmtDelete')" />
                <v-list-item height="32px" class="fs-m gd-tb-menu-delete" @click="deleteSelected" v-if="permission('ft_lmtDelete')"><i class="grey500-i icon-trash mr-2"></i>Delete</v-list-item>
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
    "lmt_filter.search" : {
      handler: function (value){
        this.searchText = value
      },
      immediate: true
    }
  },

  computed:{
    ...mapGetters(['lmt_itemsFiltered', 'lmt_filter']),

    filterToggle: {
      get: function (){
        return this.lmt_filter.use ? 0 : null;
      },

      set: function(value){
        let f = this.lmt_filter;
        f.use= isNullOrUndefined(value) ? false : true;     
        this.lmt_setFilter(f);
      }
    }
  },
  methods:{
    ...mapActions(['lmt_deleteConfirm', 'lmt_create', 'lmt_setFilter']),

    searchFocus(){
      if(this.$vuetify.breakpoint.mdAndUp)
        this.searchWidth = 200;
    },

    searchBlur(){
      if(this.searchText == '')
        this.searchWidth = 128;
    },

    onEnter(){
      var filter = this.lmt_filter;
      filter.search = this.searchText;
      this.lmt_setFilter(filter);
    },


    create(){
      this.lmt_create();
    },

    exportCsv(){
      // var toCsv = this.lmt_itemsFiltered.map(m=>{ return { 
      //   TMPL_NAME : m.name, 
      //   STATUS    : m.statusCode, 
      //   PROJECT   : m.projectName, 
      //   GROUP     : m.groupName, 
      //   CPU       : m.cpu, 
      //   RAM       : m.ram, 
      //   OS        : m.osName,
      //   // PRICE    : m.price
      // } });

      // Vue.prototype.$export.csv(toCsv, 'lmtList.csv')
    },

    deleteSelected(){
      this.lmt_deleteConfirm();
    }
  }
}
</script>
<style lang="stylus" scoped>
.lmt-tb
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