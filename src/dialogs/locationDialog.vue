<template>
    <d-dialog-basic :dialogId="id" width="90%" maxWidth="1200px" height="90%">
        <v-card class="d-location pa-0 white-light">
            <v-layout>
                <v-flex>
                    <v-card-text class="fs-l pa-0 grey700"> 
                        <v-layout class="pa-4 d-flex align-center">
                            <v-flex class="pl-6">
                                Change location 
                            </v-flex>
                            <v-flex class="d-location__close-btn-wrapper">
                                <v-btn icon tile text width="36" height="36" class="d-location__close-btn br-4" @click="cancelClick">
                                    <i class="grey500-i icon-Close icon-24"></i>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                        <v-layout>
                            <c-locations-view-content :isDialog="true" @choosen="acceptClick()"/>
                        </v-layout>
                    </v-card-text>
                </v-flex>
            </v-layout>
        </v-card>
    </d-dialog-basic>
</template>

<script>
import extBus from '@/modules/_system/_extension/_bus'
import { mapGetters, mapActions } from 'vuex';
import Vue from 'vue'
import dialogMixin from '@/dialogs/windows/windowMixin'


const component = Vue.extend({

    mixins: [ dialogMixin ],

    data(){
        return{
            
        }
    },

    computed:{
        ...mapGetters(['glb_permissions']),

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
        ...mapActions(['glb_setPermissions']),
        
    },

    mounted(){
        this.showDialog = this.value;
    }

})

export function register(){
    Vue.prototype.$windows.registerDialog({ dialogCode: 'locationDialog', component});
}

export default component
</script>

<style lang="stylus" scoped>
.d-location
    border-radius 0 !important
    overflow hidden
    &__close-btn-wrapper
        max-width 36px
        margin-bottom -6px
    &__close-btn
        margin-top -6px
        margin-right -6px
</style>
<style>
.v-dialog:not(.v-dialog--fullscreen){max-height:90% !important;overflow: hidden;}
</style>