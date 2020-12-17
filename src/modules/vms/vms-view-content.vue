<!--noindex-->Модуль таблицы ВМ<!--/noindex-->
<template>
  <div>
    <vmToolBar/>
    <c-glb-loading/>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items  ="vm_itemsFiltered"
      :sort-by.sync="sortBy"
      :sort-desc.sync="descending"
      :custom-sort="customSort"
      item-key="id"
      show-select
      disable-pagination
      hide-default-header
      hide-default-footer
      class="vms-table custom-table gd-table"
      fixed-header
    > 
      <template v-slot:header="data">
        <thead>
          <tr>
          <template v-for="header in data.props.headers">
            <th 
              v-if="header.permission || header.value == 'data-table-select'" 
              :class="[
                  'column sortable', descending ? 'desc' : 'asc',
                  header.value === sortBy ? 'active' : '',
                  header.value == 'data-table-select' ? 'gd-tb-col gd-tbcol-select' : header.guideCls,
                  (header.value != 'data-table-select' && header.show != 'all' && !$vuetify.breakpoint[header.show]) || (glb_showProperty && header.value != 'data-table-select' && header.showWithProps != 'all' && !$vuetify.breakpoint[header.showWithProps]) ? 'd-none' : ''
                ]"
              :key="header.value" class="table-header-text pa-2 fw-n" 
              :style="{'width': header.width}">

              <div v-if="header.value != 'data-table-select'">
                <div @click="changeSort(header.value)" class="pointer d-flex align-center" v-if="header.value != 'hiddenMenuColumn'" :class="{'table-header-price-period': header.value == 'prep.priceTotal'}">
                  <i aria-hidden="true" v-if="sortBy == header.value && !descending" class="icon-up-down-sorted icon-18"><span class="path1"></span><span class="path2"></span></i>
                  <i aria-hidden="true" v-else-if="sortBy == header.value && descending" class="icon-up-down-sorted-reverse icon-18"><span class="path1"></span><span class="path2"></span></i>
                  <i aria-hidden="true" v-else class="icon-UP-Down icon-18"></i>
                  <span :class="[sortBy == header.value ? 'fw-b grey800 fs-s': 'grey600 fs-s']">{{header.text}}</span>
                  <v-menu offset-y left v-model="menuPeriod" width="218px"  v-if="header.value == 'prep.priceTotal'">
                    <template v-slot:activator="{ }">
                      <v-tooltip bottom  content-class="custom-tooltip fs-s">
                        <template v-slot:activator="{ on }">
                          <v-btn text v-on="on" @click.stop="menuPeriod=true" :class="[sortBy == header.value ? 'fw-b grey800 fs-s': 'grey600 fs-s', 'gd-tb-price-btn']" class="normal-text mb-0-5 mx-1 px-0 border-none br-4" min-width="unset" height="24px">(<span class="vms-table__price-period grey800-border border-bottom-dashed">{{glb_pricePeriod}}</span>)</v-btn>
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
                        v-model="header.choosen"></c-filter-input>
                  <!-- /INPUT      
                      MULTI SELECT -->
                  <c-filter-select 
                        :menuClass="`${header.guideCls.split(' ')[1]}-filter`" 
                        v-if="header.filterType == 'select'" 
                        :items="header.items" 
                        @doChange="header.onChange" 
                        v-model="header.choosen"></c-filter-select>
                  <!-- /MULTI SELECT
                      FROM TO -->
                  <c-filter-from-to 
                        :menuClass="`${header.guideCls.split(' ')[1]}-filter`"  
                        v-if="header.filterType == 'from-to'" 
                        :data="header.choosen" 
                        @doChange="header.onChange" 
                        :fromToType="header.fromToType" 
                        :left="header.isLeft"
                        :factor="header.factor"
                        :masked="header.masked"
                        :mask="header.mask"
                        ></c-filter-from-to>
                  <!-- /FROM TO -->
                  <c-filter-location 
                        :menuClass="`${header.guideCls.split(' ')[1]}-filter`" 
                        v-if="header.filterType == 'location'" 
                        @doChange="header.onChange" 
                        v-model="header.choosen"/>
                </div>
              </div>
              <div v-if="header.value == 'data-table-select'" :class="{'mt-2': !useFilter}">
                  <c-table-checkbox 
                    logging="true" 
                    :state="selected.length==vm_itemsFiltered.length && vm_itemsFiltered.length > 0"                     
                    @click="updateSelectedOnClick(data, $event)" 
                    class="ml-2 d-flex align-center justify-space-around mt-0"  
                    :cbid="'vm-table-header-cb'" 
                    :indeterminate="selected.length>0 && selected.length < vm_itemsFiltered.length"
                  />
                <div v-if="useFilter" class="vms-table__item-counter mt-3 grey900 text-left">{{selected.length}}/{{vm_itemsFiltered.length}}</div>
              </div>
            </th>
          </template>
          </tr>
          <tr v-if="useFilter&&chipsSorted.length>0">
            <td :colspan="headers.length + 1" class="border-bottom grey200-border">
              <v-chip v-for="(chip, index) in chipsSorted" :key="'filter-chips-' + index" @click:close="chip.clear()" close close-icon="icon-Close blue700-i br-4 icomoon-important close-chips-button" class="vms-table__filter-chip br-4 blue800 blue000-b fs-s fw-b px-2 ml-4">{{chip.type}}: {{chip.text}}</v-chip>
            </td>
          </tr>
        </thead>
      </template>

      <template v-slot:item="data">
        <tr :class="rowSelectedClass(data)" class="row-with-hidden-menu" >
          <template v-for="(header, index) in data.headers">
            <td :key="index" v-if="index==0 && !data.item.prep.isLocationLocked" class="gd-tbcol-row-select-cell" :class="[header.align == 'right' ? 'monospace' : '', ' pointer text-' + header.align]" @click="data.select(!data.isSelected), updateSelectedOnClick()">
              <div>
              <c-table-checkbox class="gd-tbcol-row-select-cb" :cbid="'vm-table-row-' + data.item.id"  :state="data.isSelected" @click="data.select(!data.isSelected), updateSelectedOnClick()"/>
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
          <td  :key="index" v-if="index!=0 && header.permission" :class="['px-2', header.isMono ? 'monospace' : '', header.value == 'name' ? ' pointer' : '', ' text-' + header.align, (header.value != 'data-table-select' && header.show != 'all' && !$vuetify.breakpoint[header.show]) || (glb_showProperty && header.value != 'data-table-select' && header.showWithProps != 'all' && !$vuetify.breakpoint[header.showWithProps]) ? 'd-none' : '']" >
            <!-- powerStateCode -->
            <div v-if="header.value=='powerStateCode'" class="vms-table__state-cell">
              <span>
                <i v-if="data.item.powerStateCode=='running'"   class="green600-i icon-play"></i>
                <i v-if="data.item.powerStateCode=='suspended'" class="brown700-i icon-pause"></i>
                <i v-if="data.item.powerStateCode=='stopped'"   class="grey500-i icon-stop-circle"></i>
              </span>
            </div>

            <!-- name -->
            <div class="fill-height" v-if="header.value=='name'">
              <v-layout class="d-flex align-strech fill-height">
                <div @click="showDetails(data.item.id, false)" class="d-flex fill-height" @click.prevent.middle="showDetails(data.item.id, true)">
                  <div class="align-self-center">
                    <label class="fw-b name-prop blue800 name-overflow align-self-center">{{data.item.name}}</label>
                    <div v-if="data.item.hasErrors" class="d-flex align-center vms-table__has-error">
                      <div class="fs-s red500 name-overflow">Last task completed with errors</div>
                      <v-btn text rounded class="vms-table__reset-error-btn pa-0 ml-1" @click.stop="resetError(data.item.id)">
                        <i class="icon-Close icon-10 grey500-i"></i>
                      </v-btn>
                    </div>
                  </div>
                </div>
                <v-spacer @click="showDetails(data.item.id, false)" @click.middle="showDetails(data.item.id, true)"></v-spacer>
                <v-menu :key="'menu'+data.item.id" right offset-x width="240px" v-if="anyPermission(['ft_vmDelete', 'ft_vmConsole', 'ft_vmClone', 'ft_vmMigration', 'ft_vmCopyToTemplate', 'ft_vmConvertToTemplate', 'ft_vmChangePowerState'])" v-model="data.item.prep.menu" :internal-activator="true" :close-on-content-click="false" @change="showStopList = false, showRestartList = false, adminTools = false">
                  <template v-slot:activator="{ on, value }">
                    <v-btn v-if="!data.item.prep.isLocationLocked" text height="24" width="24" class="align-self-center ml-2 pa-0 hidden-row-menu-button gd-tb-row-item-menu-btn" v-on="on" @click="showStopList = false, showRestartList = false, adminTools = false" :class="{'visible-row-menu-button' : value}"><i class="grey500-i icon-Donner"></i></v-btn>
                  </template>
                  <div class="vms-table__row-menu border blue050-border br-4 white-theme-table-menu  gd-tb-row-item-menu">
                    <v-layout xs12 class="bg-gradient nowrap px-4 py-1 br-4-t">
                      <span class="vms-table__row-menu-name white--text">{{data.item.name}}</span>
                    </v-layout>
  
                    <v-list xs12 class="control-combobox py-2 br-4-b" :class="[adminTools==true ? 'vms-table__admin-tools-menu' : '']" >
                      <div v-if="adminTools==true">
                        <v-list-item height="32px" class="fs-m fw-b" @click="adminTools=false" ><i class="mdi mdi-arrow-left icon-18 mr-2 gd-tb-row-item-menu-backFromAdminTools"></i> Back</v-list-item>
                        <v-divider class="my-1" />
                        <v-list-item height="32px" class="fs-m fw-b gd-tb-row-item-menu-sinchronize" @click="resyncClick(data.item.id), data.item.prep.menu=false" >Synchronize</v-list-item>
                      </div>
                      <div v-else>
                        <v-list-item v-if="data.item.statusCode!='busy' && permission('ft_vmConsole')" class="fs-m gd-tb-row-item-menu-console" height="32px" @click="consoleClick(data.item),data.item.prep.menu=false"><i class="mr-2 icon-terminal icon-16 grey500-i"></i><span class="grey700">Console</span></v-list-item>
                        <v-divider   v-if="data.item.statusCode!='busy' && permission('ft_vmConsole')" class="my-1" />
                        <v-list-item v-if="data.item.statusCode!='busy' && data.item.powerStateCode!='running' && permission('ft_vmChangePowerState')" height="32px" class="fs-m gd-tb-row-item-menu-run" @click="doVmAction('powerOn' , data.item),data.item.prep.menu=false"><i class="mr-2 green600-i icon-play icon-16"></i><span class="green700">Run</span></v-list-item>
                        <v-list-item v-if="data.item.statusCode!='busy' && data.item.powerStateCode=='running' && permission('ft_vmChangePowerState')"                    height="32px" class="fs-m"      @click="doVmAction('suspend' , data.item),data.item.prep.menu=false"><i class="mr-2 brown700-i icon-pause icon-16"></i><span class="yel600">Suspend</span></v-list-item>
                        <v-list-item v-if="data.item.statusCode!='busy' && data.item.powerStateCode!='stopped' && permission('ft_vmChangePowerState')"                    height="32px" class="fs-m"      @click="doVmAction('powerOff', data.item),data.item.prep.menu=false"><i class="mr-2 grey500-i icon-stop-circle icon-16"></i><span class="grey700">Stop</span></v-list-item>
                        <v-list-item v-if="data.item.statusCode!='busy' && data.item.powerStateCode=='running' && permission('ft_vmChangePowerState')"                    height="32px" class="fs-m"      @click="doVmAction('reboot'  , data.item),data.item.prep.menu=false"><i class="mr-2 grey500-i icon-refresh-ccw icon-16"></i><span class="grey700">Reboot</span></v-list-item>
                        <!-- <v-list-item v-if="data.item.statusCode!='busy' && data.item.powerStateCode=='running' && permission('ft_vmChangePowerState')"                    height="32px" class="fs-m"      @click="stopToggle()"             ><v-flex class="d-flex"><i class="mr-2 grey500-i icon-stop-circle icon-16"></i><span class="grey700 grow">Stop</span><i class="grey500-i icon-ChDown icon-14" :class="{'reverse-arrow': showStopList}"></i></v-flex></v-list-item>
                        <v-list-item v-if="data.item.statusCode!='busy' && data.item.powerStateCode=='running' && permission('ft_vmChangePowerState') && showStopList"    height="32px" class="fs-m pl-8" @click="doVmAction('softPowerOff', data.item),data.item.prep.menu=false"><i class="mr-2 grey500-i icon-stop-circle icon-16"></i><span class="grey700">Soft stop</span></v-list-item>
                        <v-list-item v-if="data.item.statusCode!='busy' && data.item.powerStateCode=='running' && permission('ft_vmChangePowerState') && showStopList"    height="32px" class="fs-m pl-8" @click="doVmAction('powerOff'    , data.item),data.item.prep.menu=false"><i class="mr-2 grey500-i icon-stop-circle icon-16"></i><span class="grey700">Hard stop</span></v-list-item>
                        <v-list-item v-if="data.item.statusCode!='busy' && data.item.powerStateCode=='running' && permission('ft_vmChangePowerState')"                    height="32px" class="fs-m"      @click="restartToggle()"          ><v-flex class="d-flex"><i class="mr-2 grey500-i icon-refresh-ccw icon-16"></i><span class="grey700 grow">Reboot</span><i class="grey500-i icon-ChDown icon-14" :class="{'reverse-arrow': showRestartList}"></i></v-flex></v-list-item>
                        <v-list-item v-if="data.item.statusCode!='busy' && data.item.powerStateCode=='running' && permission('ft_vmChangePowerState') && showRestartList" height="32px" class="fs-m pl-8" @click="doVmAction('softReboot'  , data.item),data.item.prep.menu=false"><i class="mr-2 grey500-i icon-refresh-ccw icon-16"></i><span class="grey700">Soft reboot</span></v-list-item>
                        <v-list-item v-if="data.item.statusCode!='busy' && data.item.powerStateCode=='running' && permission('ft_vmChangePowerState') && showRestartList" height="32px" class="fs-m pl-8" @click="doVmAction('reboot'      , data.item),data.item.prep.menu=false"><i class="mr-2 grey500-i icon-refresh-ccw icon-16"></i><span class="grey700">Reset</span></v-list-item> -->
                        <v-divider class="my-1" v-if="data.item.statusCode!='busy'" />
                        <v-list-item height="32px" class="fs-m fw-b gd-tb-row-item-menu-prop"   @click="showProperty(data.item.id),data.item.prep.menu=false" >Property</v-list-item>
                        <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-editAdv"     @click="editProperty(data.item.id),data.item.prep.menu=false">Edit advanced</v-list-item>
                        <v-list-item height="32px" v-if="anyPermission(['ft_vmPerformance', 'ft_tskShowSection'])" class="fs-m gd-tb-row-item-menu-monitoring"  @click="monitoringMode(data.item.id),data.item.prep.menu=false" >Monitoring</v-list-item>
                        <v-divider class="my-1" v-if="permissionPA()"/> <!-- permissionPA() -->
                        <v-list-item height="32px" v-if="permissionPA()" class="fs-m gd-tb-row-item-menu-adminTools" @click="adminTools=true" >Administration tools</v-list-item>
                        <v-divider class="my-1" v-if="anyPermission(['ft_snapRead', 'ft_snapCreate'])" />
                        <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-snapTake"   :disabled="data.item.statusCode=='busy'" v-if="permission('ft_snapCreate')"      @click="takeSnapshotClick(data.item),data.item.prep.menu=false">Take snapshot</v-list-item>
                        <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-snapMgr"    :disabled="data.item.statusCode=='busy'" v-if="permission('ft_snapRead') && data.item.snapshotsCount > 0"      @click="snapshotManagerClick(data.item),data.item.prep.menu=false" >Snapshot manager</v-list-item>
                        <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-chng-prj-grp" :disabled="data.item.statusCode=='busy'" @click="chngPrjAndGrp(data.item),data.item.prep.menu=false">Change project and group</v-list-item>
                        <v-divider class="my-1" v-if="anyPermission(['ft_vmClone', 'ft_vmMigrate', 'ft_vmToTemplate'])" />
                        <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-clone"      :disabled="data.item.statusCode=='busy'" v-if="permission('ft_vmClone')"      @click="cloneClick(data.item),data.item.prep.menu=false"        >Clone</v-list-item>
                        <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-migrate"    :disabled="data.item.statusCode=='busy'" v-if="permission('ft_vmMigration')"  @click="migrateClick(data.item),data.item.prep.menu=false"      >Migration</v-list-item>
                        <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-toTemplate" :disabled="data.item.statusCode=='busy'" v-if="permission('ft_vmCopyToTemplate')"          @click="saveTemplateClick(data.item),data.item.prep.menu=false" >Save VM as template</v-list-item>
                        <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-convertToTemplate" :disabled="data.item.statusCode=='busy'" v-if="permission('ft_vmConvertToTemplate')" @click="convertToTemplateClick(data.item),data.item.prep.menu=false" >Convert to template</v-list-item>
                        <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-resetError"  :disabled="data.item.statusCode=='busy'" v-if="data.item.hasErrors==true" @click="resetError(data.item.id)" >Reset error message</v-list-item>
                        <v-divider class="my-1" v-if="permission('ft_vmDelete')" />
                        <v-list-item height="32px" class="fs-m gd-tb-row-item-menu-delete" v-if="permission('ft_vmDelete')" @click="doVmActionDelete(data.item),data.item.prep.menu=false"><i class="grey500-i icon-trash icon-16 mr-2"></i>Delete</v-list-item>
                      </div>
                    </v-list>
                  </div>
                </v-menu>
              </v-layout>
            </div>

            <!-- statusCode -->
            <div v-if="header.value=='statusCode'" >
              <v-flex v-if="data.item.statusCode=='busy'" class="d-flex align-center">
                <v-flex class="vms-table__status-progress-wrapper">
                <v-progress-circular  rotate="90" size="22" 
                  :indeterminate="isNullOrUndefined(data.item.tasks) || data.item.tasks.length==0 || data.item.tasks[0].percentCompleted==0" 
                  :value="!isNullOrUndefined(data.item.tasks) && data.item.tasks.length > 0 ? data.item.tasks[0].percentCompleted : undefined" 
                  width="2" class="blue800 fs-xs fw-b mr-1">{{!isNullOrUndefined(data.item.tasks) && data.item.tasks.length > 0 && data.item.tasks[0].percentCompleted!=0 ? data.item.tasks[0].percentCompleted : ''}}</v-progress-circular> 
                <!-- value="66"  {{ value }} -->
                </v-flex>
                <v-flex>
                  <div class="fs-s layout">
                    <span 
                      class="blue800 fw-b fs-s blue800-border pointer" 
                      :class="[!isNullOrUndefined(data.item.tasks) && data.item.tasks.length > 0 && !isNullOrUndefined(vmTaskConsts[data.item.tasks[0].typeCode]) ? '' : 'border-bottom-dashed']" 
                      @click="goToTaskById(data.item.tasks[0].id, false)" 
                      @click.middle="goToTaskById(data.item.tasks[0].id, true)">
                    {{!isNullOrUndefined(data.item.tasks) && data.item.tasks.length > 0 && !isNullOrUndefined(vmTaskConsts[data.item.tasks[0].typeCode]) ? vmTaskConsts[data.item.tasks[0].typeCode].name : objStatus[data.item.statusCode]}}
                    </span>
                    <div v-if="!isNullOrUndefined(data.item.tasks) && data.item.tasks.length > 1" class="inline-block blue800 ml-1 blue200-b px-0-5 fs-s default-border-radius">{{ data.item.tasks.length }}</div>
                  </div>
                  <div v-if="!isNullOrUndefined(data.item.tasks) && data.item.tasks.length > 0 && !isNullOrUndefined(vmTaskConsts[data.item.tasks[0].typeCode])" class="blue800 fw-b fs-s"> 
                    <span class="border-bottom-dashed blue800-border">{{vmTaskConsts[data.item.tasks[0].typeCode].subtitle}}</span>
                  </div>
                </v-flex>
              </v-flex>
              <v-flex v-if="data.item.statusCode=='error'" class="red500 fw-b fs-s d-flex align-center">
                <i class="icon-x-circle icon-20 mr-1"></i>
                <span class="border-bottom-dashed red500-border pointer" @click="goToTask('error', data.item.id, false)" @click.middle="goToTask('error', data.item.id, true)">{{objStatus[data.item.statusCode]}}</span>
              </v-flex>
              <v-flex v-if="data.item.statusCode=='ready'" class="fs-s d-flex align-center">
                <i class="icon-check-circle grey300-i icon-20 mr-1"></i>
                <span class="grey300 fs-s">{{objStatus[data.item.statusCode]}}</span>
              </v-flex>
            </div>

            <!-- locationFullPath -->
            <div v-if="header.value=='prep.resourceProfileFullpath'" class="pointer" @click="showLocationDetails()">
              <div class="name-overflow grey900 fs-m"><span class="">{{ isNullOrUndefined(data.item.prep.resourceProfile) ? '' : data.item.prep.resourceProfile.name}}</span></div>
              <div class="name-overflow grey300 fs-s"><span class="">{{ isNullOrUndefined(data.item.prep.serviceProvider) ? '' : data.item.prep.serviceProvider.name + '/' + data.item.prep.datacenter.name}}</span></div>
            </div>
            
            <!-- projectName -->
            <div v-if="header.value=='prep.projectName'">
              <span class="grey900 fs-m ws-pre">{{data.item.prep.projectName}}</span>
            </div>

            <!-- groupName -->
            <div v-if="header.value=='prep.groupName'">
              <span class="grey900 fs-m">{{data.item.prep.groupName}}</span>
            </div>

            <!-- cpu -->
            <div v-if="header.value=='cpu'">
              <span class="grey900 fs-m">{{data.item.cpu}}</span>
            </div>

            <!-- ram -->
            <div v-if="header.value=='ram'">
              <span class="grey900">{{data.item.prep.ramFormatted}} GB</span>
            </div>

            <!-- storageTotal -->
            <div v-if="header.value=='prep.storageTotal'">
              <span class="grey900 fs-m">{{data.item.prep.storageTotalFormatted}} GB</span>
            </div>

            <!-- osName -->
            <div v-if="header.value=='prep.osName'" class="name-overflow">
              <span class="grey900 fs-s">{{data.item.prep.osName}}</span>
            </div>

            <!-- createDate -->
            <div v-if="header.value=='createDate'">
              <span class="grey900 fs-m">{{data.item.prep.createDateFormatted}}</span>
            </div>

            <!-- price -->
            <div v-if="header.value=='prep.priceTotal' && !isNullOrUndefined(data.item.prep.priceFullTotalFormatted)" class="nowrap pr-4 fs-m fw-b" :class="[data.item.prep.priceCalcError ? 'red500' : 'grey900']">
              <span v-if="glb_pricePeriod=='HOUR'" >{{data.item.prep.priceFullTotalFormatted.perHour}}</span>
              <span v-if="glb_pricePeriod=='DAY'"  >{{data.item.prep.priceFullTotalFormatted.perDay}}</span>
              <span v-if="glb_pricePeriod=='MONTH'">{{data.item.prep.priceFullTotalFormatted.perMonth}}</span>
            </div>
          </td>
          </template>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapGetters         } from 'vuex';
