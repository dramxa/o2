<!--noindex-->Модуль таблицы Групп<!--/noindex-->
<template>
  <div>
    <netToolBar/>
    <c-glb-loading/>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items  ="net_itemsFiltered"
      :sort-by.sync="sortBy"
      :sort-desc.sync="descending"
      item-key="id"
      show-select
      disable-pagination
      hide-default-header
      hide-default-footer
      class="net-table custom-table gd-table"
      fixed-header
    > 
      <template v-slot:header="data">
        <thead>
          <tr>
          <template v-for="header in data.props.headers.filter(f=>f.permission || f.permission == undefined)">
          <th v-if="header.permission || header.value == 'data-table-select'" :class="[header.value == 'data-table-select' ? 'gd-tb-col gd-tbcol-select' : header.guideCls, 'column sortable', descending ? 'desc' : 'asc', header.value === sortBy ? 'active' : '', (header.value != 'data-table-select' && header.show != 'all' && !$vuetify.breakpoint[header.show]) || (glb_showProperty && header.value != 'data-table-select' && header.showWithProps != 'all' && !$vuetify.breakpoint[header.showWithProps]) ? 'd-none' : '']" :key="header.value" class="table-header-text pa-2 fw-n" :width="header.width">
            <div v-if="header.value != 'data-table-select'">
              <div @click="changeSort(header.value)" class="pointer d-flex align-center">
                <i aria-hidden="true" v-if="sortBy == header.value && !descending" class="icon-up-down-sorted icon-18"><span class="path1"></span><span class="path2"></span></i>
                <i aria-hidden="true" v-else-if="sortBy == header.value && descending" class="icon-up-down-sorted-reverse icon-18"><span class="path1"></span><span class="path2"></span></i>
                <i aria-hidden="true" v-else class="icon-UP-Down icon-18"></i>
                <span :class="[sortBy == header.value ? 'fw-b grey800 fs-s': 'grey600 fs-s']">{{header.text}}</span>
              </div>
              <div class="mt-2" v-if="useFilter">
                <!-- INPUT -->
                <c-filter-input 
                  v-if="header.filterType == 'input'" 
                  class="filter-active" 
                  placeholder="All" 
                  @doChange="header.onChange" 
                  v-model="header.choosen"/>
                <!-- /INPUT      
                     MULTI SELECT -->
                <c-filter-select 
                  :menuClass="`${header.guideCls.split(' ')[1]}-filter`" 
                  v-if="header.filterType == 'select'"  
                  :items="header.items" 
                  @doChange="header.onChange" 
                  v-model="header.choosen"/>
                <!-- /MULTI SELECT
                     FROM TO -->
                <c-filter-from-to 
                  :menuClass="`${header.guideCls.split(' ')[1]}-filter`" 
                  v-if="header.filterType == 'from-to'" 
                  :data="header.choosen" 
                  @doChange="header.onChange" 
                  :fromToType="header.fromToType" 
                  :left="header.isLeft"/>
                <!-- /FROM TO -->
                <c-filter-location 
                  :menuClass="`${header.guideCls.split(' ')[1]}-filter`" 
                  v-if="header.filterType == 'location'" 
                  @doChange="header.onChange" 
                  v-model="header.choosen"/>
              </div>
            </div>
            <div v-else :class="{'mt-2': !useFilter}">
                <c-table-checkbox 
                  logging="true" 
                  :state="selected.length==net_itemsFiltered.length && net_itemsFiltered.length > 0"  
                  @click="updateSelectedOnClick(data, $event)" 
                  class="ml-2 d-flex align-center justify-space-around mt-0"  
                  :cbid="'net-table-header-cb'" 
                  :indeterminate="selected.length>0 && selected.length < net_itemsFiltered.length"
                 />
              <div v-if="useFilter" class="net-table__item-counter mt-3 grey900 text-left">{{selected.length}}/{{net_itemsFiltered.length}}</div>
            </div>
          </th>
          </template>
          </tr>
          <tr v-if="useFilter&&chipsSorted.length>0">
            <td :colspan="headers.length + 1" class="border-bottom grey200-border">
              <v-chip v-for="(chip, index) in chipsSorted" :key="'filter-chips-' + index" @click:close="chip.clear()" close close-icon="icon-Close blue700-i icomoon-important close-chips-button br-4" class="net-table__filter-chip br-4 blue800 blue000-b fs-s fw-b px-2 ml-4">{{chip.type}}: {{chip.text}}</v-chip>
            </td>
          </tr>
        </thead>

      </template>

      <template v-slot:item="data">
        <tr :class="rowSelectedClass(data.item)" class="row-with-hidden-menu">
          <template v-for="(header, index) in data.headers.filter(f=>f.permission || f.permission == undefined)">
          <td :key="index" v-if="index==0 && !data.item.prep.isLocationLocked" class="gd-tbcol-row-select-cell" :class="[header.align == 'right' ? 'monospace' : '', ' pointer text-' + header.align]" @click="data.select(!data.isSelected), updateSelectedOnClick()">
            <div>
              <c-table-checkbox class="gd-tbcol-row-select-cb" :cbid="'net-table-row-' + data.item.id"  :state="data.isSelected" @click="data.select(!data.isSelected), updateSelectedOnClick()"/>
            </div>
          </td>
          <td :key="index" v-if="index==0 && data.item.prep.isLocationLocked" class="gd-tbcol-row-select-cell" :class="[header.align == 'right' ? 'monospace' : '', ' pointer text-' + header.align]">
            <div>
              <v-tooltip bottom  content-class="custom-tooltip fs-s">
                <template v-slot:activator="{ on }">
                  <i v-on="on" class="ml-3 icon-Lock grey500-i icon-12"></i> 
                </template>
                <span class="custom-tooltip-accent fw-m">Location is locked</span>
              </v-tooltip>
            </div>
          </td>
          <td v-if="header.permission || index!=0" :key="index" :class="[header.isMono ? 'monospace' : '', header.value == 'name' ? ' pointer' : '', ' text-' + header.align, (header.value != 'data-table-select' && header.show != 'all' && !$vuetify.breakpoint[header.show]) || (glb_showProperty && header.value != 'data-table-select' && header.showWithProps != 'all' && !$vuetify.breakpoint[header.showWithProps]) ? 'd-none' : '']">

            <!-- name -->
            <div class="fill-height" v-if="header.value=='name'">
              <v-layout class="d-flex align-strech fill-height">
                <div @click="showDetails(data.item.id, false)" @click.middle="showDetails(data.item.id, true)" class="d-flex fill-height">
                  <label class="fw-b pointer blue800 name-overflow align-self-center">{{data.item.name}}</label>
                </div>
                <v-spacer @click="showDetails(data.item.id, false)" @click.middle="showDetails(data.item.id, true)" class="pointer"></v-spacer>
                <v-menu left offset-x width="240px" v-model="data.item.menu" :close-on-content-click="false" v-if="permission('ft_netDelete')">
                  <template v-slot:activator="{ on, value }">
                    <v-btn v-if="!data.item.prep.isLocationLocked" text height="24" width="24" class="align-self-center ml-2 pa-0 hidden-row-menu-button gd-tb-row-item-menu-btn" v-on="on" :class="{'visible-row-menu-button' : value}"><i class="grey500-i icon-Donner"></i></v-btn>
                  </template>
                  <div class="net-table__row-menu border blue050-border br-4 white-theme-table-menu gd-tb-row-item-menu">
                  <v-layout class="nowrap bg-gradient px-4 py-1 br-4-t">
                    <span class="net-table__row-menu-name white--text">{{data.item.name}}</span>
                  </v-layout>
                  <v-list class="control-combobox py-2 br-4-b">
                    <div v-if="adminTools==true">
                      <v-list-item height="32px" class="fs-m fw-b" @click="adminTools=false" ><i class="mdi mdi-arrow-left icon-18 mr-2 gd-tb-row-item-menu-backFromAdminTools"></i> Back</v-list-item>
                      <v-divider class="my-1" />
                      <v-list-item height="32px" class="fs-m fw-b gd-tb-row-item-menu-sinchronize" @click="net_resyncConfirm(data.item.id), data.item.menu=false" >Synchronize</v-list-item>
                    </div>
                    <div v-else>
                      <v-list-item height="32px" class="fs-m fw-b gd-tb-row-item-menu-prop" @click="showProperty(data.item.id),data.item.menu=false" >Property</v-list-item>
                      <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-edit" @click="editProperty(data.item.id),data.item.menu=false" >Edit</v-list-item>
                      <v-divider class="my-1" v-if="permissionPA()"/> <!-- permissionPA() -->
                      <v-list-item height="32px" v-if="permissionPA()" class="fs-m gd-tb-row-item-menu-adminTools" @click="adminTools=true" >Administration tools</v-list-item>
                      <v-divider class="my-1" />
                      <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-delete" @click="deleteClick(data.item)"><i class="grey500-i icon-trash icon-16 mr-2"></i>Delete</v-list-item>
                    </div>
                  </v-list>
                  </div>
                </v-menu>
              </v-layout>
            </div>

            <!-- vlan -->
            <div v-if="header.value=='vlan'">
              <span class="grey900 fs-m">{{ isNullOrUndefined(data.item.vlan, { y:()=>'unknown', n:v=>v }) }}</span>
            </div>

            <!-- netType -->
            <div v-if="header.value=='netType'">
              <span class="grey900 fs-m">{{netTypes[data.item.type]}}</span>
            </div>
            
            <!-- vmCount -->
            <div v-if="header.value=='vmCount'">
              <span class="grey900 fs-m">{{data.item.connectedVms.length}}</span>
            </div>

            <!-- statusCode -->
            <div v-if="header.value=='statusCode'">
              <v-flex v-if="data.item.statusCode=='busy'" class="d-flex align-center">
                <v-progress-circular  rotate="90" size="20" indeterminate width="2" class="blue800 fs-xs fw-b mr-1"></v-progress-circular> <!-- value="66"  {{ value }} -->
                <span v-if="data.item.statusCode=='busy'"  class="blue800 fw-b fs-s border-bottom-dashed blue800-border">{{objStatus[data.item.statusCode]}}</span>
              </v-flex>
              <v-flex v-if="data.item.statusCode=='error'" class="red500 fw-b fs-s d-flex align-center">
                <i class="icon-x-circle icon-20 mr-1"></i>
                <span class="border-bottom-dashed red500-border">{{objStatus[data.item.statusCode]}}</span>
              </v-flex>
              <v-flex v-if="data.item.statusCode=='ready'" class="fs-s d-flex align-center">
                <i class="icon-check-circle grey300-i icon-20 mr-1"></i>
                <span class="grey300 fs-s">{{objStatus[data.item.statusCode]}}</span>
              </v-flex>
            </div>

            <!-- Location -->
            <div v-if="header.value=='prep.resourceProfileFullpath'" >
              <div class="name-overflow grey900 fs-m"><span class="">{{ isNullOrUndefined(data.item.prep.resourceProfile) ? '' : data.item.prep.resourceProfile.name}}</span></div>
              <div class="name-overflow grey300 fs-s"><span class="">{{ isNullOrUndefined(data.item.prep.serviceProvider) ? '' : data.item.prep.serviceProvider.name + '/' + data.item.prep.datacenter.name}}</span></div>
            </div>


            
            <!-- comment -->
            <div v-if="header.value=='comment'">
              <span class="grey900 fs-m">{{data.item.comment}}</span>
            </div>
           
            <!-- createDateFormatted -->
            <div v-if="header.value=='createDate'">
              <span class="grey900 fs-m">{{data.item.prep.createDateFormatted}}</span>
            </div>

          </td>
          </template>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapGetters   } from 'vuex';

