<!--noindex-->Модуль таблицы организаций<!--/noindex-->
<template>
  <div>
    <orgToolBar/>
    <c-glb-loading/>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items  ="org_itemsFiltered"
      :sort-by.sync="sortBy"
      :sort-desc.sync="descending"
      item-key="id"
      show-select
      disable-pagination
      hide-default-header
      hide-default-footer
      class="org-table custom-table gd-table"
      fixed-header
    > 
      <template v-slot:header="data">
        <thead>
          <tr>
          <template v-for="header in data.props.headers">
          <th v-if="header.permission || header.value == 'data-table-select'" :class="[header.value == 'data-table-select' ? 'gd-tb-col gd-tbcol-select' : header.guideCls, 'column sortable', descending ? 'desc' : 'asc', header.value === sortBy ? 'active' : '', (header.value != 'data-table-select' && header.show != 'all' && !$vuetify.breakpoint[header.show]) || (glb_showProperty && header.value != 'data-table-select' && header.showWithProps != 'all' && !$vuetify.breakpoint[header.showWithProps]) ? 'd-none' : '' ]" :key="header.value" class="table-header-text pa-2 fw-n" :width="header.width">
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
                  v-model="header.choosen"
                />
                <!-- /INPUT      
                     MULTI SELECT -->
                <c-filter-select 
                  :menuClass="`${header.guideCls.split(' ')[1]}-filter`" 
                  v-if="header.filterType == 'select'"  
                  :items="header.items" 
                  @doChange="header.onChange" 
                  v-model="header.choosen"
                />
                <!-- /MULTI SELECT
                     FROM TO -->
                <c-filter-from-to 
                  :menuClass="`${header.guideCls.split(' ')[1]}-filter`" 
                  v-if="header.filterType == 'from-to'" 
                  :data="header.choosen" @doChange="header.onChange" 
                  :fromToType="header.fromToType" 
                  :left="header.isLeft"
                />
                <!-- /FROM TO -->
                <c-filter-location 
                  :menuClass="`${header.guideCls.split(' ')[1]}-filter`" 
                  v-if="header.filterType == 'location'" 
                  @doChange="header.onChange" 
                  v-model="header.choosen"
                />
              </div>
            </div>
            <div v-else :class="{'mt-2': !useFilter}">
              <c-table-checkbox 
                logging="true" 
                :state="selected.length==org_itemsFiltered.length && org_itemsFiltered.length > 0"  
                @click="updateSelectedOnClick(data, $event)" 
                class="ml-2 d-flex align-center justify-space-around mt-0"  
                :cbid="'org-table-header-cb'" 
                :indeterminate="selected.length>0 && selected.length < org_itemsFiltered.length"
                />
              <div v-if="useFilter" class="org-table__item-counter mt-3 grey900 text-left">{{selected.length}}/{{org_itemsFiltered.length}}</div>
            </div>
          </th>
          </template>
          </tr>
          <tr v-if="useFilter&&chipsSorted.length>0">
            <td :colspan="headers.length + 1" class="border-bottom grey200-border">
              <v-chip v-for="(chip, index) in chipsSorted" :key="'filter-chips-' + index" @click:close="chip.clear()" close close-icon="icon-Close blue700-i icomoon-important close-chips-button br-4" class="org-table__filter-chip br-4 blue800 blue000-b fs-s fw-b px-2 ml-4">{{chip.type}}: {{chip.text}}</v-chip>
            </td>
          </tr>
        </thead>
      </template>

      <template v-slot:item="data">
        <tr :class="rowSelectedClass(data)" class="pointer row-with-hidden-menu">
          <template v-for="(header, index) in data.headers">
            <td :key="index" v-if="index==0" class="gd-tbcol-row-select-cell" :class="[header.align == 'right' ? 'monospace' : '', ' text-' + header.align]" @click="data.select(!data.isSelected), updateSelectedOnClick()">
              <div>
                <c-table-checkbox class="gd-tbcol-row-select-cb" :cbid="'org-table-row-' + data.item.id"  :state="data.isSelected" @click="data.select(!data.isSelected), updateSelectedOnClick()"/>
              </div>
            </td>
          <td v-if="header.permission || index!=0" :key="index" :class="[header.isMono ? 'monospace' : '', ' text-' + header.align, (header.value != 'data-table-select' && header.show != 'all' && !$vuetify.breakpoint[header.show]) || (glb_showProperty && header.value != 'data-table-select' && header.showWithProps != 'all' && !$vuetify.breakpoint[header.showWithProps]) ? 'd-none' : '']">

            <!-- name -->
            <div class="fill-height" v-if="header.value=='name'">
              <v-layout class="d-flex align-strech fill-height">
                <div @click="showDetails(data.item.id, false)" @click.middle="showDetails(data.item.id, true)" class="d-flex align-senter fill-height">
                  <div class="align-self-center">
                    <label class="fw-b pointer blue800 name-overflow" >{{data.item.name}}</label>
                    <div class="fs-s grey700 org-table__description-overflow">{{data.item.fullName}}</div>
                  </div>
                </div>
                <v-spacer @click="showDetails(data.item.id, false)" @click.middle="showDetails(data.item.id, true)"></v-spacer>
                <v-menu left offset-x width="240px" v-model="data.item.menu" :close-on-content-click="false"  v-if="permission('ft_orgDelete')">
                  <template v-slot:activator="{ on, value }">
                    <v-btn text height="24" width="24" class="align-self-center ml-2 pa-0 hidden-row-menu-button gd-tb-row-item-menu-btn" v-on="on" :class="{'visible-row-menu-button' : value}"><i class="grey500-i icon-Donner"></i></v-btn>
                  </template>
                  <div class="org-table__row-menu border blue050-border br-4 white-theme-table-menu gd-tb-row-item-menu">
                  <v-layout class="nowrap bg-gradient px-4 py-1 br-4-t">
                    <span class="org-table__row-menu-name white--text">{{data.item.name}}</span>
                  </v-layout>
                  <v-list class="control-combobox py-2 br-4-b">
                    <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-impersonate" @click="impersonate(data.item)" v-if="glb_permissionPA" >Impersonate</v-list-item>
                    <v-divider class="my-1" v-if="glb_permissionPA" />
                    <v-list-item height="32px" class="fs-m fw-b gd-tb-row-item-menu-prop" @click="showProperty(data.item.id),data.item.menu=false" >Property</v-list-item>
                    <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-edit" @click="editProperty(data.item.id),data.item.menu=false" >Edit</v-list-item>
                    <v-divider class="my-1" />
                    <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-lock" @click="changeLockState(data.item)"><i class="grey500-i icon-Lock icon-16 mr-2"></i>{{data.item.isBlocked ? 'Unlock': 'Lock'}}</v-list-item>
                    <v-divider class="my-1" />
                    <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-delete" @click="deleteClick(data.item)"><i class="grey500-i icon-trash icon-16 mr-2"></i>Delete</v-list-item>
                  </v-list>
                  </div>
                </v-menu>
              </v-layout>
            </div>

            <!-- code -->
            <div v-if="header.value=='code'">
              <span class="grey900 fs-m">{{data.item.code}}</span>
            </div>

            <!-- projectsCount -->
            <div v-if="header.value=='projectsCount'">
              <span class="grey900 fs-m">{{data.item.projectsCount}}</span>
            </div>

            <!-- groupsCount -->
            <div v-if="header.value=='groupsCount'">
              <span class="grey900 fs-m">{{data.item.groupsCount}}</span>
            </div>

            <!-- createDate -->
            <div v-if="header.value=='prep.createDateFormatted'">
              <span class="grey900 fs-m">{{data.item.prep.createDateFormatted}}</span>
            </div>

            <!-- isBlocked -->
            <div v-if="header.value=='isBlocked'">
              <span v-if="data.item.isBlocked" class="grey700 fw-b fs-m" ><i class="grey500-i icon-Lock mr-2"></i>Locked</span>
            </div> 

            <!-- comment -->
            <div v-if="header.value=='comment'">
              <span class="grey900 fs-m">{{data.item.comment}}</span>
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

