<!--noindex-->Модуль тулбара управления ВМ<!--/noindex-->
<template>
  <v-toolbar flat  class="toolbar-ext" height="50px">
    <v-toolbar-items>
      <div class="vms-tb-search align-self-center ml-4 relative gd-tb-search">
        <input 
          v-model="searchText"
          v-on:keyup.enter="onEnter"
          type="text"
          :style="{width: searchWidth + 'px'}"
          :class="[searchText != '' && searchText != vm_filter.search ? 'blue700 blue000-b': 'grey700']"
          placeholder="Search"
          class="vms-tb-search__input border grey300-border px-2 py-1 br-2 fw-b fs-s gd-tb-search"
          @focus="searchFocus()"
          @blur="searchBlur()"
          >
          <i v-show="searchText != ''" class="vms-tb-search__icon icon-Close py-1 px-1 pointer" :class="[searchText != '' && searchText != vm_filter.search ? 'blue700-i blue000-b': 'white']" @click="searchText='', onEnter()"></i>
      </div>
      <v-flex srink  class="align-self-center mr-4" >
        <v-btn-toggle v-model="filterToggle">        
          <v-btn class="normal-text px-2 mx-4 border-none table-filter-toggle-btn br-4 gd-tb-filter" :class="{'blue600 blue050-b': vm_filter.use, 'grey600 white': !vm_filter.use}" height="24px">
            <i class="icon-filter mr-1" :class="{'blue600-i': vm_filter.use}"></i>
            <span>Filters</span>
          </v-btn>
        </v-btn-toggle>
      </v-flex>
      
      <v-flex class="align-self-center" v-if="permission('ft_vmChangePowerState')">
        <c-toolbar-btn btnClass="gd-tb-console" icon="grey500-i icon-terminal icon-18"     tooltip="Console" @click="goToConsole()"/>
        <c-toolbar-btn btnClass="gd-tb-run"     icon="green600-i icon-play icon-18"        tooltip="Run"     @click="doVmAction('powerOn')"/>
        <c-toolbar-btn btnClass="gd-tb-suspend" icon="brown700-i icon-pause icon-18"       tooltip="Pause"   @click="doVmAction('suspend')"/>
        <c-toolbar-btn btnClass="gd-tb-stop"    class="ml-0-25"   icon="grey500-i icon-stop-circle icon-18" tooltip="Stop"    @click="doVmAction('powerOff')"/>
        <c-toolbar-btn btnClass="gd-tb-reboot"  class="ml-0-25" icon="grey500-i icon-refresh-ccw icon-18" tooltip="Restart" @click="doVmAction('reboot')"/> 
        <!-- <v-menu offset-y v-model="menuStop" width="218px">
          <template v-slot:activator="{ on, value }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon tile class="pa-0 control-button br-4 mx-0-5" v-on="on" @click="menuStop = true">
                  <i class="grey500-i icon-stop-circle icon-18"></i>
                </v-btn>
              </template>
              <span>Stop</span>
            </v-tooltip>
          </template>
          <v-list width="150px" class="control-combobox py-2 border blue050-border br-4">
              <v-list-item class="fs-m dropdown-menu-item" @click="doVmAction('powerOff')" ><span class="grey700">Hard stop</span></v-list-item>
              <v-list-item class="fs-m dropdown-menu-item" @click="doVmAction('softPowerOff')" ><span class="grey700">Soft stop</span></v-list-item>
          </v-list>
        </v-menu>
        <v-menu offset-y v-model="menuReboot" width="218px">
          <template v-slot:activator="{ on, value }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon tile class="pa-0 control-button br-4 mx-0-5" v-on="on" @click="menuReboot = true">
                  <i class="grey500-i icon-refresh-ccw icon-18"></i>
                </v-btn>
              </template>
              <span>Reboot</span>
            </v-tooltip>
          </template>
          <v-list width="150px" class="control-combobox py-2 border blue050-border br-4">
              <v-list-item class="fs-m dropdown-menu-item" @click="doVmAction('reboot')" ><span class="grey700">Reset</span></v-list-item>
              <v-list-item class="fs-m dropdown-menu-item" @click="doVmAction('softReboot')" ><span class="grey700">Soft restart</span></v-list-item>
          </v-list>
        </v-menu> -->
      </v-flex>
    </v-toolbar-items>

    
    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-flex class="align-self-center">
        <c-toolbar-btn btnClass="gd-tb-create" class="mr-4" icon="grey500-i icon-Create icon-18" tooltip="Create" @click="create"  v-if="permission('ft_vmCreate')"/> 
        <v-menu offset-y left width="218px">
            <template v-slot:activator="{ on, value }">
              <v-btn icon tile class="pa-0 icon-18 control-button br-4 ml-2 mr-1 gd-tb-menu-btn" v-on="on" :class="{'grey100-b': value}">
                <i class="grey500-i icon-Donner icon-18"></i>
              </v-btn>
            </template>
            <v-list v-if="sleceted.length >= 0" width="240px" class="control-combobox py-2 border blue050-border br-4 gd-tb-menu">
                <v-list-item height="32px" class="fs-m gd-tb-menu-admImport"     v-if="permissionPA()"                @click="admImport()">Import from hypervisor</v-list-item>
                <v-list-item height="32px" class="fs-m gd-tb-menu-clone"         v-if="permission('ft_vmClone')"      @click="chngPrjAndGrp">Change project and group</v-list-item>
                <v-list-item height="32px" class="fs-m gd-tb-menu-clone"         v-if="permission('ft_vmClone')"      @click="cloneClick">Clone</v-list-item>
                <v-list-item height="32px" class="fs-m gd-tb-menu-migration"     v-if="permission('ft_vmMigrate')"    @click="migrateClick">Migration</v-list-item>
                <v-list-item height="32px" class="fs-m gd-tb-menu-save-template" v-if="permission('ft_vmToTemplate')" @click="saveTemplateClick">Save selected VM as template</v-list-item>
                <v-list-item height="32px" class="fs-m gd-tb-menu-csv" @click="exportCsv">Export list (CSV)</v-list-item>                
                <v-divider class="my-1" v-if="permission('ft_vmDelete')" />
                <v-list-item height="32px" class="fs-m gd-tb-menu-migration"     @click="resetErrors">Reset error messages</v-list-item>
                <v-divider class="my-1" v-if="permission('ft_vmDelete')" />
                <v-list-item height="32px" class="fs-m gd-tb-menu-delete" @click="deleteSelected" v-if="permission('ft_vmDelete')"><i class="grey500-i icon-trash mr-2"></i>Delete</v-list-item>
            </v-list>
            <v-card v-else class="pa-3 border blue050-border br-4 fs-s grey800" width="218px">
              Select all VM or a single virtual machine to see additional actions
            </v-card>
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
      menuStop   : false,
      menuReboot : false,
      sleceted   : [],
      searchText : '',
      searchWidth: 128
    }
  },

  computed:{
    ...mapGetters([
      'vm_filter', 
      'vm_itemsFiltered', 
      'vm_itemsSelected', 
      'vm_itemsAll', 
      'lctn_defaultResourceProfile', 
      'glb_pricePeriod', 
      'vm_showProperty'
      ]),

    filterToggle: {
      get: function (){
        return this.vm_filter.use ? 0 : null;
      },

      set: function(value){
        let f = this.vm_filter;
        f.use= isNullOrUndefined(value) ? false : true;   
        this.vm_setFilter(f);
      }
    }
  },

  watch:{
    "vm_filter.search" : {
      handler: function (value){
        this.searchText = value
      },
      immediate: true
    }
  },

  methods:{
    ...mapActions([
      'vm_deleteConfirm', 
      'vm_create', 
      'vm_setFilter', 
      'vm_actionsConfirm', 
      'vm_clone', 
      'vm_migrate', 
      'vm_setSelectedItems',
      'vm_admImport',
      'vm_resetErrorsConfirm',
      'vm_changeProjectAndGroup'
      ]),

    admImport(){
      this.vm_admImport()
    },

    searchFocus(){
      if(this.$vuetify.breakpoint.mdAndUp)
        this.searchWidth = 200;
    },

    searchBlur(){
      if(this.searchText == '')
        this.searchWidth = 128;
    },

    onEnter(){
      var filter = this.vm_filter;
      filter.search = this.searchText;
      this.vm_setFilter(filter);
    },

    create(){
      if(isNullOrUndefined(this.lctn_defaultResourceProfile)){
        Vue.prototype.$windows.showDialog({ dialogCode: 'locationDialog' });   
      }else{
        this.vm_create();
      }
    },
    
    doVmAction(action){
      if(this.vm_itemsSelected.length == 0){
        if(!isNullOrUndefined(this.vm_showProperty)){
          this.vm_actionsConfirm({action, vmId: this.vm_showProperty.id});
          return;
        }else{
          showMessage('noVmSelected', { caption: 'Select VM' });
          return;
        }
      }

      this.vm_actionsConfirm({action});
    },

    goToConsole(){
      if(this.vm_itemsSelected.length == 0){
        if(!isNullOrUndefined(this.vm_showProperty)){
          this.vm_actionsConfirm({action, vmId: this.vm_showProperty.id});
          return;
        }else{
          showMessage('noVmSelected', { caption: 'Console VM' });
          return;
        }
      }

      this.vm_itemsSelected.forEach(id=>this.$vm.openConsole({id}));
    },

    cloneClick(){
      if(this.vm_itemsSelected.length == 0){
        showMessage('noVmSelected', { caption: 'Clone VM' });
        return;
      }        

      var self = this;
      Vue.prototype.$windows.showDialog({
          dialogCode: 'cloneVmDialog',
          
          props: {
            vms: this.vm_itemsSelected
          },

          onAccept: function(propAdd){
            self.vm_itemsSelected.forEach(id=>{
              self.vm_clone({id, propAdd})
            })
          }
        }        
      );
    },

    chngPrjAndGrp(){
      if(this.vm_itemsSelected.length == 0){
        showMessage('noVmSelected', { caption: 'Changing Project and Group' });
        return;
      }    

      var self = this;
      Vue.prototype.$windows.showDialog({
          dialogCode: 'chngProjectAndGroupDialog',
          
          props: {
            vms: this.vm_itemsAll.filter(f=>this.vm_itemsSelected.includes(f.id))
          },

          onAccept: function({projectId, groupId}){
            self.vm_changeProjectAndGroup({
              data      : self.vm_itemsSelected,
              projectId,
              groupId
            })
          }
        }        
      );
    },

    migrateClick(){
      if(this.vm_itemsSelected.length == 0){
        showMessage('noVmSelected', { caption: 'Migrate VM' });
        return;
      }

      var self = this;
      Vue.prototype.$windows.showDialog({
          dialogCode: 'migrateVmDialog',
          
          props: {
            vms: this.vm_itemsSelected
          },

          onAccept: function(propAdd){
            self.vm_itemsSelected.forEach(id=>{
              self.vm_migrate({id, propAdd})
            })
          }
        }        
      );      
    },
    
    saveTemplateClick(){
      Vue.prototype.$windows.showDialog({
          dialogCode: 'saveAsTemplate',
          
          props: {
            text: 'SendedText'
          },

          onClose: function(){
            console.log('dialog Closed1')
          },
          onCancel: function(){
            console.log('dialog ended with Cancel')
          },
          onAccept: function(){
            console.log('dialog ended with Accept')
          }
        }        
      );      
    },

    deleteSelected(){
      if(this.vm_itemsSelected.length == 0){
        showMessage('noVmSelected', { caption: 'Delete VMs' });
        return;
      }

  
      // Vue.prototype.$dialogs.confirmDialog('delete', ['test'])
      this.vm_deleteConfirm();

    },

    resetErrors(){
      if(this.vm_itemsSelected.length == 0){
        showMessage('noVmSelected', { caption: 'Reset errors' });
        return;
      }

      this.vm_resetErrorsConfirm(this.vm_itemsSelected);
    },

    exportCsv(){
      var pricePeriod = this.glb_pricePeriod;

      var priceParameter = '';
      switch(this.glb_pricePeriod){
        case 'HOUR' : priceParameter  = 'perHour'; break;
        case 'DAY' : priceParameter   = 'perDay'; break;
        case 'MONTH' : priceParameter = 'perMonth'; break;   
        default: priceParameter       = 'perMonth'; break;   
      }

      var toCsv = this.vm_itemsFiltered.map(m=>{ 
        var price = isNullOrUndefined(m.prep.priceFullTotalFormatted, {y: res=>'', n: res=>res[priceParameter]})
        var res = { 
          STATE         : m.powerStateCode, 
          NAME          : m.name, 
          STATUS        : m.statusCode, 
          LOCATION      : m.prep.resourceProfileFullpath,
          PROJECT       : globalThis.isNullOrUndefined(m.prep.projectName, {y: res=>'', n: res=>res}),
          GROUP         : globalThis.isNullOrUndefined(m.prep.groupName, {y: res=>'', n: res=>res}),
          CPU           : m.cpu,
          'RAM(GB)'     : localeString(m.prep.ramTotal, false),
          'STORAGE(GB)' : localeString(m.prep.storageTotal, false),
          CREATE        : m.prep.createDateFormatted,
          COMMENT       : m.comment
        }
        res[`PRICE(${pricePeriod})`] = price;
        return res;
      });

      Vue.prototype.$export.csv(toCsv, 'vmList.csv')
    },
  }
}
</script>
<style lang="stylus" scoped>
.vms-tb
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