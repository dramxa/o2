<template>
    <v-card class="tmpl-prop" v-if="item!=null" tile>
        <v-toolbar fixed flat class="bg-gradient sticky-header" :class="{'locked-location-bg': item.prep.isLocationLocked}" height="60px;">
            <v-toolbar-title class="font-white">{{title}}</v-toolbar-title>
            <div class="flex-grow-1"></div>

            <v-btn tile :disabled="tmpl_editMode" :text="tmpl_editMode" :icon="!tmpl_editMode" class="font-white br-4" @click="editClick" v-if="permissionObj('ft_templUpdate', item.id) && (!item.isPublic || permissionPA()) && !item.prep.isLocationLocked">
                <i v-if="!tmpl_editMode" class="icon-Edit iconmoon-unset icon-24"></i>
            </v-btn>

            <v-btn tile icon class="font-white br-4 gd-prp-close" @click="close">
                <i class="icon-Close iconmoon-unset icon-24"></i>
            </v-btn>              
        </v-toolbar>
         <!-- -->

        <div v-show="!tmpl_editMode" class="sticky-subheader white border-bottom blue050-border" v-if="permission('ft_tskRead')">
            <v-layout class="pa-2-5">
                <v-spacer></v-spacer>
                <v-btn text class="mr-2 px-1 custom-transform-class text-none grey900 normal-text" @click="goToTasks(false)" @click.middle="goToTasks(true)">
                    <i class="mr-1 icon-log icon-16 grey500-i"></i>View log
                </v-btn>
            </v-layout>
        </div>

        <c-group v-if="!tmpl_editMode">
            <v-layout row wrap class="mt-2">
                <c-labeled-slot class="px-3 pa-0" xs="6" label="STATUS">
                    <v-flex v-if="item.statusCode=='busy'" class="d-flex align-center px-0">
                        <v-progress-circular  rotate="90" size="20" indeterminate width="2" class="blue800 fs-xs fw-b mr-1"></v-progress-circular> <!-- value="66"  {{ value }} -->
                        <span class="blue600 fw-b fs-s border-bottom-dashed blue800-border">{{objStatus[item.statusCode]}}</span>
                    </v-flex>
                    <v-flex v-if="item.statusCode=='error'" class="red500 fw-b fs-s d-flex align-center px-0">
                        <i class="icon-x-circle icon-20 mr-1"></i>
                        <span class="border-bottom-dashed red500-border">{{objStatus[item.statusCode]}}</span>
                    </v-flex>
                    <v-flex v-if="item.statusCode=='ready'" class="fs-s d-flex align-center px-0">
                        <i class="icon-check-circle grey300-i icon-20 mr-1"></i>
                        <span class="grey300 fs-s">{{objStatus[item.statusCode]}}</span>
                    </v-flex>
                </c-labeled-slot>
                <v-flex v-if="isUserTemplate() && !item.isPublic" xs="6" class="py-0 px-2 gd-prp-price">
                    <v-card flat tile class="tmpl-prop__price">
                        <span class="grey700 fs-s prop-title nonselect">PRICE PER</span>
                        <v-menu offset-y left v-model="menuPeriod" width="218px">
                            <template v-slot:activator="{ }">
                            <v-tooltip bottom  content-class="custom-tooltip fs-s">
                                <template v-slot:activator="{ on }">
                                <v-btn text v-on="on" @click.stop="menuPeriod=true" class="grey600 fs-s normal-text mb-0-5 mx-1 px-0 border-none br-4" min-width="unset" height="15px">(<span class="tmpl-prop__price-period grey600-border border-bottom-dashed">{{glb_pricePeriod}}</span>)</v-btn>
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
                        <!-- <span v-if="label" class="prop-title grey700 fs-s nonselect">{{label}}</span><br> -->
                        <span class="fs-ml fw-b grey900"  v-if="!isNullOrUndefined(item.prep.priceTotalFormatted)">
                            <div v-if="glb_pricePeriod=='HOUR'" >{{item.prep.priceTotalFormatted.perHour}}</div>
                            <div v-if="glb_pricePeriod=='DAY'"  >{{item.prep.priceTotalFormatted.perDay}}</div>
                            <div v-if="glb_pricePeriod=='MONTH'">{{item.prep.priceTotalFormatted.perMonth}}</div>
                        </span>
                    </v-card>
                </v-flex>
                <c-labeled-field  class="px-3" xs="6" label="CREATED" v-model="item.prep.createDateFormatted" />
            </v-layout>
            <v-layout row wrap class="mt-2">
                <c-labeled-slot label="LOCK STATUS" class="px-3 gd-prp-locked"  :xs="permissionPA() ? 6 : 12">
                    <c-labeled-checkbox class="pl-0 mt-1 label-bigger-font-size"  cbid="org-blocked" label="Locked" v-model="item.isLocked"  isDisable="true"/>
                </c-labeled-slot>
                <c-labeled-slot v-if="permissionPA()" label="STATUS" class="px-3 gd-prp-locked"  xs="6">
                    <c-labeled-checkbox class="mt-1 label-bigger-font-size" :isDisable="!tmpl_editMode" cbid="tmpl-public" label="Public" v-model="item.isPublic"  editMode="true" />
                </c-labeled-slot>
            </v-layout>
        </c-group>
        
        <c-group v-if="tmpl_editMode">
            <v-layout row wrap class="mt-2">
                <c-labeled-field class="px-3 gd-prp-edt-name" xs="12" label="NAME" v-model="item.name" editMode="true" required="true" :error="errors.name"/>
            </v-layout>

            <c-labeled-slot label="LOCK STATUS" class="mt-2 px-3 gd-prp-locked"  xs="12">
                <c-labeled-checkbox class="mt-1 label-bigger-font-size"  cbid="tmpl-locked" label="Locked" v-model="item.isLocked"  editMode="true" />
            </c-labeled-slot>

            <c-labeled-slot v-if="permissionPA()" label="STATUS" class="mt-2 px-3 gd-prp-locked"  xs="12">
                <c-labeled-checkbox class="mt-1 label-bigger-font-size"  cbid="tmpl-public" label="Public" v-model="item.isPublic"  editMode="true" />
            </c-labeled-slot>
        </c-group>

        <c-group caption="Location" v-if="!tmpl_editMode">
            <v-layout row wrap>
                <c-labeled-field  xs="12" class="px-3 mt-3"  label="LOCATION"  v-model="item.prep.resourceProfileFullpath"/>
            </v-layout>
        </c-group>

        <c-group v-if="!tmpl_editMode" caption="Compute resources">
            <v-layout row wrap class="mt-2">
                <c-labeled-field class="px-3" xs="6" label="CPU" v-model="item.cpu" :editMode="tmpl_editMode"/>
                <c-labeled-field class="px-3" xs="6" label="RAM" v-model="item.prep.ramFormatted" :editMode="tmpl_editMode"/>
                <v-layout class="flex">
                    <v-flex xs6 class="pt-0 px-3">
                        <c-labeled-checkbox :isDisable="!tmpl_editMode" class="pl-0" label="Enable CPU HOT ADD" cbid="tmpl-advanced-editor-cpu-hot"/>
                    </v-flex>
                    <v-flex xs6 class="pt-0 px-3">
                        <c-labeled-checkbox :isDisable="!tmpl_editMode" label="Enable RAM HOT ADD" cbid="tmpl-advanced-editor-ram-hot"/>
                    </v-flex>
                </v-layout>
                <c-labeled-combo-filter xs="12" class="px-3" label="OS"     :editMode="tmpl_editMode" :items="os_itemsAll" v-model="item.osCode" />
            </v-layout>
        </c-group>
        
        <c-group v-if="!tmpl_editMode && item.disks.length!=0"  caption="Storage" :total="storageTotal">
            <!-- <v-expansion-panels accordion v-if="!tmpl_editMode">
                <v-expansion-panel v-for="hdd in item.disks" :key="hdd.id" flat>
                    <v-expansion-panel-header class="px-0" expand-icon="mdi-chevron-down grey500">
                        <v-layout row wrap>
                            <c-labeled-field class="px-3" xs="4" label="NAME" v-model="hdd.name"            :editMode="tmpl_editMode"/>
                            <c-labeled-combo class="px-3" xs="4" label="TYPE" v-model="hdd.policyCode"      :editMode="tmpl_editMode" :items="vmDiskPolicyTypes" />
                            <c-labeled-field-hdd class="px-3 text-right" xs="4" label="SIZE (GB)" v-model="hdd.size" :editMode="tmpl_editMode" divider="1024"/>
                        </v-layout>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="px-1">
                        <v-layout row wrap>
                            <v-flex xs4></v-flex>
                            <c-labeled-field class="px-3 pb-2" xs="4" label="BUS"        v-model="hdd.specBus"/>
                            <c-labeled-field class="px-3 pb-2 text-right" xs="4" label="CONTROLLER" v-model="hdd.specController"/>
                        </v-layout>                     
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels> -->
            <v-layout class="mt-2" row wrap v-for="(hdd, index) in item.disks" :key="index">
                <c-labeled-field class="px-3" xs="5" label="NAME" :hideLabel="index>0" v-model="hdd.name"       :editMode="tmpl_editMode"/>
                <c-labeled-combo class="pa-0" xs="4" label="TYPE" :hideLabel="index>0" v-model="hdd.policyCode" :editMode="tmpl_editMode" :items="vmDiskPolicyTypes" />
                <v-flex xs3>
                    <v-layout wrap>
                        <c-labeled-field-hdd class="text-right pr-2" :xs="tmpl_editMode ? 9 : 12" label="SIZE (GB)" :hideLabel="index>0" v-model="hdd.size"  :editMode="tmpl_editMode" divider="1024"/>
                        <v-flex xs3 v-if="tmpl_editMode" class="align-self-end pa-0">
                            <v-btn icon @click="deleteDisk(hdd, index)">
                                <i class="icon-trash icon-16"></i>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            <div class="px-2 mt-2" v-if="tmpl_editMode">
            <v-btn @click="addDisk" text height="24px" class="tmpl-prop__add-new-btn normal-text justify-space-between align-center fs-s fw-b grey700 grey300-border px-2" outlined>
                <div>Add new disk</div>
                <div> <i class="grey500-i icon-Create icon-10"></i> </div>
            </v-btn>
            </div>
       </c-group>

        <c-group v-if="!tmpl_editMode && item.networks.length!=0"  caption="Network interfaces">
           <!-- <v-layout v-if="!tmpl_editMode">
                <v-flex>
                    <v-expansion-panels accordion>
                        <v-expansion-panel v-for="(net, index) in item.networks" :key="net.id" flat>
                            <v-expansion-panel-header class="px-0" expand-icon="mdi-chevron-down grey500">
                                <v-layout row wrap>
                                    <c-labeled-check-combo :cbid="'tmpl-property-network' + index" class="px-3" xs="7" label="NETWORK" :editMode="tmpl_editMode" :items="networks" v-model="net.netId" applyUnset="true"/>
                                    <c-labeled-field class="px-3 text-right" xs="5" label="IP" :editMode="tmpl_editMode" v-model="net.ip" />
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
            <v-layout class="mt-2" row wrap v-for="(net, index) in item.networks" :key="net.id">
                <v-flex >
                    <v-layout>
                        <v-flex class="px-0 d-flex flex-row">
                            <c-labeled-check-combo :cbid="'tmpl-property-network' + index" :hideLabel="index>0" class="px-3 py-0" xs="12" label="NETWORK" :editMode="tmpl_editMode" :items="networks" v-model="net.netId" applyUnset="true"/>
                            <!-- <c-labeled-field :hideLabel="index>0" class="px-3" xs="5" label="IP" :editMode="tmpl_editMode" v-model="net.ip" /> -->
                        </v-flex>
                        <v-flex v-if="tmpl_editMode" class="tmpl-prop__delete-btn-wrapper align-self-end pl-0 pr-1 mr-1">
                            <v-btn icon @click="deleteNetwork(net, index)">
                                <i class="icon-trash icon-16"></i>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            <div class="px-2 mt-2" v-if="tmpl_editMode">
            <v-btn @click="addNetwork" text height="24px" class="tmpl-prop__add-new-btn normal-text justify-space-between align-center fs-s fw-b grey700 grey300-border px-2" outlined>
                <div>Add new network interface</div>
                <div> <i class="grey500-i icon-Create icon-10"></i> </div>
            </v-btn>
            </div>            
       </c-group>

       <c-group v-if="!tmpl_editMode && item.mediaImageContainers.length!=0"  caption="CD/DVD Drives">
            <v-layout row wrap  v-for="(mediaContainer, index) in item.mediaImageContainers" :key="mediaContainer.id" :class="[index == 0 ? 'mt-2':'']">
                <v-flex class="px-0">
                <c-labeled-combo-filter class="pl-3 py-0" xs="12" :hideLabel="index>0" label="MEDIA" :editMode="tmpl_editMode" :items="media"   applyUnset="true"/>
                </v-flex>
                <v-flex class="tmpl-prop__delete-btn-wrapper align-self-end pl-0 pr-1 mr-1"  v-if="tmpl_editMode">
                    <v-btn icon @click="deleteMediaController(mediaContainer, index)">
                        <i class="icon-trash icon-16"></i>
                    </v-btn>
                </v-flex>
            </v-layout>
            <div class="px-2 mt-2" v-if="tmpl_editMode">
                <v-btn @click="addMediaController" text height="24px" class="tmpl-prop__add-new-btn normal-text justify-space-between align-center fs-s fw-b grey700 grey300-border px-2" outlined>
                    <div>Add new media controller</div>
                    <div> <i class="grey500-i icon-Create icon-10"></i> </div>
                </v-btn>
            </div>
       </c-group>

        <c-group caption="Meta data" class="gd-prp-comment">
            <v-layout class="mb-4">
                <v-flex xs12>
                    <c-labeled-textArea class="px-2" xs="12" label="COMMENT" v-model="item.comment" :editMode="tmpl_editMode"/>
                </v-flex>
            </v-layout>
       </c-group>

       <v-footer v-if="tmpl_editMode" padless class="font-weight-medium px-4 py-3 justify-space-between blue050-b border-top grey100-border sticky-footer">
               <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-close" @click="close"    :disabled="disableInput" outlined><span class="blue900">Cancel</span></v-btn>
               <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-apply" @click="applyChanges" :loading="disableInput">{{ tmpl_editNewObject ? 'Create':'Apply' }}</v-btn>
       </v-footer>
    </v-card>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';
