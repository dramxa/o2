<template>
    <v-menu :left="isLeft" :close-on-content-click="false" v-model="showForm">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" text height="24px" class="c-filter-location__activator-btn justify-space-between align-center px-2 border" :class="[isActive ? 'blue800 blue000-b blue500-border':'grey700 grey300-border']">
                    <div class="prop-edit-value fw-b">All</div>
                    <div class="c-filter-location__activator-btn-icon"> <i class="icon-ChDown" :class="[isActive ? 'blue500-i' : 'grey500-i']"></i> </div>
                </v-btn>
            </template>
            <div class="c-filter-location border default-border-radius elevation-0"  :class="[isActive ? 'blue000-b blue500-border ':'white-light grey300-border', menuClass]">
                <v-layout class="px-2 pt-1">
                    <span class="normal-text fs-s" :class="[isActive ? 'blue800':'grey700']">All</span><v-spacer></v-spacer><i class="icon-ChDown" :class="[isActive ? 'blue500-i' : 'grey500-i']"></i>
                </v-layout>
                <v-layout class="px-1 gd-filter-inputs">
                    <!-- <c-labeled-combo class="px-1" xs="4" :isActiveFilter="isActive" label="SERVICE PROVIDER" editMode="true"/>
                    <c-labeled-combo class="px-1" xs="4" :isActiveFilter="isActive" label="DATA CENTER"      editMode="true"/>
                    <c-labeled-combo class="px-1" xs="4" :isActiveFilter="isActive" label="RESOURCE PROFILE" editMode="true"/> -->
                    <c-labeled-combo-filter v-model="serviceProvider" :isActiveFilter="isActive" :items="serviceProviders" xs="4" label="SERVICE PROVIDER" editMode="true"/>
                    <c-labeled-combo-filter v-model="dataCenter"      :isActiveFilter="isActive" :items="dataCenters"      xs="4" label="DATACENTER"       editMode="true" class="mx-2" applyUnset="true"/>
                    <c-labeled-combo-filter v-model="resourceProfile" :isActiveFilter="isActive" :items="resourceProfiles" xs="4" label="RESOURCE PROFILE" editMode="true" applyUnset="true"/>
                </v-layout>
                <v-layout class="pa-2 gd-filter-control">
                    <v-spacer></v-spacer>
                    <v-btn text class="normal-text fs-s fw-b grey300 pa-0 mr-2" height="24px"><span class="btn-text" @click="clearClick">Clear all</span></v-btn>
                    <v-btn text class="normal-text fs-s fw-b blue600 pa-0"      height="24px"><span class="btn-text" @click="applyClick">Apply    </span></v-btn>
                </v-layout>
            </div>
        </v-menu>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
     props: [
        'isLeft',
        'value',
        'menuClass'
    ],
    
    data(){
        return{
            isActive: false,

            showForm  : false,

            serviceProvider : null,
            dataCenter      : null,
            resourceProfile : null,
            
            resPath : ''
        }
    },

    computed:{
        ...mapGetters(['lctn_serviceProviders']),

        serviceProviders(){
            return this.lctn_serviceProviders.map(m=>{ return {code: m.id, name: m.name}});
        },

        dataCenters(){
            var sp = this.lctn_serviceProviders.find(f=>f.id==this.serviceProvider);
            return isNullOrUndefined(sp) ? null : sp.datacenters.map(m=>{ return {code: m.id, name: m.name}});
        },

        resourceProfiles(){
            if(isNullOrUndefined(this.serviceProvider))
                return null;
            if(isNullOrUndefined(this.dataCenter))
                return null;
            
            var sp = this.lctn_serviceProviders.find(f=>f.id==this.serviceProvider);
            var dc = sp.datacenters.find(f=>f.id==this.dataCenter); 
            
            return isNullOrUndefined(dc) ? null : dc.resourceProfiles.map(m=>{ return {code: m.id, name: m.name}});
        }
    },

    methods:{

        clearClick(){
            this.resPath = '';
            this.showForm = false;
        },
        applyClick(){
            var path = '';
            if(!isNullOrUndefined(this.serviceProvider) || !isNullOrUndefined(this.serviceProviders)){
                path =  this.serviceProviders.find(f=>f.code == this.serviceProvider).name + ' / ';
                path += isNullOrUndefined(this.dataCenter) ? '' : this.dataCenters.find(f=>f.code == this.dataCenter).name + ' / ';
                path += isNullOrUndefined(this.resourceProfile) ? '' : this.resourceProfiles.find(f=>f.code == this.resourceProfile).name;
            }
            this.resPath = path;           
            this.showForm = false;
        }
    },

    watch:{
        showForm: function(value){
            if(!value){
                this.$emit('doChange', this.resPath);
            }
        },

        serviceProvider:function(value){
            this.dataCenter = null;
            this.resourceProfile = null;
        },
        dataCenters:function(value){
            this.resourceProfile = null;
        },

        value: {
            handler: function(value){
                var pathNames =isNullOrUndefined(value) ? [] : value.split(' / ');
                if(pathNames.length==3 && !isNullOrUndefined(this.serviceProviders)){
                    this.serviceProvider = this.serviceProviders.find(f=>f.name==pathNames[0]).code;
                    if(pathNames.length > 1 && pathNames[1] != '')
                        this.dataCenter      = this.dataCenters.find(f=>f.name==pathNames[1]).code;
                    if(pathNames.length > 2 && pathNames[2] != '')
                        this.resourceProfile = this.resourceProfiles.find(f=>f.name==pathNames[2]).code;
                }
            },
            immediate: true
        }        
    }


}
</script>
<style lang="stylus" scoped>
.c-filter-location
    width 392px
    &__activator-btn
        width 100%
        text-align left
        text-transform none
        border-radius 2px
    &__activator-btn-icon
        margin-bottom -3px
</style>