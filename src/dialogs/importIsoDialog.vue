<template>
    <d-dialog-basic :dialogId="id" maxWidth="500px">
        <v-card style="border-radius:0 !important;" class="pa-6 white-light gd-dlg-import">
            <v-layout>
                <v-flex>
                    <v-card-text class="fs-l pa-0 grey700"> 
                        <v-layout><v-flex>
                            Import ISO
                        </v-flex>
                        <v-flex style="max-width:36px;">
                            <v-btn icon tile text width="36" height="36" style="margin-top:-6px;margin-right:-6px;" class="br-4" @click="cancelClick"><i class="grey500-i icon-Close icon-24"></i></v-btn>
                        </v-flex>
                        </v-layout>
                        <v-layout class="mt-4">
                            <c-labeled-field class="px-0 gd-dlg-import-name" xs="12" label="NAME" v-model="fileName"  editMode="true"/>
                        </v-layout>
                        <v-layout class="mt-4 gd-dlg-import-location">
                            <c-labeled-combo-filter v-model="serviceProvider" :items="serviceProviders" xs="4" label="SERVICE PROVIDER" editMode="true"/>
                            <c-labeled-combo-filter v-model="dataCenter"      :items="dataCenters"      xs="4" label="DATACENTER" class="mx-2" editMode="true"/>
                            <c-labeled-combo-filter v-model="resourceProfile" :items="resourceProfiles" xs="4" label="RESOURCE PROFILE" editMode="true"/>
                        </v-layout>
                        <form
                            @dragstart="handleDragStart"
                            @dragover="handleDragOver"
                            @dragenter="handleDragEnter"
                            @dragleave="handleDragLeave"
                            @dragend="handleDragEnd"
                            @drop="handleDrop"
                            @drag="handleDrag"
                            class="v-card v-card--flat v-sheet theme--light pointer pl-11 py-8 px-4 border-all-dashed br-8 mt-6 gd-dlg-import-form" 
                            :class="[isGlow ? 'blue900-border blue000-b' : 'grey700-border ']" 
                            @mouseenter="isGlow = true" 
                            @mouseleave="isGlow = false"
                            >
                            <v-layout>
                                <v-flex xs3 class="align-center">
                                    <i class="icon-TaskList1" :class="{'blue600-i': isGlow}" style="font-size:60px;"></i>
                                </v-flex>
                                <v-flex xs9 class="fs-ml d-flex align-center align-self-center" :class="[isGlow ? 'blue700' : 'grey700']">
                                    <input type="file" id="iso-input-file" @change="importFile()" ref="iso-input-file" accept=".iso">
                                    <label for="iso-input-file" style="width:100%;">
                                        <span v-if="fileName == null">Drop file here or <br>Click and choose from dialog</span>
                                        <span v-else>
                                            <v-tooltip bottom max-width="350"  content-class="custom-tooltip fs-s">
                                                <template v-slot:activator="{ on }">
                                                    <span class="overflow-filename" v-on="on">
                                                            {{fileName}}
                                                    </span>
                                                </template>
                                                <span class="custom-tooltip-accent fw-m">{{fileName}}</span>
                                            </v-tooltip>
                                            <v-layout class="d-flex align-center"><v-progress-linear class="blue600 mr-3" indeterminate rounded height="6"></v-progress-linear>20%</v-layout>
                                        </span>
                                    </label>
                                </v-flex>
                            </v-layout>
                        </form>
                    </v-card-text>
                    <v-card-actions class="pa-0 mt-6">
                        <v-spacer/>
                        <v-btn class="normal-text white-light fs-ml elevation-0  blue900" small width="80" height="32" @click="cancelClick"> Cancel</v-btn>
                        <v-btn class="blue700-b normal-text fs-ml elevation-0" style="color:white" small width="80" height="32" @click="clickYes"> Import</v-btn>
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
            isGlow: false
        }
    },

    computed:{
        ...mapGetters(['lctn_serviceProviders', 'lctn_defaultResourceProfile']),

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
        },

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

        importFile(){
            if(this.$refs['iso-input-file'].value != ''){
                console.log(this.$refs['iso-input-file'].value);
                this.fileName = this.$refs['iso-input-file'].value.split( '\\' ).pop();
            }
        },

        clickYes(){
            console.log('import');       
        },

        handleDragStart: function (e) {
            console.log('handleDragStart', e);
            
        },
        handleDragOver: function (e) {
            console.log('handleDragOver', e);
            e.preventDefault();
            this.isGlow = true;
        },
        handleDragEnter: function (e) {
            console.log('handleDragEnter', e);
            this.isGlow = true;
        },
        handleDragLeave: function (e) {
            console.log('handleDragLeave', e);
            this.isGlow = false;
        },
        handleDragEnd: function (e) {
            console.log('handleDragEnd', e);
            this.isGlow = false;
        },
        handleDrop: function (e) {
            e.preventDefault();
            console.log('handleDrop', e.target);
            this.$refs['iso-input-file'].files = e.dataTransfer.files;
            console.log(this.$refs['iso-input-file'].value);
            this.fileName = this.$refs['iso-input-file'].value.split( '\\' ).pop();
            console.log("DROP");
        },
        handleDrag: function (e) {
            console.log('handleDrag', e);
            
        }
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
    Vue.prototype.$windows.registerDialog({ dialogCode: 'importIsoDialog', component})
}

export default component
</script>

<style>
.v-dialog--active{border-radius:0 !important;}
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