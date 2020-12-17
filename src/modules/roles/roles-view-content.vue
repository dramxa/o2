<template>
<v-card flat>
  <roleToolBar/>
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
      class="role-table custom-table gd-table"
      fixed-header
    > 
      <template v-slot:header="data">
        <thead>
          <tr>
          <th v-for="header in data.props.headers" :class="[header.value == 'data-table-select' ? 'gd-tb-col gd-tbcol-select' : header.guideCls, 'column sortable', descending ? 'desc' : 'asc', header.value === sortBy ? 'active' : '', (header.value != 'data-table-select' && header.show != 'all' && !$vuetify.breakpoint[header.show]) || (glb_showProperty && header.value != 'data-table-select' && header.showWithProps != 'all' && !$vuetify.breakpoint[header.showWithProps]) ? 'd-none' : '']" :key="header.value" class="table-header-text pa-2 fw-n" :width="header.width">
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
                  :state="selected.length==role_itemsFiltered.length && role_itemsFiltered.length > 0"  
                  @click="updateSelectedOnClick(data, $event)" 
                  class="ml-2 d-flex align-center justify-space-around mt-0"  
                  :cbid="'role-table-header-cb'" 
                  :indeterminate="selected.length>0 && selected.length < role_itemsFiltered.length"
                 />
              <div v-if="useFilter" class="role-table__item-counter mt-3 grey900 text-left">{{selected.length}}/{{role_itemsFiltered.length}}</div>
            </div>
          </th>
          </tr>
          <tr v-if="useFilter&&chipsSorted.length>0">
            <td :colspan="headers.length + 1" class="border-bottom grey200-border">
              <v-chip v-for="(chip, index) in chipsSorted" :key="'filter-chips-' + index" @click:close="chip.clear()" close close-icon="icon-Close blue700-i icomoon-important close-chips-button br-4" class="role-table__filter-chip br-4 blue800 blue000-b fs-s fw-b px-2 ml-4">{{chip.type}}: {{chip.text}}</v-chip>
            </td>
          </tr>
        </thead>
      </template>
      
      <template v-slot:item="data">
        <tr :class="rowSelectedClass(data.item)" class="row-with-hidden-menu">
          <template v-for="(header, index) in data.headers">
            <td :key="index" v-if="index==0" class="gd-tbcol-row-select-cell" :class="[header.align == 'right' ? 'monospace' : '', ' pointer text-' + header.align]" @click ="data.select(!data.isSelected), updateSelectedOnClick()">
              <div>
                <c-table-checkbox class="gd-tbcol-row-select-cb" :cbid="'role-table-row-' + data.item.id"  :state="data.isSelected"  @click="data.select(!data.isSelected), updateSelectedOnClick()"/>
             </div>
            </td>
          <td :key="index" v-else :class="[header.isMono ? 'monospace' : '', header.value == 'name' ? ' pointer' : '', ' text-' + header.align, (header.value != 'data-table-select' && header.show != 'all' && !$vuetify.breakpoint[header.show]) || (glb_showProperty && header.value != 'data-table-select' && header.showWithProps != 'all' && !$vuetify.breakpoint[header.showWithProps]) ? 'd-none' : '']">


            <!-- name -->
            <div class="fill-height" v-if="header.value=='name'">
              <v-layout class="d-flex align-strech fill-height">
                <div @click="showDetails(data.item.id, false)" @click.middle="showDetails(data.item.id, true)" class="d-flex fill-height">
                  <label class="fw-b name-prop blue800 align-self-center">{{data.item.name}}</label>
                </div>
                <v-spacer @click="showDetails(data.item.id, false)" @click.middle="showDetails(data.item.id, true)" class="role-table__item-cell-spacer"></v-spacer>
                <v-menu left offset-x width="240px" v-model="data.item.menu" :close-on-content-click="false" v-if="permission('ft_roleDelete')">
                  <template v-slot:activator="{ on, value }">
                    <v-btn text height="24" width="24" class="align-self-center ml-2 pa-0 hidden-row-menu-button gd-tb-row-item-menu-btn" v-on="on" :class="{'visible-row-menu-button' : value}"><i class="grey500-i icon-Donner"></i></v-btn>
                  </template>
                  <div class="role-table__row-menu border blue050-border br-4 white-theme-table-menu gd-tb-row-item-menu">
                  <v-layout class="nowrap bg-gradient px-4 py-1 br-4-t">
                    <span class="role-table__row-menu-name white--text">{{data.item.name}}</span>
                  </v-layout>
                  <v-list class="control-combobox py-2 br-4-b">
                    <v-list-item height="32px" class="fs-m fw-b gd-tb-row-item-menu-prop" @click="showProperty(data.item.id),data.item.menu=false" >Property</v-list-item>
                    <v-list-item height="32px" v-if="!data.item.isSystem" class="fs-m" @click="editProperty(data.item.id),data.item.menu=false" >Edit</v-list-item>
                    <v-divider class="my-1" v-if="!data.item.isSystem" />
                    <v-list-item height="32px" v-if="!data.item.isSystem" class="fs-m gd-tb-row-item-menu-delete" @click="deleteClick(data.item)"><i class="grey500-i icon-trash icon-16 mr-2"></i>Delete</v-list-item>
                  </v-list>
                  </div>
                </v-menu>
              </v-layout>
            </div>

            <!-- description -->
            <div v-if="header.value=='description'">
              <span class="grey900 fs-m">{{data.item.description}}</span>
            </div>


            <!-- isSystem -->
            <div v-if="header.value=='isSystem'">
              <span class="grey900 fs-m" v-if="data.item.isSystem"><i class=" grey500-i icon-Lock mr-2"></i>System</span>
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
import roleToolBar     from './roles-view-toolBar'
import filterMixin   from '@/modules/_system/filterMixin'

