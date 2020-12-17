<!--noindex-->Модуль таблицы задач<!--/noindex-->
<template>
  <div>
    <vjobToolBar/>
    <c-glb-loading/>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items  ="vjob_itemsFiltered"
      :sort-by.sync="sortBy"
      :sort-desc.sync="descending"
      item-key="id"
      show-select
      disable-pagination
      hide-default-header
      hide-default-footer
      class="vjob-table custom-table gd-table"
      fixed-header
    > 
      <template v-slot:header="data">
        <thead>
          <tr>
          <th v-for="header in data.props.headers" :class="['column sortable', descending ? 'desc' : 'asc', header.value === sortBy ? 'active' : '', (header.value != 'data-table-select' && header.show != 'all' && !$vuetify.breakpoint[header.show]) || (glb_showProperty && header.value != 'data-table-select' && header.showWithProps != 'all' && !$vuetify.breakpoint[header.showWithProps]) ? 'd-none' : '']" :key="header.value" class="table-header-text pa-2 fw-n" :width="header.width">
            <div v-if="header.value != 'data-table-select'">
              <div @click="changeSort(header.value)" class="pointer d-flex align-center">
                <i aria-hidden="true" v-if="sortBy == header.value && !descending" class="icon-up-down-sorted icon-18"><span class="path1"></span><span class="path2"></span></i>
                <i aria-hidden="true" v-else-if="sortBy == header.value && descending" class="icon-up-down-sorted-reverse icon-18"><span class="path1"></span><span class="path2"></span></i>
                <i aria-hidden="true" v-else class="icon-UP-Down icon-18"></i>
                <span :class="[sortBy == header.value ? 'fw-b grey800 fs-s': 'grey600 fs-s']">{{header.text}}</span>
              </div>
              <div class="mt-2" v-if="useFilter">
                <!-- INPUT -->
                <c-filter-input v-if="header.filterType == 'input'" class="filter-active" placeholder="All" @doChange="header.onChange" v-model="header.choosen"></c-filter-input>
                <!-- /INPUT      
                     MULTI SELECT --> 
                <c-filter-select v-if="header.filterType == 'select'"  :items="header.items" @doChange="header.onChange" v-model="header.choosen"></c-filter-select>
                <!-- /MULTI SELECT
                     FROM TO -->
                <c-filter-from-to v-if="header.filterType == 'from-to'" :data="header.choosen" @doChange="header.onChange" :fromToType="header.fromToType" :left="header.isLeft"></c-filter-from-to>
                <!-- /FROM TO -->
                <c-filter-location v-if="header.filterType == 'location'" @doChange="header.onChange" v-model="header.choosen"/>
              </div>
            </div>
            <div v-else :class="{'mt-2': !useFilter}">
                <c-table-checkbox 
                  logging="true" 
                  :state="selected.length==vjob_itemsFiltered.length && vjob_itemsFiltered.length > 0"  
                  @click="updateSelectedOnClick(data, $event)" 
                  class="ml-2 d-flex align-center justify-space-around mt-0"  
                  :cbid="'tsk-table-header-cb'" 
                  :indeterminate="selected.length>0 && selected.length < vjob_itemsFiltered.length"
                 />
              <div v-if="useFilter" class="vjob-table__item-counter mt-3 grey900 text-left">{{selected.length}}/{{vjob_itemsFiltered.length}}</div>
            </div>
          </th>
          </tr>
          <tr v-if="useFilter&&chipsSorted.length>0" class="border-bottom blue050-border">
            <td :colspan="headers.length + 1">
              <v-chip v-for="(chip, index) in chipsSorted" :key="'filter-chips-' + index" @click:close="chip.clear()" close close-icon="icon-Close blue700-i icomoon-important close-chips-button br-4" class="vjob-table__filter-chip br-4 blue800 blue000-b fs-s fw-b px-2 ml-4">{{chip.type}}: {{chip.text}}</v-chip>
            </td>
          </tr>
        </thead>

      </template>

      <template v-slot:item="data">
        <tr :class="rowSelectedClass(data.item)" class="row-with-hidden-menu">
          <template v-for="(header, index) in data.headers">
          <td :key="index" v-if="index==0" :class="[header.align == 'right' ? 'monospace' : '', ' pointer text-' + header.align]" @click="data.select(!data.isSelected), updateSelectedOnClick()">
            <div>
              <c-table-checkbox :cbid="'tsk-table-row-' + data.item.id"  :state="data.isSelected" @click="data.select(!data.isSelected), updateSelectedOnClick()"/>
            </div>
          </td>
          <td :key="index" v-else :class="[header.isMono ? 'monospace' : '', header.value == 'name' ? ' pointer' : '', ' text-' + header.align, (header.value != 'data-table-select' && header.show != 'all' && !$vuetify.breakpoint[header.show]) || (glb_showProperty && header.value != 'data-table-select' && header.showWithProps != 'all' && !$vuetify.breakpoint[header.showWithProps]) ? 'd-none' : '']">

            <!-- objectName -->
            <div class="fill-height" v-if="header.value=='jobName'">
              <v-layout class="d-flex align-strech fill-height">
                <div @click="showDetails(data.item.id, false)" @click.middle="showDetails(data.item.id, true)" class="d-flex fill-height">
                  <label class="fw-b name-prop blue800 name-overflow align-self-center">{{jobLabel(data.item.virtualJobTypeCode)}}</label>
                </div>
                <v-spacer @click="showDetails(data.item.id, false)" @click.middle="showDetails(data.item.id, true)" class="pointer"></v-spacer>
                <v-menu oleft offset-x width="240px" v-model="data.item.menu" :close-on-content-click="false">
                  <template v-slot:activator="{ on, value }">
                    <v-btn text height="24" width="24" class="align-self-center ml-2 pa-0 hidden-row-menu-button" v-on="on" :class="{'visible-row-menu-button' : value}"><i class="grey500-i icon-Donner"></i></v-btn>
                  </template>
                  <div class="vjob-table__row-menu border blue050-border br-4 white-theme-table-menu">
                  <v-layout class="nowrap bg-gradient px-4 py-1 br-4-t">
                    <span class="vjob-table__row-menu-name white--text">{{jobLabel(data.item.virtualJobTypeCode)}}</span>
                  </v-layout>
                  <v-list class="control-combobox py-2 br-4-b">
                      <v-list-item height="32px" class="fs-m" @click="showProperty(data.item.id),data.item.menu=false" >Property</v-list-item>
                      <v-divider class="my-1" v-if="data.item.acknowledge.needAcknowledge" />
                      <v-list-item height="32px" v-if="data.item.acknowledge.needAcknowledge" class="fs-m" @click="vjob_acknowledge(data.item)"><i class="grey500-i mdi mdi-message-alert-outline icon-16 mr-2"></i>Acknowledge</v-list-item>
                  </v-list>
                  </div>
                </v-menu>
              </v-layout>
            </div>

            <!-- target -->
            <div v-if="header.value=='target'">
              <v-layout class="d-flex align-strech fill-height row-with-hidden-menu">
                <label class="name-overflow align-self-center">{{data.item.objectName}}</label>
                <!-- <v-spacer></v-spacer>
                <v-tooltip bottom open-delay="500"  content-class="custom-tooltip fs-s">
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" @click="filterTarget(data.item.objecId)" text height="24" width="24" class="align-self-center ml-2 pa-0 hidden-row-menu-button"><i class="grey500-i icon-filter"></i></v-btn>
                    </template>
                    <span class="custom-tooltip-accent fw-m">Filter by this object</span>
                </v-tooltip> -->
              </v-layout>
            </div>           
                        
            <!-- status -->
            <div v-if="header.value=='status'">
                <v-flex v-if="data.item.stateCode == 'running'" class="d-flex align-center">
                  <v-flex class="vjob-table__status-progress-wrapper">
                    <v-progress-circular  rotate="90" size="22" 
                      :indeterminate="false" 
                      :value="data.item.prep.lastTask.percentCompleted" 
                      width="2" class="blue800 fs-xs fw-b mr-2">{{data.item.prep.lastTask.percentCompleted}}</v-progress-circular>
                  </v-flex>
                  <v-flex>
                    <div class="blue800 fw-b fs-m"> 
                      In progress
                    </div>
                  </v-flex>
                </v-flex>
                <v-flex v-if="data.item.stateCode == 'error'" class="red500 fw-b fs-s d-flex align-center">
                  <i class="icon-x-circle icon-20 mr-2"></i>
                  <span class="fs-m">Error</span>
                </v-flex>
                <v-flex v-if="data.item.stateCode == 'completed'" class="fs-s d-flex align-center">
                  <i class="icon-check-circle grey300-i icon-20 mr-2"></i>
                  <span class="grey300 fs-m">Completed</span>
                </v-flex>
            </div>    

            <!-- acknowledge -->
            <div v-if="header.value=='acknowledge'" class="d-flex align-center justify-space-around">
                <i v-if="data.item.acknowledge.needAcknowledge && data.item.acknowledge.isAcknowledged" class="mdi mdi-message-alert-outline icon-22 grey300"></i>
                <i v-if="data.item.acknowledge.needAcknowledge && !data.item.acknowledge.isAcknowledged" class="mdi mdi-message-alert-outline icon-22 red500 pointer" @click="vjob_acknowledge(data.item)"></i>
            </div>  

            <!-- initiator -->
            <div v-if="header.value=='initiator'">
              <span class="grey900 fs-m"><span v-if="permissionPA() && $vuetify.breakpoint.lgAndUp">{{data.item.prep.initiatorDomain}}\</span>{{data.item.prep.initiatorFirstName}} {{data.item.prep.initiatorLastName}}</span>
            </div>          

            <!-- startTime -->
            <div v-if="header.value=='startTime'">
              <span class="grey900 fs-m">{{formatDate(data.item.dateStart)}}</span>&nbsp;&nbsp;<span class="grey700 fs-m fw-b">{{formatTime(data.item.dateStart)}}</span>
            </div>

            <!-- completeTime -->
            <div v-if="header.value=='completeTime'">
              <span class="grey900 fs-m">{{formatDate(data.item.dateEnd)}}</span>&nbsp;&nbsp;<span class="grey700 fs-m fw-b">{{formatTime(data.item.dateEnd)}}</span>
            </div>

            <!-- duration -->
            <div v-if="header.value=='duration'">
              <span class="grey900 fs-m">{{getDuration(data.item.dateStart, data.item.dateEnd)}}</span>
            </div> 

          </td>
          </template>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapGetters }   from 'vuex';

