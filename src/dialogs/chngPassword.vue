<template>
    <d-dialog-basic :dialogId="id" maxWidth="410px">
        <v-card class="d-change-password pa-6 white-light confirm-dialog">
            <v-layout>
                <v-flex>
                    <v-card-text class="fs-l pa-0 grey700"> 
                        <v-layout><v-flex>
                            Change password for user <span class="blue700 fw-b">{{user.login}}</span>
                        </v-flex>
                        <v-flex class="d-change-password__close-btn-wrapper">
                            <v-btn icon tile text width="36" height="36" class="d-change-password__close-btn br-4" @click="cancelClick"><i class="grey500-i icon-Close icon-24"></i></v-btn>
                        </v-flex>
                        </v-layout>

                        <!-- <v-layout class="mt-4">
                            <c-labeled-field xs="7" label="CURRENT" :capsCheck="true" @caps="currentCapsChange" type="password" showButton="true" editMode="false" v-model="currentPassword"/>
                        </v-layout> -->

                        <v-layout class="mt-4">
                            <c-labeled-field xs="8" label="PASSWORD" :capsCheck="true" @caps="newCapsChange" type="password" showButton="true" editMode="true" v-model="newPassword"/>
                        </v-layout>

                        <v-layout class="mt-4">
                            <c-labeled-field xs="8" label="CONFIRM"  :capsCheck="true" @caps="newCapsChange" type="password" showButton="true" editMode="true" v-model="newPasswordConfirm" :error="!verifyPassword"/>
                        </v-layout>

                        <v-layout class="mt-4">
                            <div v-show="newCapsPressed || currentCapsPressed" class="brown700 fs-m align-self-end pb-1 ml-2">CapsLock pressed</div>
                        </v-layout>

                    </v-card-text>
                    <v-card-actions class="pa-0 mt-6">
                        <v-spacer/>
                        <v-btn class="normal-text white-light fs-ml elevation-0  blue900" small width="80" height="32" @click="cancelClick"> Cancel</v-btn>
                        <v-btn class="white--text blue700-b normal-text fs-ml elevation-0" small width="80" height="32" @click="clickYes"> Change</v-btn>
                    </v-card-actions>
                </v-flex>
            </v-layout>
        </v-card>
    </d-dialog-basic>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Vue from 'vue'
import dialogMixin from '@/dialogs/windows/windowMixin'


const component = Vue.extend({

    mixins: [ dialogMixin ],
    props: ['user'],

    data(){
        return{
            currentPassword    : '',
            newPassword        : '',
            newPasswordConfirm : '',
            currentCapsPressed : false,
            newCapsPressed     : false,
        }
    },

    computed:{
        verifyPassword(){
            return this.newPasswordConfirm == this.newPassword ? true : false;
        }
    },

    watch:{
        value: function(state){
            this.showDialog = value;
        },

        showDialog: function(state){
            if(!state)
                this.$emit('onClose', this.result);
        }
    },


    methods:{
        ...mapActions(['usr_changePassword']),

        currentCapsChange(value){
            this.currentCapsPressed = value;
        },

        newCapsChange(value){
            this.newCapsPressed = value;
        },

        clickYes(){
            if(!this.verifyPassword)
                return;
            this.usr_changePassword({
                        id: this.user.id,
                        currentPassword : this.currentPassword,
                        newPassword     : this.newPassword
                    });

            this.acceptClick();
        }
    },

    mounted(){
        this.showDialog = this.value;
    }

})

export function register(){
    Vue.prototype.$windows.registerDialog({ dialogCode: 'chngPassword', component})
}

export default component
</script>

<style lang="stylus" scoped>
.d-change-password
    border-radius: 0 !important
    &__close-btn-wrapper
        max-width: 36px
    &__close-btn
        margin-top: -6px
        margin-right: -6px
</style>