export default {
  mixins:[filterMixin],

  components:{
    roleToolBar
  },

  data(){ return {
      sortBy     : "name",
      descending : false,
      useFilter  : null, 
      selected   : [],
      chipsInner : [],
      userSelect : false,

      headers:[
        { text:'NAME'       , guideCls: 'gd-tb-col gd-tbcol-name'       , show: 'all', showWithProps: 'all', align:'left', isMono: false, value: 'name'       , filterType:'input'   , isLeft: true , width: 'auto'  },
        { text:'DESCRIPTION', guideCls: 'gd-tb-col gd-tbcol-description', show: 'all', showWithProps: 'all', align:'left', isMono: false, value: 'description', filterType:'input'   , isLeft: true , width: 'auto' },
        { text:'SYSTEM'     , guideCls: 'gd-tb-col gd-tbcol-system'     , show: 'all', showWithProps: 'all', align:'left', isMono: false, value: 'isSystem'   , filterType:'select'  , isLeft: true , width: '190px' },
        { text:'CREATED'    , guideCls: 'gd-tb-col gd-tbcol-created'    , show: 'all', showWithProps: 'all', align:'left', isMono: true , value: 'createDate' , filterType:'from-to' , isLeft: true , width: '110px' , fromToType:'date' },
        { text: ' '                                                     , show: 'all', showWithProps: 'xl' , align:'left', isMono: true , value: 'spacer'     , permission: true, width: '17%'},
      ],
  } },

  computed:{
    ...mapGetters(['role_itemsFiltered', 'role_itemsSelected', 'role_filter', 'glb_showProperty', 'os_itemsAll', 'role_showProperty', 'role_reactiveState']),
    
    items(){
      return this.role_itemsFiltered; 
    },
    
    filter:{
      get: function(){        
        return this.role_filter;
      },

      set: function(data){
        this.role_setFilter(data);
      }
    } 
  },

  watch:{
    selected: function (data) {
      let compare = this.role_itemsSelected.filter( function(e){
        return this.indexOf(e) < 0
      },  data.map(i=>i.id));
      if(this.userSelect){
        this.role_setSelectedItems(data.map(item=>item.id));
        this.userSelect = false;
      }
    },

    role_itemsSelected: function(data){
      this.selected = this.role_itemsFiltered.filter(f=>data.includes(f.id))
    },

    role_itemsFiltered:{
      handler: function(items){
        this.selected = this.role_itemsFiltered.filter(f=>this.role_itemsSelected.includes(f.id))
      },
      deep: true
    }
  },

  methods: {
    ...mapActions(['role_getItems', 'role_setSelectedItems', 'role_setFilter', 'role_deleteConfirm', 'role_setEdited', 'role_setShowProperty']),

    updateSelectedOnClick(data, event){
      if(!isNullOrUndefined(data))
        data.on['toggle-select-all'](event);
      this.userSelect = true;
    },

    editProperty(id){
      this.role_setEdited(id);
    },
    
    showProperty(id){
      this.role_setShowProperty(id);
    },

    rowSelectedClass(item){
      if(isNullOrUndefined(item))
        return '';

      var ir = this.role_reactiveState.find(f=>f.id==item.id);
      if(!isNullOrUndefined(ir)){
        switch(ir.state){
          case 'add'     : return 'green100-b';
          case 'edit'    : return 'green100-b';
          case 'delete'  : return 'red100-b';
        }
      }

      if(this.selected.includes(item))
        return 'blue100-b';
      if(!isNullOrUndefined(this.role_showProperty) && this.role_showProperty.id==item.id)
        return 'blue000-b';
      return '';
    },

    deleteClick(item){
      this.role_deleteConfirm(item);
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
      this.role_getItems();
      new SimpleBar(qs(".custom-table .v-data-table__wrapper"), { autoHide: true });
  },
}
</script>
<style lang="stylus">
.role-table
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
  &__item-cell-spacer
    height 100%
  &__row-menu
    width 240px
  &__row-menu-name
    overflow hidden
    text-overflow ellipsis
</style>