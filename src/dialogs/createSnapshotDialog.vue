<template>
    <d-dialog-basic :dialogId="id" maxWidth="400px">
        <v-card class="d-create-snapshot pa-6 white-light confirm-dialog gd-dlg-snpCrt">
            <v-layout>
                <v-flex>
                    <v-card-text class="fs-l pa-0 grey700"> 
                        <v-layout>
                            <v-flex>
                                Create snapshot from <span class="blue700 fw-b">{{ vm.name }}</span>
                            </v-flex>
                            <v-flex class="d-create-snapshot__close-btn-wrapper ml-2">
                                <v-btn icon tile text width="36" height="36" class="d-create-snapshot__close-btn br-4 gd-dlg-close" @click="cancelClick">
                                    <i class="grey500-i icon-Close icon-24"></i>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                        <v-layout class="mt-4">
                            <c-labeled-field class="px-0 gd-dlg-snpCrt-name" xs="11" label="NAME" v-model="snap.name" editMode="true"/>
                        </v-layout>                        
                        <v-layout class="mt-4">
                            <c-labeled-textArea class="px-0 gd-dlg-snpCrt-description" xs="11" label="DESCRIPTION" v-model="snap.description" editMode="true"/>
                        </v-layout>
                        <v-layout class="mt-4 gd-dlg-snpCrt-memory" :style="vmRunning ? '' : 'opacity: .6'">
                            <c-labeled-slot label="MEMORY" xs="12">
                                <c-labeled-checkbox class="pl-0 mt-1 label-bigger-font-size"  cbid="snap-memory" label="Snapshot memory" v-model="snap.isWithMemory" :isDisable='!vmRunning' />
                            </c-labeled-slot>
                        </v-layout>
                        <v-layout class="mt-4 gd-dlg-snpCrt-quiesce" :style="vmRunning ? '' : 'opacity: .6'">
                            <c-labeled-slot label="QUIESCE" xs="12">
                                <c-labeled-checkbox class="pl-0 mt-1 label-bigger-font-size"  cbid="snap-quiesce" label="Quiesce file system (VMware Tools required)" v-model="snap.isQuiesceGuestFS"  :isDisable='!vmRunning'/>
                            </c-labeled-slot>
                        </v-layout>

                    </v-card-text>
                    <v-card-actions class="pa-0 mt-6">
                        <v-spacer/>
                        <v-btn class="normal-text white-light fs-ml elevation-0  blue900" small width="80" height="32" @click="cancelClick"> Cancel</v-btn>
                        <v-btn class="white--text blue700-b normal-text fs-ml elevation-0" small width="80" height="32" @click="clickYes"> Create</v-btn>
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
    props: ['vm'],

    data(){
        return{
            snap: {
                name             : '',
                description      : '',
                isWithMemory     : false,
                isQuiesceGuestFS : false
            }
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
        vmRunning(){
            return this.vm.powerStateCode == 'running';
        }
    },


    methods:{
        clickYes(){
            this.acceptClick(
                {
                    vmId  : this.vm.id,
                    snap  : this.snap
                })         
        }
    },

    mounted(){
        this.showDialog = this.value;
        this.snap.name = `Snapshot ${formatDateTime(Date.now())}`.replace(',', '')
    }

})

export function register(){
    Vue.prototype.$windows.registerDialog({ dialogCode: 'createSnapshotDialog', component})
}

export default component
</script>

<style lang="stylus" scoped>
.d-create-snapshot
    border-radius: 0 !important
    &__close-btn-wrapper
        max-width: 36px
    &__close-btn
        margin-top: -6px
        margin-right: -6px
</style>