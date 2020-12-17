<template>
    <v-card class="ds-prop" v-if="item!=null" tile>
        <v-toolbar fixed flat class="bg-gradient sticky-header" height="60px;">
            <v-toolbar-title class="font-white gd-prp-name">{{title}}</v-toolbar-title>
            <div class="flex-grow-1"></div>

            <v-btn tile :disabled="ds_editMode" :text="ds_editMode" :icon="!ds_editMode" class="font-white br-4 gd-prp-edt-btn" @click="editClick"  v-if="permissionObj('ft_netUpdate', item.id)">
                <i v-if="!ds_editMode" class="icon-Edit iconmoon-unset icon-24"></i>
            </v-btn>

            <v-btn tile icon class="font-white br-4 gd-prp-close" @click="close">
                <i class="icon-Close iconmoon-unset icon-24"></i>
            </v-btn>              
        </v-toolbar>

        <div v-show="!ds_editMode" class="sticky-subheader white border-bottom blue050-border" >
            <v-layout class="pa-2 py-2-5">
                <v-spacer></v-spacer>
                <v-btn text class="mr-2 px-1 py-0 custom-transform-class text-none grey500 normal-text gd-prp-disable-btn">
                    <i class="mr-1 mdi mdi-progress-check icon-22 grey500-i"></i>{{item.isEnabled ? 'Disable' : 'Enable'}} datastore
                </v-btn>
            </v-layout>
        </div>

        <c-group>
            <v-layout row wrap class="mt-2">
                <c-labeled-field class="px-3 gd-prp-edt-name mb-2" v-if="ds_editMode" xs="12" label="NAME" v-model="item.name" :editMode="ds_editMode" :disabled="disableInput" required="true" :error="errors.name"/>
                <c-labeled-combo class="px-3 gd-prp-type" xs="12" label="TYPE" :editMode="ds_editMode" :items="types" v-model="item.storageTypeId" required="true" :error="errors.storageTypeId" />
                <v-layout row wrap class="mt-2">
                    <c-labeled-slot label="STATUS" class="px-4 gd-prp-status"  xs="12">
                        <c-labeled-checkbox class="pl-0 mt-1 label-bigger-font-size" :isDisable="!ds_editMode" cbid="ds-status" label="Enabled" v-model="item.isEnabled"/>
                    </c-labeled-slot>
                </v-layout>
                <c-labeled-field xs="12" class="px-3 mt-3 gd-prp-location" label="LOCATION" v-model="item.prep.resourceProfileFullpath"  :editMode="false" v-if="!ds_editNewObject"/>
                <v-layout row wrap class="px-1 gd-prp-edt-location">
                    <c-labeled-combo-filter v-model="serviceProvider" v-if="ds_editNewObject" :items="serviceProviders" xs="6"  label="SERVICE PROVIDER" class="px-3" editMode="true" required="true" applyUnset="true" :error="serviceProviderError" />
                    <c-labeled-combo-filter v-model="datacenter"      v-if="ds_editNewObject" :items="datacenters"      xs="6"  label="DATACENTER"       class="px-3" editMode="true" required="true" applyUnset="true" :error="dataCenterError" />
                    <c-labeled-combo-filter v-model="resourceProfile" v-if="ds_editNewObject" :items="resourceProfiles" xs="12" label="RESOURCE PROFILE" class="px-3" editMode="true" required="true" applyUnset="true" :error="resourceProfileError" />
                </v-layout>
            </v-layout>
            <v-layout row wrap class="mt-2">
                <c-labeled-textArea class="px-3" xs='12' label="COMMENT" v-model="item.comment" :editMode="ds_editMode"/>
            </v-layout>
        </c-group>

        <c-group caption="Allowed" class="gd-prp-allowed">
            <v-layout row wrap class="mt-1">
                <c-labeled-checkbox class="px-6 mt-1 label-bigger-font-size" :isDisable="!ds_editMode" cbid="ds-vms" label="VMS" v-model="item.appliedTypeId.isVirtualMachine"/>
            </v-layout>
            <v-layout row wrap class="mt-1">
                <c-labeled-checkbox class="px-6 mt-1 label-bigger-font-size" :isDisable="!ds_editMode" cbid="ds-templates" label="Templates" v-model="item.appliedTypeId.isTemplate"/>
            </v-layout>
            <v-layout row wrap class="mt-1">
                <c-labeled-checkbox class="px-6 mt-1 label-bigger-font-size" :isDisable="!ds_editMode" cbid="ds-media" label="Media" v-model="item.appliedTypeId.isMediaImage"/>
            </v-layout>
        </c-group>

       <v-footer v-if="ds_editMode" padless class="fw-m px-4 py-3 justify-space-between border-top grey100-border blue050-b sticky-footer">
            <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-close" @click="close"    :disabled="disableInput" outlined><span class="blue900">Cancel</span></v-btn>
            <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-apply" @click="applyChanges" :loading="disableInput">{{ ds_editNewObject ? 'Create':'Apply' }}</v-btn>
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
            errors     : {
                name          : false,
                storageTypeId : false,
            },
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

        ds_editNewObject:{
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
        ...mapGetters([
            'ds_showProperty', 'ds_edited', 'ds_editMode', 'ds_editedApplying', 'ds_editNewObject', 
            'lctn_serviceProviders', 'lctn_defaultResourceProfile', 'dst_itemsAll']),
        
        types(){
            return this.dst_itemsAll.map(m=>{ return {code: m.id, name: m.name}});
        },

        title(){
            return this.ds_editMode ? this.ds_edited.prep.oldName : this.ds_showProperty.name;
        },

        item(){
            return this.ds_editMode ? this.ds_edited : this.ds_showProperty;
        },

        disableInput(){
            return this.ds_editedApplying;
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
        ...mapActions(['ds_setEdited', 'ds_applyChangesConfirm', 'ds_setShowProperty']),

        checkForError(){
            for(let err in this.errors){
                if(isNullOrUndefined(this.item[err]) || this.item[err] == ''){
                    this.errors[err] = true;
                    this.hasError = true;
                }else{
                    this.errors[err] = false;
                }
            }
        },

        editClick(){
            if(this.ds_editMode)
                this.ds_setEdited(); // убираем объект из редактора
            else
                this.ds_setEdited(this.ds_showProperty.id)
        },
        
        close(){
            if(this.ds_editMode && !this.ds_editNewObject)
            {
                this.ds_setShowProperty(this.ds_showProperty.id);
                return;
            }
            this.ds_setShowProperty();
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

            if(this.serviceProviderError || this.dataCenterError || this.resourceProfileError){
                showMessage('inputError');
                return;
            }

            if(!this.hasError){
                this.item.resourceProfileId = this.resourceProfile;
                this.ds_applyChangesConfirm();
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
.ds-prop
    min-height 100vh
</style>
