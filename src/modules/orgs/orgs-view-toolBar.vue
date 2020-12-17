<!--noindex-->Модуль тулбара управления Организациями<!--/noindex-->
<template>
  <v-toolbar flat  class="toolbar-ext" height="50px">
    <v-toolbar-items>
      <div class="org-tb-search align-self-center ml-4 relative gd-tb-search">
        <input 
          v-model="searchText"
          v-on:keyup.enter="onEnter"
          type="text"  
          :style="{width: searchWidth + 'px'}"
          :class="[searchText != '' && searchText != org_filter.search ? 'blue700 blue000-b': 'grey700']"
          placeholder="Search"
          class="org-tb-search__input border grey300-border px-2 py-1 br-2 fw-b fs-s gd-tb-search"
          @focus="searchFocus()"
          @blur="searchBlur()"
          >
          <i v-show="searchText != ''" class="org-tb-search__icon icon-Close py-1 px-1 pointer" :class="[searchText != '' && searchText != org_filter.search ? 'blue700-i blue000-b': 'grey500-i white']" @click="searchText='', onEnter()"></i>
      </div>
      <v-flex srink  class="align-self-center">
        <v-btn-toggle v-model="filterToggle">        
          <v-btn class="normal-text px-2 mx-4 table-filter-toggle-btn border-none br-4 gd-tb-filter" :class="{'blue600 blue050-b': org_filter.use, 'grey600 white': !org_filter.use}" height="24px">
            <i class="icon-filter mr-1" :class="{'blue600-i': org_filter.use}"></i>
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
        <c-toolbar-btn class="mr-4" btnClass="gd-tb-create" icon="grey500-i icon-Create icon-18" tooltip="Create" @click="create" v-if="permission('ft_orgCreate')"/> 
        <v-menu offset-y left width="218px">
            <template v-slot:activator="{ on, value }">
              <v-btn icon tile class="pa-0 control-button br-4 ml-2 mr-1 gd-tb-menu-btn" v-on="on" :class="{'grey100-b': value}">
                <i class="grey500-i icon-Donner icon-18"></i>
              </v-btn>
            </template>
            <v-list width="240px" class="control-combobox py-2 border blue050-border br-4 gd-tb-menu">
                <v-list-item height="32px" class="fs-m gd-tb-menu-csv" @click="exportCsv()">Export list (CSV)</v-list-item>
                <v-divider class="my-1" v-if="permission('ft_orgDelete')" />
                <v-list-item height="32px" class="fs-m gd-tb-menu-delete" @click="deleteSelected" v-if="permission('ft_orgDelete')"><i class="grey500-i icon-trash mr-2"></i>Delete</v-list-item>
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
    "org_filter.search" : {
      handler: function (value){
        this.searchText = value
      },
      immediate: true
    }
  },


  computed:{
    ...mapGetters(['org_itemsFiltered', 'org_filter']),

    filterToggle: {
      get: function (){
        return this.org_filter.use ? 0 : null;
      },

      set: function(value){
        let f = this.org_filter;
        f.use= isNullOrUndefined(value) ? false : true;     
        this.org_setFilter(f);
      }
    }
  },
  methods:{
    ...mapActions(['org_deleteConfirm', 'org_create', 'org_setFilter']),

    searchFocus(){
      if(this.$vuetify.breakpoint.mdAndUp)
        this.searchWidth = 200;
    },

    searchBlur(){
      if(this.searchText == '')
        this.searchWidth = 128;
    },

    onEnter(){
      var filter = this.org_filter;
      filter.search = this.searchText;
      this.org_setFilter(filter);
    },


    create(){
      this.org_create();
    },

    exportCsv(){
      var toCsv = this.org_itemsFiltered.map(m=>{ return { 
        ORG_NAME       : m.name, 
        FULL_NAME      : m.fullName, 
        CODE           : m.code, 
        PROJECTS_COUNT : m.projectsCount, 
        GROUPS_COUNT   : m.groupsCount, 
        CREATED        : m.prep.createDateFormatted, 
        LOCKED         : m.isBlocked,
        COMMENT        : m.comment
      } });

      Vue.prototype.$export.csv(toCsv, 'orgList.csv')
    },

    deleteSelected(){
      this.org_deleteConfirm();
    }
  }
}
</script>
<style lang="stylus" scoped>
.org-tb
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