import { objStatus , objStatusCode      } from '@/consts/_otherConsts';
import { vmPowerStateCode, vmPowerState } from '@/consts/vmConsts';
import { vmTaskConsts } from '@/consts/taskConsts';
import { deepSort, defaultSort }  from '@/utilites'

import vmToolBar     from './vms-view-toolBar'
import filterMixin   from '@/modules/_system/filterMixin'

export default {
  mixins:[filterMixin],

  components:{
    vmToolBar
  },

  data(){ return {
      objStatus,
      vmTaskConsts,
      menuPeriod : false,
      pricePeriod: 'MONTH',
      sortBy     : "name",
      descending : false,
      selected   : [],
      showStopList: false,
      showRestartList: false,
      userSelect : false,
      adminTools : false,

      headers: [
        { text:'STATE'        , guideCls: 'gd-tb-col gd-tbcol-state'   , show: 'all'    , showWithProps: 'all'    , align:'center' , value:'powerStateCode'                , filterType:'select'  ,isMono:false , isLeft: false, permission: true , width: '40px'},          
        { text:'VM NAME'      , guideCls: 'gd-tb-col gd-tbcol-name'    , show: 'all'    , showWithProps: 'all'    , align:'left'   , value:'name'                          , filterType:'input'   ,isMono:false , isLeft: false, permission: true },
        { text:'STATUS'       , guideCls: 'gd-tb-col gd-tbcol-status'  , show: 'all'    , showWithProps: 'all'    , align:'left'   , value:'statusCode'                    , filterType:'select'  ,isMono:false , isLeft: false, permission: true , width: '115px'},
        { text:'LOCATION'     , guideCls: 'gd-tb-col gd-tbcol-location', show: 'mdAndUp', showWithProps: 'lgAndUp', align:'left'   , value:'prep.resourceProfileFullpath'  , filterType:'location',isMono:false , isLeft: false, permission: true },
        { text:'PROJECT'      , guideCls: 'gd-tb-col gd-tbcol-project' , show: 'all'    , showWithProps: 'mdAndUp', align:'left'   , value:'prep.projectName'              , filterType:'input'   ,isMono:false , isLeft: false, permission: this.permission('ft_prjRead') },
        { text:'GROUP'        , guideCls: 'gd-tb-col gd-tbcol-group'   , show: 'all'    , showWithProps: 'mdAndUp', align:'left'   , value:'prep.groupName'                , filterType:'input'   ,isMono:false , isLeft: false, permission: this.permission('ft_grpRead') },
        { text:'CPU'          , guideCls: 'gd-tb-col gd-tbcol-cpu'     , show: 'all'    , showWithProps: 'all'    , align:'right'  , value:'cpu'                           , filterType:'from-to' ,isMono:true  , isLeft: false, permission: true , width: '70px', masked: true, mask: 'justDigits' },
        { text:'RAM(GB)'      , guideCls: 'gd-tb-col gd-tbcol-ram'     , show: 'all'    , showWithProps: 'all'    , align:'right'  , value:'ram'                           , filterType:'from-to' ,isMono:true  , isLeft: false, permission: true , width: '90px', masked: true, mask: 'justDigits' },
        { text:'STORAGE(GB)'  , guideCls: 'gd-tb-col gd-tbcol-storage' , show: 'mdAndUp', showWithProps: 'xlOnly' , align:'right'  , value:'prep.storageTotal'             , filterType:'from-to' ,isMono:true  , isLeft: false, permission: true , width: '116px'},
        { text:'OS'           , guideCls: 'gd-tb-col gd-tbcol-os'      , show: 'lgAndUp', showWithProps: 'xlOnly' , align:'left'   , value:'prep.osName'                   , filterType:'select'  ,isMono:false , isLeft: false, permission: true },
        { text:'CREATED'      , guideCls: 'gd-tb-col gd-tbcol-created' , show: 'lgAndUp', showWithProps: 'xlOnly' , align:'left'   , value:'createDate'                    , filterType:'from-to' ,isMono:true  , isLeft: true , permission: true , fromToType:'date',},
        { text:'PRICE'        , guideCls: 'gd-tb-col gd-tbcol-price'   , show: 'all'    , showWithProps: 'all'    , align:'right'  , value:'prep.priceTotal'               , filterType:'from-to' ,isMono:true  , isLeft: true , permission: this.permission('ft_prcRead') , width: '130px', masked: true, mask: 'currency'},
      ],
  } },

  computed:{
    ...mapGetters(['vm_itemsFiltered', 'vm_itemsSelected', 'vm_filter', 'glb_showProperty', 'os_itemsAll', 'vm_showProperty', 'wsize', 'vm_reactiveState', 'glb_pricePeriod']),

    filter:{
      get: function(){        
        return this.vm_filter;
      },

      set: function(data){
        this.vm_setFilter(data);
      }
    }
  },

  watch:{
    selected: function (data) {
      let compare = this.vm_itemsSelected.filter( function(e){
        return this.indexOf(e) < 0
      },  data.map(i=>i.id));
      if(this.userSelect){
        this.vm_setSelectedItems(data.map(item=>item.id));
        this.userSelect = false;
      }
    },

    vm_itemsSelected: function(data){
      this.selected = this.vm_itemsFiltered.filter(f=>data.includes(f.id))
    },

    vm_itemsFiltered:{
      handler: function(items){
          this.selected = this.vm_itemsFiltered.filter(f=>this.vm_itemsSelected.includes(f.id))
      },
      deep: true
    }
  },

  methods: {
    ...mapActions([
      'vm_getItems', 
      'vm_setSelectedItems', 
      'vm_setFilter', 
      'lctn_getItems', 
      'vm_actionsConfirm',
      'vm_deleteConfirm', 
      'vm_clone', 
      'vm_migrate', 
      'vm_setEdited', 
      'vm_setShowProperty', 
      'vm_setExtEditorState',
      'vm_createSnapshot', 
      'vm_resyncConfirm',
      'vm_resetErrorsConfirm',
      'glb_setPricePeriod', 
      'diskPolicy_getItems',
      'tmpl_cloneToTemplate', 
      'tmpl_convertToTemplate',
      'vm_changeProjectAndGroup'
      ]),


    customSort(items, sortBy, isDesc){  
      sortBy = sortBy[0]; 
      isDesc = isDesc[0];
      if(sortBy=='name'){
        return deepSort(items, 'name', isDesc)
      }
      return defaultSort(items, sortBy, isDesc);
    },

    updateSelectedOnClick(data, event){
      if(!isNullOrUndefined(data)){
        data.on['toggle-select-all'](event);
      }
      this.userSelect = true;
    },

    editProperty(id){
      this.vm_setEdited(id).then(()=> 
        this.vm_setExtEditorState(true));
    },

    monitoringMode(id){
      this.$router.push({ path: `/vms/${id}/monitoring` });
    },

    showProperty(id){
      this.vm_setShowProperty(id);
    },

    goToTask(status, id, newWindow){
      if(!permission('ft_tskRead'))
        return;
      this.$nav.navigateTo('tasks', { use: true, stateCodes: [status], objectName: id.toString() }, newWindow);
    },

    goToTaskById(id, newWindow){
      if(!permission('ft_tskRead'))
        return;
      this.$nav.navigateTo('tasks', { use: true, objectName: id.toString() }, newWindow);
    },

    // ф-я вызова консоли
    consoleClick(item){
      this.$vm.openConsole(item);
    },

    showLocationDetails(){
      Vue.prototype.$windows.showDialog({ dialogCode: 'locationDetailsDialog' });
    },

    cloneClick(item){
      var self = this;
      Vue.prototype.$windows.showDialog({
          dialogCode: 'cloneVmDialog',
          
          props: {
            vms: [item]
          },

          onAccept: function(propAdd){
            self.vm_clone({ id:item.id, propAdd});
          }
        }        
      );
    },

    chngPrjAndGrp(item){
      var self = this;
      Vue.prototype.$windows.showDialog({
          dialogCode: 'chngProjectAndGroupDialog',
          
          props: {
            vms: [item]
          },

          onAccept: function({projectId, groupId}){
            self.vm_changeProjectAndGroup({
              data      : item.id,
              projectId,
              groupId
            })
          }
        }        
      );
    },

    migrateClick(item){
      var self = this;
      Vue.prototype.$windows.showDialog({
          dialogCode: 'migrateVmDialog',
          
          props: {
            vms: [item]
          },

          onAccept: function(propAdd){
            self.vm_migrate({ id:item.id, propAdd});
          }
        }        
      );      
    },
    saveTemplateClick(item){
      var self = this;
      Vue.prototype.$windows.showDialog({
          dialogCode: 'saveAsTemplate',
          
          props: {
            sourceName : item.name,
            sourceId   : item.id
          },

          onAccept: function(res){
            self.tmpl_cloneToTemplate(res)
          }
        }        
      );      
    },

    convertToTemplateClick(item){
      var self = this;
      Vue.prototype.$windows.showDialog({
          dialogCode: 'convertToTemplate',
          
          props: {
            sourceName : item.name,
            sourceId   : item.id
          },

          onAccept: function(res){
           self.tmpl_convertToTemplate(res);
          }
        }        
      );      
    }, 

    takeSnapshotClick(item){
      var self = this;
      Vue.prototype.$windows.showDialog({
          dialogCode: 'createSnapshotDialog',
          
          props: {
            vm: item
          },
  
          onAccept: function(res){
            self.vm_createSnapshot(res);
          }
        }        
      );
    },

    snapshotManagerClick(item){
      var self = this;
      Vue.prototype.$windows.showDialog({
          dialogCode: 'snapshotManagerDialog',
          
          props: {
            vm: item
          },
  
          onAccept: function(res){
            self.vm_createSnapshot(res);
          }
        }        
      );
    },

    stopToggle(){
      this.showRestartList = false;
      this.showStopList = !this.showStopList;
    },
    restartToggle(){
      this.showStopList = false;
      this.showRestartList = !this.showRestartList;
    },

    doVmAction(action, item){  
        this.vm_actionsConfirm({action, vmId: item.id});
    },

    doVmActionDelete(item){
      this.vm_deleteConfirm(item);
    },

    rowSelectedClass(data){
      var item = data.item
      if(isNullOrUndefined(item))
       return '';

      var ir = this.vm_reactiveState.find(f=>f.id==item.id);
  

      if(!isNullOrUndefined(ir)){
        switch(ir.state){
          case 'add'     : return 'green100-b';
          case 'edit'    : {
            if(item.statusCode!='busy')
              return 'green100-b';
            else
              break;
          }          
          case 'delete'  : return 'red100-b';
        }
      }

      if(this.selected.includes(item) && !item.prep.isLocationLocked)
       return 'blue100-b';
      if(!isNullOrUndefined(this.vm_showProperty) && this.vm_showProperty.id==item.id)
       return 'blue000-b';
      return '';
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

    resyncClick(id){
      this.vm_resyncConfirm(id);
    },

    resetError(id){
      this.vm_resetErrorsConfirm(id);
    }
  },

  created(){
    this.useFilter = this.vm_filter.use;
  },

  mounted() {
    var self = this;
    setTimeout(()=>self.vm_getItems(), 0);
    // this.diskPolicy_getItems();
    new SimpleBar(qs(".custom-table .v-data-table__wrapper"), { autoHide: true });
  },
}
</script>
<style lang="stylus">
.vms-table
  max-height calc(100vh - 117px)
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
  &__state-cell
    opacity 0.6
  &__reset-error-btn
    min-width 14px !important
    height 14px !important
    margin-bottom -2px
  &__row-menu
    width 240px
  &__row-menu-name
    overflow hidden
    text-overflow ellipsis
  &__status-progress-wrapper
    max-width 30px
  &__admin-tools-menu
    background-color #f9f3d2
  &__has-error button
    visibility hidden
  &__has-error:hover button
    visibility visible
</style>
<style>
.custom-snackbar .v-snack__content{padding: 0 !important;}
.snackbar-close-hover{transition:all 0.5s;}
.snackbar-close-hover:hover{background:#ECEFF1;}
.reverse-arrow{transform: scale(1, -1);}
</style>