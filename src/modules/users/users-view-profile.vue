<template>
    <div v-if="!isNullOrUndefined(item)"> 
        <v-toolbar flat  class="toolbar-ext border-bottom grey100-border pl-4"> 
            <v-toolbar-title>
                <span class="fs-m grey800">Edit <span class="fw-b">{{shortName}}</span> account </span>
            </v-toolbar-title>
        </v-toolbar>
        <v-card flat style="height: calc(100vh - 115px);">
        <v-card flat class="pl-10" style="overflow-x: hidden; height: calc(100vh - 115px - 85px);">

            <!--  Person  -->
            <v-layout row wrap class="pt-4 pb-8">
                <v-flex xs2 class="justify-end">
                    <v-card flat tile>
                        <v-card-text >
                            <span class="prop-group-title blue500 fs-ml">Person</span>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs10>
                    <form autocomplete="off">
                    <v-layout class="flex-row" row wrap>
                        <v-card flat tile class="ml-4 d-flex">
                            <c-labeled-field class="mx-2 advanced-editor-col-1 gd-usrProfile-lastName" xs="6" label="LAST NAME"   v-model="item.lastName"   :editMode="editMode" :masked="true" mask="justLetters"/>
                            <c-labeled-field class="mx-2 advanced-editor-col-1 gd-usrProfile-firstName" xs="6" label="FIRST NAME"  v-model="item.firstName"  :editMode="editMode" :masked="true" mask="justLetters"/>
                            <c-labeled-field class="mx-2 advanced-editor-col-1 gd-usrProfile-middleName" xs="6" label="MIDDLE NAME" v-model="item.middleName" :editMode="editMode" :masked="true" mask="justLetters"/>
                        </v-card>
                    </v-layout>
                    </form>
                    <v-layout class="flex-row mt-2" row wrap>
                        <v-card flat tile class="ml-4 d-flex">
                            <c-labeled-field class="mx-2 advanced-editor-col-1 gd-usrProfile-login" label="LOGIN" inputname="login" :editMode="editMode" v-model="item.login" :disabled="true"/>
                        </v-card>
                    </v-layout>            
                </v-flex>
            </v-layout>
            <v-divider></v-divider>

            <!--  Change Password  -->
            <v-layout row wrap class="pt-4 pb-8">
                <v-flex xs2 class="justify-end">
                    <v-card flat tile>
                        <v-card-text >
                            <span class="prop-group-title blue500 fs-ml">Change Password</span>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs10 class="gd-usrProfile-chngPass">
                    <v-layout class="flex-row" row wrap>
                        <v-card flat tile class="ml-4 d-flex">
                            <c-labeled-field class="mx-2 advanced-editor-col-1" label="CURRENT" :capsCheck="true" @caps="currentCapsChange" type="password" showButton="true" editMode="false" v-model="currentPassword"/>
                            <div v-show="currentCapsPressed" class="brown700 fs-m align-self-end pb-1 ml-2">CapsLock pressed</div>
                        </v-card>
                    </v-layout>      
    
                    <v-layout class="flex-row mt-2" row wrap>
                        <form autocomplete="off">
                            <v-card flat tile class="ml-4 d-flex">
                                <c-labeled-field class="mx-2 advanced-editor-col-1" label="PASSWORD" :capsCheck="true" @caps="newCapsChange" type="password" showButton="true" editMode="true" v-model="newPassword"/>
                                <c-labeled-field class="mx-2 advanced-editor-col-1" label="CONFIRM"  :capsCheck="true" @caps="newCapsChange" type="password" showButton="true" editMode="true" v-model="newPasswordConfirm" :error="!verifyPassword"/>
                                <div v-show="newCapsPressed" class="brown700 fs-m align-self-end pb-1 ml-2">CapsLock pressed</div>
                            </v-card>
                        </form>
                    </v-layout>

                    <v-layout class="flex-row" row wrap>
                        <v-card flat tile class="ml-4 d-flex">
                            <c-labeled-btn class="mx-2 advanced-editor-col-1 mt-4" value="Change password" :disabled="chng_pass_disabled" :active="!chng_pass_disabled" :hideIcon="true" editMode="true" @click="changePass()" />
                        </v-card>
                    </v-layout>  

                </v-flex>
            </v-layout>
            <v-divider></v-divider>

            <!--  Contacts  -->
            <v-layout row wrap class="pt-4 pb-8">
                <v-flex xs2 class="justify-end">
                    <v-card flat tile>
                        <v-card-text >
                            <span class="prop-group-title blue500 fs-ml">Contacts</span>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs10>
                    <v-layout class="flex-row" row wrap>
                    <v-card flat tile class="ml-4 d-flex">
                        <c-labeled-field class="mx-2 advanced-editor-col-1 gd-usrProfile-email" label="EMAIL" v-model="item.email" :editMode="editMode" :error="emailErr"/>
                    </v-card>
                    </v-layout>      
                </v-flex>
            </v-layout>
            <v-divider></v-divider>

             <!-- Groups 
            <v-layout row wrap class="pt-4 pb-8">
                <v-flex xs2 class="justify-end">
                    <v-card flat tile>
                        <v-card-text >
                            <span class="prop-group-title blue500 fs-ml">Groups</span>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs10>
                    <v-layout class="flex-row" row wrap>
                    <v-card flat tile class="ml-4 d-flex">
                        <c-labeled-combo-filter class="mx-2 advanced-editor-col-1" label="GROUP"  :items="groups"   editMode="true" applyUnset="true"/>
                        <v-btn flat tile icon height="24" width="24" style="margin-top:18px"><i class="grey500-i icon-Create py-1"></i></v-btn>
                    </v-card>
                    </v-layout>
                    <v-layout class="flex-row" row wrap>
                        <v-card class="ml-4" flat tile v-if="tags.length>0">
                            <v-chip v-for="(chip, index) in tags" :key="index" @click:close="deleteTag(index)"
                                close 
                                close-icon="icon-Close blue700-i icomoon-important close-chips-button br-4" 
                                class="br-4 blue800 blue000-b fs-s fw-b px-2 mx-2 mt-2" 
                                style="height:24px;margin-top: 1px;"
                                >{{chip}}</v-chip>
                        </v-card>    
                    </v-layout>       
                </v-flex>
            </v-layout>
            <v-divider></v-divider> -->

            <!--  State  -->
            <!-- <v-layout row wrap class="pt-4 pb-8">
                <v-flex xs2 class="justify-end">
                    <v-card flat tile>
                        <v-card-text >
                            <span class="prop-group-title blue500 fs-ml">State</span>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs10>
                    <v-layout class="flex-row" row wrap>
                    <v-card flat tile class="ml-6 d-flex">
                        <c-labeled-slot label="LOCKED">
                            <c-labeled-checkbox class="pl-0 mt-1"  cbid="acc-blocked" v-model="item.isBlocked"/>
                        </c-labeled-slot>
                        
                    </v-card>
                    </v-layout>      
                </v-flex>
            </v-layout>
            <v-divider></v-divider> -->
        
        </v-card>
        <v-footer padless class="font-weight-medium px-4 py-3 border-top grey100-border sticky-footer" v-if="editMode">
            <v-spacer></v-spacer>
            <v-btn large color="primary" class="normal-text normal-text blue900 fw-b px-2 gd-usrProfile-close" outlined @click="cancelClick" ><span class="blue900">Cancel</span></v-btn>
            <v-btn large color="primary" class="normal-text normal-text px-2 fw-b ml-8 gd-usrProfile-apply" @click="applyClick">Apply</v-btn>
        </v-footer>
    </v-card>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    data(){
        return{
            item: null,
            currentPassword    : '',
            newPassword        : '',
            newPasswordConfirm : '',
            currentCapsPressed : false,
            newCapsPressed     : false,
            emailErr           : false,
        }
    },
    
    watch:{
        usr_currentUser:function(value) {
            this.item = Object.assign(clone(value)); 
        }
    },

    computed:{
        ...mapGetters(['usr_currentUser', 'usr_currentUserId']),

        chng_pass_disabled(){
            return this.currentPassword != '' && this.newPasswordConfirm == this.newPassword && this.newPassword != '' ? false : true;
        },

        verifyPassword(){
            return this.newPasswordConfirm == this.newPassword ? true : false;
        },

        editMode(){
            return this.permission('ft_usrUpdate');
        },

        shortName(){
            return this.item.prep.nameShort;
        }
    },

    methods:{
        ...mapActions(['usr_changePassword', 'usr_getItems', 'usr_updateProfile']),

        validateEmail(email) {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        },

        currentCapsChange(value){
            this.currentCapsPressed = value;
        },

        newCapsChange(value){
            this.newCapsPressed = value;
        },

        addTag(value){
            if(!this.tags.some(f=>f==value))
                this.tags.push(value);
        },

        deleteTag(index){
            this.tags.splice(index, 1);
        },

        changePass(){
            this.usr_changePassword({
                id: this.item.id,
                currentPassword : this.currentPassword,
                newPassword     : this.newPassword
            })
        },
        cancelClick()
        {
            this.$nav.navigateTo('vms');
        },

        applyClick(){
            if(!this.validateEmail(this.item.email)){
                this.emailErr = true;
                return;
            }
            this.emailErr = false;
            let self = this
            this.usr_updateProfile(this.item)
            .then(res=>{
                if(res && self.currentPassword != '' && self.newPasswordConfirm == self.newPassword && self.newPassword != ''){
                    self.usr_changePassword({
                        id: self.item.id,
                        currentPassword : self.currentPassword,
                        newPassword     : self.newPassword
                    })
                }
            })
            .catch(c=>{});
        }
    },

    created(){
        var self = this;
        this.usr_getItems();
    },
}
</script>