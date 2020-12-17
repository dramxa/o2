<template>
    <v-card class="org-prop" v-if="item!=null" tile>
        <v-toolbar fixed flat class="bg-gradient sticky-header" height="60px;">
            <v-toolbar-title class="font-white gd-prp-name">{{title}}</v-toolbar-title>
            <div class="flex-grow-1"></div>

            <v-btn tile :disabled="org_editMode" :text="org_editMode" :icon="!org_editMode" class="font-white br-4 gd-prp-edt-btn" @click="editClick" v-if="permissionObj('ft_orgUpdate', item.id)">
                <i v-if="!org_editMode" class="icon-Edit iconmoon-unset icon-24"></i>
            </v-btn>

            <v-btn tile icon class="font-white br-4 gd-prp-close" @click="close">
                <i class="icon-Close iconmoon-unset icon-24"></i>
            </v-btn>                
        </v-toolbar>

        <div v-show="!org_editMode" class="sticky-subheader white border-bottom blue050-border">
            <v-layout class="pa-2-5">
                <v-spacer></v-spacer>
                <v-btn text class="mr-2 px-2 custom-transform-class text-none grey900 normal-text gd-prp-impersonate" @click="impersonate()" >
                    <i class="org-prop__impersonate-icon mdi mdi-badge-account-outline grey500 mr-1 fs-ml"></i>Impersonate
                </v-btn>
                <v-menu offset-y left :close-on-content-click="false" width="218px">
                    <template v-slot:activator="{ on, value }">
                    <v-btn icon tile class="pa-0 br-4 ml-0-5 gd-prp-menu-btn" v-on="on" :class="{'grey100-b': value}" height="36" width="36">
                        <i class="grey500-i icon-Donner icon-16"></i>
                    </v-btn>
                    </template>
                    <v-list width="240px" class="control-combobox py-2 border blue050-border br-4 gd-prp-menu">
                        <v-list-item height="32px" class="fs-m gd-prp-menu-btn-lock" @click="changeLockState()"><i class="grey500-i icon-Lock icon-16 mr-2"></i>{{item.isBlocked ? 'Unlock': 'Lock'}}</v-list-item>
                        <v-divider class="my-1" />
                        <v-list-item height="32px" class="fs-m gd-prp-menu-btn-delete" @click="deleteClick()"><i class="grey500-i icon-trash icon-16 mr-2"></i>Delete</v-list-item>
                    </v-list>
                </v-menu>
            </v-layout>
        </div>


        <!-- <div v-show="!org_editMode" class="sticky-subheader white border-bottom blue050-border" v-if="permission('ft_tskRead')">
            <v-layout class="pa-2">
                <v-flex class="d-flex align-center px-2 py-3">
                    <div class="pointer px-1 normal-text fs-xs fw-b grey800 mr-2">
                        <span>Projects</span><div class="inline-block ml-1 grey100-b px-0-5 fs-xs default-border-radius">{{item.projectsCount}}</div>
                    </div>
                    <div class="pointer px-1 normal-text fs-xs fw-b grey800">
                        <span>Groups</span><div class="inline-block ml-1 grey100-b px-0-5 fs-xs default-border-radius">{{item.groupsCount}}</div>
                    </div>
                </v-flex>
                <v-spacer></v-spacer>
                <v-btn text class="mr-2 px-1 custom-transform-class text-none grey900 normal-text" @click="goToTasks(false)" @click.middle="goToTasks(true)">
                    <i class="mr-1 icon-log icon-16 grey500-i"></i>View log
                </v-btn>
            </v-layout>
        </div> -->

        <c-group v-if="!org_editMode">
            <v-layout row wrap class="mt-2">
                <c-labeled-field class="px-3 gd-prp-created" xs="4"  label="CREATED"   v-model="item.prep.createDateFormatted"/>
                <v-flex xs4/>
                <c-labeled-field class="px-3 gd-prp-code" xs="4"  label="CODE"      v-model="item.code"/>
            </v-layout>            
            <v-layout row wrap class="mt-2">
                <c-labeled-field class="px-3 gd-prp-fullname" xs="12" label="FULL NAME" v-model="item.fullName"/>
            </v-layout>
            <v-layout row wrap class="mt-2">
                <c-labeled-slot label="STATUS" class="px-3 gd-prp-locked"  xs="12">
                    <c-labeled-checkbox class="pl-0 mt-1 label-bigger-font-size"  cbid="org-blocked" label="Locked" v-model="item.isBlocked"  isDisable="true"/>
                </c-labeled-slot>
            </v-layout>
        </c-group>

        <c-group v-if="org_editMode">
            <v-layout row wrap>
                <c-labeled-field class="px-3 gd-prp-edt-code" xs="12" label="CODE"      v-model="item.code"     :editMode="org_editMode" required="true" :error="errors.code"  v-if="org_editNewObject" :masked="true" mask="noFirstDigits" />
                <c-labeled-field class="mt-2 px-3 gd-prp-edt-name" xs="12" label="NAME"      v-model="item.name"     :editMode="org_editMode" required="true" :error="errors.name"/>
                <c-labeled-field class="mt-2 px-3 gd-prp-edt-fullname" xs="12" label="FULL NAME" v-model="item.fullName" :editMode="org_editMode" required="true" :error="errors.fullName"/>
                <c-labeled-slot  class="mt-2 px-3 gd-prp-edt-locked" xs="12" label="STATUS">
                    <c-labeled-checkbox class="pl-0 mt-1 label-bigger-font-size" cbid="org-blocked" label="Locked" v-model="item.isBlocked"/>
                </c-labeled-slot>
            </v-layout>
        </c-group>

        <c-group caption="Meta data" class="gd-prp-comment">
            <v-layout row wrap>
                <c-labeled-textArea class="px-3" xs="12" label="COMMENT" v-model="item.comment" :editMode="org_editMode"/>
            </v-layout>
            <v-layout row wrap class="mt-2" v-if="!org_editMode && !isNullOrUndefined(item.userName) && !isNullOrUndefined(item.userPassword)">
                <c-labeled-field class="px-3" xs="12"  label="VC USERNAME"     v-model="item.userName"/>
            </v-layout>             
        </c-group>

        <v-footer v-if="org_editMode" padless class="font-weight-medium px-4 py-3 justify-space-between blue050-b border-top grey100-border sticky-footer">
               <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-close" @click="close"        :disabled="disableInput" outlined><span class="blue900">Cancel</span></v-btn>
               <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-apply" @click="applyChanges" :loading ="disableInput">{{ org_editNewObject ? 'Create':'Apply' }}</v-btn>
       </v-footer>
    </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Vue from 'vue';

