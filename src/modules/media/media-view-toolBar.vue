<!--noindex-->Модуль тулбара управления ISO<!--/noindex-->
<template>
  <v-toolbar flat  class="toolbar-ext" height="50px">
    <v-toolbar-items>
      <div class="med-tb-search align-self-center ml-4 relative gd-tb-search">
        <input 
          v-model="searchText"
          v-on:keyup.enter="onEnter"
          type="text" 
          :style="{width: searchWidth + 'px'}"
          :class="[searchText != '' && searchText != med_filter.search ? 'blue700 blue000-b': 'grey700']"
          class="med-tb-search__input border grey300-border px-2 py-1 br-2 fw-b fs-s gd-tb-search"
          placeholder="Search"
          @focus="searchFocus()"
          @blur="searchBlur()"
          >
          <i v-show="searchText != ''" class="med-tb-search__icon icon-Close py-1 px-1 pointer" :class="[searchText != '' && searchText != med_filter.search ? 'blue700-i blue000-b': 'grey500-i white']" @click="searchText='', onEnter()"></i>
      </div>
      <v-flex srink  class="align-self-center">
        <v-btn-toggle v-model="filterToggle">        
          <v-btn class="normal-text px-2 mx-4 border-none table-filter-toggle-btn br-4 gd-tb-filter" :class="{'blue600 blue050-b': med_filter.use, 'grey600 white': !med_filter.use}" height="24px">
            <i class="icon-filter mr-1" :class="{'blue600-i': med_filter.use}"></i>
            <span>Filters</span>
          </v-btn>
        </v-btn-toggle>
      </v-flex>
    
    </v-toolbar-items>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-flex class="align-self-center">
        <c-toolbar-btn class="mr-2" btnClass="gd-tb-import" icon="grey500-i icon-AddISO icon-18" tooltip="Import ISO" @click="importClick()" v-if="permission('ft_medImport')" />
        <v-menu offset-y left width="218px">
            <template v-slot:activator="{ on, value }">
              <v-btn icon tile class="pa-0 control-button br-4 ml-2 mr-1 gd-tb-menu-btn" v-on="on" :class="{'grey100-b': value}">
                <i class="grey500-i icon-Donner icon-18"></i>
              </v-btn>
            </template>
            <v-list width="240px" class="control-combobox py-2 border blue050-border br-4 gd-tb-menu">
                <v-list-item height="32px" class="fs-m gd-tb-menu-admImport" v-if="permissionPA()" @click="admImport()">Import from hypervisor</v-list-item>
                <v-list-item height="32px" class="fs-m gd-tb-menu-csv" @click="exportCsv()">Export list (CSV)</v-list-item>
                <v-divider class="my-1" v-if="permission('ft_medDelete')" />
                <v-list-item height="32px" class="fs-m gd-tb-menu-delete" @click="deleteSelected" v-if="permission('ft_medDelete')"><i class="grey500-i icon-trash mr-2"></i>Delete</v-list-item>
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
      sleceted: [],
      searchText : '',
      searchWidth: 128
    }
  },

  watch:{
    "med_filter.search" : {
      handler: function (value){
        this.searchText = value
      },
      immediate: true
    }
  },

  computed:{
    ...mapGetters(['med_itemsFiltered', 'med_filter']),

    filterToggle: {
      get: function (){
        return this.med_filter.use ? 0 : null;
      },

      set: function(value){
        let f = this.med_filter;
        f.use= isNullOrUndefined(value) ? false : true;     
        this.med_setFilter(f);
      }
    }
  },
  methods:{
    ...mapActions(['med_deleteConfirm', 'med_create', 'med_setFilter', 'med_admImport']),

    searchFocus(){
      if(this.$vuetify.breakpoint.mdAndUp)
        this.searchWidth = 200;
    },

    searchBlur(){
      if(this.searchText == '')
        this.searchWidth = 128;
    },

    onEnter(){
      var filter = this.med_filter;
      filter.search = this.searchText;
      this.med_setFilter(filter);
    },


    create(){
      this.med_create();
    },

    exportCsv(){
      var toCsv = this.med_itemsFiltered.map(m=>{ return { 
        ISO_NAME      : m.name, 
        CONNECTED_VMS : m.connectedVms.length, 
        STATUS_CODE   : m.statusCode, 
        SIZE          : m.size
      } });

      Vue.prototype.$export.csv(toCsv, 'medList.csv')
    },

    admImport(){
      this.med_admImport();
    },

    deleteSelected(){
      this.net_deleteConfirm();
    }
  }
}
</script>
<style lang="stylus" scoped>
.med-tb
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