import { objStatus } from '@/consts/_otherConsts';
import { vmPresets, vmPrecision, vmDiskPolicyTypes } from '@/consts/vmConsts';
import Vue from 'vue';

export default {  
    data(){
        return{
            objStatus,
            vmDiskPolicyTypes,
            menuPeriod : false,
            hasError   : false,
            firstCheck : true,
            errors     : {
                name : false
            }
        }
    },

    computed:{
        ...mapGetters(['tmpl_showProperty', 'tmpl_edited', 'tmpl_editMode', 'tmpl_editedApplying', "net_itemsAll", 
        'tmpl_editNewObject', 'os_itemsAll', 'med_itemsAll', 'auth_accessTokenInfo', 'glb_pricePeriod']),

        title(){
            return this.tmpl_editMode ? this.tmpl_edited.prep.oldName : this.tmpl_showProperty.name;
        },

        storageTotal(){
            return (isNullOrUndefined(this.item.prep.storageTotal) ? 0 : this.item.prep.storageTotal).toString() + " GB";
        },

        item(){
            return this.tmpl_editMode ? this.tmpl_edited : this.tmpl_showProperty;
        },

        networks(){
            return this.net_itemsAll.map(m=>{ return {code: m.id, name: m.name}});
        },

        disableInput(){
            return this.tmpl_editedApplying;
        },

        media() { 
            return this.med_itemsAll.map(m=>{ return {code: m.id, name: m.name}});
        }, 
    },

    watch:{
        item:{
            handler:function(){
                if(!this.firstCheck)
                    this.checkForError();
            },
            deep: true,
            immediate:true
        },
        tmpl_editNewObject:{
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

    methods:{
        ...mapActions(['tmpl_setEdited', 'tmpl_applyChangesConfirm', 'tmpl_setShowProperty', 'net_getItems','med_getItems', 'glb_setPricePeriod']),

        isUserTemplate(){
            return this.item.orgId == this.auth_accessTokenInfo.org_id
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

        editClick(){
            if(this.tmpl_editMode)
                this.tmpl_setEdited(); // убираем объект из редактора
            else
                this.tmpl_setEdited(this.tmpl_showProperty.id)
        },
        
        close(){
            if(this.tmpl_editMode && !this.tmpl_editNewObject)
            {
                this.tmpl_setShowProperty(this.tmpl_showProperty.id);
                return;
            }
            this.tmpl_setShowProperty();
        },

        addDisk(){
            let nHdd = { name: 'new hdd', size: '0', policyCode: 'sas' };
            if(isNullOrUndefined(this.item.disks))
                this.item.disks = [];
            this.item.disks.push(nHdd);
        },

        deleteDisk(hdd, index){
            this.item.disks.splice(index, 1);
        },

        addNetwork(){
            let nNetwork = { netId: '', ip: "" };
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

        applyChanges(){
            this.firstCheck = false;
            this.hasError = false;
            this.checkForError();

            if(!this.hasError){
                this.tmpl_applyChangesConfirm();
            }else{
                showMessage('inputError');
            }
        },

        goToTasks(newWindow){
            this.$nav.navigateTo('tasks', { use: true, objectName: this.item.id }, newWindow)
        }

    }
}
</script>
<style lang="stylus" scoped>
.tmpl-prop
    min-height 100vh
    &__price
        line-height 1.1
    &__price-period
        position relative
        top 1px
    &__add-new-btn
        width 100%
        text-align left
        text-transform none
        border-style dashed
    &__delete-btn-wrapper
        max-width 30px
</style>