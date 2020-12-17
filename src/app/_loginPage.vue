<template>
<v-container fluid class="login-bg d-flex" >
    <div class="login-page-logo-fixed"></div>
    <div style="position:absolute;top:110px;left:0;" v-if="glb_impersonatedOrgName!=''">
        <div class="px-4 text-center grey900">Impersonate to organization</div>
        <div class="px-4 mt-1 py-2 grey900 fw-b text-center" style="background-color: rgb(255, 216, 0);">{{glb_impersonatedOrgName}}</div>
    </div>
    <v-col cols="6" class="d-flex align-center justify-space-around">
        <!-- loading -->
        <v-card height="300px" flat class="pa-5 content-block">
        <div v-if="isLoading">
            <!-- <img src="@/assets/logo.svg" alt="LogoO2" style="width:100%;"> -->
            <p class="fs-m blue800 text-center mt-12 pt-12 mb-2" >Loading authorization data...</p>
            <v-progress-linear class="blue600 login-progressbar" indeterminate rounded height="4"></v-progress-linear>
        </div>

        <!--  login -->
        <div v-if="showLoginForm">
            <form>
                <div class="fs-xl fw-b blue700 pl-5 mb-6">Welcome</div>
                <c-labeled-field label="Username" inputName="login"    isAutocomplete="username" v-model="username" :error="isAuthFalure" editMode="true" @onPressEnter="loginClick"></c-labeled-field>
                <c-labeled-field label="Password" inputName="password" isAutocomplete="password" v-model="password" :error="isAuthFalure" editMode="true" type="password" @onPressEnter="loginClick" :capsCheck="true" @caps="passCapsCheck"></c-labeled-field>
                <div :class="{'visibility-hidden' : !passCaps}" class="brown700 fs-m mt-2">CapsLock pressed</div>
                <v-flex class="mt-2">
                    <v-btn @click="loginClick" height="24" width="70" type="submit" class="blue050 blue700-b normal-text fw-b fs-s">Login</v-btn>
                    <!-- <router-link class="blue700 normal-text fs-s pl-4 decoration-none" to="/login/reset">Forgot your password?</router-link> -->
                </v-flex>
                <p v-if="isAuthFalure" class="fs-s red500 ml-5 mt-6">There is no user with this username</p>
            </form>
        </div>

        <!-- reset 1 step -->
        <div v-if="showReset1StepForm">
            <div class="fs-xl fw-b blue700 pl-5 mb-6">Reset password</div>
            <c-labeled-field label="Username/Email" :error="isResetUserFailure" editMode="true"></c-labeled-field>
            <v-btn @click="resetSendClick" height="24" width="70" class="blue050 blue700-b normal-text fw-b fs-s mx-5 mt-6">Send</v-btn>
            <p class="fs-s mx-5 mt-6" v-if="isResetLinkSended">Reset link was sended to your email</p>
            <p :error="isResetUserFailure" class="fs-s red500 mx-5 mt-6" v-if="isResetUserFailure">There is no user or email</p>
        </div>

        <!-- reset 2 step -->
        <div v-if="showReset2StepForm">
            <div class="fs-xl fw-b blue700 pl-5 mb-6">Set new password</div>
            <c-labeled-field label="New password" editMode="true"></c-labeled-field>
            <c-labeled-field label="Confirm password" editMode="true"></c-labeled-field>
            <v-btn @click="resetApplyClick" height="24" width="70" class="blue050 blue700-b normal-text fw-b fs-s mx-5 mt-6">Apply</v-btn>
        </div>

        <!-- service unavailable -->
        <div v-if="isServiceUnavailable" class="blue700 fs-xxl fw-b">Service unavailable</div>
        </v-card>
    </v-col>
    </v-container>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default {
    data(){
        return{
            username: "",
            password: "",

            resetCode: "",

            isLoginMode      : false,
            isAuthFalure     : false,

            isReset1StepMode  : false,
            isResetLinkSended : false,
            isResetUserFailure: false,

            isReset2StepMode : false,

            isLoading            : false,
            isServiceUnavailable : false,

            temp: 0,

            passCaps : false,
        }
    },

    computed:{
        ...mapGetters(['glb_impersonatedOrgId', 'glb_impersonatedOrgName']),

        showLoginForm(){ return !this.isLoading && !this.isServiceUnavailable && this.isLoginMode; },
        showReset1StepForm(){ return !this.isLoading && !this.isServiceUnavailable && this.isReset1StepMode; },
        showReset2StepForm(){ return !this.isLoading && !this.isServiceUnavailable && this.isReset2StepMode; }
    },

    methods:{

        showUnsupportDialog(){
            Vue.prototype.$windows.showDialog({

                dialogCode: 'confirmDialog', // тип выводимого окна (вьюха)
        
                props: {
                    textConst    : 'unsupportedBrowser',       // константа текста
                    okClick      : true,
                    objArray     :  ['Chrome', 'Firefox', 'Safari']  
                },

            })
        },

        passCapsCheck(value){
            this.passCaps = value
        },

        timeout(ms){
           return new Promise(resolve => setTimeout(resolve, ms));
        },

        resetApplyClick(){
            // send to srv code
            this.$router.push({ path: '/login' })
        },

        loginClick(){
            this.isAuthFalure = false;
            this.isLoading = true;
            Vue.prototype.$auth.login(this.username, this.password)
                .then(res=>{
                    this.isLoading = false;
                    if(this.glb_impersonatedOrgId!=''){
                        let impersonate = `?impersonate=${this.glb_impersonatedOrgId}`
                        if(this.glb_impersonatedOrgName!='')
                            impersonate += `&organization=${encodeURI(this.glb_impersonatedOrgName)}`
                        let url = location.origin;
                        location.href = url + impersonate;
                    }
                    else
                        this.$router.push({ path: '/' });
                })
                .catch(res=>{
                    this.isLoading = false;
                    if(res.code!=500){
                        this.isAuthFalure = true;
                    }
                    else{
                        this.isServiceUnavailable = true;                        
                        this.timeout(3000)
                            .then(k=>this.isServiceUnavailable=false);
                    }

                });            
        },

        resetSendClick(){
            if(this.temp == 0){
                this.temp = 1;
                this.isResetUserFailure = true;
                return;
            }
            if(this.temp == 1){
                this.temp = 2;
                this.isResetUserFailure = false;
                this.isResetLinkSended = true;
                return;
            }
            if(this.temp == 2){
                this.temp = 0;
                this.$router.push({ path: '/login/reset/link-to-reset' })
                return;
            }
        },

        readUrl(){
            this.isLoginMode      = false;
            this.isReset1StepMode = false;
            this.isReset2StepMode = false;
            var route = this.$route;
            var mode = "";
            let sectArray = route.fullPath.split('/');
            if(sectArray.length >= 2)
                mode = sectArray[2];

            if(mode=='enter')
                this.isLoginMode = true;

            if(mode=="reset")
            {
                if(isNullOrUndefined(route.params['resetCode']))
                {
                    this.isReset1StepMode = true;
                }else{
                    this.isReset2StepMode = true;
                    this.resetCode = route.params['resetCode'];
                }          
            } 
        }
    },


// для отработки интерфейса комментируем mounted и выставляем состояние переменными
    mounted(){
        this.readUrl();
        let supportedBrowser = ['chrome', 'firefox', 'safari'];
        let currentBrowser = browser();
        if(!supportedBrowser.includes(currentBrowser))
            this.showUnsupportDialog();
    },

    watch:{
        $route(to){
            this.readUrl();
        }
    }
}
</script>

<style>
html{
    text-decoration: none !important;
    letter-spacing: none !important;
    font-family: 'PTRootUI', sans-serif !important;
  }

  .content-block{width: 290px;}
  .login-progressbar .v-progress-linear__determinate {background: linear-gradient(290.34deg, #637CEB 0%, #63A9EB 98.23%) !important;}

  .login-bg{
      background-position: right bottom;
      background-size: contain;
  }
</style>
