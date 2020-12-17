<template>
    <div v-if="!isNullOrUndefined(item)" class="gd-adv-editor">
        <v-toolbar flat  class="toolbar-ext border-bottom grey100-border pl-4"> 
            <v-toolbar-title>
                <span class="fs-m grey800">{{vm_editNewObject? "Create" : "Edit" }} virtual machine <span class="fw-b">{{vm_edited.name}}</span><span class="pl-2" :class="[vm_edited.powerStateCode == 'stopped' ? 'grey700' : vm_edited.powerStateCode == 'running' ? 'green600' : 'brown700']">({{vm_edited.powerStateCode}})</span></span>
            </v-toolbar-title>
        </v-toolbar>
        <v-card flat data-simplebar style="height: calc(100vh - 112px - 85px);">
        <v-card flat class="pl-10" style="overflow-x: hidden;">

        <!--  Name  -->
        <v-layout row wrap class="pt-4 pb-8">
            <v-flex xs2 class="justify-end">
                <v-card flat tile>
                    <v-card-text >
                        <span class="prop-group-title blue500 fs-ml">Name</span>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs10>
                <v-layout class="flex-row" row wrap>
                <v-card flat tile class="ml-4 d-flex">
                    <c-labeled-field class="mx-2 advanced-editor-col-1 gd-adv-name" xs="6" label="VM NAME" v-model="item.name" editMode="true" required="true" :error="errors.name" />
                    <c-labeled-combo-filter-tmpl v-if="vm_editNewObject"  class="mx-2 advanced-editor-col-1 gd-adv-template" label="Template"  v-model="item.prep.templateId"  :items="templates" editMode="true" applyUnset="true"/>
                    <c-adv-editor-increment class="mx-2 advanced-editor-col-1 gd-adv-multiple" v-model="multiple"  v-if="vm_editNewObject" />
                    <c-labeled-field class="mx-2 advanced-editor-col-1 gd-adv-tags" xs="6" label="TAGS" :v-model="''" editMode="true" advancedMode="true" inputIcon="true" @applyClick="addTag"/>
                </v-card>
                </v-layout>
                <v-layout class="flex-row" row wrap>
                <v-card class="ml-4" flat tile v-if="!isNullOrUndefined(item.tags)">
                    <v-chip v-for="(chip, index) in item.tags" :key="index" @click:close="deleteTag(chip)"
                        close 
                        close-icon="icon-Close blue700-i icomoon-important close-chips-button br-4 close-chips-button" 
                        class="br-4 blue600 blue000-b fs-s fw-b px-2 mx-2 mt-2" 
                        style="height:24px;margin-top: 1px;"
                        >{{chip}}</v-chip>
                </v-card>    
                </v-layout>       
            </v-flex>
        </v-layout>
        <v-divider></v-divider>

        <!--  Location  -->
        <v-layout row wrap class="pt-4 pb-8">
            <v-flex xs2 class="justify-end">
                <v-card flat tile>
                    <v-card-text >
                        <span class="prop-group-title blue500 fs-ml">Location</span>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs10>
                <v-card flat tile class="ml-4">
                    <v-layout class="flex-row" row wrap>
                    <c-labeled-combo-filter class="mx-2 advanced-editor-col-1 gd-adv-project" label="PROJECT"          v-model="item.projectId"           :items="projects"         editMode="true" applyUnset="true"/>
                    <c-labeled-combo-filter class="mx-2 advanced-editor-col-1 gd-adv-group"   label="GROUP"            v-model="item.groupId"             :items="groups"           editMode="true" applyUnset="true"/>
                    <c-labeled-combo-filter class="mx-2 advanced-editor-col-1 gd-adv-lctn-sp" label="SERVICE PROVIDER" v-model="serviceProvider"          :items="serviceProviders" editMode="true" v-if="vm_editNewObject" @change="serviceProviderChange()"/>
                    <c-labeled-combo-filter class="mx-2 advanced-editor-col-1 gd-adv-lctn-dc" label="DATACENTER"       v-model="datacenter"               :items="datacenters"      editMode="true" v-if="vm_editNewObject" @change="datacenterChange()"/>
                    <c-labeled-combo-filter class="mx-2 advanced-editor-col-1 gd-adv-lctn-rp" label="RESOURCE PROFILE" v-model="item.resourceProfileId"   :items="resourceProfiles" editMode="true" v-if="vm_editNewObject"/>
                    <!-- <c-labeled-combo :items="os_itemsAll" class="mx-2 advanced-editor-col-1" label="SERVICE PROVIDER" editMode="true" v-model="serviceProviderName"></c-labeled-combo>
                    <c-labeled-combo :items="os_itemsAll" class="mx-2 advanced-editor-col-1" label="DATACENTER"       editMode="true" v-model="datacenterName"></c-labeled-combo>
                    <c-labeled-combo :items="os_itemsAll" class="mx-2 advanced-editor-col-1" label="RESOURCE PROFILE" editMode="true" v-model="resourceProfileName"></c-labeled-combo> -->
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
        <v-divider></v-divider>

        <!--  Computing resourses  -->
        <v-layout row wrap class="pt-4 pb-8">
            <v-flex xs2 class="justify-end">
                <v-card flat tile>
                    <v-card-text >
                        <span class="prop-group-title blue500 fs-ml">Computing resourses</span>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs10>
                <v-card flat tile class="ml-4">
                    <v-layout class="flex-row" row wrap>
                    <c-labeled-combo :items="presets"      class="mx-2 advanced-editor-col-1 gd-adv-presets" label="PRESET"    editMode="true" v-model="preset"/>
                    <v-flex class="mx-2 advanced-editor-col-1 gd-adv-cpu">
                        <c-labeled-input-combo :items="cpuPresets" label="CPU" editMode="true" v-model="cpu" :masked="true" mask="justDigits" />
                        <c-labeled-checkbox class="pl-0" label="CPU HOT ADD" cbid="vm-advanced-editor-cpu-hot" v-model="item.spec.cpuHotAdd"/>
                    </v-flex>
                    <v-flex class="mx-2 advanced-editor-col-1 gd-adv-ram">
                       <v-layout>
                           <c-labeled-input-combo xs="7" :items="ramPresets" class="mr-2" label="RAM" editMode="true" v-model="ram" :masked="true" mask="justDigits" /> 
                           <c-labeled-combo       xs="5" :items="ramPrecision"  label=" " editMode="true" v-model="ramPrecisionCode"/> 
                        </v-layout>
                        <c-labeled-checkbox label="RAM HOT ADD" cbid="vm-advanced-editor-ram-hot" v-model="item.spec.ramHotAdd"/>
                    </v-flex>
                    <c-labeled-combo-filter class="mx-2 advanced-editor-col-2 gd-adv-os" label="OS" editMode="true" :items="os_itemsAll" v-model="item.osCode" /> 
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
        <v-divider></v-divider>

        <!--  Storage  -->
        <v-layout row wrap class="pt-4 pb-8">
            <v-flex xs2 class="justify-end">
                <v-card flat tile>
                    <v-card-text >
                        <span class="prop-group-title blue500 fs-ml">Storage</span><br>
                        <span class="prop-group-subtitle blue500">Total storage <b>{{storageTotalFormatted}}</b> GB</span>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs10>
                <v-card flat tile class="ml-4 gd-adv-storages">
                    <v-layout class="flex-row" row wrap v-for="(hdd, index) in item.disks" :key="index">
                        <c-labeled-field :class="[index>0 ? 'mt-3' : '']" useBottomSlot="true" class="mx-2 advanced-editor-col-1" xs="6" :hideLabel="index>0" label="NAME" v-model="hdd.name" editMode="true"/>
                        <c-labeled-field-hdd class="mx-2 advanced-editor-col-1" label="SIZE (GB)" :class="[index>0 ? 'mt-3' : '']" :hideLabel="index>0" v-model="hdd.size"  editMode="true" divider="1024" :masked="true" mask="justDigits"/>
                        <c-labeled-combo :items="vmDiskPolicyTypes" :hideLabel="index>0" v-model="hdd.policyCode" :class="[index>0 ? 'mt-3' : '']" class="mx-2 advanced-editor-col-1" label="TYPE" editMode="true">
                        <!-- <c-labeled-combo :items="os_itemsAll" :hideLabel="index>0" :class="[index>0 ? 'mt-3' : '']" class="mx-2 advanced-editor-col-1" label="BUS" editMode="true"/>
                        <c-labeled-combo :items="os_itemsAll" :hideLabel="index>0" :class="[index>0 ? 'mt-3' : '']" useRightSlot="true" class="mx-2 advanced-editor-col-1" label="CONTROLLER" editMode="true"> -->
                            <template v-slot:rightSlot>
                                <v-btn icon height="24px" width="24px" class="ml-4">
                                    <i class="icon-trash icon-16"></i>
                                </v-btn>
                            </template>
                        </c-labeled-combo>
                        <v-btn icon height="24px" width="24px" class="ml-2" style="margin-top:17px;" @click="deleteDisk(index)">
                            <i class="icon-trash icon-16"></i>
                        </v-btn>
                    </v-layout>
                    <v-layout row wrap>
                        <c-labeled-btn class="mx-2 advanced-editor-col-1 mt-4" value="Add new" editMode="true" @click="addDisk()" />
                    </v-layout>
                </v-card>
                
                
            </v-flex>
        </v-layout>
        <v-divider></v-divider>

        <!--  Network interfaces  -->
        <v-layout row wrap class="pt-4 pb-8">
            <v-flex xs2 class="justify-end">
                <v-card flat tile>
                    <v-card-text >
                        <span class="prop-group-title blue500 fs-ml">Network interfaces</span>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs10>
                <v-card flat tile class="ml-4 gd-adv-networks">
                    <v-layout class="flex-row" row wrap v-for="(net, index) in item.networks" :key="net.id">
                        <c-labeled-check-combo  class="mx-2 advanced-editor-col-2" :class="[index>0 ? 'mt-3' : '']" :hideLabel="index>0" label="NETWORK" editMode="true" :items="networks" v-model="net.netId" applyUnset="true" :cbid="'vm-adved-network' + index"  isDisabled="false" :checked="net.connected" @checkClick="net.connected=!net.connected" />
                        <!-- <c-labeled-field        class="mx-2 advanced-editor-col-1" :class="[index>0 ? 'mt-3' : '']" :hideLabel="index>0" label="IP"  v-model="net.ip"  editMode="true"/>
                        <c-labeled-field        class="mx-2 advanced-editor-col-1" :class="[index>0 ? 'mt-3' : '']" :hideLabel="index>0" label="MAC" v-model="net.mac" editMode="true"/> -->
                        <!-- <c-labeled-combo        class="mx-2 advanced-editor-col-1" :class="[index>0 ? 'mt-3' : '']" :hideLabel="index>0" label="CONTROLLER" :items="os_itemsAll" editMode="true" :v-model="!isNullOrUndefined(net.spec) ? net.spec.type : ''"/> -->
                        <v-btn @click="deleteNetwork(net, index)" icon height="24px" width="24px" class="ml-2" style="margin-top:17px;">
                            <i class="icon-trash icon-16"></i>
                        </v-btn>
                    </v-layout>
                    <v-layout row wrap>
                        <c-labeled-btn @click="addNetwork"  class="mx-2 advanced-editor-col-1 mt-4" value="Add new" editMode="true"></c-labeled-btn>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
        <v-divider></v-divider>

        <!--  CD/DVD Drives  -->
        <v-layout row wrap class="pt-4 pb-8">
            <v-flex xs2 class="justify-end">
                <v-card flat tile>
                    <v-card-text >
                        <span class="prop-group-title blue500 fs-ml">CD/DVD Drives</span>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs10>
                <v-card flat tile class="ml-4 gd-adv-media">
                    <v-layout class="flex-row" row wrap  v-for="(mediaContainer, index) in item.mediaImageContainers" :key="mediaContainer.id">
                        <c-labeled-combo-filter class="mx-2 advanced-editor-col-2" :class="[index>0 ? 'mt-3' : '']" xs="8" :hideLabel="index>0" label="MEDIA" editMode="true" 
                            :items="media" v-model="mediaContainer.image.id"  applyUnset="true">
                        </c-labeled-combo-filter>
                        <!-- <c-labeled-combo class="mx-2 advanced-editor-col-1" :class="[index>0 ? 'mt-3' : '']" :hideLabel="index>0" label="CONTROLLER" editMode="true"/> -->
                        <v-btn icon height="24px" width="24px" class="ml-2" style="margin-top:17px;" @click="deleteMediaController(mediaContainer, index)">
                            <i class="icon-trash icon-16"></i>
                        </v-btn>
                    </v-layout>
                    <v-layout class="flex-row" row wrap>
                        <c-labeled-btn @click="addMediaController"  class="mx-2 advanced-editor-col-1 mt-4" value="Add new" editMode="true"></c-labeled-btn>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
        <v-divider></v-divider>

        <!--  Meta data  -->
        <v-layout row wrap class="pt-4 pb-8">
            <v-flex xs2 class="justify-end">
                <v-card flat tile>
                    <v-card-text >
                        <span class="prop-group-title blue500 fs-ml">Meta data</span>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs10>
                <v-card flat tile class="d-flex flex-row align-top">
                    <c-labeled-textArea class="mx-2 advanced-editor-col-2 gd-adv-comment" xs="12" label="COMMENTS" v-model="item.comment" :editMode="true"/>
                </v-card>
            </v-flex>
        </v-layout>
        </v-card>
        
    </v-card>
    <v-footer padless class="font-weight-medium px-4 py-3 border-top grey100-border sticky-footer">
        <span v-if="priceShow">
            <span class="grey500 pl-4">VM Cost per 
                <v-menu offset-y top v-model="menuPeriod" width="218px">
                    <template v-slot:activator="{ }">
                    <v-tooltip top  content-class="custom-tooltip fs-s">
                        <template v-slot:activator="{ on }">
                        <v-btn text v-on="on" @click.stop="menuPeriod=true" class="font-weight-medium grey500 fs-s normal-text mb-0-5 px-0 border-none br-4" style="min-width:unset;" height="24px">(<span class="grey800-border border-bottom-dashed" style="position: relative;top: 1px;">{{glb_pricePeriod}}</span>)</v-btn>
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
            :</span>
            <span class="title pl-2 grey800" v-if="glb_pricePeriod == 'HOUR'">{{pricePerHourToShow}}</span>
            <span class="title pl-2 grey800" v-if="glb_pricePeriod == 'DAY'">{{pricePerDayToShow}}</span>
            <span class="title pl-2 grey800" v-if="glb_pricePeriod == 'MONTH'">{{pricePerMonthToShow}}</span>
            <span class="title pl-2 grey800" v-if="glb_pricePeriod == 'HOUR' && multiple.count > 1">(for {{multiple.count}} - {{multiplePricePerHourToShow}})</span>
            <span class="title pl-2 grey800" v-if="glb_pricePeriod == 'DAY' && multiple.count > 1">(for {{multiple.count}} - {{multiplePricePerDayToShow}})</span>
            <span class="title pl-2 grey800" v-if="glb_pricePeriod == 'MONTH' && multiple.count > 1">(for {{multiple.count}} - {{multiplePricePerMonthToShow}})</span>
        </span>
        <v-spacer></v-spacer>
        <v-btn large color="primary" class="normal-text normal-text blue900 fw-b px-2 gd-adv-bt-cancel"  outlined @click="cancel"><span class="blue900">Cancel</span></v-btn>
        <v-btn large color="primary" class="normal-text normal-text gd-adv-bt-simpleMode blue900 fw-b px-2 mx-8" outlined @click="simpleMode" width="140px"><span class="blue900">Simple mode</span></v-btn>
        <v-btn large color="primary" class="normal-text normal-text px-2 fw-b gd-adv-bt-apply" @click="applyChanges">Apply</v-btn>
    </v-footer>
    </div>

