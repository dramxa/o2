<template>
<v-container fluid class="login-page-new d-flex" >
    <div class="login-page-logo-fixed"></div>
    <div class="login-page-impersonate" v-if="glb_impersonatedOrgName!=''">
        <div class="px-4 text-center grey900">Impersonate to organization</div>
        <div class="px-4 mt-1 py-2 grey900 fw-b text-center login-page-impersonate__org-name">{{glb_impersonatedOrgName}}</div>
    </div>
    <div class="login-page-content d-flex align-center justify-space-around ma-n3">
        <!-- loading -->
        <div class="login-page-content-wrapper pa-5">
            <div v-if="isLoading" class="login-page-loading">
                <!-- <img src="@/assets/logo.svg" alt="LogoO2" style="width:100%;"> -->
                <p class="login-page-loading__title fs-m text-center mt-6 pt-6 mb-2" >Loading authorization data...</p>
                <v-progress-linear class="login-page-loading__progressbar" color="var(--white-primary600)" indeterminate height="3"></v-progress-linear>
            </div>

            <!--  login -->
            <div v-if="showLoginForm">
                <form>
                    <div class="login-page-new-title fs-xl fw-b mb-5">Welcome</div>
                    <c-labeled-field-login :loginPage="true" label="Username" inputName="login"    isAutocomplete="username" v-model="username" :error="isAuthFalure" editMode="true" @onPressEnter="loginClick" class="mb-3"/>
                    <c-labeled-field-login :loginPage="true" label="Password" inputName="password" isAutocomplete="password" v-model="password" :error="isAuthFalure" editMode="true" type="password" @onPressEnter="loginClick" :capsCheck="true" @caps="passCapsCheck"/>
                    <div :class="{'visibility-hidden' : !passCaps}" class="brown700 fs-m mt-2">CapsLock pressed</div>
                    <v-flex class="mt-2">
                        <v-btn @click="loginClick" height="24" width="70" type="submit" class="login-page-new-btn normal-text fw-b fs-s br-0">Login</v-btn>
                        <!-- <router-link class="blue700 normal-text fs-s pl-4 decoration-none" to="/login/reset">Forgot your password?</router-link> -->
                    </v-flex>
                    <p v-if="isAuthFalure" class="fs-s red500 ml-5 mt-6">There is no user with this username</p>
                </form>
            </div>

            <!-- reset 1 step -->
            <div v-if="showReset1StepForm">
                <div class="login-page-new-title fs-xl fw-b pl-5 mb-6">Reset password</div>
                <c-labeled-field-login label="Username/Email" :error="isResetUserFailure" editMode="true"/>
                <v-btn @click="resetSendClick" height="24" width="70" class="login-page-new-btn normal-text fw-b fs-s mx-5 mt-6 br-0">Send</v-btn>
                <p class="fs-s mx-5 mt-6" v-if="isResetLinkSended">Reset link was sended to your email</p>
                <p :error="isResetUserFailure" class="fs-s red500 mx-5 mt-6" v-if="isResetUserFailure">There is no user or email</p>
            </div>

            <!-- reset 2 step -->
            <div v-if="showReset2StepForm">
                <div class="login-page-new-title fs-xl fw-b pl-5 mb-6">Set new password</div>
                <c-labeled-field-login label="New password" editMode="true"/>
                <c-labeled-field-login label="Confirm password" editMode="true"/>
                <v-btn @click="resetApplyClick" height="24" width="70" class="login-page-new-btn grey100-b normal-text fw-b fs-s br-0">Apply</v-btn>
            </div>

            <!-- service unavailable -->
            <div v-if="isServiceUnavailable" class="blue700 fs-xxl fw-b">Service unavailable</div>
        </div>
    </div>
    <div class="login-page-particles">
        <Particles
            id="tsparticles"
            :options="{
                  background: {
                      color: {
                          value: 'transperent'
                      }
                  },
                  fpsLimit: 60,
                  interactivity: {
                      detectsOn: 'canvas',
                      modes: {
                          bubble: {
                              distance: 40,
                              duration: 1,
                              opacity: 0.9,
                              size: 5
                          },
                          push: {
                              quantity: 4
                          },
                          repulse: {
                              distance: 200,
                              duration: 0.4
                          }
                      }
                  },
                  particles: {
                      color: {
                          value: '#949494'
                      },
                      links: {
                          color: '#949494',
                          distance: 250,
                          enable: true,
                          opacity: 0.5,
                          width: 1
                      },
                      collisions: {
                          enable: false
                      },
                      move: {
                          direction: 'none',
                          enable: true,
                          outMode: 'bounce',
                          random: false,
                          speed: 1.6,
                          straight: false
                      },
                      number: {
                          density: {
                              enable: true,
                              value_area: 1900
                          },
                          value: 150
                      },
                      opacity: {
                          value: 0.2
                      },
                      shape: {
                          type: 'circle'
                      },
                      size: {
                          random: true,
                          value: 5
                      }
                  },
                  detectRetina: true
              }"
          />
      </div>
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
<style lang="stylus" scoped>
.login-page-new
    background linear-gradient(53deg, rgb(223, 223, 223) 0%, rgb(255, 255, 255) 50%, rgb(232, 232, 232) 100%)
    height 100vh
    &-btn
        color var(--white-primary800) !important
    &-title
        color var(--white-primary800) !important

.login-page-impersonate
    position absolute
    top 110px
    left 0
    &__org-name
        background-color rgb(255, 216, 0)

.login-page-particles
    position absolute
    width 80%
    transform rotate(45deg)
    right -20%
    top 44%

.login-page-content
    width 650px

.login-page-content-wrapper
    width 290px

.login-page-loading
    &__title
        color var(--white-primary800) !important
        
#tsparticles
    width 60%
</style>