import { tskStates, tskStateCodes, tskObjTypes, tskCombine, jobTypes, tskTypes } from '@/consts/taskConsts';

import vjobToolBar    from './vjobs-view-toolBar'
import filterMixin   from '@/modules/_system/filterMixin'

export default {
  mixins:[filterMixin],

  components:{
    vjobToolBar
  },

  data(){ 
    return {      
        tskStates,
        tskCombine,
        tskObjTypes,
        jobTypes,
        tskTypes,
        formatTime,
        formatDate,
    
        sortBy     : "name",
        descending : false,
        useFilter  : null,
        selected   : [],
        chipsInner : [],
        userSelect : false,

        headers: [
            { text: 'JOB NAME'       , show: 'all'    , showWithProps: 'all'    , align: 'left', isMono:false, value: 'jobName'     , filterType:'input'  , isLeft: false, width: 'auto'},
            { text: 'TARGET'         , show: 'all'    , showWithProps: 'all'    , align: 'left', isMono:false, value: 'target'      , filterType:'input' , isLeft: false, width: 'auto'},
            { text: 'STATUS'         , show: 'all'    , showWithProps: 'smAndUp', align: 'left', isMono:false, value: 'status'      , filterType:'select' , isLeft: false, width: '140px'},
            { text: 'AKNW'           , show: 'mdAndUp', showWithProps: 'lgAndUp', align: 'left', isMono:false, value: 'acknowledge' , filterType:'select' , isLeft: false, width: '50px'},
            { text: 'INITIATOR'      , show: 'smAndUp', showWithProps: 'lgAndUp', align: 'left', isMono:false, value: 'initiator'   , filterType:'input'  , isLeft: false, width: 'auto' }, 
            { text: 'START TIME'     , show: 'all'    , showWithProps: 'all'    , align: 'left', isMono:true , value: 'startTime'   , filterType:'from-to', isLeft: false, width: '180px', fromToType:'date' },
            { text: 'COMPLETION TIME', show: 'all'    , showWithProps: 'none'   , align: 'left', isMono:true , value: 'completeTime', filterType:'from-to', isLeft: false, width: '180px', fromToType:'date' },
            { text: 'DURATION'       , show: 'lgAndUp', showWithProps: 'lgAndUp', align: 'left', isMono:true , value: 'duration'    , filterType:'from-to', isLeft: false, width: '160px', fromToType:'date' },
        ],
    }
  },

  computed:{
    ...mapGetters(['vjob_itemsFiltered', 'vjob_itemsSelected', 'vjob_filter', 'vjob_showProperty', 'glb_showProperty', 'vjob_reactiveState']),

    filter:{
      get: function(){        
        return this.vjob_filter;
      },

      set: function(data){
        this.vjob_setFilter(data);
      }
    } 
  },


  watch:{
    selected: function (data) {
      let compare = this.vjob_itemsSelected.filter( function(e){
        return this.indexOf(e) < 0
      },  data.map(i=>i.id));
      if(this.userSelect){
        this.vjob_setSelectedItems(data.map(item=>item.id));
        this.userSelect = false;
      }
    },

    vjob_itemsSelected: function(data){
      this.selected = this.vjob_itemsFiltered.filter(f=>data.includes(f.id))
    },

    vjob_itemsFiltered:{
      handler: function(items){
        this.selected = this.vjob_itemsFiltered.filter(f=>this.vjob_itemsSelected.includes(f.id))
      },
      deep: true
    }  
  },

  methods:{    
    ...mapActions([
      'vjob_getItems', 
      'vjob_setSelectedItems', 
      'vjob_setFilter', 
      'vjob_setShowProperty',
      'vjob_acknowledge'
    ]),

    jobLabel(code){
      var data = jobTypes[code];
      return isNullOrUndefined(data) ? code : data;
    },

    filterTarget(id){
      this.vjob_setFilter({
        use: true,
        target: `${id}`
      });
    },

    getDuration(start,end){
      if(end == null)
        return '';
      let duration = new Date(end).getTime() - new Date(start).getTime()
      //дни
      if(duration/(86400*1000) > 1)
        return `${Math.floor(duration/(86400*1000))} days`
      //часы
      if(duration/(3600*1000) > 1)
        return `${Math.floor(duration/(3600*1000))} hours`
      //минуты
      if(duration/(60*1000) > 1)
        return `${Math.floor(duration/(60*1000))} minutes`
      //секунды
      if(duration/1000 > 1)
        return `${Math.floor(duration/1000)} seconds`

      return `${duration} ms`
    },    
    
    // formatDate(date){
    //   let d = new Date(date)
    //   let day = d.getDate()
    //   if(day<10)
    //     day = '0' + day
    //   let month = d.getMonth()+1
    //   if(month<10)
    //     month = '0' + month

    //   return `${day}:${month}:${d.getFullYear()}`
    // },
    
    updateSelectedOnClick(data, event){
      if(!isNullOrUndefined(data))
        data.on['toggle-select-all'](event);
      this.userSelect = true;
    },

    showProperty(id){
      this.vjob_setShowProperty(id);
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

      var ir = this.vjob_reactiveState.find(f=>f.id==item.id);
      if(!isNullOrUndefined(ir)){
        switch(ir.state){
          case 'add'     : return 'green100-b';
          case 'edit'    : return 'green100-b';
          case 'delete'  : return 'red100-b';
        }
      }

      if(this.selected.includes(item))
       return 'blue100-b';
      if(!isNullOrUndefined(this.vjob_showProperty) && this.vjob_showProperty.id==item.id)
       return 'blue000-b';
      return '';
    },

  },

  
  mounted() {
     this.vjob_getItems();
     new SimpleBar(qs(".custom-table .v-data-table__wrapper"), { autoHide: true });
  },
}
</script>
<style lang="stylus">
.vjob-table
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
  &__status-progress-wrapper
    max-width 30px
</style>
