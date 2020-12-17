<template>
    <v-card class="net-prop" v-if="item!=null" tile>
        <v-toolbar fixed flat class="bg-gradient sticky-header" :class="{'locked-location-bg': item.prep.isLocationLocked}" height="60px;">
            <v-toolbar-title class="font-white gd-prp-name">{{title}}</v-toolbar-title>
            <div class="flex-grow-1"></div>

            <v-btn tile :disabled="net_editMode" :text="net_editMode" :icon="!net_editMode" class="font-white br-4 gd-prp-edt-btn" @click="editClick"  v-if="permissionObj('ft_netUpdate', item.id) && !item.prep.isLocationLocked">
                <i v-if="!net_editMode" class="icon-Edit iconmoon-unset icon-24"></i>
            </v-btn>

            <v-btn tile icon class="font-white br-4 gd-prp-close" @click="close">
                <i class="icon-Close iconmoon-unset icon-24"></i>
            </v-btn>              
        </v-toolbar>
         <!-- -->

        <div v-show="!net_editMode" class="sticky-subheader white border-bottom blue050-border" v-if="permission('ft_tskRead')">
            <v-layout class="pa-2 py-2-5">
                <v-spacer></v-spacer>
                <v-btn text class="mr-2 px-1 py-0 custom-transform-class text-none grey900 normal-text" @click="goToTasks(false)" @click.middle="goToTasks(true)">
                    <i class="mr-1 icon-log icon-16 grey500-i"></i>View log
                </v-btn>
            </v-layout>
        </div>

        <c-group>
            <v-layout row wrap class="mt-2">
                <c-labeled-field class="px-3 gd-prp-edt-name" v-if="net_editMode" xs="12" label="NAME" v-model="item.name" :editMode="net_editMode" :disabled="disableInput" required="true" :error="errors.name"/>
                <c-labeled-slot class="px-3 gd-prp-status" v-if="!net_editMode" xs="6" label="STATUS">
                    <v-flex v-if="item.statusCode=='busy'" class="d-flex align-center">
                        <v-progress-circular  rotate="90" size="20" indeterminate width="2" class="blue800 fs-xs fw-b mr-1"></v-progress-circular> <!-- value="66"  {{ value }} -->
                        <span v-if="item.statusCode=='busy'"  class="blue800 fw-b fs-s border-bottom-dashed blue800-border">{{objStatus[item.statusCode]}}</span>
                    </v-flex>
                    <v-flex v-if="item.statusCode=='error'" class="red500 fw-b fs-s d-flex align-center">
                        <i class="icon-x-circle icon-20 mr-1"></i>
                        <span class="border-bottom-dashed red500-border">{{objStatus[item.statusCode]}}</span>
                    </v-flex>
                    <v-flex v-if="item.statusCode=='ready'" class="fs-s d-flex align-center">
                        <i class="icon-check-circle grey300-i icon-20 mr-1"></i>
                        <span class="grey300 fs-s">{{objStatus[item.statusCode]}}</span>
                    </v-flex>
                </c-labeled-slot>
                <c-labeled-field v-if="!glb_permissionPA" class="mt-3 px-3 gd-prp-type"  xs="12" label="TYPE" v-model="item.type" :editMode="false" :disabled="disableInput"/>
                <c-labeled-combo v-if="glb_permissionPA" xs="12" class="px-3 mt-3 gd-prp-edt-type" label="TYPE" :editMode="net_editMode" :items="netTypes" v-model="item.type" :required="true"/>
                <c-labeled-field v-if="glb_permissionPA && net_editMode && item.type=='public'" xs="12" class="px-3 mt-3 gd-prp-edt-vlan" label="VLAN" v-model="item.vlan"  :editMode="net_editMode" :required="true" :error="vlanError" masked="true" mask="justDigits"/>
                <c-labeled-field xs="12" class="px-3 mt-3 gd-prp-location" label="LOCATION" v-model="item.prep.resourceProfileFullpath"  :editMode="false" v-if="!net_editNewObject"/>
                <!-- <c-labeled-field class="px-3 mt-2 gd-prp-vlan" v-if="permissionPA()" xs="12" label="Vlan" v-model="item.vlan" :editMode="net_editMode" :disabled="disableInput" :masked="true" mask="justDigits"/> -->
                <c-labeled-field class="px-3 mt-3 gd-prp-vms" v-if="!net_editMode" xs="6" label="VM#" v-model="item.connectedVms.length" :editMode="net_editMode" :disabled="disableInput"/>
                <c-labeled-field v-if="glb_permissionPA && !net_editMode && item.type=='public'" xs="6" class="px-3 mt-3 gd-prp-vlan" label="VLAN" v-model="item.vlan"  :editMode="false" />
                <v-layout row wrap class="px-1 gd-prp-edt-location mt-2">
                    <c-labeled-combo-filter v-model="serviceProvider" v-if="net_editNewObject" :items="serviceProviders" xs="6"  label="SERVICE PROVIDER" class="px-3" editMode="true" required="true" applyUnset="true" :error="serviceProviderError" />
                    <c-labeled-combo-filter v-model="datacenter"      v-if="net_editNewObject" :items="datacenters"      xs="6"  label="DATACENTER"       class="px-3" editMode="true" required="true" applyUnset="true" :error="dataCenterError" />
                    <c-labeled-combo-filter v-model="resourceProfile" v-if="net_editNewObject" :items="resourceProfiles" xs="12" label="RESOURCE PROFILE" class="px-3" editMode="true" required="true" applyUnset="true" :error="resourceProfileError" />
                </v-layout>
            </v-layout>
        </c-group>

        <c-group caption="Meta data" class="gd-prp-comment">
            <v-layout row wrap>
                <c-labeled-textArea class="px-3" xs='12' label="COMMENT" v-model="item.comment" :editMode="net_editMode"/>
            </v-layout>
        </c-group>

       <v-footer v-if="net_editMode" padless class="font-weight-medium px-4 py-3 justify-space-between border-top grey100-border blue050-b sticky-footer">
            <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-close" @click="close"    :disabled="disableInput" outlined><span class="blue900">Cancel</span></v-btn>
            <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-apply" @click="applyChanges" :loading="disableInput">{{ net_editNewObject ? 'Create':'Apply' }}</v-btn>
       </v-footer>
    </v-card>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';