export default {  
    data(){
        return{
            hasError   : false,
            firstCheck : true,
            errors     : {
                name     : false,
                code     : false,
                fullName : false
                
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
        org_editNewObject:{
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
    
    computed:{
        ...mapGetters(['org_showProperty', 'org_edited', 'org_editMode', 'org_editedApplying', 'org_editNewObject', 'org_setLockState']),

        title(){
            return this.org_editMode ? this.org_edited.prep.oldName : this.org_showProperty.name;
        },

        item(){
            return this.org_editMode ? this.org_edited : this.org_showProperty;
        },

        disableInput(){
            return this.org_editedApplying;
        },
    },

    methods:{
        ...mapActions(['org_setEdited', 'org_applyChangesConfirm', 'org_setShowProperty', 'org_deleteConfirm']),

        impersonate(){
            this.$nav.navigateToNewWindow(`/?impersonate=${this.item.id}&organization=${encodeURI(this.item.name)}`, true);
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
            if(this.org_editMode)
                this.org_setEdited(); // убираем объект из редактора
            else
                this.org_setEdited(this.org_showProperty.id)
        },

        close(){
            if(this.org_editMode && !this.org_editNewObject)
            {
                this.org_setShowProperty(this.org_showProperty.id);
                return;
            }
            this.org_setShowProperty();
        },

        applyChanges(){
            this.firstCheck = false;
            this.hasError = false;
            this.checkForError();

            if(!this.hasError){
                this.org_applyChangesConfirm();
            }else{
                showMessage('inputError');
            }
        },

        goToTasks(newWindow){
            this.$nav.navigateTo('tasks', { use: true, objectName: this.item.id }, newWindow)
        },

        changeLockState(){
            this.org_setLockState({ item: this.item, lockState: !this.item.isBlocked })
        },

        deleteClick(){
            this.org_deleteConfirm(this.item);
        },
    }
}
</script>
<style lang="stylus" scoped>
.org-prop
    min-height 100vh
    &__impersonate-icon
        margin-top -2px
</style>