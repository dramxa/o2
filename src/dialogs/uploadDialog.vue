<template>
    <d-dialog-basic :dialogId="id" maxWidth="400px">
        <v-card style="border-radius:0 !important;" class="pa-6" >
            <v-layout>
                <v-flex class="fs-l fw-b grey700">
                    Upload progress
                </v-flex>
                <v-flex style="max-width:36px;">
                    <v-btn icon tile text width="36" height="36" style="margin-top:-6px;margin-right:-6px;" class="br-4 gd-dlg-close" @click="cancelClick"><i class="grey500-i icon-Close icon-24"></i></v-btn>
                </v-flex>
            </v-layout>
            <div>
                <div class="d-flex">
                    <div class="mx-2 pointer" @click="type=1">type 1</div>
                    <div class="mx-2 pointer" @click="type=2">type 2</div>
                    <div class="mx-2 pointer" @click="type=3">type 3</div>
                </div>
                <div v-if="type==1">
                    <div class="mt-4">
                        <div class="d-flex align-center justify-space-between fw-b">
                            <div class="grey900 fs-m">Template Windows 2019</div>
                            <div class="grey500 fs-s">UPLOADING</div>
                        </div>
                    </div>
                    <v-expansion-panels class="pt-0" accordion flat>
                        <v-expansion-panel>
                            <v-expansion-panel-header class="px-0" style="min-height:40px;" expand-icon="mdi-chevron-down grey500">
                                <div class="d-flex upload-dlg-main-loader align-center relative">
                                    <div style="width:40%;" class="blue700-b upload-dlg-main-loader-item"></div>
                                    <div style="width:60%;" class="blue100-b upload-dlg-main-loader-item"></div>
                                    <div style="position:absolute;left:0;right:0;" class="text-center grey900 fs-m fw-b">40%</div>
                                </div>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content class="px-1">
                                <div class="d-flex mb-2" v-for="n in 5" :key="n">
                                    <div class="flex-grow-0 fs-s fw-b grey500 mr-2 monospace">
                                        Thread {{n}}
                                    </div>
                                    <div class="flex-grow-1">
                                        <div class="d-flex upload-dlg-thread-loader" >
                                            <div class="upload-dlg-thread-loader-item blue700-b" :style="{width: `${n*19}%`}"></div>
                                            <div class="upload-dlg-thread-loader-item blue100-b" :style="{width: `${100 - n*19}%`}"></div>
                                        </div>
                                    </div>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div>
                <div v-if="type==2">
                    <div class="mt-4">
                        <div class="d-flex align-center justify-space-between fw-b">
                            <div class="grey900 fs-m">Template Windows 2019</div>
                            <div class="grey500 fs-s">CHECKING</div>
                        </div>
                    </div>
                    <v-expansion-panels class="pt-0" accordion flat>
                        <v-expansion-panel>
                            <v-expansion-panel-header class="px-0" style="min-height:40px;" expand-icon="mdi-chevron-down grey500">
                                <div class="d-flex upload-dlg-main-loader align-center relative">
                                    <div style="width:15%;background:#FFC107;" class="upload-dlg-main-loader-item"></div>
                                    <div style="width:55%;" class="checking-in-progress-bg upload-dlg-main-loader-item"></div>
                                    <div style="width:30%;background:#FFECB4;" class="upload-dlg-main-loader-item"></div>
                                    <div style="position:absolute;left:0;right:0;" class="text-center grey900 fs-m fw-b">15%</div>
                                </div>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content class="px-1">
                                <div class="d-flex mb-2" v-for="n in 5" :key="n">
                                    <div class="flex-grow-0 fs-s fw-b grey500 mr-2 monospace">
                                        Thread {{n}}
                                    </div>
                                    <div class="flex-grow-1">
                                        <div class="d-flex upload-dlg-thread-loader" >
                                            <div class="upload-dlg-thread-loader-item" style="background:#FFC107;" :style="{width: `${n*19}%`}"></div>
                                            <div class="upload-dlg-thread-loader-item" style="background:#FFECB4;" :style="{width: `${100 - n*19}%`}"></div>
                                        </div>
                                    </div>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div>
                <div v-if="type==3">
                    <div class="mt-4">
                        <div class="d-flex align-center justify-space-between fw-b">
                            <div class="grey900 fs-m">Template Windows 2019</div>
                            <div class="grey500 fs-s">CHECKING</div>
                        </div>
                    </div>
                    <v-expansion-panels class="pt-0" accordion flat>
                        <v-expansion-panel>
                            <v-expansion-panel-header class="px-0" style="min-height:40px;" expand-icon="mdi-chevron-down grey500">
                                <div class="d-flex upload-dlg-main-loader align-center relative">
                                    <div style="width:15%;" class="grey700-b upload-dlg-main-loader-item"></div>
                                    <div style="width:55%;" class="grey500-b upload-dlg-main-loader-item"></div>
                                    <div style="width:30%;" class="grey200-b upload-dlg-main-loader-item"></div>
                                    <div style="position:absolute;left:0;right:0;" class="text-center white--text fs-m fw-b">15%</div>
                                </div>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content class="px-1">
                                <div class="d-flex mb-2" v-for="n in 5" :key="n">
                                    <div class="flex-grow-0 fs-s fw-b grey500 mr-2 monospace">
                                        Thread {{n}}
                                    </div>
                                    <div class="flex-grow-1">
                                        <div class="d-flex upload-dlg-thread-loader" >
                                            <div class="upload-dlg-thread-loader-item grey700-b" :style="{width: `${n*19}%`}"></div>
                                            <div class="upload-dlg-thread-loader-item grey200-b" :style="{width: `${100 - n*19}%`}"></div>
                                        </div>
                                    </div>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div>
            </div>
        </v-card>
    </d-dialog-basic>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';
import { async } from 'q';

import Vue from 'vue'
import dialogMixin from '@/dialogs/windows/windowMixin'


const component = Vue.extend({
    mixins: [ dialogMixin ],

    props:[
        
    ],

    data(){
        return {            
            result     : false,
            showDialog : false,
            type       : 1,
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

    computed:{
        
    },

    methods:{
        
    },

    mounted(){
        this.showDialog = this.value
    }
})

export function register(){
    Vue.prototype.$windows.registerDialog({ dialogCode: 'uploadDialog', component})
}

export default component

</script>

<style>
.v-dialog--active{border-radius:0 !important;}
.upload-dlg-main-loader{ height:30px;  width:100%; }
.upload-dlg-main-loader-item{ height:30px; }
.upload-dlg-thread-loader{ height:12px;width:100%; }
.upload-dlg-thread-loader-item{ height:12px; }
.checking-in-progress-bg{background: repeating-linear-gradient( -45deg, #FFCC33, #FFCC33 10px, #FEDB71 10px, #FEDB71 20px );}
</style>

