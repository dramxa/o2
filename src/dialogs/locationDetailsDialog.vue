<template>
    <d-dialog-basic :dialogId="id" maxWidth="574px">
        <v-card class="d-location-details py-6 px-9 white-light confirm-dialog">
            <v-layout>
                <v-flex>
                    <v-card-text class="fs-l pa-0 grey700"> 
                        <v-layout class="mx-n3">
                            <v-flex>
                                Location details
                            </v-flex>
                            <v-flex class="d-location-details__close-btn-wrapper">
                                <v-btn icon tile text width="36" height="36" class="d-location-details__close-btn br-4" @click="cancelClick"><i class="grey500-i icon-Close icon-24"></i></v-btn>
                            </v-flex>
                        </v-layout>
                        <div class="mt-4">
                            <div>
                                <div class="d-flex">
                                    <div class="d-location-details__left-block flex-grow-0">
                                        <img src="/img/stack.e98c38e1.png">
                                    </div>
                                    <div class="flex-grow-1">
                                        <div class="blue800 d-location-details__item-title fw-b">Stack Telecom</div>
                                        <div class="blue500 fs-s fw-b pointer">https://stacktelecom.ru</div>
                                    </div>
                                </div>
                                <div class="d-flex pb-4">
                                    <div class="d-location-details__left-block flex-grow-0">
                                        <div class="d-location-details__vertical-line"></div>
                                    </div>
                                    <div class="flex-grow-1 fs-s grey500">
                                        Сервис провайдер оказывающий большое количесво всевозможных услуг, в том числе и облачных.
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="d-flex">
                                    <div class="d-location-details__left-block flex-grow-0">
                                        <img src="/img/m1cloud.529de98a.png">
                                    </div>
                                    <div class="flex-grow-1">
                                        <div class="blue800 d-location-details__item-title fw-b">M1Cloud</div>
                                        <div class="blue500 fs-s fw-b pointer">https://m1cloud.ru</div>
                                    </div>
                                </div>
                                <div class="d-flex pb-4">
                                    <div class="d-location-details__left-block flex-grow-0">
                                        <div class="d-location-details__vertical-line"></div>
                                    </div>
                                    <div class="flex-grow-1 fs-s grey500">
                                        Сервис провайдер оказывающий большое количесво всевозможных услуг, в том числе и облачных.
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="d-flex">
                                    <div class="d-location-details__left-block d-location-details__left-block--bigger flex-grow-0">
                                        <img src="/img/publicCloud.e11d57ae.png">
                                    </div>
                                    <div class="flex-grow-1">
                                        <div class="blue800 d-location-details__rp-title fw-b">Public Cloud M1</div>
                                        <div class="fs-s fw-b grey500 py-2">Публичное облако, предоставляется посредством VMware vCloud Director</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex">
                            <div class="d-location-details__left-block flex-grow-0"></div>
                            <div class="flex-grow-1">
                                <div class="d-flex">
                                    <div class="fs-s grey500 mr-2">Available templates</div>
                                    <v-spacer class="d-location-details__available-spacer border-bottom grey200-border"/>
                                </div>
                                <div class="d-flex flex-wrap justify-space-around mt-2">
                                    <v-tooltip bottom v-for="os in osList" :key="os.code" content-class="custom-tooltip fs-s">
                                        <template v-slot:activator="{ on }">
                                            <div v-on="on" class="d-location-details__os-item d-flex align-center ma-2 pointer">
                                                <div class="d-location-details__os-img mr-1">
                                                    <img :src="`/img/os-icons/${os.img}`">
                                                </div>
                                                <span class="fs-s grey800 border-bottom-dashed grey800-border">{{os.name}}</span>
                                            </div>
                                        </template>
                                        <div class="custom-tooltip-color fw-m">
                                            <div>Windows 2008 EN x64 Standard</div>
                                            <div>Windows 2012 EN x64 Standard</div>
                                            <div>Windows 2016 EN x64 Standard</div>
                                        </div>
                                    </v-tooltip>
                                </div>
                            </div>
                        </div>
                    </v-card-text>
                </v-flex>
            </v-layout>
        </v-card>
    </d-dialog-basic>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Vue from 'vue'
import dialogMixin from '@/dialogs/windows/windowMixin'
import osList from '@/consts/osConsts'


const component = Vue.extend({

    mixins: [ dialogMixin ],

    data(){
        return{
            osList
        }
    },

    computed:{
        
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
        ...mapActions([  ]),

        
    },

    mounted(){
        this.showDialog = this.value;
    }

})

export function register(){
    Vue.prototype.$windows.registerDialog({ dialogCode: 'locationDetailsDialog', component})
}

export default component
</script>

<style lang="stylus" scoped>
.d-location-details
    border-radius 0 !important
    &__close-btn-wrapper
        max-width 36px
    &__close-btn
        margin-top -6px
        margin-right -6px
    &__left-block
        position relative
        margin-right 32px
        width 51px
        min-width 51px
        & img
            width 100%
        &&--bigger
            min-width 80px
            margin-left -14px
            margin-right 16px
    &__vertical-line
        position absolute
        left 25px
        top 0px
        bottom -8px
        width 1px
        background var(--white-primary200)
    &__available-spacer
        margin-bottom 7px
    &__os-item:hover
        & img
            filter grayscale(0) !important 
            opacity 1 !important 
    &__os-img
        width 25px
        height 25px
        & img
            max-height 100%
            max-width 100%
            filter grayscale(1)
            opacity .8
    &__rp-title
        font-size 26px
        line-height 35px
    &__item-title
        font-size 22px
        line-height 30px
</style>