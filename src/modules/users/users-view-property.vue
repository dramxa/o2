<template>
    <v-card class="usr-prop" v-if="item!=null" tile>
        <v-toolbar fixed flat class="bg-gradient sticky-header" height="60px;">
            <v-toolbar-title class="font-white">{{title}}</v-toolbar-title>
            <div class="flex-grow-1"></div>

            <v-btn tile :disabled="usr_editMode" :text="usr_editMode" :icon="!usr_editMode" class="font-white br-4" @click="editClick" v-if="permissionObj('ft_usrUpdate', item.id)">
                <i v-if="!usr_editMode" class="icon-Edit iconmoon-unset icon-24"></i>
            </v-btn>

            <v-btn tile icon class="font-white br-4 gd-prp-close" @click="close">
                <i class="icon-Close iconmoon-unset icon-24"></i>
            </v-btn>                
        </v-toolbar>

        <div v-show="!usr_editMode" class="sticky-subheader white border-bottom blue050-border" v-if="anyPermission(['ft_usrUpdate', 'ft_tskRead', 'ft_usrDelete'])">
            <v-layout class="pa-2-5">
                <v-spacer></v-spacer>
                <v-btn text class="mr-2 px-2 custom-transform-class text-none grey900 normal-text" v-if="permission('ft_usrUpdate')" @click="changePassword(item)" >
                    <i class="mdi mdi-key-variant grey500 mr-1 fs-ml"></i>Change password
                </v-btn>
                <v-menu offset-y left :close-on-content-click="false" width="218px">
                    <template v-slot:activator="{ on, value }">
                    <v-btn icon tile class="pa-0 br-4 ml-0-5" v-on="on" :class="{'grey100-b': value}" height="36" width="36">
                        <i class="grey500-i icon-Donner icon-16"></i>
                    </v-btn>
                    </template>
                    <v-list width="240px" class="control-combobox py-2 border blue050-border br-4">
                        <v-list-item height="32px"  v-if="permission('ft_usrUpdate')" class="fs-m" @click="changeLockState(item)">{{item.isBlocked ? 'Unlock': 'Lock'}}</v-list-item>
                        <v-divider class="my-1"     v-if="permission('ft_usrUpdate')"/>
                        <v-list-item height="32px"  v-if="permission('ft_tskRead')" class="fs-m" @click="goToTasks(false)"  @click.middle="goToTasks(true)">View log</v-list-item>
                        <v-divider class="my-1"     v-if="permission('ft_tskRead')"/>
                        <v-list-item height="32px"  v-if="permission('ft_usrDelete')" class="fs-m" @click="deleteClick()"><i class="grey500-i icon-trash mr-2"></i>Delete</v-list-item>
                    </v-list>
                </v-menu>
            </v-layout>
        </div>
        <div v-bar :class="[usr_editMode ? 'usr-prop--editable' :'usr-prop--non-editable']">
        <div>
        <div class="border-box">

        <c-group v-if="!usr_editMode">
            <v-layout row wrap class="mt-2">
                <c-labeled-field class="px-3" xs="6"  label="CREATED"   v-model="item.prep.createDateFormatted"/>
                <c-labeled-field class="px-3" xs="6"  label="LOGIN"      v-model="item.login"/>
            </v-layout>
        </c-group>

        <c-group caption="Person" v-if="!usr_editMode">
            <v-layout row wrap class="mt-2">
                <c-labeled-field class="pl-3 pr-2" xs="6"  label="FIRST NAME"  v-model="item.firstName" :editMode="usr_editMode" :masked="true" mask="justLetters"/>
                <c-labeled-field class="pr-3 pl-2" xs="6"  label="LAST NAME"   v-model="item.lastName"  :editMode="usr_editMode" :masked="true" mask="justLetters"/>
            </v-layout>            
            <v-layout row wrap class="mt-2">
                <c-labeled-field class="px-3"      xs="12" label="MIDDLE NAME" v-model="item.middleName" :editMode="usr_editMode" :masked="true" mask="justLetters"/>
            </v-layout>
        </c-group>

        <c-group caption="Contacts" v-if="!usr_editMode">
            <v-layout row wrap class="mt-2">
                <c-labeled-field class="px-3 mt-2" xs="12" label="EMAIL" v-model="item.email"/>
            </v-layout>            
            <v-layout row wrap class="mt-2">
                <c-labeled-slot label="STATUS" class="px-3"  xs="12">
                    <c-labeled-checkbox class="pl-0 mt-1 label-bigger-font-size"  cbid="usr-blocked" label="Locked" v-model="item.isBlocked" isDisable="true"/>
                </c-labeled-slot>
            </v-layout>
        </c-group>

        <c-group v-if="usr_editMode">
            <v-layout row wrap class="mt-2">
                <c-labeled-field class="pl-3 pr-2 gd-prp-edt-name" xs="6"  label="FIRST NAME"  v-model="item.firstName" :editMode="usr_editMode" :masked="true" mask="justLetters" required="true" :error="errors.firstName"/>
                <c-labeled-field class="pr-3 pl-2 gd-prp-edt-lastname" xs="6"  label="LAST NAME"   v-model="item.lastName"  :editMode="usr_editMode" :masked="true" mask="justLetters" required="true" :error="errors.lastName"/>
            </v-layout>            
            <v-layout row wrap class="mt-2">
                <c-labeled-field class="px-3 gd-prp-edt-middlename" xs="12" label="MIDDLE NAME" v-model="item.middleName" :editMode="usr_editMode" :masked="true" mask="justLetters"/>
            </v-layout>
        </c-group>

        <c-group v-if="usr_editMode">
            <v-layout row wrap >
                <c-labeled-field class="px-3 gd-prp-edt-email"      xs="12" label="EMAIL"     v-model="item.email"    :editMode="usr_editMode" required="true" :error="errors.email"/>
                <c-labeled-field class="px-3 mt-2 gd-prp-edt-login" xs="12" label="LOGIN"     v-model="item.login"    :editMode="usr_editMode" required="true" :error="errors.login" v-if="usr_editNewObject"/>
                <c-labeled-field class="px-3 mt-2 gd-prp-edt-password" xs="12" label="PASSWORD"  v-model="item.password" :editMode="usr_editMode" required="true" :error="errors.password" type="password" showButton="true" v-if="usr_editNewObject" :capsCheck="true" @caps="passCapsCheck"/>
                <div v-show="passCaps" class="xs-12 brown700 fs-m mt-2 px-3">CapsLock pressed</div>
            </v-layout> 
            <v-layout row wrap class="mt-2">
                <c-labeled-slot label="STATUS" class="px-3 gd-prp-edt-status"  xs="12">
                    <c-labeled-checkbox class="pl-0 mt-1 label-bigger-font-size"  cbid="usr-blocked" label="Locked" v-model="item.isBlocked"/>
                </c-labeled-slot>
            </v-layout>
        </c-group>

        <c-group caption="Roles" class="pt-1 gd-prp-roles" v-if="!isNullOrUndefined(item.roles) || usr_editMode">
            <template v-if="!usr_editMode">
                <v-layout v-for="(role, index) in item.roles" :key="index" row wrap>
                    <v-flex xs1 class="fs-m text-right pl-3 mt-2"><i class="icon-20 iconmoon grey500-i icon-Premissions1"></i></v-flex>
                    <c-labeled-field class="px-2 mt-2" xs="11" :value="rolesListKvp[role].name" label="" hideLabel="true" :editMode="false" />
                </v-layout>
            </template>
            <template  v-if="usr_editMode">
                <v-layout v-for="(role, index) in item.roles" row wrap :key="index">
                    <v-flex xs1 class="fs-m text-right pl-3 mt-2"><i class="icon-20 iconmoon grey500-i icon-Premissions1"></i></v-flex>
                    <c-labeled-field class="px-3 mt-2" xs="10" :value="rolesListKvp[role].name" label="" hideLabel="true" :editMode="false" />
                    <v-flex xs1 class="fs-m text-right pr-3 mt-2"><v-btn @click="deleteRole(index)" icon class="ml-1" width="20" height="20"><i class="icon-trash icon-16"></i></v-btn></v-flex>
                </v-layout>
                <v-layout>
                    <v-flex class="px-0">
                        <c-labeled-combo-filter class="pl-3 py-0" xs="12" label="Add new role" :editMode="true" :items="rolesList" v-model="newrole"  applyUnset="true" :excludeList="item.roles"/>
                    </v-flex>
                    <!-- <v-flex class="usr-prop__add-new-btn-wrapper align-self-end pl-0 pr-1 mr-1">
                        <v-btn icon @click="addNewRole()" height="24px" width="24px" class="grey300-border border br-2">
                            <i class="grey500-i icon-Create icon-14"></i>
                        </v-btn>
                    </v-flex> -->
                </v-layout>
            </template>
        </c-group>
        </div>
        </div>
        </div>

        <v-footer v-if="usr_editMode" padless class="font-weight-medium px-4 py-3 justify-space-between blue050-b border-top grey100-border sticky-footer">
               <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-close" @click="close"        :disabled="disableInput" outlined><span class="blue900">Cancel</span></v-btn>
               <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-apply" @click="applyChanges" :loading ="disableInput">{{ usr_editNewObject ? 'Create':'Apply' }}</v-btn>
       </v-footer>
    </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Vue from 'vue';