import { objStatus } from '@/consts/_otherConsts';
import Vue from 'vue';

export default {  
    data(){
        return{
            objStatus,
            hasError   : false,
            firstCheck : true,
            serviceProvider : null,
            datacenter      : null,
            resourceProfile : null,
            serviceProviderError : false,
            dataCenterError      : false,
            resourceProfileError : false,
            vlanError            : false,
            errors     : {
                name         : false,
            },
            netTypes: [
                {code:'public',name:'Public'},
                {code:'isolated',name:'Isolated'},
            ]
        }
    },

    watch:{
        item:{
            handler:function(item){
                if(!this.firstCheck)
                    this.checkForError();    
                
                if(!isNullOrUndefined(item)
                   && !isNullOrUndefined(item.resourceProfileId))
                    if(!isNullOrUndefined(this.item.prep.serviceProvider)){
                        this.serviceProvider = this.item.prep.serviceProvider.id;
                    if(!isNullOrUndefined(this.item.prep.datacenter))
                        this.datacenter = this.item.prep.datacenter.id;
                    if(!isNullOrUndefined(this.item.prep.resourceProfile))
                        this.resourceProfile = this.item.prep.resourceProfile.id;
                }
            },
            deep: true,
            immediate:true
        },

        resourceProfile: function(newValue, oldValue){
            if(!isNullOrUndefined(this.item)){  
                this.item.prep.serviceProvider.id = this.serviceProvider;
                this.item.prep.datacenter.id = this.datacenter
                this.item.prep.resourceProfile.id = newValue;
                this.item.resourceProfileId = newValue;
            }
        },

        net_editNewObject:{
            //обнуляем все ошибки при переходе к созданию нового объекта во время редактирования существующего
            handler:function(){ 
                // this.serviceProvider = null;
                // this.dataCenter      = null;
                // this.resourceProfile = null;
                this.firstCheck = true;
                for(let err in this.errors){
                    this.hasError = false;
                    this.errors[err] = false;
                }
                this.serviceProviderError = false;
                this.dataCenterError = false;
                this.resourceProfileError = false;
            }
        }
    },

    computed:{
        ...mapGetters(['net_showProperty', 'net_edited', 'net_editMode', 'net_editedApplying', 'net_editNewObject', 'lctn_serviceProviders', 'lctn_defaultResourceProfile', 'glb_permissionPA']),

        title(){
            return this.net_editMode ? this.net_edited.prep.oldName : this.net_showProperty.name;
        },

        item(){
            return this.net_editMode ? this.net_edited : this.net_showProperty;
        },

        disableInput(){
            return this.net_editedApplying;
        },

        serviceProviders(){
            return this.lctn_serviceProviders.map(m=>{ return {code: m.id, name: m.name}});
        },

        datacenters(){
            var sp = this.lctn_serviceProviders.find(f=>f.id==this.serviceProvider);
            return isNullOrUndefined(sp) ? null : sp.datacenters.map(m=>{ return {code: m.id, name: m.name}});
        },

        resourceProfiles(){
            if(isNullOrUndefined(this.serviceProvider))
                return null;
            if(isNullOrUndefined(this.datacenter))
                return null;
            var sp = this.lctn_serviceProviders.find(f=>f.id==this.serviceProvider);

            if(isNullOrUndefined(sp))
                return null
            var dc = sp.datacenters.find(f=>f.id==this.datacenter); 
            return isNullOrUndefined(dc) ? null : dc.resourceProfiles.map(m=>{ return {code: m.id, name: m.name}});
        },

    },

    methods:{
        ...mapActions(['net_setEdited', 'net_applyChangesConfirm', 'net_setShowProperty']),

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
            if(this.net_editMode)
                this.net_setEdited(); // убираем объект из редактора
            else
                this.net_setEdited(this.net_showProperty.id)
        },
        
        close(){
            if(this.net_editMode && !this.net_editNewObject)
            {
                this.net_setShowProperty(this.net_showProperty.id);
                return;
            }
            this.net_setShowProperty();
        },

        applyChanges(){
            this.firstCheck = false;
            this.hasError = false;
            this.checkForError();
            if(isNullOrUndefined(this.serviceProvider))
                this.serviceProviderError = true;
            else
                this.serviceProviderError = false;
            if(isNullOrUndefined(this.datacenter))
                this.dataCenterError = true;
            else
                this.dataCenterError = false;
            if(isNullOrUndefined(this.resourceProfile))
                this.resourceProfileError = true;
            else
                this.resourceProfileError = false;

            if(this.item.type == 'public' && (isNullOrUndefined(this.item.vlan) || this.item.vlan == '' || !Number.isInteger(this.item.vlan)))
                this.vlanError = true;
            else
                this.vlanError = false;

            if(this.serviceProviderError || this.dataCenterError || this.resourceProfileError || this.vlanError){
                showMessage('inputError');
                return;
            }

            

            if(!this.hasError){
                this.item.resourceProfileId = this.resourceProfile;
                this.net_applyChangesConfirm();
            }else{
                showMessage('inputError');
            }
        },

        goToTasks(newWindow){
            this.$nav.navigateTo('tasks', { use: true, objectName: this.item.id }, newWindow)
        }

    },

    mounted(){
        if(!isNullOrUndefined(this.item))
            if(!isNullOrUndefined(this.item.prep.serviceProvider)){
                this.serviceProvider = this.item.prep.serviceProvider.id;
            if(!isNullOrUndefined(this.item.prep.datacenter))
                this.datacenter = this.item.prep.datacenter.id;
            if(!isNullOrUndefined(this.item.prep.resourceProfile))
                this.resourceProfile = this.item.prep.resourceProfile.id;
        }else{
            var defRP = this.lctn_defaultResourceProfile;        
            if(!isNullOrUndefined(defRP)){
                this.serviceProvider = defRP.serviceProvider.id;
                this.datacenter      = defRP.datacenter.id;
                this.resourceProfile = defRP.resourceProfile.id;
            }
        }
    }
}
</script>
<style lang="stylus" scoped>
.net-prop
    min-height 100vh
</style>
