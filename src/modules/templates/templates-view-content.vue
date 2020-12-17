<template>
<v-card flat>
  <tmplToolBar/>
  <c-glb-loading/>
  <v-data-table
      v-model="selected"
      :headers="headers"
      :items="templateItems"
      :sort-by.sync="sortBy"
      :sort-desc.sync="descending"
      item-key="id"
      show-select
      disable-pagination
      hide-default-header
      hide-default-footer
      class="tmpl-table custom-table gd-table"
      fixed-header
    > 
      <template v-slot:header="data">
        <thead>
          <tr>
          <template v-for="header in data.props.headers" >
          <th  v-if="header.value != 'prep.priceTotal' || tmpl_tepmplateType == 'user'" :class="[header.value == 'data-table-select' ? 'gd-tb-col gd-tbcol-select' : header.guideCls, 'column sortable', descending ? 'desc' : 'asc', header.value === sortBy ? 'active' : '', (header.value != 'data-table-select' && header.show != 'all' && !$vuetify.breakpoint[header.show]) || (glb_showProperty && header.value != 'data-table-select' && header.showWithProps != 'all' && !$vuetify.breakpoint[header.showWithProps]) ? 'd-none' : '']" :key="header.value" class="table-header-text pa-2 fw-n" :width="header.width">
            <div v-if="header.value != 'data-table-select'">
              <div @click="changeSort(header.value)" class="pointer d-flex align-center" v-if="header.value != 'spacer'">
                <i aria-hidden="true" v-if="sortBy == header.value && !descending && header.text != ''" class="icon-up-down-sorted icon-18"><span class="path1"></span><span class="path2"></span></i>
                <i aria-hidden="true" v-else-if="sortBy == header.value && descending && header.text != ''" class="icon-up-down-sorted-reverse icon-18"><span class="path1"></span><span class="path2"></span></i>
                <i aria-hidden="true" v-else :class="[header.text != '' ? 'icon-UP-Down icon-18' : '']"></i>
                <span :class="[sortBy == header.value ? 'fw-b grey800 fs-s': 'grey600 fs-s']">{{header.text}}</span>
                <v-menu offset-y left v-model="menuPeriod" width="218px"  v-if="header.value == 'prep.priceTotal'">
                  <template v-slot:activator="{ }">
                    <v-tooltip bottom  content-class="custom-tooltip fs-s">
                      <template v-slot:activator="{ on }">
                        <v-btn text v-on="on" @click.stop="menuPeriod=true" :class="[sortBy == header.value ? 'fw-b grey800 fs-s': 'grey600 fs-s', 'gd-tb-price-btn']" class="normal-text mb-0-5 mx-1 px-0 border-none br-4" min-width="unset" height="24px">(<span class="tmpl-table__price-period grey800-border border-bottom-dashed">{{glb_pricePeriod}}</span>)</v-btn>
                      </template>
                      <span class="custom-tooltip-accent fw-m">Choose period</span>
                    </v-tooltip>
                  </template>
                  <v-list width="150px" class="control-combobox py-2 border blue050-border br-4 gd-tb-price-menu">
                      <v-list-item class="fs-m dropdown-menu-item" @click="glb_setPricePeriod('HOUR')"  ><span :class="glb_pricePeriod=='HOUR' ? 'blue800 fw-b':'grey700'">Hour</span></v-list-item>
                      <v-list-item class="fs-m dropdown-menu-item gd-tb-price-menu-click" @click="glb_setPricePeriod('DAY')"   ><span :class="glb_pricePeriod=='DAY' ? 'blue800 fw-b':'grey700'">Day</span></v-list-item>
                      <v-list-item class="fs-m dropdown-menu-item" @click="glb_setPricePeriod('MONTH')" ><span :class="glb_pricePeriod=='MONTH' ? 'blue800 fw-b':'grey700'">Month</span></v-list-item>
                  </v-list>
                </v-menu>
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
                  :state="selected.length==templateItems.length && templateItems.length > 0"  
                  @click="updateSelectedOnClick(data, $event)" 
                  class="ml-2 d-flex align-center justify-space-around mt-0"  
                  :cbid="'tmpl-table-header-cb'" 
                  :indeterminate="selected.length>0 && selected.length < templateItems.length"
                 />
              <div v-if="useFilter" class="tmpl-table__item-counter mt-3 grey900 text-left">{{selected.length}}/{{tmpl_itemsFiltered.length}}</div>
            </div>
          </th>
          </template>
          </tr>
          <tr v-if="useFilter&&chipsSorted.length>0">
            <td :colspan="headers.length + 1" class="border-bottom grey200-border">
              <v-chip v-for="(chip, index) in chipsSorted" :key="'filter-chips-' + index" @click:close="chip.clear()" close close-icon="icon-Close blue700-i icomoon-important close-chips-button br-4" class="tmpl-table__filter-chip br-4 blue800 blue000-b fs-s fw-b px-2 ml-4">{{chip.type}}: {{chip.text}}</v-chip>
            </td>
          </tr>
        </thead>
      </template>
      
      <template v-slot:item="data">
        <tr :class="rowSelectedClass(data.item)" class="row-with-hidden-menu">
          <template v-for="(header, index) in data.headers">
            <td :key="index" v-if="index==0 && !data.item.prep.isLocationLocked" class="gd-tbcol-row-select-cell" :class="[header.align == 'right' ? 'monospace' : '', ' pointer text-' + header.align]" @click ="data.select(!data.isSelected), updateSelectedOnClick()">
              <div>
                <c-table-checkbox class="gd-tbcol-row-select-cb" :cbid="'tmpl-table-row-' + data.item.id"  :state="data.isSelected"  @click="data.select(!data.isSelected), updateSelectedOnClick()"/>
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
          <td :key="index" v-if="(header.value != 'prep.priceTotal' || tmpl_tepmplateType == 'user') && index!=0" :class="[header.isMono ? 'monospace' : '', header.value == 'name' ? ' pointer' : '', ' text-' + header.align, (header.value != 'data-table-select' && header.show != 'all' && !$vuetify.breakpoint[header.show]) || (glb_showProperty && header.value != 'data-table-select' && header.showWithProps != 'all' && !$vuetify.breakpoint[header.showWithProps]) ? 'd-none' : '']">


            <!-- name -->
            <div class="fill-height" v-if="header.value=='name'">
              <v-layout class="d-flex align-strech fill-height">
                <div @click="showDetails(data.item.id, false)" @click.middle="showDetails(data.item.id, true)" class="d-flex fill-height">
                  <!-- <img src="img/icons/template_default_icon.png" class="tmpl-icon mr-2 align-self-center"> -->
                  <label class="fw-b name-prop blue800 name-overflow align-self-center">{{data.item.name}}</label>
                </div>
                <v-spacer @click="showDetails(data.item.id, false)" @click.middle="showDetails(data.item.id, true)"></v-spacer>
                <v-menu left offset-x width="240px" v-model="data.item.menu" :close-on-content-click="false" v-if="permission('ft_templDelete')">
                  <template v-slot:activator="{ on, value }">
                    <v-btn v-if="!data.item.prep.isLocationLocked" text height="24" width="24" class="align-self-center ml-2 pa-0 hidden-row-menu-button gd-tb-row-item-menu-btn" v-on="on" :class="{'visible-row-menu-button' : value}"><i class="grey500-i icon-Donner"></i></v-btn>
                  </template>
                  <div class="tmpl-table__row-menu border blue050-border br-4 white-theme-table-menu gd-tb-row-item-menu">
                  <v-layout class="nowrap bg-gradient px-4 py-1 br-4-t">
                    <span class="tmpl-table__row-menu-name white--text">{{data.item.name}}</span>
                  </v-layout>
                  <v-list class="control-combobox py-2 br-4-b">
                      <v-list-item height="32px" class="fs-m fw-b gd-tb-row-item-menu-prop" @click="showProperty(data.item.id),data.item.menu=false" >Property</v-list-item>
                      <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-edit" v-if="!data.item.isPublic || permissionPA()" @click="editProperty(data.item.id),data.item.menu=false" >Edit</v-list-item>
                      <v-divider class="my-1" v-if="!data.item.isPublic || permissionPA()" />
                      <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-delete" v-if="!data.item.isPublic || permissionPA()" @click="deleteClick(data.item)"><i class="grey500-i icon-trash icon-16 mr-2"></i>Delete</v-list-item>
                  </v-list>
                  </div>
                </v-menu>
              </v-layout>
            </div>

            <!-- status -->
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

            <!-- Locked -->
            <div v-if="header.value=='isLocked'">
              <span v-if="data.item.isLocked" class="grey700 fw-b fs-m" ><i class="grey500-i icon-Lock mr-2"></i>Locked</span>
            </div> 

            <!-- Location -->
            <div v-if="header.value=='prep.resourceProfileFullpath'" >
              <div class="name-overflow grey900 fs-m"><span class="">{{ isNullOrUndefined(data.item.prep.resourceProfile) ? '' : data.item.prep.resourceProfile.name}}</span></div>
              <div class="name-overflow grey300 fs-s"><span class="">{{ isNullOrUndefined(data.item.prep.serviceProvider) ? '' : data.item.prep.serviceProvider.name + '/' + data.item.prep.datacenter.name}}</span></div>
            </div>
            
            <!-- cpu -->
            <div v-if="header.value=='cpu'">
              <span class="grey900 fs-m">{{data.item.cpu}}</span>
            </div>

            <!-- ram -->
            <div v-if="header.value=='ram'">
              <span class="grey900 fs-m ws-pre">{{data.item.prep.ramFormatted}} GB</span>
            </div>

            <!-- storageTotal -->
            <div v-if="header.value=='prep.storageTotal'">
              <span class="grey900 fs-m">{{data.item.prep.storageTotalFormatted}} GB</span>
            </div>

            <!-- osName -->
            <div v-if="header.value=='prep.osName'">
              <span class="grey900 fs-s ws-pre">{{truncateString(data.item.prep.osName, 22)}}</span>
            </div>

            <!-- createDateFormatted -->
            <div v-if="header.value=='createDate'">
              <span class="grey900 fs-m">{{data.item.prep.createDateFormatted}}</span>
            </div>

            <!-- price -->
            <div v-if="header.value=='prep.priceTotal' && !isNullOrUndefined(data.item.prep.priceTotalFormatted)" class="nowrap pr-4 fs-m fw-b" :class="[data.item.prep.priceCalcError ? 'red500' : 'grey900']">
              <span v-if="glb_pricePeriod=='HOUR'" >{{data.item.prep.priceTotalFormatted.perHour}}</span>
              <span v-if="glb_pricePeriod=='DAY'"  >{{data.item.prep.priceTotalFormatted.perDay}}</span>
              <span v-if="glb_pricePeriod=='MONTH'">{{data.item.prep.priceTotalFormatted.perMonth}}</span>
            </div>
          </td>
          </template>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapActions, mapGetters  } from 'vuex';