import { objStatus, objStatusCode, objBlocked, objBlockedCode } from '@/consts/_otherConsts';
import orgToolBar from './orgs-view-toolBar'
import filterMixin from '@/modules/_system/filterMixin'

export default {
    mixins:[filterMixin],

    components:{
      orgToolBar
    },
    
    data () {
      return {
        objBlocked,
        sortBy     : "name",
        descending : false,
        useFilter  : null, 
        selected   : [],
        chipsInner : [],
        userSelect : false,

        headers: [
          { text: 'NAME'    , guideCls: 'gd-tb-col gd-tbcol-name'    , show: 'all'    , showWithProps: 'all'    , align: 'left' , isMono:false, permission: true                      , value: 'name'                    , filterType:'input'  , width: 'auto' },
          { text: 'CODE'    , guideCls: 'gd-tb-col gd-tbcol-code'    , show: 'all'    , showWithProps: 'all'    , align: 'left' , isMono:false, permission: true                      , value: 'code'                    , filterType:'input'  , width: 'auto' },
          { text: 'STATUS'  , guideCls: 'gd-tb-col gd-tbcol-status'  , show: 'all'    , showWithProps: 'all'    , align: 'left' , isMono:false, permission: true                      , value: 'isBlocked'               , filterType:'select' , width: '150px'},
          { text: 'PROJECT#', guideCls: 'gd-tb-col gd-tbcol-projects', show: 'all'    , showWithProps: 'smAndUp', align: 'right', isMono:true , permission: this.permission('ft_prjRead'), value: 'projectsCount'        , filterType:'from-to', width: '100px'},
          { text: 'GROUP#'  , guideCls: 'gd-tb-col gd-tbcol-groups'  , show: 'all'    , showWithProps: 'smAndUp', align: 'right', isMono:true , permission: this.permission('ft_grpRead'), value: 'groupsCount'          , filterType:'from-to', width: '88px' },
          { text: 'CREATED' , guideCls: 'gd-tb-col gd-tbcol-created' , show: 'smAndUp', showWithProps: 'mdAndUp', align: 'left' , isMono:true , permission: true                      , value: 'prep.createDateFormatted', filterType:'from-to', width: '130px', fromToType:'date'},
          { text: ' '                                                , show: 'mdAndUp', showWithProps: 'xlOnly' , align: 'left'               , permission: true                      , value: 'spacer'                                        , width: '20%'  },
          // { text: 'COMMENT' , guideCls: 'gd-tb-col gd-tbcol-comment' , show: 'lgAndUp', showWithProps: 'lgAndUp', align: 'left' , isMono:false, permission: true                      , value: 'comment'                  , filterType:'input'  , width: 'auto' },
        ]
      }
    },

    computed:{
      ...mapGetters(['org_itemsFiltered', 'org_itemsSelected', 'glb_showProperty', 'org_filter', 'org_showProperty', 'org_reactiveState', 'glb_permissionPA']),

      filter:{
        get: function(){        
          return this.org_filter;
        },

        set: function(data){
          this.org_setFilter(data);
        }
      }
    },


    watch:{
      selected: function (data) {
      let compare = this.org_itemsSelected.filter( function(e){
        return this.indexOf(e) < 0
      },  data.map(i=>i.id));
      if(this.userSelect){
        this.org_setSelectedItems(data.map(item=>item.id));
        this.userSelect = false;
      }
    },

    org_itemsSelected: function(data){
      this.selected = this.org_itemsFiltered.filter(f=>data.includes(f.id))
    },

      org_itemsFiltered:{
        handler: function(items){
          this.selected = this.org_itemsFiltered.filter(f=>this.org_itemsSelected.includes(f.id))
        },
        deep: true
      }

    },

    methods:{
      ...mapActions(['org_getItems', 'org_setSelectedItems', 'org_setFilter', 'org_deleteConfirm', 'org_setLockState', 'org_setEdited', 'org_setShowProperty']),

      impersonate(item){
        this.$nav.navigateToNewWindow(`/?impersonate=${item.id}&organization=${encodeURI(item.name)}`, true);
      },

      updateSelectedOnClick(data, event){
        if(!isNullOrUndefined(data))
          data.on['toggle-select-all'](event);
        this.userSelect = true;
      },

      editProperty(id){
        this.org_setEdited(id);
      },
      showProperty(id){
        this.org_setShowProperty(id);
      },

      changeLockState(item){
        this.org_setLockState({ item, lockState: !item.isBlocked })
      },

      rowSelectedClass(data){
        var item = data.item
        if(isNullOrUndefined(item))
          return '';

        var ir = this.org_reactiveState.find(f=>f.id==item.id);
        if(!isNullOrUndefined(ir)){
          switch(ir.state){
            case 'add'     : return 'green100-b';
            case 'edit'    : return 'green100-b';
            case 'delete'  : return 'red100-b';
          }
        }

        if(this.selected.includes(item))
          return 'blue100-b';
        if(!isNullOrUndefined(this.org_showProperty) && this.org_showProperty.id==item.id)
          return 'blue000-b';
        return '';
      },


      checkRow(item){
        let index = this.selected.indexOf(item.id);
        if(index>=0)
          this.selected.splice(index, 1);
        else
          this.selected.push(item.id)
      },

      deleteClick(item){
        this.org_deleteConfirm(item);
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
        this.org_getItems();
        new SimpleBar(qs(".custom-table .v-data-table__wrapper"), { autoHide: true });
    },
}
</script>
<style lang="stylus">
.org-table
  max-height calc(100vh - 112px)
  &__description-overflow   
    overflow hidden
    display -webkit-box
    -webkit-line-clamp 2
    -webkit-box-orient vertical
    max-height 3em
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