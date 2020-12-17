<template> 
    <v-card class="vms-prop" v-if="item!=null" tile>
        <v-toolbar fixed flat class="bg-gradient sticky-header" :class="{'locked-location-bg': item.prep.isLocationLocked}" height="62px;">
            <v-toolbar-title class="font-white gd-prp-name" >{{title}}</v-toolbar-title>
            <div class="flex-grow-1"></div>

            <v-btn tile :disabled="vm_editMode" :text="vm_editMode" :icon="!vm_editMode" class="font-white br-4 gd-prp-edt-btn" @click="editClick" v-if="permissionObj('ft_vmUpdate', item.id) && !item.prep.isLocationLocked">
                <i v-if="!vm_editMode" class="icon-Edit iconmoon-unset icon-24"></i>
                <span class="title white--text text--darken-2" v-if="vm_editMode && priceShow">
                    <span v-if="glb_pricePeriod == 'HOUR'">{{pricePerHourToShow}}</span>
                    <span v-if="glb_pricePeriod == 'DAY'">{{pricePerDayToShow}}</span>
                    <span v-if="glb_pricePeriod == 'MONTH'">{{pricePerMonthToShow}}</span>
                </span>
            </v-btn>

            <v-btn tile icon class="font-white br-4 gd-prp-close" @click="close">
                <i class="icon-Close iconmoon-unset icon-24"></i>
            </v-btn>          
        </v-toolbar>
         <!-- -->
        <div class="sticky-subheader white border-bottom blue050-border" :class="{'d-none':vm_editMode}">
            <v-layout class="pa-2-25">
                <c-vm-state-combo v-model="item.powerStateCode" @doAction="doVmAction" :isDisabled="!permissionObj('ft_vmChangePowerState', item.id) || item.prep.isLocationLocked"/>
                <v-spacer></v-spacer>            
                <v-btn text class="px-2 custom-transform-class text-none grey900 normal-text class gd-prp-console" @click.stop.prevent="consoleClick()"  v-if="permissionObj('ft_vmConsole', item.id) && !item.prep.isLocationLocked">
                    <i class="mr-2 icon-terminal icon-16 grey500-i"></i>Console
                </v-btn>

                <v-menu offset-y left width="218px" v-if="anyPermission(['ft_snapCreate', 'ft_snapRead', 'ft_vmClone', 'ft_vmMigration', 'ft_vmCopyToTemplate', 'ft_vmConvertToTemplate', 'ft_tskRead', 'ft_vmDelete']) && !item.prep.isLocationLocked">
                    <template v-slot:activator="{ on, value }">
                    <v-btn icon tile class="pa-0 br-4 ml-0-5 gd-prp-menu-btn" v-on="on" :class="{'grey100-b': value}" height="36" width="36">
                        <i class="grey500-i icon-Donner icon-16"></i>
                    </v-btn>
                    </template>
                    <v-list width="240px" class="control-combobox py-2 border blue050-border br-4">
                        <v-list-item height="32px" class="fs-m" :disabled="item.statusCode=='busy'" v-if="anyPermission(['ft_vmPerformance', 'ft_tskShowSection'])" @click="monitoringMode(item.id)">Monitoring</v-list-item>
                        <v-divider class="my-1" v-if="anyPermission(['ft_vmPerformance', 'ft_tskShowSection'])"/>
                        <v-list-item height="32px" class="fs-m" :disabled="item.statusCode=='busy'" v-if="permission('ft_snapCreate')" @click="takeSnapshotClick()">Take snapshot</v-list-item>
                        <v-list-item height="32px" class="fs-m" :disabled="item.statusCode=='busy'" v-if="permission('ft_snapRead') && item.snapshotsCount > 0" @click="snapshotManagerClick()">Snapshot manager</v-list-item>
                        <v-divider class="my-1" v-if="anyPermission(['ft_snapRead', 'ft_snapCreate'])"/>
                        <v-list-item height="32px" class="fs-m" :disabled="item.statusCode=='busy'" @click="chngPrjAndGrp()">Change project and group</v-list-item>
                        <v-list-item height="32px" class="fs-m" :disabled="item.statusCode=='busy'" v-if="permission('ft_vmClone')"      @click="cloneClick()">Clone</v-list-item>
                        <v-list-item height="32px" class="fs-m" :disabled="item.statusCode=='busy'" v-if="permission('ft_vmMigration')"    @click="migrateClick()">Migration</v-list-item>
                        <v-list-item height="32px" class="fs-m" :disabled="item.statusCode=='busy'" v-if="permission('ft_vmCopyToTemplate')" @click="saveTemplateClick()">Save VM as template</v-list-item>
                        <v-list-item height="32px" class="fs-m" :disabled="item.statusCode=='busy'" v-if="permission('ft_vmConvertToTemplate')" @click="convertToTemplateClick()">Convert to template</v-list-item>
                        <v-divider class="my-1" v-if="anyPermission(['ft_vmClone', 'ft_vmMigrate', 'ft_vmToTemplate'])"/>
                        <v-list-item height="32px" class="fs-m" v-if="permission('ft_tskRead')" @click="goToTasks()">View log</v-list-item>
                        <v-divider class="my-1" v-if="permission('ft_tskRead')"/>
                        <!-- <v-list-item height="32px" class="fs-m" >Rights</v-list-item> -->
                        <!-- <v-divider class="my-1" v-if="permission('ft_vmDelete')"/> -->
                        <v-list-item height="32px" v-if="permission('ft_vmDelete')" class="fs-m" @click="deleteClick()"><i class="grey500-i icon-trash mr-2"></i>Delete</v-list-item>
                    </v-list>
                </v-menu>

            </v-layout>
        <!-- -->
        </div>
    <div v-show="!vm_editMode" v-bar class="vms-prop--non-editable">
        <div>
        <div class="border-box">
        <c-group v-if="vm_editMode">
            <v-layout row wrap>
                <c-labeled-field class="pl-3 pr-2" xs="6" label="NAME" v-model="item.name" editMode="true" required="true" :error="errors.name"/>
                <c-labeled-field class="pl-2 pr-3" xs="6" label="TAGS" :v-model="''" editMode="true" inputIcon="true" @applyClick="addTag"/>
            </v-layout>
            <v-card flat tile v-if="!isNullOrUndefined(item.tags)">
                <v-chip v-for="(chip, index) in item.tags" :key="index" @click:close="deleteTag(chip)"
                    close 
                    close-icon="icon-Close blue700-i icomoon-important close-chips-button br-4" 
                    class="vms-prop__tag-chip br-4 blue800 blue000-b fs-s fw-b px-2 mx-2 mt-2"
                    >{{chip}}</v-chip>
            </v-card>
            <c-labeled-combo-filter-tmpl v-if="vm_editMode && vm_editNewObject" xs="12"  class="px-2 mt-3" label="TEMPLATE"  v-model="item.prep.templateId"  :items="templates" editMode="true" applyUnset="true"/>
        </c-group>
        
        <c-group v-show="!vm_editMode">
            <v-layout row wrap class="mt-2">
                <c-labeled-slot class="px-3 pa-0 gd-prp-status" xs="6" label="STATUS">
                    <v-flex v-if="item.statusCode=='busy'" class="d-flex align-center px-0">
                        <v-flex class="vms-prop__status-progress-wrapper">
                            <v-progress-circular  rotate="90" size="20" 
                            :indeterminate="isNullOrUndefined(item.tasks) || item.tasks.length==0 || item.tasks[0].percentCompleted==0" 
                            :value="!isNullOrUndefined(item.tasks) && item.tasks.length > 0 ? item.tasks[0].percentCompleted : undefined" 
                            width="2" class="blue800 fs-xs fw-b mr-1">
                                {{!isNullOrUndefined(item.tasks) && item.tasks.length > 0 && item.tasks[0].percentCompleted!=0 ? item.tasks[0].percentCompleted : ''}}
                            </v-progress-circular> 
                        </v-flex>
                        <v-flex @click="goToTaskById(item.tasks[0].id, false)" @click.middle="goToTaskById(item.tasks[0].id, true)" class="pointer">
                            <div class="fs-s">
                                <span 
                                v-if="item.statusCode=='busy'"  
                                :class="[!isNullOrUndefined(item.tasks) && item.tasks.length > 0 && !isNullOrUndefined(vmTaskConsts[item.tasks[0].typeCode]) ? '' : 'border-bottom-dashed']"
                                class="blue800 fw-b fs-s blue800-border pointer" 
                                >
                                    {{!isNullOrUndefined(item.tasks) && item.tasks.length > 0 && !isNullOrUndefined(vmTaskConsts[item.tasks[0].typeCode]) ? vmTaskConsts[item.tasks[0].typeCode].name : objStatus[item.statusCode]}}
                                </span>
                                <div v-if="!isNullOrUndefined(item.tasks) && item.tasks.length > 1" class="inline-block blue800 ml-1 blue200-b px-0-5 fs-s default-border-radius">{{ item.tasks.length }}</div>
                            </div>
                            <div v-if="!isNullOrUndefined(item.tasks) && item.tasks.length > 0 && !isNullOrUndefined(vmTaskConsts[item.tasks[0].typeCode])" class="blue800 fw-b fs-s"> 
                                <span class="border-bottom-dashed blue800-border">{{vmTaskConsts[item.tasks[0].typeCode].subtitle}}</span>
                            </div>
                        </v-flex>
                    </v-flex>
                    <v-flex v-if="item.statusCode=='error'" class="red500 fw-b fs-s d-flex align-center px-0">
                        <i class="icon-x-circle icon-20 mr-1"></i>
                        <span class="border-bottom-dashed red500-border pointer" @click="goToTask('error', item.id, false)" @click.middle="goToTask('error', item.id, true)">{{objStatus[item.statusCode]}}</span>
                    </v-flex>
                    <v-flex v-if="item.statusCode=='ready'" class="fs-s d-flex align-center px-0">
                        <i class="icon-check-circle grey300-i icon-20 mr-1"></i>
                        <span class="grey300 fs-s">{{objStatus[item.statusCode]}}</span>
                    </v-flex>
                </c-labeled-slot>
                <v-flex xs="6" class="py-0 px-3 gd-prp-price">
                    <v-card flat tile class="vms-prop__price">
                        <span class="grey700 fs-s prop-title nonselect">PRICE PER</span>
                        <v-menu offset-y left v-model="menuPeriod" width="218px">
                            <template v-slot:activator="{ }">
                            <v-tooltip bottom  content-class="custom-tooltip fs-s">
                                <template v-slot:activator="{ on }">
                                <v-btn text v-on="on" @click.stop="menuPeriod=true" class="grey600 fs-s normal-text mb-0-5 mx-1 px-0 border-none br-4" min-width="unset" height="15px">(<span class="vms-prop__price-period grey600-border border-bottom-dashed">{{glb_pricePeriod}}</span>)</v-btn>
                                </template>
                                <span class="custom-tooltip-accent fw-m">Choose period</span>
                            </v-tooltip>
                            </template>
                            <v-list width="150px" class="control-combobox py-2 border blue050-border br-4">
                                <v-list-item class="fs-m dropdown-menu-item" @click="glb_setPricePeriod('HOUR')"  ><span :class="glb_pricePeriod=='HOUR' ? 'blue800 fw-b':'grey700'">Hour</span></v-list-item>
                                <v-list-item class="fs-m dropdown-menu-item" @click="glb_setPricePeriod('DAY')"   ><span :class="glb_pricePeriod=='DAY' ? 'blue800 fw-b':'grey700'">Day</span></v-list-item>
                                <v-list-item class="fs-m dropdown-menu-item" @click="glb_setPricePeriod('MONTH')" ><span :class="glb_pricePeriod=='MONTH' ? 'blue800 fw-b':'grey700'">Month</span></v-list-item>
                            </v-list>
                        </v-menu>
                        <br/>
                        <span class="text--primary prop-value" v-if="!isNullOrUndefined(item.prep.priceFullTotalFormatted)">
                            <v-tooltip bottom v-if="item.prep.priceSnapTotal.perMonth > 0"  content-class="custom-tooltip fs-s">
                                <template v-slot:activator="{ on }" class="pointer">
                                    <span class="fs-ml fw-b pointer" v-on="on" :class="[item.prep.priceCalcError ? 'red500' : 'grey900']" @click="snapshotManagerClick()">
                                        <span v-if="glb_pricePeriod=='HOUR'"  class="border-dashed">{{item.prep.priceFullTotalFormatted.perHour}}</span>
                                        <span v-if="glb_pricePeriod=='DAY'"   class="border-dashed">{{item.prep.priceFullTotalFormatted.perDay}}</span>
                                        <span v-if="glb_pricePeriod=='MONTH'" class="border-dashed">{{item.prep.priceFullTotalFormatted.perMonth}}</span>
                                    </span>
                                </template>
                                <div class="vms-prop__tooltip-wrapper">
                                    <div class="text-center fw-m custom-tooltip-accent mb-1">PRICE CONTAIN</div>
                                    <div v-if="glb_pricePeriod=='HOUR'"  class="d-flex justify-space-between"><span class="custom-tooltip-color">VM:</span>  <span class="monospace fw-m custom-tooltip-accent">{{item.prep.priceOnlyVmTotalFormatted.perHour}}</span></div>
                                    <div v-if="glb_pricePeriod=='DAY'"   class="d-flex justify-space-between"><span class="custom-tooltip-color">VM:</span>  <span class="monospace fw-m custom-tooltip-accent">{{item.prep.priceOnlyVmTotalFormatted.perDay}}</span></div>
                                    <div v-if="glb_pricePeriod=='MONTH'" class="d-flex justify-space-between"><span class="custom-tooltip-color">VM:</span>  <span class="monospace fw-m custom-tooltip-accent">{{item.prep.priceOnlyVmTotalFormatted.perMonth}}</span></div>
                                    <div v-if="glb_pricePeriod=='HOUR'"  class="d-flex justify-space-between"><span class="custom-tooltip-color">Snapshot:</span><span class="monospace fw-m custom-tooltip-accent">{{item.prep.priceSnapTotalFormatted.perHour}}</span></div>
                                    <div v-if="glb_pricePeriod=='DAY'"   class="d-flex justify-space-between"><span class="custom-tooltip-color">Snapshot:</span><span class="monospace fw-m custom-tooltip-accent">{{item.prep.priceSnapTotalFormatted.perDay}}</span></div>
                                    <div v-if="glb_pricePeriod=='MONTH'" class="d-flex justify-space-between"><span class="custom-tooltip-color">Snapshot:</span><span class="monospace fw-m custom-tooltip-accent">{{item.prep.priceSnapTotalFormatted.perMonth}}</span></div>
                                </div>
                            </v-tooltip>
                            <span v-else class="fs-ml fw-b" :class="[item.prep.priceCalcError ? 'red500' : 'grey900']">
                                <span v-if="glb_pricePeriod=='HOUR'" >{{item.prep.priceFullTotalFormatted.perHour}}</span>
                                <span v-if="glb_pricePeriod=='DAY'"  >{{item.prep.priceFullTotalFormatted.perDay}}</span>
                                <span v-if="glb_pricePeriod=='MONTH'">{{item.prep.priceFullTotalFormatted.perMonth}}</span>
                            </span>
                        </span>
                    </v-card>
                </v-flex>
            </v-layout>
            <v-layout row wrap>
                <c-labeled-field class="px-3 mt-2 gd-prp-created" xs="6" label="CREATED" v-model="item.prep.createDateFormatted"/>
                
                <c-labeled-slot class="px-3 pa-0 mt-2 gd-prp-snap" xs="6" label="SNAPSHOTS" v-if="permission('ft_snapRead') && item.snapshotsCount > 0">
                    <span class="red500 fw-b fs-s border-bottom-dashed red500-border pointer" @click="snapshotManagerClick()">{{item.snapshotsCount}} {{item.snapshotsCount > 1 ? 'points' : 'point'}}</span>
                </c-labeled-slot>

                <c-labeled-slot  class="px-3 mt-2 py-0 gd-prp-pricelist" :xs="permission('ft_vmSnapshots') && item.snapshotsCount > 0 ? 12 : 6"  label="PRICE" v-if="!isNullOrUndefined(item.prep.priceListName)">
                    <span class="blue700 pointer" @click="gotoPriceList(false)" @click.middle="gotoPriceList(true)"><span class="blue700-border border-bottom-dashed">{{item.prep.priceListName || '-'}}</span> </span>
                </c-labeled-slot>

                <c-labeled-slot class="px-3 pa-0 mt-2 gd-prp-tags" xs="12" label="TAGS" v-if="item.tags.length">
                    <v-card flat tile v-if="!isNullOrUndefined(item.tags)">
                        <v-chip v-for="(chip, index) in item.tags" :key="index"
                            class="vms-prop__tag-chip br-4 blue800 blue000-b fs-s fw-b px-2 mx-2 mt-2"
                            >{{chip}}</v-chip>
                    </v-card>
                </c-labeled-slot>
            </v-layout>

        </c-group>


        <c-group caption="Location">
            <v-layout row wrap>
                <c-labeled-combo-filter xs="6"  class="pl-3 pr-2 mt-2 gd-prp-project"  label="PROJECT"          v-model="item.projectId"  :items="projects"         :editMode="vm_editMode" applyUnset="true"/>
                <c-labeled-combo-filter xs="6"  class="px-3 gd-prp-group"    label="GROUP"            v-model="item.groupId"    :items="groups"           :editMode="vm_editMode" applyUnset="true"/>
                
                <c-labeled-slot         xs="12" class="px-3 mt-2 gd-prp-location" label="LOCATION">
                    <div class="pointer ws-pre grey900-border border-bottom-dashed d-inline-block" @click="showLocationDetails()">
                        <span class="grey900">{{item.prep.resourceProfileFullpath}}</span>
                    </div>
                </c-labeled-slot>
            </v-layout>
        </c-group>
        
        <c-group caption="Compute resources">
            <v-layout row wrap>
                <c-labeled-combo        xs="12" class="px-3 mt-3 gd-prp-presets" label="PRESET" :editMode="vm_editMode" :items="presets"     v-model="preset"/>
                <v-layout class="px-3 flex">
                    <v-flex xs6 class="pt-0">
                        <c-labeled-checkbox :isDisable="!vm_editMode" v-model="cpuHotAdd" class="pl-0" label="Enable CPU HOT ADD" cbid="vm-advanced-editor-cpu-hot"/>
                    </v-flex>
                    <v-flex xs6 class="pt-0 px-3">
                        <c-labeled-checkbox :isDisable="!vm_editMode" v-model="ramHotAdd" label="Enable RAM HOT ADD" cbid="vm-advanced-editor-ram-hot"/>
                    </v-flex>
                </v-layout>
                <c-labeled-combo-filter xs="12" class="px-3 gd-prp-os" label="OS"     :editMode="vm_editMode" :items="os_itemsAll" v-model="item.osCode" />
            </v-layout>
        </c-group>

    <c-group caption="Storage" class="gd-prp-storage" :total="storageTotalFormatted" v-if="item.disks.length > 0 || vm_editMode">
            <!-- <v-expansion-panels class="pt-0" accordion v-if="!vm_editMode">
                <v-expansion-panel v-for="(hdd, index) in item.disks" :key="hdd.id" flat :class="{'mt-2 pt-2': index > 0}">
                    <v-expansion-panel-header class="px-0" expand-icon="mdi-chevron-down grey500">
                        <v-layout row wrap>
                            <c-labeled-field class="px-3" xs="4" label="NAME" v-model="hdd.name"            :editMode="vm_editMode"/>
                            <c-labeled-combo class="px-3" xs="4" label="TYPE" v-model="hdd.policyCode"      :editMode="vm_editMode" :items="vmDiskPolicyTypes" />
                            <c-labeled-field class="px-3 text-right" xs="4" label="SIZE (GB)" v-model="hdd.sizeFormatted" :editMode="vm_editMode" divider="1024"/>
                        </v-layout>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="px-1">
                        <v-layout row wrap>
                            <v-flex xs4></v-flex>
                            <c-labeled-field class="px-3" xs="4" label="BUS" :v-model="isNullOrUndefined(hdd.spec) ? '' : hdd.spec.bus"/>
                            <c-labeled-field class="px-3 text-right" xs="4" label="CONTROLLER" :v-model="isNullOrUndefined(hdd.spec) ? '' : hdd.spec.controller"/>
                        </v-layout>                     
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels> -->
            <div v-if="!vm_editMode">
            <v-layout  row wrap v-for="(hdd, index) in item.disks" :key="index" :class="{'mt-1': index == 0}">
                <v-flex :class="[index == 0 ? 'pt-0': '']">
                    <v-flex class="px-0 d-flex flex-row">
                        <c-labeled-field     class="px-3"      xs="5" label="NAME" :hideLabel="index>0" v-model="hdd.name"       :editMode="vm_editMode"/>
                        <c-labeled-combo     class="pa-0 pr-2" xs="4" label="TYPE" :hideLabel="index>0" v-model="hdd.policyCode" :editMode="vm_editMode" :items="vmDiskPolicyTypes" />
                        <c-labeled-field-hdd class="text-right" xs="3" label="SIZE (GB)" :hideLabel="index>0" v-model="hdd.size"       :editMode="vm_editMode" divider="1024"/>
                    </v-flex>
                </v-flex>
            </v-layout>
            </div>
            <v-layout v-else row wrap v-for="(hdd, index) in item.disks" :key="index" :class="{'mt-1': index == 0}">
                <v-flex :class="[index == 0 ? 'pt-0': '']">
                    <v-layout>
                        <v-flex class="px-0 d-flex flex-row">
                            <c-labeled-field     class="px-3"      xs="4" label="NAME" :hideLabel="index>0" v-model="hdd.name"       :editMode="vm_editMode"/>
                            <c-labeled-combo     class="pa-0 pr-2" xs="4" label="TYPE" :hideLabel="index>0" v-model="hdd.policyCode" :editMode="vm_editMode" :items="vmDiskPolicyTypes" />
                            <c-labeled-field-hdd              xs="4" label="SIZE (GB)" :hideLabel="index>0" v-model="hdd.size"       :editMode="vm_editMode" divider="1024"/>
                        </v-flex>
                        <v-flex class="vms-prop__delete-item-btn-wrapper align-self-end pl-0 pr-1 mr-1">
                            <v-btn icon @click="deleteDisk(hdd, index)">
                                <i class="grey500-i icon-trash icon-16"></i>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            <div class="px-2 mt-2" v-if="vm_editMode">
            <v-btn @click="addDisk" text height="24px" class="vms-prop__add-new-item-btn normal-text justify-space-between align-center fs-s fw-b grey700 grey300-border px-2" outlined>
                <div>Add new disk</div>
                <div> <i class="grey500-i icon-Create icon-10"></i> </div>
            </v-btn>
            </div>
    </c-group>

    <c-group caption="Network interfaces" class="gd-prp-networks" v-if="item.networks.length > 0 || vm_editMode" >
        <!-- <v-layout v-if="!vm_editMode" class="mt-0-5">
                <v-flex>
                    <v-expansion-panels accordion>
                        <v-expansion-panel v-for="(net, index) in item.networks" :key="net.id" flat :class="{'mt-3 pt-2': index > 0}">
                            <v-expansion-panel-header class="px-0" expand-icon="mdi-chevron-down grey500">
                                <v-layout row wrap>
                                    <c-labeled-check-combo :cbid="'vm-property-network' + index" class="px-3 py-0" xs="7" label="NETWORK" :editMode="vm_editMode" :items="networks" v-model="net.netId" applyUnset="true" isDisabled="true" :checked="net.connected"/>
                                    <c-labeled-field class="px-3 text-right" xs="5" label="IP" :editMode="vm_editMode" v-model="net.ip" />
                                </v-layout>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-layout row wrap>
                                    <c-labeled-field class="px-3 pl-8" xs="5" label="MAC" v-model="net.mac"/>
                                    <v-flex xs3></v-flex>
                                    <c-labeled-field class="px-3 text-right" xs="4" label="CONTROLLER" :v-model="!isNullOrUndefined(net.spec) ? net.spec.type : ''"/>
                                </v-layout>                     
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-flex>
            </v-layout> -->
            <v-layout row wrap v-for="(net, index) in item.networks" :key="net.id" class="mt-1">
                <v-flex >
                    <v-layout>
                        <v-flex class="px-0 d-flex flex-row">
                        <c-labeled-check-combo :cbid="'vm-property-network' + index" :hideLabel="index>0" class="px-3 py-0" xs="12" label="NETWORK" :editMode="vm_editMode" :items="networks" v-model="net.netId" applyUnset="true" isDisabled="false" :checked="net.connected" @checkClick="net.connected=!net.connected"/>
                        <!-- <c-labeled-field :hideLabel="index>0"  xs="5" label="IP" :editMode="vm_editMode" v-model="net.ip" /> -->
                        </v-flex>
                        <v-flex v-if="vm_editMode" class="vms-prop__delete-item-btn-wrapper align-self-end pl-0 pr-1 mr-1">
                            <v-btn icon @click="deleteNetwork(net, index)" class="vms-prop__delete-item-btn">
                                <i class="grey500-i icon-trash icon-16"></i>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            <div class="px-2 mt-2" v-if="vm_editMode">
            <v-btn @click="addNetwork" text height="24px" class="vms-prop__add-new-item-btn normal-text justify-space-between align-center fs-s fw-b grey700 grey300-border px-2" outlined>
                <div>Add new network interface</div>
                <div> <i class="grey500-i icon-Create icon-10"></i> </div>
            </v-btn>
            </div>            
    </c-group>

    <c-group caption="CD/DVD Drives" class="gd-prp-media" v-if="item.mediaImageContainers.length > 0 || vm_editMode" >
            <v-layout row wrap  v-for="(mediaContainer, index) in item.mediaImageContainers" :key="mediaContainer.id" class="mt-1">
                <v-flex class="px-0">
                    <c-labeled-combo-filter class="pl-3 py-0" xs="12" :hideLabel="index>0" label="MEDIA" :editMode="vm_editMode" :items="media" v-model="mediaContainer.image.id"  applyUnset="true"/>
                </v-flex>
                <v-flex v-if="vm_editMode" class="vms-prop__delete-item-btn-wrapper align-self-end pl-0 pr-1 mr-1">
                    <v-btn icon @click="deleteMediaController(mediaContainer, index)" class="vms-prop__delete-item-btn">
                        <i class="grey500-i icon-trash icon-16"></i>
                    </v-btn>
                </v-flex>
            </v-layout>
            <div class="px-2 mt-2" v-if="vm_editMode">
                <v-btn @click="addMediaController" text height="24px" class="vms-prop__add-new-item-btn normal-text justify-space-between align-center fs-s fw-b grey700 grey300-border px-2" outlined>
                    <div>Add new media controller</div>
                    <div> <i class="grey500-i icon-Create icon-10"></i> </div>
                </v-btn>
            </div>
    </c-group>

    <c-group caption="Meta data">
            <v-layout class="mb-4 mt-0-5 gd-prp-comment gtComment">
                <v-flex xs12>
                    <c-labeled-textArea class="px-2" xs="12" label="COMMENT" v-model="item.comment" :editMode="vm_editMode"/>
                </v-flex>
            </v-layout>
    </c-group>
        </div>
        </div>
    </div>
    <div v-if="vm_editMode" v-bar class="vms-prop--editable">
        <div>
        <div class="border-box">
        <c-group v-if="vm_editMode">
            <v-layout row wrap>
                <c-labeled-field class="pl-3 pr-2 gd-prp-edt-name" xs="6" label="NAME" v-model="item.name" editMode="true" required="true" :error="errors.name"/>
                <c-labeled-field class="pl-2 pr-3 gd-prp-edt-tags" xs="6" label="TAGS" :v-model="''" editMode="true" inputIcon="true" @applyClick="addTag"/>
            </v-layout>
            <v-card flat tile v-if="!isNullOrUndefined(item.tags)">
                <v-chip v-for="(chip, index) in item.tags" :key="index" @click:close="deleteTag(chip)"
                    close 
                    close-icon="icon-Close blue700-i icomoon-important close-chips-button br-4" 
                    class="vms-prop__tag-chip br-4 blue600 blue000-b fs-s fw-b px-2 mx-2 mt-2"
                    >{{chip}}</v-chip>
            </v-card>
            <c-labeled-combo-filter-tmpl v-if="vm_editMode && vm_editNewObject" xs="12"  class="px-2 mt-3" label="TEMPLATE"  v-model="item.prep.templateId"  :items="templates" editMode="true" applyUnset="true"/>
        </c-group>
        
        <c-group v-if="!vm_editMode">
            <v-layout row wrap class="mt-2">
                <c-labeled-slot class="px-3 pa-0" xs="6" label="STATUS">
                    <v-flex v-if="item.statusCode=='busy'" class="d-flex align-center px-0">
                        <v-flex class="vms-prop__status-progress-wrapper">
                            <v-progress-circular  rotate="90" size="20" 
                            :indeterminate="isNullOrUndefined(item.tasks) || item.tasks.length==0" 
                            :value="!isNullOrUndefined(item.tasks) && item.tasks.length > 0 ? item.tasks[0].percentCompleted : undefined" 
                            width="2" class="blue800 fs-xs fw-b mr-1">{{!isNullOrUndefined(item.tasks) && item.tasks.length > 0 ? item.tasks[0].percentCompleted : ''}}</v-progress-circular> 
                        </v-flex>
                        <v-flex>
                            <div>
                                <span v-if="item.statusCode=='busy'"  class="blue800 fw-b fs-s border-bottom-dashed blue800-border pointer" @click="goToTaskById(item.tasks[0].id, false)" @click.middle="goToTaskById(item.tasks[0].id, true)">{{!isNullOrUndefined(item.tasks) && item.tasks.length > 0 && !isNullOrUndefined(vmTaskConsts[item.tasks[0].typeCode]) ? vmTaskConsts[item.tasks[0].typeCode].name : objStatus[item.statusCode]}}</span>
                                <div v-if="!isNullOrUndefined(item.tasks) && item.tasks.length > 1" class="inline-block blue800 ml-1 blue200-b px-0-5 fs-s default-border-radius">{{ item.tasks.length }}</div>
                            </div>
                            <div v-if="!isNullOrUndefined(item.tasks) && item.tasks.length > 0 && !isNullOrUndefined(vmTaskConsts[item.tasks[0].typeCode])" class="blue800 fw-b fs-s"> 
                                <span class="border-bottom-dashed blue800-border">{{vmTaskConsts[item.tasks[0].typeCode].subtitle}}</span>
                            </div>
                        </v-flex>
                    </v-flex>
                    <v-flex v-if="item.statusCode=='error'" class="red500 fw-b fs-s d-flex align-center px-0">
                        <i class="icon-x-circle icon-20 mr-1"></i>
                        <span class="border-bottom-dashed red500-border pointer" @click="goToTask('error', item.id, false)" @click.middle="goToTask('error', item.id, true)">{{objStatus[item.statusCode]}}</span>
                    </v-flex>
                    <v-flex v-if="item.statusCode=='ready'" class="fs-s d-flex align-center px-0">
                        <i class="icon-check-circle grey300-i icon-20 mr-1"></i>
                        <span class="grey300 fs-s">{{objStatus[item.statusCode]}}</span>
                    </v-flex>
                </c-labeled-slot>
                <v-flex xs6><h2 class="text-right grey900">{{item.prep.priceTotalFormatted}}</h2></v-flex>
                <c-labeled-field class="px-3 mt-2" xs="12" label="CREATED" v-model="item.prep.createDateFormatted"/>
                <c-labeled-slot class="px-3 pa-0 mt-2" xs="12" label="TAGS">
                    <v-card flat tile v-if="!isNullOrUndefined(item.tags)">
                        <v-chip v-for="(chip, index) in item.tags" :key="index"
                            class="vms-prop__tag-chip br-4 blue600 blue000-b fs-s fw-b px-2 mx-2 mt-2" 
                            >{{chip}}</v-chip>
                    </v-card>
                </c-labeled-slot>
            </v-layout>

        </c-group>


        <c-group caption="Location">
            <v-layout row wrap>
                <c-labeled-combo-filter xs="6"  class="pl-3 pr-2 mt-2 gd-prp-edt-project"  label="PROJECT"  v-model="item.projectId"  :items="projects"         :editMode="vm_editMode" applyUnset="true"/>
                <c-labeled-combo-filter xs="6"  class="pl-2 pr-3 mt-2 gd-prp-edt-group"    label="GROUP"    v-model="item.groupId"    :items="groups"           :editMode="vm_editMode" applyUnset="true"/>
                <c-labeled-slot         xs="12" class="px-3 mt-3 gd-prp-location"  v-if="!vm_editNewObject" label="LOCATION">
                    <div class="pointer ws-pre grey900-border border-bottom-dashed d-inline-block" @click="showLocationDetails()">
                        <span class="grey900">{{item.prep.resourceProfileFullpath}}</span>
                    </div>
                </c-labeled-slot>
                <c-labeled-slot         xs="12" class="px-3 mt-2 overflow-hidden" v-if="vm_editNewObject" label="LOCATION">
                    <div class="pointer ws-pre grey900-border border-bottom-dashed d-inline-block" @click="changeDefaultLocation">
                        <span class="grey900">{{item.prep.resourceProfileFullpath}}</span>
                    </div>
                </c-labeled-slot>
            </v-layout>
        </c-group>
        
        <c-group caption="Compute resources">
            <v-layout row wrap>
                <c-labeled-combo        xs="12" class="px-3 mt-3 gd-prp-edt-presets" label="PRESET" :editMode="vm_editMode" :items="presets"     v-model="preset"/>
                <v-layout class="px-3 flex">
                    <v-flex xs6 class="pt-0">
                        <c-labeled-checkbox :isDisable="!vm_editMode" v-model="cpuHotAdd" class="pl-0" label="Enable CPU HOT ADD" cbid="vm-advanced-editor-cpu-hot"/>
                    </v-flex>
                    <v-flex xs6 class="pt-0">
                        <c-labeled-checkbox :isDisable="!vm_editMode" v-model="ramHotAdd" label="Enable RAM HOT ADD" cbid="vm-advanced-editor-ram-hot"/>
                    </v-flex>
                </v-layout>
                <c-labeled-combo-filter xs="12" class="px-3 gd-prp-edt-os" label="OS"     :editMode="vm_editMode" :items="os_itemsAll" v-model="item.osCode" customUnsetText="Other Operating System" />
            </v-layout>
        </c-group>

       <c-group caption="Storage" class="gd-prp-edt-storage" :total="storageTotalFormatted" v-if="item.disks.length > 0 || vm_editMode">
            <v-expansion-panels class="pt-0" accordion v-if="!vm_editMode">
                <v-expansion-panel v-for="(hdd, index) in item.disks" :key="hdd.id" flat :class="{'mt-1': index > 0}">
                    <v-expansion-panel-header class="px-0" expand-icon="mdi-chevron-down grey500">
                        <v-layout row wrap>
                            <c-labeled-field class="px-3" xs="4" label="NAME" v-model="hdd.name"            :editMode="vm_editMode"/>
                            <c-labeled-combo class="px-3" xs="4" label="TYPE" v-model="hdd.policyCode"      :editMode="vm_editMode" :items="vmDiskPolicyTypes" />
                            <c-labeled-field class="px-3 text-right" xs="4" label="SIZE (GB)" v-model="hdd.sizeFormatted" :editMode="vm_editMode" divider="1024"/>
                        </v-layout>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="px-1 mb-2">
                        <v-layout row wrap>
                            <v-flex xs4></v-flex>
                            <c-labeled-field class="px-3" xs="4" label="BUS" :v-model="isNullOrUndefined(hdd.spec) ? '' : hdd.spec.bus"/>
                            <c-labeled-field class="px-3 text-right" xs="4" label="CONTROLLER" :v-model="isNullOrUndefined(hdd.spec) ? '' : hdd.spec.controller"/>
                        </v-layout>                     
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
            <div v-if="!vm_editMode">
            <v-layout  row wrap v-for="(hdd, index) in item.disks" :key="index" :class="{'mt-1': index == 0}">
                <v-flex :class="[index == 0 ? 'pt-0': '']">
                    <v-flex class="px-0 d-flex flex-row">
                        <c-labeled-field     class="px-3"      xs="5" label="NAME" :hideLabel="index>0" v-model="hdd.name"       :editMode="vm_editMode"/>
                        <c-labeled-combo     class="pa-0 pr-2" xs="4" label="TYPE" :hideLabel="index>0" v-model="hdd.policyCode" :editMode="vm_editMode" :items="vmDiskPolicyTypes" />
                        <c-labeled-field-hdd class="text-right pr-2" xs="3" label="SIZE (GB)" :hideLabel="index>0" v-model="hdd.size" :editMode="vm_editMode" divider="1024" :masked="true" mask="justDigits"/>
                    </v-flex>
                </v-flex>
            </v-layout>
            </div>
            <v-layout v-else row wrap v-for="(hdd, index) in item.disks" :key="index" :class="{'mt-1': index == 0}">
                <v-flex :class="[index == 0 ? 'pt-0': '']">
                    <v-layout>
                        <v-flex class="px-0 d-flex flex-row">
                            <c-labeled-field     class="px-3"      xs="4" label="NAME" :hideLabel="index>0" v-model="hdd.name"       :editMode="vm_editMode"/>
                            <c-labeled-combo     class="pa-0 pr-2" xs="4" label="TYPE" :hideLabel="index>0" v-model="hdd.policyCode" :editMode="vm_editMode" :items="vmDiskPolicyTypes" />
                            <c-labeled-field-hdd              xs="4" label="SIZE (GB)" :hideLabel="index>0" v-model="hdd.size"       :editMode="vm_editMode" divider="1024" :masked="true" mask="justDigits"/>
                        </v-flex>
                        <v-flex class="vms-prop__delete-item-btn-wrapper align-self-end pl-0 pr-1 mr-1">
                            <v-btn icon @click="deleteDisk(hdd, index)" class="vms-prop__delete-item-btn">
                                <i class="grey500-i icon-trash icon-16"></i>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            <div class="px-2 mt-2" v-if="vm_editMode">
            <v-btn @click="addDisk" text height="24px" class="vms-prop__add-new-item-btn normal-text justify-space-between align-center fs-s fw-b grey700 grey300-border px-2" outlined>
                <div>Add new disk</div>
                <div> <i class="grey500-i icon-Create icon-10"></i> </div>
            </v-btn>
            </div>
       </c-group>

       <c-group caption="Network interfaces" class="gd-prp-edt-networks" v-if="item.networks.length > 0 || vm_editMode" >
           <v-layout v-if="!vm_editMode" class="mt-0-5">
                <v-flex>
                    <v-expansion-panels accordion>
                        <v-expansion-panel v-for="(net, index) in item.networks" :key="net.id" flat>
                            <v-expansion-panel-header class="px-0" expand-icon="mdi-chevron-down grey500">
                                <v-layout row wrap>
                                    <c-labeled-check-combo :cbid="'vm-property-network' + index" class="px-3" xs="7" label="NETWORK" :editMode="vm_editMode" :items="networks" v-model="net.netId" applyUnset="true" isDisabled="true" :checked="net.connected"/>
                                    <c-labeled-field class="px-3 text-right" xs="5" label="IP" :editMode="vm_editMode" v-model="net.ip" />
                                </v-layout>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-layout row wrap>
                                    <c-labeled-field class="px-3 pl-8" xs="5" label="MAC" v-model="net.mac"/>
                                    <v-flex xs3></v-flex>
                                    <c-labeled-field class="px-3 text-right" xs="4" label="CONTROLLER" :v-model="!isNullOrUndefined(net.spec) ? net.spec.type : ''"/>
                                </v-layout>                     
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-flex>
            </v-layout>
            <v-layout v-else row wrap v-for="(net, index) in item.networks" :key="net.id" class="mt-1">
                <v-flex >
                    <v-layout>
                        <v-flex class="px-0 d-flex flex-row">
                            <c-labeled-check-combo :cbid="'vm-property-network' + index" :hideLabel="index>0" class="px-3 py-0" xs="12" label="NETWORK" :editMode="vm_editMode" :items="networks" v-model="net.netId" applyUnset="true" isDisabled="false" :checked="net.connected" @checkClick="net.connected=!net.connected"/>
                            <!-- <c-labeled-field :hideLabel="index>0"  xs="5" label="IP" :editMode="vm_editMode" v-model="net.ip" /> -->
                        </v-flex>
                        <v-flex class="vms-prop__delete-item-btn-wrapper align-self-end pl-0 pr-1 mr-1">
                            <v-btn icon @click="deleteNetwork(net, index)" class="vms-prop__delete-item-btn">
                                <i class="grey500-i icon-trash icon-16"></i>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            <div class="px-2 mt-2" v-if="vm_editMode">
            <v-btn @click="addNetwork" text height="24px" class="vms-prop__add-new-item-btn normal-text justify-space-between align-center fs-s fw-b grey700 grey300-border px-2" outlined>
                <div>Add new network interface</div>
                <div> <i class="grey500-i icon-Create icon-10"></i> </div>
            </v-btn>
            </div>            
       </c-group>

       <c-group caption="CD/DVD Drives" class="gd-prp-edt-media" v-if="item.mediaImageContainers.length > 0 || vm_editMode" >
            <v-layout row wrap  v-for="(mediaContainer, index) in item.mediaImageContainers" :key="mediaContainer.id" class="mt-1">
                <v-flex class="px-0">
                    <c-labeled-combo-filter  class="pl-3 py-0" xs="12" :hideLabel="index>0" label="MEDIA" :editMode="vm_editMode" :items="media" v-model="mediaContainer.image.id"  applyUnset="true"/>
                </v-flex>
                <v-flex v-if="vm_editMode" class="vms-prop__delete-item-btn-wrapper align-self-end pl-0 pr-1 mr-1">
                    <v-btn icon @click="deleteMediaController(mediaContainer, index)" class="vms-prop__delete-item-btn">
                        <i class="grey500-i icon-trash icon-16"></i>
                    </v-btn>
                </v-flex>
            </v-layout>
            <div class="px-2 mt-2" v-if="vm_editMode">
                <v-btn @click="addMediaController" text height="24px" class="vms-prop__add-new-item-btn normal-text justify-space-between align-center fs-s fw-b grey700 grey300-border px-2" outlined>
                    <div>Add new media controller</div>
                    <div> <i class="grey500-i icon-Create icon-10"></i> </div>
                </v-btn>
            </div>
       </c-group>

       <c-group caption="Meta data" class="gd-prp-edt-comment">
            <v-layout class="mb-4 mt-0-5">
                <v-flex xs12>
                    <c-labeled-textArea class="px-2" xs="12" label="COMMENT" v-model="item.comment" :editMode="vm_editMode"/>
                </v-flex>
            </v-layout>
       </c-group>
        </div>
        </div>
    </div>
       <v-footer v-show="vm_editMode" padless class="font-weight-medium px-4 py-3 justify-space-between border-top grey100-border sticky-footer">
               <v-btn large color="primary" class="normal-text px-2 normal-text gd-prp-bt-close" @click="close"    :disabled="disableInput" outlined><span class="blue900">Cancel</span></v-btn>
               <v-btn large color="primary" class="normal-text px-2 normal-text gd-prp-bt-advanced" @click="advancedMode" :disabled="disableInput" outlined width="140px"><span class="blue900">Advanced mode</span></v-btn>
               <v-btn large color="primary" class="normal-text px-2 normal-text gd-prp-bt-apply" @click="applyChanges" :loading="disableInput">{{ vm_editNewObject ? 'Create':'Apply' }}</v-btn>
       </v-footer>
    </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { objStatus} from '@/consts/_otherConsts';
