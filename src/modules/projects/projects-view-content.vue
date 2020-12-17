<!--noindex-->Модуль таблицы Проектов<!--/noindex-->
<template>
  <div>
    <prjToolBar/>
    <c-glb-loading/>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items  ="prj_itemsFiltered"
      :sort-by.sync="sortBy"
      :sort-desc.sync="descending"
      item-key="id"
      show-select
      disable-pagination
      hide-default-header
      hide-default-footer
      class="prj-table custom-table gd-table"
      fixed-header
    > 
      <template v-slot:header="data">
        <thead>
          <tr>
          <template v-for="header in data.props.headers">
          <th v-if="header.permission || header.value == 'data-table-select'" :class="[ header.value == 'data-table-select' ? 'gd-tb-col gd-tbcol-select' : header.guideCls, 'column sortable', descending ? 'desc' : 'asc', header.value === sortBy ? 'active' : '', (header.value != 'data-table-select' && header.show != 'all' && !$vuetify.breakpoint[header.show]) || (glb_showProperty && header.value != 'data-table-select' && header.showWithProps != 'all' && !$vuetify.breakpoint[header.showWithProps]) ? 'd-none' : '']" :key="header.value" class="table-header-text pa-2 fw-n" :width="header.width">
            <div v-if="header.value != 'data-table-select'">
              <div @click="changeSort(header.value)" class="pointer d-flex align-center" v-if="header.value != 'spacer'" :class="{'table-header-price-period': header.value == 'prep.price'}">
                <i aria-hidden="true" v-if="sortBy == header.value && !descending" class="icon-up-down-sorted icon-18"><span class="path1"></span><span class="path2"></span></i>
                <i aria-hidden="true" v-else-if="sortBy == header.value && descending" class="icon-up-down-sorted-reverse icon-18"><span class="path1"></span><span class="path2"></span></i>
                <i aria-hidden="true" v-else class="icon-UP-Down icon-18"></i>
                <span :class="[sortBy == header.value ? 'fw-b grey800 fs-s': 'grey600 fs-s']">{{header.text}}</span>
                <v-menu offset-y left v-model="menuPeriod" width="218px"  v-if="header.value == 'prep.price'">
                  <template v-slot:activator="{ }">
                    <v-tooltip bottom  content-class="custom-tooltip fs-s">
                      <template v-slot:activator="{ on }">
                        <v-btn text v-on="on" @click.stop="menuPeriod=true" :class="[sortBy == header.value ? 'fw-b grey800 fs-s': 'grey600 fs-s']" class="normal-text mb-0-5 mx-1 px-0 border-none br-4 gd-tb-price-btn" min-width="unset" height="24px">(<span class="prj-table__price-period grey800-border border-bottom-dashed">{{glb_pricePeriod}}</span>)</v-btn>
                      </template>
                      <span  class="custom-tooltip-accent fw-m">Choose period</span>
                    </v-tooltip>
                  </template>
                  <v-list width="150px" class="control-combobox py-2 border blue050-border br-4 gd-tb-price-menu">
                      <v-list-item class="fs-m dropdown-menu-item" @click="glb_setPricePeriod('HOUR')"  ><span :class="glb_pricePeriod=='HOUR' ? 'blue800 fw-b':'grey700'">Hour</span></v-list-item>
                      <v-list-item class="fs-m dropdown-menu-item  gd-tb-price-menu-click" @click="glb_setPricePeriod('DAY')"   ><span :class="glb_pricePeriod=='DAY' ? 'blue800 fw-b':'grey700'">Day</span></v-list-item>
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
                :state="selected.length==prj_itemsFiltered.length && prj_itemsFiltered.length > 0"  
                @click="updateSelectedOnClick(data, $event)" 
                class="ml-2 d-flex align-center justify-space-around mt-0"  
                :cbid="'prj-table-header-cb'" 
                :indeterminate="selected.length>0 && selected.length < prj_itemsFiltered.length"
               />
              <div v-if="useFilter" class="prj-table__item-counter mt-3 grey900 text-left">{{selected.length}}/{{prj_itemsFiltered.length}}</div>
            </div>
          </th>
          </template>
          </tr>
          <tr v-if="useFilter&&chipsSorted.length>0">
            <td :colspan="headers.length + 1" class="border-bottom grey200-border">
              <v-chip v-for="(chip, index) in chipsSorted" :key="'filter-chips-' + index" @click:close="chip.clear()" close close-icon="icon-Close blue700-i icomoon-important close-chips-button br-4" class="prj-table__filter-chip br-4 blue800 blue000-b fs-s fw-b px-2 ml-4">{{chip.type}}: {{chip.text}}</v-chip>
            </td>
          </tr>
        </thead>
      </template>

      <template v-slot:item="data">
        <tr :class="rowSelectedClass(data.item)" class="row-with-hidden-menu">
          <template v-for="(header, index) in data.headers">
            <td :key="index" v-if="index==0" class="gd-tbcol-row-select-cell" :class="[header.align == 'right' ? 'monospace' : '', ' pointer text-' + header.align]" @click="data.select(!data.isSelected), updateSelectedOnClick()">
              <div>
                <c-table-checkbox class="gd-tbcol-row-select-cb" :cbid="'prj-table-row-' + data.item.id"  :state="data.isSelected"  @click="data.select(!data.isSelected), updateSelectedOnClick()"/>
             </div>
            </td>
          <td :key="index" v-if="header.permission && index!=0" :class="[header.isMono ? 'monospace' : '', header.value == 'name' ? ' pointer' : '', ' text-' + header.align, (header.value != 'data-table-select' && header.show != 'all' && !$vuetify.breakpoint[header.show]) || (glb_showProperty && header.value != 'data-table-select' && header.showWithProps != 'all' && !$vuetify.breakpoint[header.showWithProps]) ? 'd-none' : '']">

            <!-- name -->
            <div class="fill-height" v-if="header.value=='name'">
              <v-layout class="d-flex align-strech fill-height">
                <div @click="showDetails(data.item.id, false)" @click.middle="showDetails(data.item.id, true)" class="d-flex align-senter fill-height">
                  <div class="align-self-center">
                    <label class="fw-b name-prop blue800 name-overflow">{{data.item.name}}</label>
                    <div class="prj-table__description-overflow fs-s grey700">{{data.item.description}}</div>
                  </div>
                </div>
                <v-spacer @click="showDetails(data.item.id, false)" @click.middle="showDetails(data.item.id, true)"></v-spacer>
                <v-menu left offset-x width="240px" v-model="data.item.menu" :close-on-content-click="false" v-if="permission('ft_prjDelete')">
                  <template v-slot:activator="{ on, value }">
                    <v-btn text height="24" width="24" class="align-self-center ml-2 pa-0 hidden-row-menu-button gd-tb-row-item-menu-btn" v-on="on" :class="{'visible-row-menu-button' : value}"><i class="grey500-i icon-Donner"></i></v-btn>
                  </template>
                  <div class="prj-table__row-menu border blue050-border br-4 white-theme-table-menu gd-tb-row-item-menu">
                    <v-layout class="nowrap bg-gradient px-4 py-1 br-4-t">
                      <span class="prj-table__row-menu-name white--text">{{data.item.name}}</span>
                    </v-layout>
                    <v-list class="control-combobox py-2 br-4-b">
                      <v-list-item height="32px" class="fs-m fw-b gd-tb-row-item-menu-prop" @click="showProperty(data.item.id),data.item.menu=false" >Property</v-list-item>
                      <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-edit" @click="editProperty(data.item.id),data.item.menu=false" >Edit</v-list-item>
                      <v-divider class="my-1" />
                      <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-delete" @click="deleteClick(data.item)"><i class="grey500-i icon-trash icon-16 mr-2"></i>Delete</v-list-item>
                    </v-list>
                  </div>
                </v-menu>
              </v-layout>
            </div>

            <!-- groupCount -->
            <div v-if="header.value=='prep.groupCount'">
              <span class="blue700 pointer" @click="gotoGroups(data.item, false)" @click.middle="gotoGroups(data.item, true)"><span class="blue700-border border-bottom-dashed">{{data.item.prep.groupCount}}</span> </span>
            </div>
            
            <!-- vmCount -->
            <div v-if="header.value=='prep.vmCount'">
               <span class="blue700 pointer" @click="gotoVms(data.item, false)" @click.middle="gotoVms(data.item, true)"><span class="blue700-border border-bottom-dashed">{{data.item.prep.vmCount}}</span> </span>
            </div>

            <!-- statusCode -->
            <div v-if="header.value=='statusCode'">
               <v-layout v-if="data.item.prep.vmErrors != 0 || data.item.prep.vmBusy != 0">
                 <v-flex v-if="data.item.prep.vmErrors>0" class="pointer px-1 normal-text fs-s red500" @click="gotoErrorVms(data.item, false)" @click.middle="gotoErrorVms(data.item, true)">
                    <span class="border-bottom-dashed red500-border">Error</span><div class="inline-block ml-1 red100-b px-0-5 fs-s default-border-radius">{{data.item.prep.vmErrors}}</div>
                  </v-flex>
                  <v-flex v-if="data.item.prep.vmBusy>0"  class="pointer px-1 normal-text fs-s blue800" @click="gotoBusyVms(data.item, false)" @click.middle="gotoBusyVms(data.item, true)">
                    <span class="border-bottom-dashed blue800-border">Busy</span><div class="inline-block ml-1 blue200-b px-0-5 fs-s default-border-radius">{{data.item.prep.vmBusy}}</div>
                  </v-flex>
               </v-layout>
               <v-layout v-else>
                  <v-flex class="pointer px-1 normal-text fs-s grey800" @click="gotoReadyVms(data.item, false)" @click.middle="gotoReadyVms(data.item, true)">
                    <span class="border-bottom-dashed grey800-border">Ready</span><div class="inline-block ml-1 grey100-b px-0-5 fs-s default-border-radius">{{data.item.prep.vmReady}}</div>
                  </v-flex>
               </v-layout>
            </div>

            <!-- cpu -->
            <div v-if="header.value=='prep.cpuTotal'">
              <span class="grey900 fs-m">{{data.item.prep.cpuTotal}}</span>
            </div>

            <!-- ram -->
            <div v-if="header.value=='prep.ramTotal'">
              <span class="grey900 fs-m">{{data.item.prep.ramTotalFormatted}} GB</span>
            </div>

            <!-- createDate -->
            <div v-if="header.value=='createDate'">
              <span class="grey900 fs-m">{{data.item.prep.createDateFormatted}}</span>
            </div>
            
            <!-- expiryDate -->
            <div v-if="header.value=='expiryDate'">
              <span class="grey900 fs-m">{{data.item.prep.expiryDateFormatted}}</span>
            </div>

            <!-- price -->
            <div v-if="header.value=='prep.price'">
              <div v-if="glb_pricePeriod=='HOUR' && !isNullOrUndefined(data.item.prep.prices)">
                <div v-for="[key, value] in Object.entries(data.item.prep.prices)" :key="key" class="grey900 fs-m fw-b">{{value.priceTotalPerHourFormatted}}</div>
              </div>
              <div v-if="glb_pricePeriod=='DAY' && !isNullOrUndefined(data.item.prep.prices)">
                <div v-for="[key, value] in Object.entries(data.item.prep.prices)" :key="key" class="grey900 fs-m fw-b">{{value.priceTotalPerDayFormatted}}</div>
              </div>
              <div v-if="glb_pricePeriod=='MONTH' && !isNullOrUndefined(data.item.prep.prices)">
                <div v-for="[key, value] in Object.entries(data.item.prep.prices)" :key="key" class="grey900 fs-m fw-b">{{value.priceTotalPerMonthFormatted}}</div>
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
import { mapActions, mapGetters } from 'vuex';
import { objStatus, objStatusCode } from '@/consts/_otherConsts';
import prjToolBar from './projects-view-toolBar';
import filterMixin from '@/modules/_system/filterMixin'

