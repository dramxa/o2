<template>
<v-card flat>
  <lmtToolBar/>
  <c-glb-loading/>
  <v-data-table
      v-model="selected"
      :headers="headers"
      :items="items"
      :sort-by.sync="sortBy"
      :sort-desc.sync="descending"
      item-key="id"
      show-select
      disable-pagination
      hide-default-header
      hide-default-footer
      class="lmt-table custom-table gd-table"
      fixed-header
    > 
      <template v-slot:header="data">
        <thead>
          <tr>
          <template v-for="header in data.props.headers">
          <th v-if="header.value != 'isProviderLimit' || glb_permissionPA" :class="[header.value == 'data-table-select' ? 'gd-tb-col gd-tbcol-select' : header.guideCls, 'column sortable', descending ? 'desc' : 'asc', header.value === sortBy ? 'active' : '', (header.value != 'data-table-select' && header.show != 'all' && !$vuetify.breakpoint[header.show]) || (glb_showProperty && header.value != 'data-table-select' && header.showWithProps != 'all' && !$vuetify.breakpoint[header.showWithProps]) ? 'd-none' : '']" :key="header.value" class="table-header-text pa-2 fw-n" :width="header.width">
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
                  :state="selected.length==lmt_itemsFiltered.length && lmt_itemsFiltered.length > 0"  
                  @click="updateSelectedOnClick(data, $event)" 
                  class="ml-2 d-flex align-center justify-space-around mt-0"  
                  :cbid="'lmt-table-header-cb'" 
                  :indeterminate="selected.length>0 && selected.length < lmt_itemsFiltered.length"
                 />
              <div v-if="useFilter" class="lmt-table__item-counter mt-3 grey900 text-left">{{selected.length}}/{{lmt_itemsFiltered.length}}</div>
            </div>
          </th>
          </template>
          </tr>
          <tr v-if="useFilter&&chipsSorted.length>0">
            <td :colspan="headers.length + 1" class="border-bottom grey200-border">
              <v-chip v-for="(chip, index) in chipsSorted" :key="'filter-chips-' + index" @click:close="chip.clear()" close close-icon="icon-Close blue700-i icomoon-important close-chips-button br-4" class="lmt-table__filter-chip br-4 blue800 blue000-b fs-s fw-b px-2 ml-4">{{chip.type}}: {{chip.text}}</v-chip>
            </td>
          </tr>
        </thead>
      </template>
      
      <template v-slot:item="data">
        <tr :class="rowSelectedClass(data.item)" class="row-with-hidden-menu">
          <template v-for="(header, index) in data.headers">
            <td :key="index" v-if="index==0" class="gd-tbcol-row-select-cell" :class="[header.align == 'right' ? 'monospace' : '', ' pointer text-' + header.align]" @click ="data.select(!data.isSelected), updateSelectedOnClick()">
              <div>
                <c-table-checkbox class="gd-tbcol-row-select-cb" :cbid="'lmt-table-row-' + data.item.id"  :state="data.isSelected"  @click="data.select(!data.isSelected), updateSelectedOnClick()"/>
             </div>
            </td>
          <td :key="index" v-if="index!=0 && (header.value != 'isProviderLimit' || glb_permissionPA)" :class="[header.isMono ? 'monospace' : '', header.value == 'name' ? ' pointer' : '', ' text-' + header.align, (header.value != 'data-table-select' && header.show != 'all' && !$vuetify.breakpoint[header.show]) || (glb_showProperty && header.value != 'data-table-select' && header.showWithProps != 'all' && !$vuetify.breakpoint[header.showWithProps]) ? 'd-none' : '']">


            <!-- name -->
            <div class="fill-height" v-if="header.value=='name'">
              <v-layout class="d-flex align-strech fill-height">
                <div @click="showDetails(data.item.id, false)" @click.middle="showDetails(data.item.id, true)" class="d-flex fill-height">
                  <label class="fw-b name-prop blue800 align-self-center">{{data.item.name}}</label>
                </div>
                <v-spacer @click="showDetails(data.item.id, false)" @click.middle="showDetails(data.item.id, true)" class="pointer"></v-spacer>
                <v-menu left offset-x width="240px" v-model="data.item.menu" :close-on-content-click="false" v-if="permission('ft_lmtDelete')">
                  <template v-slot:activator="{ on, value }">
                    <v-btn text height="24" width="24" class="align-self-center ml-2 pa-0 hidden-row-menu-button gd-tb-row-item-menu-btn" v-on="on" :class="{'visible-row-menu-button' : value}"><i class="grey500-i icon-Donner"></i></v-btn>
                  </template>
                  <div class="lmt-table__row-menu border blue050-border br-4 white-theme-table-menu gd-tb-row-item-menu">
                  <v-layout class="nowrap bg-gradient px-4 py-1 br-4-t">
                    <span class="lmt-table__row-menu-name white--text">{{data.item.name}}</span>
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

            <div v-if="header.value=='prep.resourceProfileFullpath'" >
              <div class="name-overflow grey900 fs-m"><span class="">{{ isNullOrUndefined(data.item.prep.resourceProfile) ? '' : data.item.prep.resourceProfile.name}}</span></div>
              <div class="name-overflow grey300 fs-s"><span class="">{{ isNullOrUndefined(data.item.prep.serviceProvider) ? '' : data.item.prep.serviceProvider.name + '/' + data.item.prep.datacenter.name}}</span></div>
            </div>

            <!-- projectName -->
            <div v-if="header.value=='prep.projectName'">
              <span class="blue700 pointer" @click="gotoProjects(data.item, false)" @click.middle="gotoProjects(data.item, true)"><span class="blue700-border border-bottom-dashed">{{data.item.prep.projectName}}</span> </span>
            </div>

            <!-- groupName -->
            <div v-if="header.value=='prep.groupName'">
              <span class="blue700 pointer" @click="gotoGroups(data.item, false)" @click.middle="gotoGroups(data.item, true)"><span class="blue700-border border-bottom-dashed">{{data.item.prep.groupName}}</span> </span>
            </div> 

            <!-- isProviderLimit -->
            <div v-if="header.value=='isProviderLimit'">
              <span class="grey900 fs-m" v-if="data.item.isProviderLimit"><i class="grey500-i icon-Lock mr-2"></i>Provider</span>
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
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { currencies } from '@/consts/pricelistConst';
import lmtToolBar     from './limits-view-toolBar'
import filterMixin   from '@/modules/_system/filterMixin'