import { vmPresets, vmPrecision } from '@/consts/vmConsts';
import { vmTaskConsts } from '@/consts/taskConsts';

import { toKeyValuePair } from '@/utilites';
import Vue from 'vue';

export default {
    data(){
        return {

            option: {       
                duration: 300,
                offset: 0,
                easing: 'easeInOutCubic'        
            },

            objStatus,
            vmPresets,
            vmTaskConsts,
            presets: [],

            priceShow           : false,
            pricePerHourToShow  : '0',
            pricePerDayToShow   : '0',
            pricePerMonthToShow : '0',

            showScrollBar : true,
            hasError   : false,
            firstCheck : true,
            menuPeriod : false,
            errors     : {
                name : false
            }
            // serviceProvider: this.item.serviceProvider.code,
            // dataCenter: this.item.datacenter.code,
            // resourceProfile: this.item.resourceProfile.code
        }
    },

    watch:{
        'item.prep.templateId': function(value){
            if(!isNullOrUndefined(value)){
                var t = this.tmpl_itemsAll.find(f=>f.id == value);
                var tmpl =  Object.assign(clone(t));
                this.item.cpu = tmpl.cpu;
                this.item.ram = tmpl.ram;
                this.item.osCode = tmpl.osCode;
                this.item.disks = tmpl.disks;
                this.item.networks = tmpl.networks;
                this.item.mediaImageContainers = tmpl.mediaImageContainers;
                this.item.comment = tmpl.comment;
                this.item.spec = tmpl.spec;
            }
        },

        item:{
            handler: function(){
                if(this.vm_editMode)
                    this.reCalculatePrice();
                if(!this.firstCheck)
                    this.checkForError();
            },
            immediate: true,
            deep:true
        },

        vm_editMode:{
            handler:function(){
                // console.log(this.$vuebar.getState(this.$refs['vm-property']));
                // this.$vuebar.refreshScrollbar(this.$refs['vm-property']);
            },

            vm_editNewObject:{
                //обнуляем все ошибки при переходе к созданию нового объекта во время редактирования существующего
                handler:function(){ 
                    this.firstCheck = true;
                    for(let err in this.errors){
                        this.hasError = false;
                        this.errors[err] = false;
                    }
                }
            }
        },

        prc_itemsAll: function(){ this.reCalculatePrice() },        
    },

    computed:{
        ...mapGetters(['vm_showProperty', 'vm_edited', 'vm_editMode', 'vm_editedApplying', 'vm_editNewObject', 
            'os_itemsAll', 'prj_itemsAll', 'grp_itemsAll', 'net_itemsAll', 'med_itemsAll', 'lctn_defaultResourceProfile',
            'tmpl_itemsAll', 'lctn_serviceProviders', 'prc_itemsAll', 'glb_pricePeriod', 'diskPolicy_itemsAll']),

        vmDiskPolicyTypes(){
            return this.diskPolicy_itemsAll.filter(d => d.resourceProfileId == this.item.resourceProfileId);
        },

        cpuHotAdd:{
            get: function(){
                if(isNullOrUndefined(this.item.spec))
                    this.item.spec = { cpuHotAdd: false, ramHotAdd: false };
                return this.item.spec.cpuHotAdd;
            },
            set: function(value){ 
                if(isNullOrUndefined(this.item.spec.cpuHotAdd))   
                    Vue.set(this.item.spec, 'cpuHotAdd', value);       
                this.item.spec.cpuHotAdd = value;
            }
        },

        ramHotAdd:{
            get: function(){
                if(isNullOrUndefined(this.item.spec))
                    this.item.spec = { cpuHotAdd: false, ramHotAdd: false };
                return this.item.spec.ramHotAdd;
            },
            set: function(value){
                if(isNullOrUndefined(this.item.spec.ramHotAdd))   
                    Vue.set(this.item.spec, 'ramHotAdd', value);       
                this.item.spec.ramHotAdd = value;
            }
        },

        title(){
            return this.vm_editMode ? this.vm_edited.prep.oldName : this.vm_showProperty.name;
        },

        storageTotal(){
            return Math.round( ((isNullOrUndefined(this.item.disks) ? 0 : this.item.disks.map(d=>{return d.size }).reduce((a,b) => a + b, 0)) / 1024 )* 100) / 100;
        },

        storageTotalFormatted(){
            return this.storageTotal == 0 ? '':  localeString(this.storageTotal) + ' GB';
        },

        item(){
            if(this.vm_editMode && isNullOrUndefined(this.vm_edited.osCode))
                this.vm_edited.osCode = "otherGuest";

            return this.vm_editMode ? this.vm_edited : this.vm_showProperty;
        },
        templates(){
            var rpId = this.item.resourceProfileId;
            return this.tmpl_itemsAll
            .filter(w=>w.resourceProfileId == rpId && w.statusCode == 'ready' && !w.isLocked )
            .map(m=>{ return {code: m.id, name: m.name, isPublic: m.isPublic}});
        },
        projects(){
            return this.prj_itemsAll.map(m=>{ return {code: m.id, name: m.name}});
        },

        groups(){
            var fList = this.grp_itemsAll.filter(f=>f.projectId==this.item.projectId).map(m=>{ return {code: m.id, name: m.name}});
            return fList;
        },

        networks(){
            var rpId = this.item.resourceProfileId;
            return this.net_itemsAll
                .filter(w=>w.resourceProfileId == rpId && w.statusCode == 'ready')
                .map(m=>{ return {code: m.id, name: m.name}});
        },

        media(){ 
            var rpId = this.item.resourceProfileId;
            return this.med_itemsAll
                .filter(w=>w.resourceProfileId == rpId && w.statusCode == 'ready')
                .map(m=>{ return {code: m.id, name: m.name}});
        },

        preset:{
            get: function(){   
                // если есть preset в можели, значит перешли из полного редактора и добавляем его как кастом
                if(!isNullOrUndefined(this.item.prep.preset)){
                    this.item.prep.preset.code = 'custom'
                    this.presets = [this.item.prep.preset, ...this.vmPresets];
                }  else
                {
                    this.presets = [...this.vmPresets];
                }

                // ищем подходящий пресет под конфигурацию ВМ
                var prst = this.presets.find(f=>{
                    var prs = vmPrecision.find(k=>k.code==f.ramPrecisionCode);
                    return f.cpu==this.item.cpu && (f.ram==prs.toCurrent(this.item.ram));
                    });

                if(isNullOrUndefined(prst)) // не нашли, создаем как custom
                {
                var d = this.item.ram % 1024;
                var defPrecisionCode = 'gb';
                if(d>0) // если при делении на 1024 число с остатком, используем MB
                { defPrecisionCode = 'mb' }
                var precision = vmPrecision.find(k=>k.code==defPrecisionCode);
                let presetName = this.item.cpu.toString() + ' CPU/' + precision.toCurrent(this.item.ram).toString() + ' ' + precision.name + ' RAM';                    
                this.presets = [{code:'custom', cpu:this.item.cpu, ram: precision.toCurrent(this.item.ram), name: presetName, ramPrecisionCode: precision.code }, 
                        ...this.vmPresets]; 
                return 'custom';          
                }

                return prst.code;
            },
            set: function(value){
                var prst = this.presets.find(f=>f.code== value);   
                var precision = vmPrecision.find(f=>f.code == prst.ramPrecisionCode);
                this.item.cpu = prst.cpu;
                this.item.ram =precision.toMb(prst.ram);
            }
        },

        disableInput(){
            return this.vm_editedApplying;
        }
    },


    methods:{
        ...mapActions([
            'vm_setEdited', 
            'vm_applyChangesConfirm', 
            'vm_setShowProperty', 
            'vm_deleteConfirm', 
            'vm_setExtEditorState', 
            'vm_actionsConfirm', 
            'net_getItems',
            'med_getItems', 
            'vm_createSnapshot', 
            'diskPolicy_getItems', 
            'glb_setPricePeriod',
            'tmpl_convertToTemplate',
            'tmpl_cloneToTemplate']),


        scrollTo(){
            qs('.non-editable-vm-property .vb-content').scroll(0,100);
        },

        showLocationDetails(){
            Vue.prototype.$windows.showDialog({ dialogCode: 'locationDetailsDialog' });
        },

        changeDefaultLocation(){
            var self = this;
            Vue.prototype.$windows.showDialog({ 
                dialogCode: 'locationDialog' ,
                onAccept: function(){
                   self.item.resourceProfileId = self.lctn_defaultResourceProfile.id;
                   self.item.prep.resourceProfileFullpath = self.lctn_defaultResourceProfile.fullPath;
                }
            });   
        },

        snapshotManagerClick(){
            var self = this;
            Vue.prototype.$windows.showDialog({
                dialogCode: 'snapshotManagerDialog',
                
                props: {
                    vm: self.item
                },
        
                onAccept: function(res){
                    self.vm_createSnapshot(res);
                }
            });
        },
        
        gotoPriceList(newWindow){
            this.$nav.navigateTo('pricelists', { use: true, name: this.item.prep.priceListName }, newWindow)
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

        checkForError(){
            for(let err in this.errors){
                if(this.item[err] == ''){
                    this.errors[err] = true;
                    this.hasError = true;
                }else{
                    this.errors[err] = false;
                }
            }
        },

        addTag(value){
            if(!this.item.tags.some(f=>f==value))
                this.item.tags.push(value);
        },
        deleteTag(value){
            var index =  this.item.tags.indexOf(value);
            this.item.tags.splice(index, 1);
        },

        editClick(){
            if(this.vm_editMode){
                this.vm_setEdited(); // убираем объект из редактора
            }else{
                this.vm_setEdited(this.vm_showProperty.id)
                
            }
        },

        close(){
            if(this.vm_editMode && !this.vm_editNewObject)
            {
                this.vm_setShowProperty(this.vm_showProperty.id);
                return;
            }
            this.vm_setShowProperty();
        },

        consoleClick(){
            this.$vm.openConsole(this.item);
        },

        advancedMode(){
           // this.$router.push({ path: '/vms/editor'});
           this.vm_setExtEditorState(true);
        },

        monitoringMode(id){
            this.$router.push({ path: `/vms/${id}/monitoring` });
        },

        applyChanges(){
            this.firstCheck = false;
            this.hasError = false;
            this.checkForError();

            if(!this.hasError){
                this.vm_applyChangesConfirm();
            }else{
                showMessage('inputError');
            }
        },

        doVmAction(action){  
            this.vm_actionsConfirm({action, vmId: this.item.id});
        },

        addDisk(){
            let nHdd = { name: 'new hdd', size: 20480, policyCode: 'sas' };
            if(isNullOrUndefined(this.item.disks))
                this.item.disks = [];
            this.item.disks.push(nHdd);
        },

        deleteDisk(hdd, index){
            this.item.disks.splice(index, 1);
        },


        addNetwork(){
            let nNetwork = { netId: '', ip: '', connected: true };
             if(isNullOrUndefined(this.item.networks))
                this.item.networks = [];
           this.item.networks.push(nNetwork);
        },

        deleteNetwork(net, index){
            this.item.networks.splice(index, 1);
        },

        addMediaController(){
            let nMediaController = { image: { id: null } };
            if(isNullOrUndefined(this.item.mediaImageContainers))
                this.item.mediaImageContainers = [];
            this.item.mediaImageContainers.push(nMediaController);
        },
        
        deleteMediaController(med, index){
            this.item.mediaImageContainers.splice(index, 1);
        },

        goToTasks(newWindow){
            this.$nav.navigateTo('tasks', { use: true, objectName: this.item.id },newWindow)
        },

        cloneClick(){
          var self = this;
          Vue.prototype.$windows.showDialog({
              dialogCode: 'cloneVmDialog',
              
              props: {
                vms: [this.item]
              },
    
              onAccept: function(propAdd){
                self.vm_clone({ id: this.item.id, propAdd });
              }
            }        
          );
        },

        chngPrjAndGrp(item){
            var self = this;
            Vue.prototype.$windows.showDialog({
                dialogCode: 'chngProjectAndGroupDialog',
                
                props: {
                    vms: [this.item]
                },

                onAccept: function(propAdd){
                    
                }
                }        
            );
        },

        takeSnapshotClick(){
          var self = this;
          Vue.prototype.$windows.showDialog({
              dialogCode: 'createSnapshotDialog',
              
              props: {
                vm: this.item
              },
    
              onAccept: function(res){
                  self.vm_createSnapshot(res);
                //self.vm_clone({ id: this.item.id, propAdd });
              }
            }        
          );
        },
    
        migrateClick(){
          var self = this;
          Vue.prototype.$windows.showDialog({
              dialogCode: 'migrateVmDialog',
              
              props: {
                vms: [this.item]
              },
    
              onAccept: function(propAdd){
                self.vm_migrate({ id: this.item.id, propAdd });
              }
            }        
          );      
        },

        saveTemplateClick(){
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

        convertToTemplateClick(){
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

        deleteClick(){
            this.vm_deleteConfirm(this.item)
        },

        reCalculatePrice(){
            if(isNullOrUndefined(this.prc_itemsAll) || this.prc_itemsAll.length == 0 || isNullOrUndefined(this.item))
                return;

            this.priceShow = false;

            var getVmPriceList = function(vm, prcs){
                let vmPrcs = prcs.filter(f=>f.resourceProfileId == vm.resourceProfileId);
                if(vmPrcs.length == 0) // если для location вм нет никаких прайсов, выходим
                return null;
                let orgPrc = vmPrcs.find(f=>isNullOrUndefined(f.projectId) && isNullOrUndefined(f.groupId));
                let prjPrc = vmPrcs.find(f=>f.projectId == vm.projectId && isNullOrUndefined(f.groupId));
                let grpPrc = vmPrcs.find(f=>f.projectId == vm.projectId && f.groupId == vm.groupId);
                if(!isNullOrUndefined(grpPrc))
                return grpPrc;
                if(!isNullOrUndefined(prjPrc))
                return prjPrc;
                if(!isNullOrUndefined(orgPrc))
                return orgPrc;
                return null; // если прайсы были, но ни один не совпал
            }

            var prcLst = getVmPriceList(this.item, this.prc_itemsAll)
            
            if(isNullOrUndefined(prcLst) || isNullOrUndefined(prcLst.prep.prices))
                return;
                
            var price = prcLst.prep.prices['cpu'] * this.item.cpu;
            price += prcLst.prep.prices['ram'] * (this.item.ram / 1024);

            this.item.disks.forEach(disk=>{
                price+= prcLst.prep.prices[disk.policyCode] * (disk.size / 1024)
                })
            
            this.pricePerHourToShow  = localePrice(price, prcLst.currencyCode);
            this.pricePerDayToShow   = localePrice(price * 24, prcLst.currencyCode);
            this.pricePerMonthToShow = localePrice(price * 24 * getDaysInMonth(), prcLst.currencyCode);
            this.priceShow = true;
        }        
    },

    mounted(){
        // this.diskPolicy_getItems();
        // this.$vuebar.initScrollbar(this.$refs['vm-property'])
        // console.log(this.$vuebar)
        // console.log(this.$refs['vm-property'])
    }
}
</script>
<style lang="stylus" scoped>
.vms-prop
    min-height 100vh
    &--editable
        height calc(100vh - 62px - 69px)
    &--non-editable
        height calc(100vh - 62px - 55px)
    &__tag-chip
        height 24px
        margin-top 1px
    &__status-progress-wrapper
        max-width 30px
    &__price
        line-height 1.1
    &__price-period
        position relative
        top 1px
    &__tooltip-wrapper
        width 130px
    &__delete-item-btn-wrapper
        max-width 30px
    &__delete-item-btn
        height 24px
        width 24px
    &__add-new-item-btn
        width 100%
        text-align left
        text-transform none
        border-style dashed
</style>