</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { vmPresets, vmCpuPresets, vmRamPresets, vmPrecision } from '@/consts/vmConsts';
import { toKeyValuePair } from '@/utilites';

export default {
     data(){
        return {
            vmPrecision,
            vmPresets,
            menuPeriod : false,

            multiple: {
                count      : 1,
                startWith  : 1,
            },
            mask : {
                masked : false,
                firstPartName : '',
                secondPartName : '',
                mask           : ''
            },

            pricePerHourToShow  : '0',
            pricePerDayToShow   : '0',
            pricePerMonthToShow : '0',

            multiplePricePerHourToShow  : '0',
            multiplePricePerDayToShow   : '0',
            multiplePricePerMonthToShow : '0',

            presets          : [],
            cpuPresets       : vmCpuPresets,
            ramDisplayCache  : 0,
            ramPrecisionCode : 'gb', 
            ramPrecision     : vmPrecision.filter(f=>f.code!='tb'),

            // cpuHotAdd   : false,
            // ramHotAdd   : false,

            serviceProvider : null,
            datacenter      : null,
            resourceProfile : null,
            
            errors     : {
                name : false
            }
        }
    },

    computed:{
        
        ...mapGetters(['vm_editNewObject', 'vm_edited', 'vm_showProperty', 'os_itemsAll', 'tmpl_itemsAll',
        'vm_editNewObject', 'prj_itemsAll', 'grp_itemsAll', 'net_itemsAll', 'med_itemsAll', 'diskPolicy_itemsAll',
         'lctn_serviceProviders', 'lctn_resourceProfiles', 'lctn_defaultResourceProfile', 'prc_itemsAll', 'glb_pricePeriod']),

        vmDiskPolicyTypes(){
            return this.diskPolicy_itemsAll.filter(d => d.resourceProfileId == this.item.resourceProfileId);
        },

        ramPresets(){
            return vmRamPresets.filter(f=>f.precisionCode==this.ramPrecisionCode)
        },

        serviceProviders(){
            return this.lctn_serviceProviders.map(m=>{ return {code: m.id, name: m.name}});
        },

        datacenters(){
            var sp = this.lctn_serviceProviders.find(f=>f.id==this.serviceProvider);
            return isNullOrUndefined(sp) ? null : sp.datacenters.map(m=>{ return {code: m.id, name: m.name}});
        },

        resourceProfiles(){
            if(isNullOrUndefined(this.serviceProvider)
            || isNullOrUndefined(this.datacenter))
                return null;

            var sp = this.lctn_serviceProviders.find(f=>f.id==this.serviceProvider);
            var dc = sp.datacenters.find(f=>f.id==this.datacenter); 
            
            return dc.resourceProfiles.map(m=>{ return {code: m.id, name: m.name}});
        },

        preset:{
            get: function(){                
                var precision = vmPrecision.find(f=>f.code == this.ramPrecisionCode);
                let presetName = this.item.cpu.toString() + ' CPU/' + precision.toCurrent(this.item.ram).toString() + ' ' + precision.name + ' RAM';                    
                this.presets = [ 
                    {code:'custom', cpu:this.item.cpu, ram: precision.toCurrent(this.item.ram), name: presetName, ramPrecisionCode: precision.code }, 
                    ...this.vmPresets]; 
                return 'custom';
            },
            set: function(value){
                var prst = this.presets.find(f=>f.code== value);              
                var precision = vmPrecision.find(f=>f.code == prst.ramPrecisionCode);
                this.item.cpu = prst.cpu;
                this.ramPrecisionCode = prst.ramPrecisionCode;
                this.ramDisplayCache = prst.ram.toString();
            }

        },

        cpu:{
            get: function(){
                return this.vm_edited.cpu.toString();
            },
            set: function(value){
                this.vm_edited.cpu = parseInt(value)
            }
        },

        ram:{
            get: function(){
                return this.ramDisplayCache;
            },
            set: function(value){
                this.ramDisplayCache = value.toString();
                var precision = vmPrecision.find(f=>f.code == this.ramPrecisionCode);
                this.vm_edited.ram = precision.toMb(parseInt(value));
            }
        },

        storageTotal(){
            return Math.round( ((isNullOrUndefined(this.item.disks) ? 0 : this.item.disks.map(d=>{return d.size }).reduce((a,b) => a + b, 0)) / 1024 )* 100) / 100;
        },

        storageTotalFormatted(){
            return localeString(this.storageTotal);
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

        media() { 
            var rpId = this.item.resourceProfileId;
            return this.med_itemsAll
                .filter(w=>w.resourceProfileId == rpId && w.statusCode == 'ready')
                .map(m=>{ return {code: m.id, name: m.name}});
        },        

        item(){
            return this.vm_edited;
        }
    },

    watch:{
        item:{
            handler: function(){
                this.reCalculatePrice();
                if(!this.firstCheck)
                    this.checkForError();
            },
            immediate: true,
            deep:true
        },

        'multiple.count': function(){
            if(this.multiple.count>1){
                if(!this.isMasked(this.item.name))
                    this.item.name += '{00}';
            }else{
                if(this.isMasked(this.item.name)){
                    let startPos = this.item.name.indexOf('{')+1;
                    let endPos = this.item.name.indexOf('}')+1;
                    let firstPartName = this.item.name.substr(0,startPos-1);
                    let secondPartName = this.item.name.substr(endPos);
                    this.item.name = firstPartName + secondPartName;
                }
            }
            this.reCalculatePrice();

        },

        'item.prep.templateId': function(value){
            if(!isNullOrUndefined(value)){
                var t = this.tmpl_itemsAll.find(f=>f.id == value);
                var tmpl =  Object.assign(clone(t));
                console.log(tmpl);
                this.item.cpu = tmpl.cpu;
                this.ram = tmpl.prep.ramTotal;
                this.item.osCode = tmpl.osCode;
                this.item.disks = tmpl.disks;
                this.item.networks = tmpl.networks;
                // this.item.mediaImageContainers = tmpl.mediaImageContainers;
                this.item.comment = tmpl.comment;
                this.item.spec = isNullOrUndefined(tmpl.spec) ? { cpuHotAdd: false, ramHotAdd: false } : tmpl.spec;
            }
        },

        ramPrecisionCode:function(value){
            var precision = vmPrecision.find(f=>f.code == this.ramPrecisionCode);
            this.vm_edited.ram = precision.toMb(parseInt(this.ramDisplayCache));
            var pr = this.preset;
        },

        prc_itemsAll: function(){ this.reCalculatePrice() },        
    },

    methods:{
        ...mapActions(['vm_setExtEditorState', 'vm_applyChangesConfirm', 'vm_setShowProperty'
        , 'vm_setExtEditorState', 'net_getItems','med_getItems','vm_createConfirmMultiple', 'glb_setPricePeriod']),

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

        serviceProviderChange(){
            this.datacenter = null;
            this.resourceProfile = null;
        },
        datacenterChange(){
            this.resourceProfile = null;
        },

        addTag(value){
            if(!this.item.tags.some(f=>f==value))
                this.item.tags.push(value);
        },
        deleteTag(value){
            var index =  this.item.tags.indexOf(value);
            this.item.tags.splice(index, 1);
        },

        simpleMode(){
            var prst = this.presets.find(f=>f.code==this.preset);
            this.item.preset = prst;
            this.vm_setExtEditorState(false);
        },

        isMasked(str){
            if(str.indexOf('{') != -1){
                if(str.indexOf('}') != -1){
                    return true;
                }else
                    return false;
            }else
                return false;
        },

        setMask(){
            let startPos = this.item.name.indexOf('{')+1;
            let endPos = this.item.name.indexOf('}')+1;
            this.mask.firstPartName = this.item.name.substr(0,startPos-1);
            this.mask.secondPartName = this.item.name.substr(endPos);
            this.mask.mask = this.item.name.substr(startPos, endPos-startPos-1);
        },



        applyChanges(){
            this.firstCheck = false;
            this.hasError = false;
            this.checkForError();

            if(!this.hasError){
                if(this.multiple.count > 1){
                    if(this.isMasked(this.item.name)){
                        this.mask.masked = true;
                        this.setMask()
                    }
                    this.vm_createConfirmMultiple( {...this.multiple, mask: this.mask } );
                }else
                    this.vm_applyChangesConfirm();
            }else{
                showMessage('inputError');
            }
        },

        cancel(){
            this.vm_setExtEditorState(false);
            if(!this.vm_editNewObject)
                this.vm_setShowProperty(this.vm_showProperty.id);
            else
                this.vm_setShowProperty();
        },

        
        addDisk(){
            let nHdd = { name: 'new hdd', size: 20480, policyCode: 'sas' };
            if(isNullOrUndefined(this.item.disks))
                this.item.disks = [];
            this.item.disks.push(nHdd);
        },

        deleteDisk(index){
            this.item.disks.splice(index, 1);
        },


        addNetwork(){
            let nNetwork = { netId: '', ip: "", connected: true };
             if(isNullOrUndefined(this.item.networks))
                this.item.networks = [];
           this.item.networks.push(nNetwork);
        },

        deleteNetwork(net, index){
            this.item.networks.splice(index, 1);
        },

        addMediaController(){
            let nMediaController = { image: { } };
            if(isNullOrUndefined(this.item.mediaImageContainers))
                this.item.mediaImageContainers = [];
            this.item.mediaImageContainers.push(nMediaController);
        },
        
        deleteMediaController(med, index){
            this.item.mediaImageContainers.splice(index, 1);
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
            if(this.multiple.count > 1){
                this.multiplePricePerHourToShow  = localePrice(price * this.multiple.count, prcLst.currencyCode);
                this.multiplePricePerDayToShow   = localePrice(price * this.multiple.count * 24, prcLst.currencyCode);
                this.multiplePricePerMonthToShow = localePrice(price * this.multiple.count * 24 * getDaysInMonth(), prcLst.currencyCode);
            }
            this.priceShow = true;
        }       

    },
    
    created(){    
        var precision = vmPrecision.find(f=>f.code == this.ramPrecisionCode);
        this.ramDisplayCache = precision.toCurrent(this.item.ram);

        var defRP = this.lctn_defaultResourceProfile;        
        if(!isNullOrUndefined(defRP)){
            this.serviceProvider = defRP.serviceProvider.id;
            this.datacenter      = defRP.datacenter.id;
            this.resourceProfile = defRP.resourceProfile.id;
        }
    }
}
</script>
<style>

</style>