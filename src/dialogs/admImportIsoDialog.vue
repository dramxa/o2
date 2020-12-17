<template>
    <d-dialog-basic :dialogId="id" maxWidth="500px">
        <v-card class="d-adm-import-iso pa-6 white-light gd-dlg-import">
            <v-layout>
                <v-flex>
                    <v-card-text class="fs-l pa-0 grey700"> 
                        <v-layout>
                            <v-flex>
                                Import ISO
                            </v-flex>
                            <v-flex class="d-adm-import-iso__close-btn-wrapper">
                                <v-btn icon tile text width="36" height="36" class="d-adm-import-iso__close-btn br-4" @click="cancelClick">
                                    <i class="grey500-i icon-Close icon-24"></i>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                        <v-layout class="mt-4">
                            <c-labeled-field class="px-0 gd-dlg-import-srcName" xs="12" label="SRC PATH" v-model="srcPath"  editMode="true" required="true" />
                        </v-layout>                        
                        <v-layout class="mt-4">
                            <c-labeled-field class="px-0 gd-dlg-import-name" xs="12" label="NAME" v-model="fileName"  editMode="true" required="true" />
                        </v-layout>
                        <v-layout class="mt-4">
                            <c-labeled-field class="px-0 gd-dlg-import-size" xs="12" label="DISPLAY SIZE(MB)" v-model="size"  editMode="true" :masked="true" mask="justDigits" required="true" />
                        </v-layout>
                        <v-layout class="mt-4 gd-dlg-import-location">
                            <c-labeled-combo-filter v-model="serviceProvider" :items="serviceProviders" xs="4" label="SERVICE PROVIDER" editMode="true" required="true" />
                            <c-labeled-combo-filter v-model="dataCenter"      :items="dataCenters"      xs="4" label="DATACENTER" class="mx-2" editMode="true" required="true" />
                            <c-labeled-combo-filter v-model="resourceProfile" :items="resourceProfiles" xs="4" label="RESOURCE PROFILE" editMode="true" required="true" />
                        </v-layout>
                    </v-card-text>
                    <v-card-actions class="pa-0 mt-6">
                        <v-spacer/>
                        <v-btn class="normal-text white-light fs-ml elevation-0  blue900" small width="80" height="32" @click="cancelClick"> Cancel</v-btn>
                        <v-btn class="white--text blue700-b normal-text fs-ml elevation-0" small width="80" height="32" @click="clickYes"> Import</v-btn>
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

    data(){
        return{
            serviceProvider : null,
            dataCenter      : null,
            resourceProfile : null,
            fileName: null,
            srcPath : null,
            size    : 0
        }
    },

    computed:{
        ...mapGetters(['lctn_serviceProviders', 'lctn_defaultResourceProfile']),

        serviceProviders(){
            return this.lctn_serviceProviders.map(m=>{ return {code: m.id, name: m.name}});
        },

        dataCenters(){
            var sp = this.lctn_serviceProviders.find(f=>f.id==this.serviceProvider);
            var res = isNullOrUndefined(sp) ? null : sp.datacenters.map(m=>{ return {code: m.id, name: m.name}});

            if(res == null || res.find(f=>f.code == this.dataCenter) == null)
                {
                    this.dataCenter = null
                    this.resourceProfile = null
                }
            return res;
        },

        resourceProfiles(){
            if(isNullOrUndefined(this.serviceProvider))
                return null;
            if(isNullOrUndefined(this.dataCenter))
                return null;
            var sp = this.lctn_serviceProviders.find(f=>f.id==this.serviceProvider);
            var dc = sp.datacenters.find(f=>f.id==this.dataCenter); 
            
            var res = isNullOrUndefined(dc) ? null : dc.resourceProfiles.map(m=>{ return {code: m.id, name: m.name}});


            if(res == null || res.find(f=>f.code == this.resourceProfile) == null)
                this.resourceProfile = null
            return res;
        },

    },

    watch:{
        showDialog: function(state){
            if(!state)
                this.$emit('onClose', this.result);
        },

        srcPath:function(value, oldValue){
            if(value != null && (this.fileName == null || this.fileName == '' || oldValue == this.fileName)){                
                this.fileName =value.substring(value.lastIndexOf('/') + 1);
            }
        }
    },


    methods:{
        clickYes(){
            if(this.srcPath == null || this.srcPath == ''
             || this.fileName == null || this.fileName == ''
             || this.size == null || this.size == ''
             || isNullOrUndefined(this.resourceProfile)
             ){
                showMessage('inputError');
                return;
            }            
            
            this.acceptClick(
                {
                    name                : this.fileName,
                    fileName            : this.srcPath,
                    size                : this.size,
                    resourceProfileId   : this.resourceProfile
                })         
        }, 
    },

    mounted(){
        this.showDialog = this.value;
        
        var defRP = this.lctn_defaultResourceProfile;        
        if(!isNullOrUndefined(defRP)){
            this.serviceProvider = defRP.serviceProvider.id;
            this.dataCenter = defRP.datacenter.id;
            this.resourceProfile = defRP.resourceProfile.id;
        }
    }

})

export function register(){
    Vue.prototype.$windows.registerDialog({ dialogCode: 'admImportIsoDialog', component})
}

export default component
</script>
<style lang="stylus" scoped>
.d-adm-import-iso
    border-radius: 0 !important
    &__close-btn-wrapper
        max-width: 36px
    &__close-btn
        margin-top: -6px
        margin-right: -6px
</style>
<style>
.border-all-dashed{border:1px dashed;}
</style>

<style scoped>
#iso-input-file{width: 0px; height: 0px;}
.overflow-filename{
    overflow: hidden;
    max-height: 1.5em;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}
</style>