import { objStatus, objStatusCode, 
           netTypes, netTypesCode } from '@/consts/_otherConsts';

import netToolBar   from './networks-view-toolBar'
import filterMixin  from '@/modules/_system/filterMixin'

export default {
  mixins:[filterMixin],

  components:{
    netToolBar
  },

  data(){ return {
      
      objStatus,
      netTypes,
      sortBy     : "name",
      descending : false,
      useFilter  : null,
      selected   : [],
      chipsInner : [],
      userSelect : false,
      adminTools : false,

      headers: [
        { text: 'NAME'     , guideCls: 'gd-tb-col gd-tbcol-name'    , show: 'all'    , showWithProps: 'all'    , align: 'left' , isMono:false, value: 'name'                         ,filterType:'input'    , isLeft: false,permission: true, width: 'auto' },
        { text: 'VLAN'     , guideCls: 'gd-tb-col gd-tbcol-vlan'    , show: 'all'    , showWithProps: 'all'    , align: 'left' , isMono:false, value: 'vlan'                         ,filterType:'from-to'  , isLeft: false,permission: this.permissionPA(), width: 'auto' },
        { text: 'STATUS'   , guideCls: 'gd-tb-col gd-tbcol-status'  , show: 'all'    , showWithProps: 'smAndUp', align: 'left' , isMono:false, value: 'statusCode'                   ,filterType:'select'   , isLeft: false,permission: true, width: '150px'},
        { text: 'LOCATION' , guideCls: 'gd-tb-col gd-tbcol-location', show: 'all'    , showWithProps: 'all'    , align: 'left' , isMono:false, value: 'prep.resourceProfileFullpath' ,filterType:'location' , isLeft: false,permission: true, width: 'auto'},
        { text: 'VM#'      , guideCls: 'gd-tb-col gd-tbcol-vms'     , show: 'all'    , showWithProps: 'all'    , align: 'right', isMono:true , value: 'vmCount'                      ,filterType:'from-to'  , isLeft: false,permission: this.permission('ft_vmRead'), width: '70px'},
        { text: 'TYPE'     , guideCls: 'gd-tb-col gd-tbcol-type'    , show: 'mdAndUp', showWithProps: 'all'    , align: 'left' , isMono:false, value: 'netType'                      ,filterType:'select'   , isLeft: false,permission: true, width: '100px'},
        // { text: 'COMMENT'  , guideCls: 'gd-tb-col gd-tbcol-comment' , show: 'lgAndUp', showWithProps: 'xl'     , align: 'left' , isMono:false, value: 'comment'                      ,filterType:'input'    , isLeft: false,permission: true, width: 'auto' },
        { text: 'CREATED'  , guideCls: 'gd-tb-col gd-tbcol-created' , show: 'lgAndUp', showWithProps: 'all'    , align: 'left' , isMono: true, value: 'createDate'                   ,filterType:'from-to'  , isLeft: true ,permission: true, width: '120px', fromToType:'date' },
      ]
    }
  },

  computed:{
    ...mapGetters(['net_itemsFiltered', 'net_itemsSelected', 'net_filter', 'glb_showProperty', 'net_showProperty', 'net_reactiveState']),

    filter:{
      get: function(){        
        return this.net_filter;
      },

      set: function(data){
        this.net_setFilter(data);
      }
    }
  },


  watch:{
    selected: function (data) {
      let compare = this.net_itemsSelected.filter( function(e){
        return this.indexOf(e) < 0
      },  data.map(i=>i.id));
      if(this.userSelect){
        this.net_setSelectedItems(data.map(item=>item.id));
        this.userSelect = false;
      }
    },

    net_itemsSelected: function(data){
      this.selected = this.net_itemsFiltered.filter(f=>data.includes(f.id))
    },

    net_itemsFiltered:{
      handler: function(items){
          this.selected = this.net_itemsFiltered.filter(f=>this.net_itemsSelected.includes(f.id))
      },
      deep: true
    }  
  },

  methods:{
    ...mapActions(['net_getItems', 'net_setSelectedItems', 'net_setFilter', 'net_deleteConfirm', 'net_setEdited', 'net_setShowProperty', 'net_resyncConfirm']),

    updateSelectedOnClick(data, event){
      if(!isNullOrUndefined(data))
        data.on['toggle-select-all'](event);
      this.userSelect = true;
    },

    editProperty(id){
      this.net_setEdited(id);
    },
    showProperty(id){
      this.net_setShowProperty(id);
    },

    showDetails(id, isNewWIndow){
      if(isNewWIndow)
        this.$nav.showDetailsInNewWindow(id);
      else
        this.$nav.showDetailsRoute(id);
    },

    rowSelectedClass(item){
      if(isNullOrUndefined(item))
       return '';
       
      var ir = this.net_reactiveState.find(f=>f.id==item.id);
      if(!isNullOrUndefined(ir)){
        switch(ir.state){
          case 'add'     : return 'green100-b';
          case 'edit'    : return 'green100-b';
          case 'delete'  : return 'red100-b';
        }
      }

      if(this.selected.includes(item) && !item.prep.isLocationLocked)
       return 'blue100-b';
      if(!isNullOrUndefined(this.net_showProperty) && this.net_showProperty.id==item.id)
       return 'blue000-b';
      return '';
    },


    deleteClick(item){
      this.net_deleteConfirm(item);
    },


    changeSort (column) {
      if (this.sortBy === column) {
        this.descending = !this.descending
      } else {
        this.sortBy = column
        this.descending = false
      }
    }
  },

  
  mounted() {
     this.net_getItems();
     new SimpleBar(qs(".custom-table .v-data-table__wrapper"), { autoHide: true });
  },
}
</script>
<style lang="stylus">
.net-table
  max-height calc(100vh - 112px)
  &__item-counter
    font-size 10px
    line-height 12px
    position relative
    top 9px
    left 17px
  &__filter-chip
    height 24px
    margin-top 1px
  &__row-menu
    width 240px
  &__row-menu-name
    overflow hidden
    text-overflow ellipsis
</style>