export default {
    mixins:[filterMixin],

    components:{
      prjToolBar
    },

  data(){ return {
    menuPeriod : false,
    pricePeriod: 'MONTH',
    sortBy     : "name",
    descending : false,
    useFilter  : null, 
    selected   : [],
    chipsInner : [],
    userSelect : false,

    headers: [
      { text: 'PROJECT NAME', guideCls: 'gd-tb-col gd-tbcol-name'    , show: 'all'    , showWithProps: 'all'    , align: 'left' , isMono:false, value: 'name'               , permission: true, filterType:'input'  , isLeft: false                  },
      { text: 'GROUP#'      , guideCls: 'gd-tb-col gd-tbcol-group'   , show: 'all'    , showWithProps: 'all'    , align: 'right', isMono:false, value: 'prep.groupCount'    , permission: this.permission('ft_grpRead'), filterType:'from-to', isLeft: false, width: '88px'   },  
      { text: 'VM#'         , guideCls: 'gd-tb-col gd-tbcol-vm'      , show: 'all'    , showWithProps: 'all'    , align: 'right', isMono:true , value: 'prep.vmCount'       , permission: this.permission('ft_vmRead') , filterType:'from-to', isLeft: false, width: '70px'   },
      { text: 'STATUS'      , guideCls: 'gd-tb-col gd-tbcol-status'  , show: 'all'    , showWithProps: 'smAndUp', align: 'left' , isMono:false, value: 'statusCode'         , permission: true, filterType:'select' , isLeft: false, width: '150px'  },
      { text: 'CPU'         , guideCls: 'gd-tb-col gd-tbcol-cpu'     , show: 'all'    , showWithProps: 'lgAndUp', align: 'right', isMono:true , value: 'prep.cpuTotal'      , permission: true, filterType:'from-to', isLeft: false, width: '70px'   },
      { text: 'RAM(GB)'     , guideCls: 'gd-tb-col gd-tbcol-ram'     , show: 'all'    , showWithProps: 'lgAndUp', align: 'right', isMono:true , value: 'prep.ramTotal'      , permission: true, filterType:'from-to', isLeft: false, width: '110px'   },
      { text: 'CREATED'     , guideCls: 'gd-tb-col gd-tbcol-created' , show: 'lgAndUp', showWithProps: 'xlOnly' , align: 'left' , isMono:true , value: 'createDate'         , permission: true, filterType:'from-to', isLeft: true,  width: '130px', fromToType:'date'  },
      { text: 'EXPIRED'     , guideCls: 'gd-tb-col gd-tbcol-expired' , show: 'smAndUp', showWithProps: 'lgAndUp', align: 'left' , isMono:true , value: 'expiryDate'         , permission: true, filterType:'from-to', isLeft: true,  width: '130px', fromToType:'date'  },
      { text: 'PRICE'       , guideCls: 'gd-tb-col gd-tbcol-price'   , show: 'all'    , showWithProps: 'all'    , align: 'right', isMono:true , value: 'prep.price'         , permission: this.permission('ft_prcRead'), filterType:'from-to', isLeft: true,  width: '140px'  },
    ]

  } },

  computed:{
    ...mapGetters(['prj_itemsFiltered', 'prj_itemsSelected', 'prj_filter', 'glb_showProperty', 'prj_showProperty', 'prj_reactiveState', 'glb_pricePeriod']),

    filter:{
      get: function(){        
        return this.prj_filter;
      },

      set: function(data){
        this.prj_setFilter(data);
      }
    }
  },

  watch:{
    selected: function (data) {
      let compare = this.prj_itemsSelected.filter( function(e){
        return this.indexOf(e) < 0
      },  data.map(i=>i.id));
      if(this.userSelect){
        this.prj_setSelectedItems(data.map(item=>item.id));
        this.userSelect = false;
      }
    },

    prj_itemsSelected: function(data){
      this.selected = this.prj_itemsFiltered.filter(f=>data.includes(f.id))
    },
    prj_itemsFiltered:{
        handler: function(items){
          this.selected = this.prj_itemsFiltered.filter(f=>this.prj_itemsSelected.includes(f.id))
        },
        deep: true
    }
  },

  methods:{
    ...mapActions(['prj_getItems', 'prj_setSelectedItems', 'prj_setFilter', 'prj_deleteConfirm', 'prj_setEdited', 'prj_setShowProperty', 'glb_setPricePeriod']),

    updateSelectedOnClick(data, event){
      if(!isNullOrUndefined(data))
        data.on['toggle-select-all'](event);
      this.userSelect = true;
    },

    editProperty(id){
      this.prj_setEdited(id);
    },
    
    showProperty(id){
      this.prj_setShowProperty(id);
    },

    rowSelectedClass(item){
      if(isNullOrUndefined(item))
        return '';

      var ir = this.prj_reactiveState.find(f=>f.id==item.id);
      if(!isNullOrUndefined(ir)){
        switch(ir.state){
          case 'add'     : return 'green100-b';
          case 'edit'    : return 'green100-b';
          case 'delete'  : return 'red100-b';
        }
      }

      if(this.selected.includes(item))
        return 'blue100-b';
      if(!isNullOrUndefined(this.prj_showProperty) && this.prj_showProperty.id==item.id)
        return 'blue000-b';
      return '';
    },

    deleteClick(item){
      this.prj_deleteConfirm(item);
    },

    showDetails(id, isNewWIndow){
      if(isNewWIndow)
        this.$nav.showDetailsInNewWindow(id);
      else
        this.$nav.showDetailsRoute(id);
    },

    gotoGroups(item, newWindow){
      this.$nav.navigateTo('groups', { use: true, projectName: item.name }, newWindow)
    },
    
    gotoVms(item, newWindow){
      this.$nav.navigateTo('vms', { use: true, projectName: item.name }, newWindow)
    },
    gotoErrorVms(item, newWindow){
      this.$nav.navigateTo('vms', { use: true, projectName: item.name, statuses: ['error'] }, newWindow)
    },
    
    gotoBusyVms(item, newWindow){
      this.$nav.navigateTo('vms', { use: true, projectName: item.name, statuses: ['busy'] }, newWindow)
    },
    
    gotoReadyVms(item, newWindow){
      this.$nav.navigateTo('vms', { use: true, projectName: item.name, statuses: ['ready'] }, newWindow)
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
     this.prj_getItems();
     new SimpleBar(qs(".custom-table .v-data-table__wrapper"), { autoHide: true });
  },
}
</script>
<style lang="stylus" >
.prj-table
  max-height calc(100vh - 112px)
  &__description-overflow
    overflow hidden
    display -webkit-box
    -webkit-line-clamp 2
    -webkit-box-orient vertical
    max-height 3em
  &__price-period
    position relative
    top 1px
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