export default {
  mixins:[filterMixin],

  components:{
    lmtToolBar
  },

  data(){ return {
      isUserItems: false,

      sortBy     : "name",
      descending : false,
      useFilter  : null, 
      selected   : [],
      chipsInner : [],
      userSelect : false,

      headers:[
        { text:'NAME'    , guideCls: 'gd-tb-col gd-tbcol-name'    , show: 'all', showWithProps: 'all', align:'left', isMono: false, value: 'name'                         , filterType:'input'   , isLeft: true , width: 'auto'  },
        { text:'LOCATION', guideCls: 'gd-tb-col gd-tbcol-location', show: 'all', showWithProps: 'all', align:'left', isMono: false, value: 'prep.resourceProfileFullpath' , filterType:'location', isLeft: false, width: '200px'},
        { text:'PROJECT' , guideCls: 'gd-tb-col gd-tbcol-project' , show: 'all', showWithProps: 'all', align:'left', isMono: false, value: 'prep.projectName'             , filterType:'input'   , isLeft: true , width: '150px' },
        { text:'GROUP'   , guideCls: 'gd-tb-col gd-tbcol-group'   , show: 'all', showWithProps: 'all', align:'left', isMono: false, value: 'prep.groupName'               , filterType:'input'   , isLeft: true , width: '150px' },
        { text:'PROVIDER', guideCls: 'gd-tb-col gd-tbcol-provider', show: 'all', showWithProps: 'all', align:'left', isMono: false, value: 'isProviderLimit'              , filterType:'select'  , isLeft: true , width: '190px' },
        { text:'CREATED' , guideCls: 'gd-tb-col gd-tbcol-created' , show: 'all', showWithProps: 'all', align:'left', isMono: true , value: 'createDate'                   , filterType:'from-to' , isLeft: true , width: '110px' , fromToType:'date' },
        { text: ' '                                               , show: 'all', showWithProps: 'xl' , align:'left', value: 'spacer', isMono:true , permission: true, width: '17%'},
      ],
  } },

  computed:{
    ...mapGetters(['lmt_itemsFiltered', 'lmt_itemsSelected', 'lmt_filter', 'glb_showProperty', 'os_itemsAll', 'lmt_showProperty', 'lmt_reactiveState', 'glb_permissionPA']),
    
    items(){
      return this.lmt_itemsFiltered; 
    },
    
    filter:{
      get: function(){        
        return this.lmt_filter;
      },

      set: function(data){
        this.lmt_setFilter(data);
      }
    } 
  },

  watch:{
    selected: function (data) {
      let compare = this.lmt_itemsSelected.filter( function(e){
        return this.indexOf(e) < 0
      },  data.map(i=>i.id));
      if(this.userSelect){
        this.lmt_setSelectedItems(data.map(item=>item.id));
        this.userSelect = false;
      }
    },

    lmt_itemsSelected: function(data){
      this.selected = this.lmt_itemsFiltered.filter(f=>data.includes(f.id))
    },

    lmt_itemsFiltered:{
      handler: function(items){
          this.selected = this.lmt_itemsFiltered.filter(f=>this.lmt_itemsSelected.includes(f.id))
      },
      deep: true
    }
  },

  methods: {
    ...mapActions(['lmt_getItems', 'lmt_setSelectedItems', 'lmt_setFilter', 'lmt_deleteConfirm', 'lmt_setEdited', 'lmt_setShowProperty']),
    updateSelectedOnClick(data, event){
      if(!isNullOrUndefined(data))
        data.on['toggle-select-all'](event);
      this.userSelect = true;
    },

    editProperty(id){
      this.lmt_setEdited(id);
    },
    showProperty(id){
      this.lmt_setShowProperty(id);
    },

    rowSelectedClass(item){
      if(isNullOrUndefined(item))
        return '';

      var ir = this.lmt_reactiveState.find(f=>f.id==item.id);
      if(!isNullOrUndefined(ir)){
        switch(ir.state){
          case 'add'     : return 'green100-b';
          case 'edit'    : return 'green100-b';
          case 'delete'  : return 'red100-b';
        }
      }

      if(this.selected.includes(item))
        return 'blue100-b';
      if(!isNullOrUndefined(this.lmt_showProperty) && this.lmt_showProperty.id==item.id)
        return 'blue000-b';
      return '';
    },

    deleteClick(item){
      this.lmt_deleteConfirm(item);
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
    },
    
    gotoGroups(item, newWindow){
      this.$nav.navigateTo('groups', { use: true, name: item.prep.groupName }, newWindow)
    },    
    
    gotoProjects(item, newWindow){
      this.$nav.navigateTo('projects', { use: true, name: item.prep.projectName }, newWindow)
    },
    
  },

  filters:{
    toGb: function (value) {
        return Math.round(value / 1024 * 100) / 100
    }
  },

  mounted() {
      this.lmt_getItems();
      new SimpleBar(qs(".custom-table .v-data-table__wrapper"), { autoHide: true });
  },
}
</script>
<style lang="stylus">
.lmt-table
  max-height calc(100vh - 112px - 40px)
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