<!--noindex-->Модуль таблицы Групп<!--/noindex-->
<template>
  <div>
    <dsToolBar/>
    <c-glb-loading/>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items  ="ds_itemsFiltered"
      :sort-by.sync="sortBy"
      :sort-desc.sync="descending"
      item-key="id"
      show-select
      disable-pagination
      hide-default-header
      hide-default-footer
      class="ds-table custom-table gd-table"
      fixed-header
    > 
      <template v-slot:header="data">
        <thead>
          <tr>
          <template v-for="header in data.props.headers">
          <th v-if="header.permission || header.value == 'data-table-select'" :class="[header.value == 'data-table-select' ? 'gd-tb-col gd-tbcol-select' : header.guideCls, 'column sortable', descending ? 'desc' : 'asc', header.value === sortBy ? 'active' : '', (header.value != 'data-table-select' && header.show != 'all' && !$vuetify.breakpoint[header.show]) || (glb_showProperty && header.value != 'data-table-select' && header.showWithProps != 'all' && !$vuetify.breakpoint[header.showWithProps]) ? 'd-none' : '']" :key="header.value" class="table-header-text pa-2 fw-n" :width="header.width">
            <div v-if="header.value != 'data-table-select'">
              <div @click="changeSort(header.value)" class="pointer d-flex align-center" v-if="header.value != 'spacer'">
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
                  :state="selected.length==ds_itemsFiltered.length && ds_itemsFiltered.length > 0"  
                  @click="updateSelectedOnClick(data, $event)" 
                  class="ml-2 d-flex align-center justify-space-around mt-0"  
                  :cbid="'net-table-header-cb'" 
                  :indeterminate="selected.length>0 && selected.length < ds_itemsFiltered.length"
                 />
              <div v-if="useFilter" class="ds-table__item-counter mt-3 grey900 text-left">{{selected.length}}/{{ds_itemsFiltered.length}}</div>
            </div>
          </th>
          </template>
          </tr>
          <tr v-if="useFilter&&chipsSorted.length>0">
            <td :colspan="headers.length + 1" class="border-bottom grey200-border">
              <v-chip v-for="(chip, index) in chipsSorted" :key="'filter-chips-' + index" @click:close="chip.clear()" close close-icon="icon-Close blue700-i icomoon-important close-chips-button br-4" class="ds-table__filter-chip br-4 blue800 blue000-b fs-s fw-b px-2 ml-4">{{chip.type}}: {{chip.text}}</v-chip>
            </td>
          </tr>
        </thead>

      </template>

      <template v-slot:item="data">
        <tr :class="rowSelectedClass(data.item)" class="row-with-hidden-menu">
          <template v-for="(header, index) in data.headers">
          <td :key="index" v-if="index==0" class="gd-tbcol-row-select-cell" :class="[header.align == 'right' ? 'monospace' : '', ' pointer text-' + header.align]" @click="data.select(!data.isSelected), updateSelectedOnClick()">
            <div>
              <c-table-checkbox class="gd-tbcol-row-select-cb" :cbid="'net-table-row-' + data.item.id"  :state="data.isSelected" @click="data.select(!data.isSelected), updateSelectedOnClick()"/>
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
                    <v-btn text height="24" width="24" class="align-self-center ml-2 pa-0 hidden-row-menu-button gd-tb-row-item-menu-btn" v-on="on" :class="{'visible-row-menu-button' : value}"><i class="grey500-i icon-Donner"></i></v-btn>
                  </template>
                  <div class="ds-table__row-menu border blue050-border br-4 white-theme-table-menu gd-tb-row-item-menu">
                  <v-layout class="nowrap bg-gradient px-4 py-1 br-4-t">
                    <span class="ds-table__row-menu-name white--text">{{data.item.name}}</span>
                  </v-layout>
                  <v-list class="control-combobox py-2 br-4-b">
                      <v-list-item height="32px" class="fs-m fw-b gd-tb-row-item-menu-prop" @click="showProperty(data.item.id),data.item.menu=false" >Property</v-list-item>
                      <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-edit" @click="editProperty(data.item.id),data.item.menu=false" >Edit</v-list-item>
                      <v-divider class="my-1" />
                      <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-enable" @click="editProperty(data.item.id),data.item.menu=false" >{{data.item.isEnabled ? 'Disable' : 'Enable'}} datastore</v-list-item>
                      <v-divider class="my-1" />
                      <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-delete" @click="deleteClick(data.item)"><i class="grey500-i icon-trash icon-16 mr-2"></i>Delete</v-list-item>
                  </v-list>
                  </div>
                </v-menu>
              </v-layout>
            </div>

            <!-- enabled -->
            <div v-if="header.value=='enabled'">
              <span class="fs-m"><i class="mdi icon-24" :class="[data.item.isEnabled ? 'mdi-check green500' : 'mdi-cancel red500']"></i></span>
            </div>
            
            <!-- type -->
            <div v-if="header.value=='type'">
              <span class="grey900 fs-m">SAS</span>
            </div>

            <!-- Location -->
            <div v-if="header.value=='prep.resourceProfileFullpath'" >
              <div class="name-overflow grey900 fs-m"><span class="">{{ isNullOrUndefined(data.item.prep.resourceProfile) ? '' : data.item.prep.resourceProfile.name}}</span></div>
              <div class="name-overflow grey300 fs-s"><span class="">{{ isNullOrUndefined(data.item.prep.serviceProvider) ? '' : data.item.prep.serviceProvider.name + '/' + data.item.prep.datacenter.name}}</span></div>
            </div>

            <!-- used / capacity -->
            <div v-if="header.value=='used'">
                <div>
                    <div class="fs-s fw-b"><span class="grey900">11 262 </span><span class="grey300"> / 15 668 GB</span></div>
                    <div class="d-flex align-center">
                        <div class="ds-table__capacity flex-grow-1 mr-2 d-flex border grey300-border br-2">
                            <div class="blue800-b br-2" style="width:80%;"></div>
                            <div></div>
                        </div>
                        <div class="fs-s flex-grow-0">80%</div>
                    </div>
                </div>
            </div>

            <!-- vms -->
            <div v-if="header.value=='vms'">
              <span class="fs-m"><i class="mdi icon-24" :class="[data.item.appliedTypeId.isVirtualMachine ? 'mdi-check green500' : '']"></i></span>
            </div>

            <!-- templates -->
            <div v-if="header.value=='templates'">
              <span class="fs-m"><i class="mdi icon-24" :class="[data.item.appliedTypeId.isTemplate ? 'mdi-check green500' : '']"></i></span>
            </div>

            <!-- media -->
            <div v-if="header.value=='media'">
              <span class="fs-m"><i class="mdi icon-24" :class="[data.item.appliedTypeId.isMediaImage ? 'mdi-check green500' : '']"></i></span>
            </div>
           
            <!-- treshold -->
            <div v-if="header.value=='treshold'">
              <span class="grey900 fs-m">5 %</span>
            </div>

            <!-- space calc -->
            <div v-if="header.value=='spaceCalc'">
                <div>
                    <div class="fs-s grey900 fw-b">145 GB free</div>
                    <div class="d-flex align-center">
                        <div class="ds-table__capacity flex-grow-1 mr-2 d-flex border grey300-border br-2">
                            <div class="blue800-b br-2" style="width:86%;"></div>
                            <div></div>
                        </div>
                        <div class="fs-s flex-grow-0">86%</div>
                    </div>
                </div>
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

