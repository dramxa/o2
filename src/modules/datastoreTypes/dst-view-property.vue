<template>
    <v-card class="dst-prop" v-if="item!=null" tile>
        <v-toolbar fixed flat class="bg-gradient sticky-header" height="60px;">
            <v-toolbar-title class="font-white gd-prp-name">{{title}}</v-toolbar-title>
            <div class="flex-grow-1"></div>

            <v-btn tile :disabled="dst_editMode" :text="dst_editMode" :icon="!dst_editMode" class="font-white br-4 gd-prp-edt-btn" @click="editClick"  v-if="permissionObj('ft_netUpdate', item.id)">
                <i v-if="!dst_editMode" class="icon-Edit iconmoon-unset icon-24"></i>
            </v-btn>

            <v-btn tile icon class="font-white br-4 gd-prp-close" @click="close">
                <i class="icon-Close iconmoon-unset icon-24"></i>
            </v-btn>              
        </v-toolbar>
         <!-- -->

        <div v-show="!dst_editMode" class="sticky-subheader white border-bottom blue050-border" v-if="permission('ft_tskRead')">
            <v-layout class="pa-2 py-2-5">
                <v-spacer></v-spacer>
                <v-btn text class="mr-2 px-1 py-0 custom-transform-class text-none grey900 normal-text" @click="goToTasks(false)" @click.middle="goToTasks(true)">
                    <i class="mr-1 icon-log icon-16 grey500-i"></i>View log
                </v-btn>
            </v-layout>
        </div>

        <c-group>
            <v-layout row wrap class="mt-2">
                <c-labeled-field class="px-3 gd-prp-name mb-1" v-if="dst_editMode" xs="12" label="NAME" v-model="item.name" :editMode="dst_editMode" :disabled="disableInput" required="true" :error="errors.name" />
                <c-labeled-field class="px-3 gd-prp-code" xs="12" label="CODE" v-model="item.code" :editMode="dst_editMode" :disabled="disableInput" required="true" :error="errors.code" :masked="true" mask="justCapsLetters" />
            </v-layout>
        </c-group>

        <c-group caption="Meta data" class="gd-prp-description">
            <v-layout row wrap>
                <c-labeled-textArea class="px-3" xs='12' label="DESCRIPTION" v-model="item.description" :editMode="dst_editMode"/>
            </v-layout>
        </c-group>

       <v-footer v-if="dst_editMode" padless class="font-weight-medium px-4 py-3 justify-space-between border-top grey100-border blue050-b sticky-footer">
            <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-close" @click="close"    :disabled="disableInput" outlined><span class="blue900">Cancel</span></v-btn>
            <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-apply" @click="applyChanges" :loading="disableInput">{{ dst_editNewObject ? 'Create':'Apply' }}</v-btn>
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
                name         : false,
                code         : false,
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

        dst_editNewObject:{
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
        ...mapGetters(['dst_showProperty', 'dst_edited', 'dst_editMode', 'dst_editedApplying', 'dst_editNewObject', 'lctn_serviceProviders', 'lctn_defaultResourceProfile']),

        title(){
            return this.dst_editMode ? this.dst_edited.prep.oldName : this.dst_showProperty.name;
        },

        item(){
            return this.dst_editMode ? this.dst_edited : this.dst_showProperty;
        },

        disableInput(){
            return this.dst_editedApplying;
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
        ...mapActions(['dst_setEdited', 'dst_applyChangesConfirm', 'dst_setShowProperty']),

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
            if(this.dst_editMode)
                this.dst_setEdited(); // убираем объект из редактора
            else
                this.dst_setEdited(this.dst_showProperty.id)
        },
        
        close(){
            if(this.dst_editMode && !this.dst_editNewObject)
            {
                this.dst_setShowProperty(this.dst_showProperty.id);
                return;
            }
            this.dst_setShowProperty();
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
                this.dst_applyChangesConfirm();
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
.dst-prop
    min-height 100vh
</style>