export default {  

    data(){
        return {
            hasError   : false,
            firstCheck : true,
            newrole    : null,
            passCaps   : false,
            errors     : {
                    login     : false,
                    firstName : false,
                    lastName  : false,
                    email     : false,
                    password  : false
            },
        }
    },

    computed:{
        ...mapGetters(['usr_showProperty', 'usr_edited', 'usr_editMode', 'usr_editedApplying', 'usr_editNewObject', 'role_itemsAll']),

        title(){
            if(this.usr_editNewObject)
              return 'Create User';

            var item = this.usr_editMode ? this.usr_edited  :  this.usr_showProperty;
            return item.lastName + ' ' + item.firstName + ' ' + item.middleName
        },

        item(){
            return this.usr_editMode ? this.usr_edited : this.usr_showProperty;
        },

        disableInput(){
            return this.usr_editedApplying;
        },

        rolesListKvp(){
            return !isNullOrUndefined(this.role_itemsAll) ? this.role_itemsAll.reduce((r, e)=>{ r[e.id] = e; return r; }, {}) : {};
        }, 

        rolesList(){
            let rl = [];
            if(!isNullOrUndefined(this.role_itemsAll))
                rl = this.role_itemsAll.map(role=>{ return { code: role.id, name: role.name }});                
            return rl;
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

        usr_editNewObject:{
            //обнуляем все ошибки при переходе к созданию нового объекта во время редактирования существующего
            handler:function(){ 
                this.firstCheck = true;
                for(let err in this.errors){
                    this.hasError = false;
                    this.errors[err] = false;
                }
            }
        },

        newrole:function(){
            this.addNewRole();
        }
    },

    methods:{
        ...mapActions(['usr_setEdited', 'usr_applyChangesConfirm', 'usr_setShowProperty', 'usr_deleteConfirm', 'usr_setLockState']),

        validateEmail(email) {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        },

        changePassword(){
            this.$windows.showDialog({
                dialogCode: 'chngPassword',
                props: { user: this.item },
                onAccept: function(){  }
            });
        },

        changeLockState(){
            this.usr_setLockState({ item: this.item, lockState: !this.item.isBlocked })
        },

        deleteClick(){
            this.usr_deleteConfirm(this.item);
        },

        passCapsCheck(value){
            this.passCaps = value
        },

        addNewRole(newRole){
            if(this.newrole != null){
                if(isNullOrUndefined(this.item.roles))
                    Vue.set(this.item, 'roles', []);
                this.item.roles.push(this.newrole);
                this.newrole = null;
            }
        },

        deleteRole(i){
            this.item.roles.splice(i,1);
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
            if(!this.validateEmail(this.item.email)){
                this.hasError = true;
                this.errors.email = true;
            }
        },

        editClick(){
            if(this.usr_editMode)
                this.usr_setEdited(); // убираем объект из редактора
            else
                this.usr_setEdited(this.usr_showProperty.id)
        },

        close(){
            if(this.usr_editMode && !this.usr_editNewObject)
            {
                this.usr_setShowProperty(this.usr_showProperty.id);
                return;
            }
            this.usr_setShowProperty();
        },

        applyChanges(){
            this.firstCheck = false;
            this.hasError = false;
            this.checkForError();

            if(!this.hasError){
                this.usr_applyChangesConfirm()
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
.usr-prop
    min-height:100vh
    &--editable
        height calc(100vh - 60px - 69px)
    &--non-editable
        height calc(100vh - 60px - 57px)
    &__add-new-btn-wrapper
        max-width 30px
</style>

