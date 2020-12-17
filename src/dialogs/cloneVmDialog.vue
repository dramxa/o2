<template>
    <d-dialog-basic :dialogId="id" maxWidth="500px">
        <v-card class="d-clone-vm pa-6 white-light gd-dlg-clone">
            <v-layout>
                <v-flex>
                    <v-card-text class="fs-l pa-0 grey700"> 
                        <v-layout>
                            <v-flex>
                                Clone <span class="blue700 fw-b">{{ multiple ? vms.length + ' VMs' : vms[0].name }}</span>
                            </v-flex>
                            <v-flex class="d-clone-vm__close-btn-wrapper">
                                <v-btn icon tile text width="36" height="36" class="d-clone-vm__close-btn br-4 gd-dlg-close" @click="cancelClick"><i class="grey500-i icon-Close icon-24"></i></v-btn>
                            </v-flex>
                        </v-layout>
                        <v-layout class="mt-4 gd-dlg-clone-name">
                            <c-labeled-field xs="12" v-model="text" :label="multiple ? 'POSTFIX TO ALL' : 'NAME'" editMode="true"/>
                        </v-layout>
                        <v-layout class="mt-4 gd-dlg-clone-location">
                            <c-labeled-combo-filter v-model="serviceProvider" :items="serviceProviders" xs="4" label="SERVICE PROVIDER" editMode="true"/>
                            <c-labeled-combo-filter v-model="datacenter"      :items="datacenters"      xs="4" class="mx-2" label="DATACENTER" editMode="true"/>
                            <c-labeled-combo-filter v-model="resourceProfile" :items="resourceProfiles" xs="4" label="RESOURCE PROFILE" editMode="true"/>
                        </v-layout>
                        <v-layout class="mt-4">
                            <c-labeled-combo-filter xs="6" class="pr-2 gd-dlg-clone-project" label="PROJECT" v-model="projectId" :items="projects" editMode="true" applyUnset="true"/>
                            <c-labeled-combo-filter xs="6" class="pl-2 gd-dlg-clone-group"   label="GROUP"   v-model="groupId"   :items="groups"   editMode="true" applyUnset="true"/> 
                        </v-layout>
                    </v-card-text>
                    <v-card-actions class="pa-0 mt-6">
                        <v-spacer/>
                        <v-btn class="normal-text white-light fs-ml elevation-0  blue900" small width="80" height="32" @click="cancelClick">Cancel</v-btn>
                        <v-btn class="white--text blue700-b normal-text fs-ml elevation-0" small width="80" height="32" @click="clickYes">Yes</v-btn>
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
    props: [ 'vms' ],

    data(){
        return{
            text            : '',
            multiple        : this.vms.length > 1,
            projectId       : '',
            groupId         : '',
            serviceProvider : null,
            datacenter      : null,
            resourceProfile : null
        }
    },

    computed:{
        ...mapGetters(['prj_itemsAll', 'grp_itemsAll', 'lctn_serviceProviders', 'lctn_defaultResourceProfile']),

        name(){
            if(this.vms.length==1)
              return this.vms[0].name;

            return '';
        },

        projects(){
            return this.prj_itemsAll.map(m=>{ return {code: m.id, name: m.name}});
        },

        groups(){
            var fList = this.grp_itemsAll.filter(f=>f.projectId==this.projectId).map(m=>{ return {code: m.id, name: m.name}});
            return fList;
        },

        serviceProviders(){
            return this.lctn_serviceProviders.map(m=>{ return {code: m.id, name: m.name}});
        },

        datacenters(){
            var sp = this.lctn_serviceProviders.find(f=>f.id==this.serviceProvider);
            return isNullOrUndefined(sp) ? null : sp.datacenters.map(m=>{ return {code: m.id, name: m.name}});
        },

        resourceProfiles(){
            if(isNullOrUndefined(this.serviceProvider)
            || isNullOrUndefined(this.datacenter))
                return null;

            var sp = this.lctn_serviceProviders.find(f=>f.id==this.serviceProvider);
            var dc = sp.datacenters.find(f=>f.id==this.datacenter); 
            
            return dc.resourceProfiles.map(m=>{ return {code: m.id, name: m.name}});
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

        clickYes(){
            this.acceptClick(
                {
                    multiple            : this.multiple,
                    text                : this.text,
                    projectId           : this.projectId,
                    groupId             : this.groupId,
                    serviceProviderId   : this.serviceProvider,
                    datacenterCode      : this.datacenter,
                    resourceProfileId   : this.resourceProfile
                })         
        }
        
    },

    mounted(){
        this.text = this.vms.length > 1 ? '_clone' : this.vms[0].name + '_clone';

        this.showDialog = this.value

        this.projectId = this.vms[0].projectId;
        this.groupId = this.vms[0].groupId;

        var defRP = this.lctn_defaultResourceProfile;        
        if(!isNullOrUndefined(defRP)){
            this.serviceProvider = defRP.serviceProvider.id;
            this.datacenter = defRP.datacenter.id;
            this.resourceProfile = defRP.resourceProfile.id;
        }
    }




})

export function register(){
    Vue.prototype.$windows.registerDialog({ dialogCode: 'cloneVmDialog', component})
}

export default component
</script>

<style lang="stylus" scoped>
.d-clone-vm
    border-radius: 0 !important
    &__close-btn-wrapper
        max-width: 36px
    &__close-btn
        margin-top: -6px
        margin-right: -6px
</style>