import { objStatus, objStatusCode } from '@/consts/_otherConsts';

import dsToolBar   from './ds-view-toolBar'
import filterMixin  from '@/modules/_system/filterMixin'

export default {
  mixins:[filterMixin],

  components:{
    dsToolBar
  },

  data(){ 
    return {
      objStatus,
      sortBy     : "name",
      descending : false,
      useFilter  : null,
      selected   : [],
      chipsInner : [],
      userSelect : false,

      headers: [
        { text: 'NAME'          , guideCls: 'gd-tb-col gd-tbcol-name'      , show: 'all' , showWithProps: 'all' , align: 'left'  , isMono:false, value: 'name'                         , filterType:'input'  , isLeft: false,permission: true, width: '280px' },
        { text: 'ENABLED'       , guideCls: 'gd-tb-col gd-tbcol-enabled'   , show: 'all' , showWithProps: 'all' , align: 'left'  , isMono:false, value: 'enabled'                      , filterType:'select'  , isLeft: false,permission: true, width: '80px' },
        { text: 'TYPE'          , guideCls: 'gd-tb-col gd-tbcol-type'      , show: 'all' , showWithProps: 'all' , align: 'left'  , isMono:false, value: 'type'                         , filterType:'select'  , isLeft: false,permission: true, width: '70px' },
        { text: 'LOCATION'      , guideCls: 'gd-tb-col gd-tbcol-location'  , show: 'all' , showWithProps: 'all' , align: 'left'  , isMono:false, value: 'prep.resourceProfileFullpath' , filterType:'location'  , isLeft: false,permission: true, width: '200px' },
        // { text: 'USED/CAPACITY' , guideCls: 'gd-tb-col gd-tbcol-used'      , show: 'all' , showWithProps: 'all' , align: 'left'  , isMono:true , value: 'used'                         , filterType:'input'  , isLeft: false,permission: true, width: '140px' },
        { text: 'VMS'           , guideCls: 'gd-tb-col gd-tbcol-vms'       , show: 'all' , showWithProps: 'all' , align: 'left'  , isMono:true , value: 'vms'                          , filterType:'select'  , isLeft: false,permission: true, width: '70px' },
        { text: 'TEMPLATES'     , guideCls: 'gd-tb-col gd-tbcol-templates' , show: 'all' , showWithProps: 'all' , align: 'left'  , isMono:false, value: 'templates'                    , filterType:'select'  , isLeft: false,permission: true, width: '100px' },
        { text: 'MEDIA'         , guideCls: 'gd-tb-col gd-tbcol-media'     , show: 'all' , showWithProps: 'all' , align: 'left'  , isMono:false, value: 'media'                        , filterType:'select'  , isLeft: false,permission: true, width: '80px' },
        { text: ' ', show: 'all', showWithProps: 'all' , align: 'right', isMono:true , permission: true, value: 'spacer', width: 'auto'},,
        // { text: 'TRESHOLD %'    , guideCls: 'gd-tb-col gd-tbcol-treshold'  , show: 'all' , showWithProps: 'all' , align: 'center', isMono: true, value: 'treshold'                     , filterType:'input'  , isLeft: true ,permission: true, width: '110px'},
        // { text: 'SPACE CALC'    , guideCls: 'gd-tb-col gd-tbcol-space-calc', show: 'all' , showWithProps: 'all' , align: 'left'  , isMono: true, value: 'spaceCalc'                    , filterType:'input'  , isLeft: true ,permission: true, width: '160px' },
      ]
    }
  },

  computed:{
    ...mapGetters(['ds_itemsFiltered', 'ds_itemsSelected', 'ds_filter', 'glb_showProperty', 'ds_showProperty', 'ds_reactiveState']),

    filter:{
      get: function(){        
        return this.ds_filter;
      },

      set: function(data){
        this.ds_setFilter(data);
      }
    } 
  },


  watch:{
    selected: function (data) {
      let compare = this.ds_itemsSelected.filter( function(e){
        return this.indexOf(e) < 0
      },  data.map(i=>i.id));
      if(this.userSelect){
        this.ds_setSelectedItems(data.map(item=>item.id));
        this.userSelect = false;
      }
    },

    ds_itemsSelected: function(data){
      this.selected = this.ds_itemsFiltered.filter(f=>data.includes(f.id))
    },

    ds_itemsFiltered:{
      handler: function(items){
          this.selected = this.ds_itemsFiltered.filter(f=>this.ds_itemsSelected.includes(f.id))
      },
      deep: true
    }  
  },

  methods:{
    ...mapActions(['ds_getItems', 'ds_setSelectedItems', 'ds_setFilter', 'ds_deleteConfirm', 'ds_setEdited', 'ds_setShowProperty']),

    updateSelectedOnClick(data, event){
      if(!isNullOrUndefined(data))
        data.on['toggle-select-all'](event);
      this.userSelect = true;
    },

    editProperty(id){
      this.ds_setEdited(id);
    },
    showProperty(id){
      this.ds_setShowProperty(id);
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
       
      var ir = this.ds_reactiveState.find(f=>f.id==item.id);
      if(!isNullOrUndefined(ir)){
        switch(ir.state){
          case 'add'     : return 'green100-b';
          case 'edit'    : return 'green100-b';
          case 'delete'  : return 'red100-b';
        }
      }

      if(this.selected.includes(item))
       return 'blue100-b';
      if(!isNullOrUndefined(this.ds_showProperty) && this.ds_showProperty.id==item.id)
       return 'blue000-b';
      return '';
    },


    deleteClick(item){
      this.ds_deleteConfirm(item);
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
     this.ds_getItems();
     new SimpleBar(qs(".custom-table .v-data-table__wrapper"), { autoHide: true });
  },
}
</script>
<style lang="stylus">
.ds-table
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
  &__capacity
    height 12px
    width 100px
    max-width 100px
</style>