import { objStatus,objStatusCode } from '@/consts/_otherConsts';

import tmplToolBar from './templates-view-toolBar'
import filterMixin from '@/modules/_system/filterMixin'

export default {
  mixins:[filterMixin],

  components:{
    tmplToolBar
  },

  data(){ return {
      isUserItems: false,
      menuPeriod : false,
      pricePeriod: 'MONTH',
      objStatus,
      sortBy     : "name",
      descending : false,
      useFilter  : null, 
      selected   : [],
      chipsInner : [],
      userSelect : false,

      headers:[
        { text:'TEMPLATE NAME', guideCls: 'gd-tb-col gd-tbcol-name'    , show: 'all'    , showWithProps: 'all'    , align: 'left' , isMono: false, value: 'name'                         , filterType:'input'   , isLeft: false, width: 'auto' },
        { text:'LOCKED'       , guideCls: 'gd-tb-col gd-tbcol-locked'  , show: 'all'    , showWithProps: 'mdAndUp', align: 'left' , isMono: false, value: 'isLocked'                     , filterType:'select'  , isLeft: false, width: '120px'},
        { text:'STATUS'       , guideCls: 'gd-tb-col gd-tbcol-status'  , show: 'all'    , showWithProps: 'mdAndUp', align: 'left' , isMono: false, value: 'statusCode'                   , filterType:'select'  , isLeft: false, width: '120px'},
        { text:'LOCATION'     , guideCls: 'gd-tb-col gd-tbcol-location', show: 'all'    , showWithProps: 'all'    , align: 'left' , isMono:false , value: 'prep.resourceProfileFullpath' , filterType:'location', isLeft: false, width: 'auto' },
        { text:'CPU'          , guideCls: 'gd-tb-col gd-tbcol-cpu'     , show: 'all'    , showWithProps: 'all'    , align: 'right', isMono: true , value: 'cpu'                          , filterType:'from-to' , isLeft: false, width: '70px' },
        { text:'RAM(GB)'      , guideCls: 'gd-tb-col gd-tbcol-ram'     , show: 'all'    , showWithProps: 'all'    , align: 'right', isMono: true , value: 'ram'                          , filterType:'from-to' , isLeft: false, width: '90px' },
        { text:'STORAGE(GB)'  , guideCls: 'gd-tb-col gd-tbcol-storage' , show: 'all'    , showWithProps: 'all'    , align: 'right', isMono: true , value: 'prep.storageTotal'            , filterType:'from-to' , isLeft: false, width: '116px'},
        { text:'OS'           , guideCls: 'gd-tb-col gd-tbcol-os'      , show: 'smAndUp', showWithProps: 'xlOnly' , align: 'left' , isMono: false, value: 'prep.osName'                  , filterType:'select'  , isLeft: false, width: '220px'},
        { text:'CREATED'      , guideCls: 'gd-tb-col gd-tbcol-created' , show: 'lgAndUp', showWithProps: 'xlOnly' , align: 'left' , isMono: true , value: 'createDate'                   , filterType:'from-to' , isLeft: true , width: '110px', fromToType:'date' },
        // { text:''                                                      , show: 'all'    , showWithProps: 'xl'     , align: 'right', isMono: true , width: '160px'},
        { text:'PRICE'        , show: 'all'    , showWithProps: 'all'    , align: 'right', isMono: true , value: 'prep.priceTotal'              , filterType:'from-to', isLeft: true , width: '130px'},
      ]
  } },

  computed:{
    ...mapGetters(['tmpl_itemsFiltered', 'tmpl_itemsSelected', 'tmpl_filter', 'glb_showProperty', 'os_itemsAll', 
    'tmpl_showProperty', 'tmpl_reactiveState', 'glb_pricePeriod', 'auth_accessTokenInfo', 'tmpl_tepmplateType']),
    
    templateItems(){
      var currentOrgTemplates =  this.tmpl_itemsFiltered.filter(t=>t.orgId == this.auth_accessTokenInfo.org_id && !t.isPublic);
      var publicTemplates = this.tmpl_itemsFiltered.filter(t=>t.isPublic);
      return this.tmpl_tepmplateType == 'user' ? currentOrgTemplates : publicTemplates
    },
    
    filter:{
      get: function(){        
        return this.tmpl_filter;
      },

      set: function(data){
        this.tmpl_setFilter(data);
      }
    },        

  },

  watch:{
    selected: function (data) {
        let compare = this.tmpl_itemsSelected.filter( function(e){
          return this.indexOf(e) < 0
        },  data.map(i=>i.id));
        if(this.userSelect){
          this.tmpl_setSelectedItems(data.map(item=>item.id));
          this.userSelect = false;
        }
      },

      tmpl_itemsSelected: function(data){
        this.selected = this.tmpl_itemsFiltered.filter(f=>data.includes(f.id))
      },

    tmpl_itemsFiltered:{
      handler: function(items){
        this.selected = this.tmpl_itemsFiltered.filter(f=>this.tmpl_itemsSelected.includes(f.id))
      },
      deep: true
    }
  },

  methods: {
    ...mapActions([
      'tmpl_getItems', 
      'tmpl_setSelectedItems', 
      'tmpl_setFilter', 
      'tmpl_deleteConfirm', 
      'tmpl_setEdited', 
      'tmpl_setShowProperty', 
      'glb_setPricePeriod'
      ]),
    
    updateSelectedOnClick(data, event){
      if(!isNullOrUndefined(data))
        data.on['toggle-select-all'](event);
      this.userSelect = true;
    },

    editProperty(id){
      this.tmpl_setEdited(id);
    },

    showProperty(id){
      this.tmpl_setShowProperty(id);
    },

    rowSelectedClass(item){
      if(isNullOrUndefined(item))
        return '';

      var ir = this.tmpl_reactiveState.find(f=>f.id==item.id);
      if(!isNullOrUndefined(ir)){
        switch(ir.state){
          case 'add'     : return 'green100-b';
          case 'edit'    : return 'green100-b';
          case 'delete'  : return 'red100-b';
        }
      }

      if(this.selected.includes(item) && !item.prep.isLocationLocked)
        return 'blue100-b';
      if(!isNullOrUndefined(this.tmpl_showProperty) && this.tmpl_showProperty.id==item.id)
        return 'blue000-b';
      return '';
    },

    deleteClick(item){
      this.tmpl_deleteConfirm(item);
    },

    truncateString(str, num){
      return isNullOrUndefined(str) ? '' : (str.length > num ? str.slice(0, num) + '...' : str)
    },

    showDetails(id, isNewWIndow){
      if(isNewWIndow)
        this.$nav.showDetailsInNewWindow(id);
      else
        this.$nav.showDetailsRoute(id);
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
      this.tmpl_getItems();
      new SimpleBar(qs(".custom-table .v-data-table__wrapper"), { autoHide: true });
  },
}
</script>
<style lang="stylus">
.tmpl-table
  max-height calc(100vh - 112px - 40px)
  &__price-period
    position relative
    top 1px
  &__item-counter
    font-size 10px
    line-height 12px
    position relative
    top 9px
    left 17px;
  &__filter-chip
    height 24px
    margin-top 1px
  &__row-menu
    width 240px
  &__row-menu-name
    overflow hidden
    text-overflow ellipsis
</style>
