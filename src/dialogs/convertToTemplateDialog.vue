<template>
    <d-dialog-basic :dialogId="id" maxWidth="500px">
        <v-card class="d-convert-to-template pa-6 white-light gd-dlg-convertTmpl">
            <v-layout>
                <v-flex>
                    <v-card-text class="fs-l pa-0 grey700"> 
                        <v-layout>
                            <v-flex>
                                Convert <span class="blue700 fw-b">{{sourceName}}</span> to template
                            </v-flex>
                            <v-flex class="d-convert-to-template__close-btn-wrapper">
                                <v-btn icon tile text width="36" height="36" class="d-convert-to-template__close-btn br-4 gd-dlg-close" @click="cancelClick"><i class="icon-Close icon-24"></i></v-btn>
                            </v-flex>
                        </v-layout>
                        <v-layout class="mt-4 gd-dlg-convertTmpl-name">
                            <c-labeled-field class="px-0" xs="11" label="NAME" v-model="name" editMode="true"/>
                        </v-layout>                        
                        <v-layout class="mt-4 gd-dlg-convertTmpl-comment">
                            <c-labeled-textArea class="px-0" xs="11" label="COMMENT" v-model="comment" editMode="true"/>
                        </v-layout>
                        <v-layout class="mt-4 gd-dlg-convertTmpl-locked">
                            <c-labeled-slot label="LOCKED" xs="12">
                                <c-labeled-checkbox class="pl-0 mt-1 label-bigger-font-size"  cbid="snap-memory" label="Locked for use" v-model="isLocked" />
                            </c-labeled-slot>
                        </v-layout>
                    </v-card-text>
                    <v-card-actions class="pa-0 mt-6">
                        <v-spacer/>
                        <v-btn class="normal-text white-light fs-ml elevation-0  blue900" small width="80" height="32" @click="cancelClick"> Cancel</v-btn>
                        <v-btn class="white--text blue700-b normal-text fs-ml elevation-0" small width="80" height="32" @click="clickYes"> Save</v-btn>
                    </v-card-actions>
                </v-flex>
            </v-layout>
        </v-card>
    </d-dialog-basic>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import dialogMixin from '@/dialogs/windows/windowMixin'


const component = Vue.extend({

    mixins: [ dialogMixin ],
    props : ['sourceId', 'sourceName'],

    data(){
        return{
            name     : '',
            comment  : '',
            isLocked : false
        }
    },

    computed:{
        ...mapGetters(['vm_itemsAll'])
    },

    methods:{
        clickYes(){            
            this.acceptClick(
                {
                    name     : this.name, 
                    comment  : this.comment, 
                    isLocked : this.isLocked, 
                    sourceId : this.sourceId
                })         
        }
    },

    mounted(){
        this.name = this.sourceName;
    }
})

export function register(){
    Vue.prototype.$windows.registerDialog({ dialogCode: 'convertToTemplate', component})
}

export default component
</script>

<style lang="stylus" scoped>
.d-convert-to-template
    border-radius: 0 !important
    &__close-btn-wrapper
        max-width: 36px
    &__close-btn
        margin-top: -6px
        margin-right: -6px
</style>