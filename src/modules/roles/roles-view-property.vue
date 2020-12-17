<template>
    <v-card class="role-prop" v-if="item!=null" tile>
        <v-toolbar fixed flat class="bg-gradient sticky-header" height="60px;">
            <v-toolbar-title class="font-white gd-prp-name">{{title}}</v-toolbar-title>
            <div class="flex-grow-1"></div>

            <v-btn tile :disabled="role_editMode" :text="role_editMode" :icon="!role_editMode" class="font-white br-4 gd-prp-edt-btn" @click="editClick" v-if="permissionObj('ft_roleUpdate', item.id) && !item.isSystem">
                <i v-if="!role_editMode" class="icon-Edit iconmoon-unset icon-24"></i>
            </v-btn>

            <v-btn tile icon class="font-white br-4 gd-prp-close" @click="close">
                <i class="icon-Close iconmoon-unset icon-24"></i>
            </v-btn>              
        </v-toolbar>
         <!-- -->

        <div v-show="!role_editMode" class="sticky-subheader white border-bottom blue050-border" v-if="permission('ft_tskRead')">
            <v-layout class="pa-2-5">
                <v-spacer></v-spacer>
                <v-btn text class="mr-2 px-1 custom-transform-class text-none grey900 normal-text" @click="goToTasks(false)" @click.middle="goToTasks(true)">
                    <i class="mr-1 icon-log icon-16 grey500-i"></i>View log
                </v-btn>
            </v-layout>
        </div>
        <div v-bar ref="role-property" :class="[role_editMode ? 'role-prop--editable' : 'role-prop--non-editable']">
        <div>
        <div class="border-box">
        <c-group>
            <v-layout row wrap class="mt-2">
                <c-labeled-field v-if="role_editMode" class="px-3 mt-1 gd-prp-edt-name" xs="12" label="NAME" v-model="item.name" :editMode="role_editMode" required="true" :error="errors.name" />
                <c-labeled-field v-if="!role_editMode" class="px-3 gd-prp-created" xs="12" label="CREATED" v-model="item.prep.createDateFormatted"/>
            </v-layout>
            <v-layout row wrap class="mt-2">
                <c-labeled-slot label="SYSTEM" class="px-3 gd-prp-system"  :xs="glb_permissionPA ? 6 : 12">
                    <c-labeled-checkbox class="pl-0 mt-1 label-bigger-font-size" :isDisable="true" cbid="rol-system"  label="Locked" v-model="item.isSystem"/>
                </c-labeled-slot>
                <c-labeled-slot label="SERVICE" class="px-3 gd-prp-service" v-if="glb_permissionPA" xs="6">
                    <c-labeled-checkbox class="pl-0 mt-1 label-bigger-font-size" :isDisable="true" cbid="rol-service" label="Private" v-model="item.isSerivce"/>
                </c-labeled-slot>
            </v-layout>
            <v-layout row wrap class="mt-2">
                <c-labeled-textArea class="px-3 gd-prp-description" xs="12" label="DESCRIPTION" v-model="item.description" :editMode="role_editMode" />
            </v-layout>
        </c-group> 

        <c-group caption="Permissions" v-if="permissions.length">
            <v-layout row wrap class="mt-1" v-for="(perm, index) in permissions" :key="index">
                <c-labeled-field class="px-3" xs="12" label="" :hideLabel="true" :editMode="false" :value="perm"/>
            </v-layout>
            <c-labeled-btn v-if="role_editMode" xs="12" class="px-2 mt-4" value="Role dialog" :editMode="true" @click="editRole()"></c-labeled-btn>
        </c-group> 
        
        </div>
        </div>
        </div>
       <v-footer v-show="role_editMode" padless class="font-weight-medium px-4 py-3 justify-space-between blue050-b border-top grey100-border sticky-footer">
               <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-close" @click="close"    :disabled="disableInput" outlined><span class="blue900">Cancel</span></v-btn>
               <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-apply" @click="applyChanges" :loading="disableInput">{{ role_editNewObject ? 'Create':'Apply' }}</v-btn>
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
            permissions: [],
            errors     : {
                name     : false,
            }
        }
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
    },

    computed:{
        ...mapGetters(['role_showProperty', 'role_edited', 'role_editMode', 'role_editedApplying','role_editNewObject', 'glb_permissionPA']),

        serviceProviders(){
            return this.lctn_serviceProviders;
        },


        title(){
            return this.role_editMode ? this.role_edited.prep.oldName : this.role_showProperty.name;
        },

        item(){
            return this.role_editMode ? this.role_edited : this.role_showProperty;
        },

        limitsItems(){
            return Object.keys(this.limitCodes).map((k,i)=>{ return {code: k, name: this.limitCodes[k].name}});
        },

        disableInput(){
            return this.role_editedApplying;
        }
        
    },

    methods:{
        ...mapActions(['role_setEdited', 'role_applyChangesConfirm', 'role_setShowProperty']),

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

        editRole(){

            var self = this;
            Vue.prototype.$windows.showDialog({
                dialogCode: 'editPermissionDialog',
                
                props: {
                    role: this.item.name
                },

                }        
            );      
        },

        formatDate(date){
            return formatDate(date);
        },

        localePrice(a,b){
           return localePrice(a,b);
        },

        editClick(){
            if(this.role_editMode)
                this.role_setEdited(); // убираем объект из редактора
            else
                this.role_setEdited(this.role_showProperty.id)
        },
        
        close(){
            if(this.role_editMode && !this.role_editNewObject)
            {
                this.role_setShowProperty(this.role_showProperty.id);
                return;
            }
            this.role_setShowProperty();
        },

        applyChanges(){
            this.item.resourceProfileId = this.resourceProfile;
            // let limArr = [];
            // this.limitsItemsEdited.forEach(i => {
            //     limArr.push({code: i.code, isActive: i.isActive, value: i.value });
            // });
            // this.item.limitItems = limArr;
            this.firstCheck = false;
            this.hasError = false;
            this.checkForError();

            if(!this.hasError){
                this.role_applyChangesConfirm();
            }else{
                showMessage('inputError');
            }
        },

        goToTasks(newWindow){
            this.$nav.navigateTo('tasks', { use: true, objectName: this.item.id }, newWindow)
        }

    },

}
</script>
<style lang="stylus" scoped>
.role-prop
    min-height:100vh
    &--editable
        height calc(100vh - 60px - 69px)
    &--non-editable
        height calc(100vh - 60px)
</style>
