<template>
    <d-dialog-basic :dialogId="id" width="90%" maxWidth="850px" height>
        <v-card style="border-radius:0 !important;overflow: hidden;" class="pa-6 white-light">
            <v-layout>
                <v-flex>
                    <v-card-text class="fs-l pa-0 grey700"> 
                        <v-layout>
                            <v-flex>
                                FEATURES
                            </v-flex>
                            <v-flex style="max-width:36px;">
                                <v-btn icon tile text width="36" height="36" style="margin-top:-6px;margin-right:-6px;" class="br-4" @click="cancelClick"><i class="grey500-i icon-Close icon-24"></i></v-btn>
                            </v-flex>
                        </v-layout>
                        <v-layout v-if="features_unreachable">
                            <span class="fs-s red500">Server ureachable show defaults</span>
                        </v-layout>
                        <v-layout >
                            <v-data-table
                                v-model="selected"
                                :headers="headers"
                                :items="items"
                                item-key="code"
                                show-select
                                disable-pagination
                                hide-default-header
                                hide-default-footer
                                style="width:100%;"
                                fixed-header
                                class="features-toogle-table"
                                v-bar
                                > 
                                <template v-slot:header="data">
                                    <thead class="border-bottom blue050-border">
                                    <tr>
                                    <template v-for="header in data.props.headers">
                                    <th style="height: 24px;" :key="header.value" class="table-header-text pa-2 fw-n" :style="{width: header.width}">
                                        <div v-if="header.value != 'data-table-select'">
                                            <div class="px-2 d-flex align-center">
                                                <span class="fs-s grey600 nonselect">{{header.text}}</span>
                                            </div>
                                        </div>
                                    </th>
                                    </template>
                                    </tr>
                                    </thead>

                                </template>
                                <template v-slot:item="data">
                                    <tr class="row-with-hidden-menu border-bottom grey100-border" style="cursor: default">
                                    <template v-for="(header, index) in data.headers">
                                        <td :key="index" v-if="index==0">
                                            <div class="d-flex align-center">
                                                <!-- <c-table-checkbox class="gd-tbcol-row-select-cb" :cbid="'features-table-row-' + data.item.code"  :state="data.isSelected" @click="data.select(!data.isSelected), updateSelectedOnClick()"/> -->
                                                <toggler v-model="data.item.enable" height="18" :disabled="true" /> <!-- :disabled="true" -->
                                            </div>
                                        </td>
                                        <td :key="index" v-else>
                                            <!-- name -->
                                            <div v-if="header.value=='name'">
                                                <span :class="[data.item.hiddenOnProd ? 'grey900': 'grey800', 'fw-b fs-m']">{{data.item.name}}</span>
                                                <span v-if="data.item.hiddenOnProd" class="grey500 fs-s"> (Hidden on prod)</span>
                                            </div>

                                            <!-- description -->
                                            <div v-if="header.value=='description'">
                                                <span class="grey900 fs-m">{{data.item.description}}</span>
                                            </div>
                                        </td>
                                    </template>
                                    </tr>
                                </template>
                            </v-data-table>
                        </v-layout>
                    </v-card-text>
                    <!-- <v-card-actions class="pa-0 mt-6" style="position:sticky;bottom:0;">
                        <v-spacer/>
                        <v-btn class="blue700-b normal-text fs-ml elevation-0" style="color:white" small width="80" height="32" @click="savePermissions()"> Save</v-btn>
                    </v-card-actions> -->
                </v-flex>
            </v-layout>
        </v-card>
    </d-dialog-basic>
</template>

<script>
import extBus from '@/modules/_system/_extension/_bus'
import { wsObjectTypes } from '@/consts/websocketConsts'
import { mapGetters, mapActions } from 'vuex';
import Vue from 'vue'
import dialogMixin from '@/dialogs/windows/windowMixin'
import toggler from './featuresToggler'


const component = Vue.extend({

    mixins: [ dialogMixin ],

    components:{
        toggler
    },

    data(){
        return{   
            sortBy     : "name",
            descending : false,
            selected   : [],
            headers: [
                {text:"NAME",value:"name",width:"260px"},
                {text:"DESCRIPTION",value:"description",width:"auto"},
            ]           
        }
    },

    computed:{
        ...mapGetters(['features_unreachable', 'features_unstableFeatures']),

        items(){
            return stand.isLocal || stand.isDevelop ? this.features_unstableFeatures : this.features_unstableFeatures.filter(w=>!w.hiddenOnProd)
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
        ...mapActions(['glb_setPermissions'])        
    },

    mounted(){
        this.showDialog = this.value;
        //new SimpleBar(qs(".edit-perm-dialog-table .v-data-table__wrapper"), { autoHide: true }); 
    }

})

export function register(){
    Vue.prototype.$windows.registerDialog({ dialogCode: 'featuresDialog', component});
}

export default component
</script>

<style>
.v-dialog--active{border-radius:0 !important;}
.v-row-group__header{background:white !important;}
.features-toogle-table .v-data-table__wrapper{max-height:calc(100vh - 64px - 48px - 66px - 16px);}
.v-dialog:not(.v-dialog--fullscreen){max-height:90% !important;overflow: hidden;}
</style>