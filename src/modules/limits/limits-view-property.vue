<template>
    <v-card class="lmt-prop" v-if="item!=null" tile>
        <v-toolbar fixed flat class="bg-gradient sticky-header" height="60px;">
            <v-toolbar-title class="font-white gd-prp-name" >{{title}}</v-toolbar-title>
            <div class="flex-grow-1"></div>

            <v-btn tile :disabled="lmt_editMode" :text="lmt_editMode" :icon="!lmt_editMode" class="font-white br-4 gd-prp-edt-btn" @click="editClick" v-if="permissionObj('ft_lmtUpdate', item.id)">
                <i v-if="!lmt_editMode" class="icon-Edit iconmoon-unset icon-24"></i>
            </v-btn>

            <v-btn tile icon class="font-white br-4 gd-prp-close" @click="close">
                <i class="icon-Close iconmoon-unset icon-24"></i>
            </v-btn>              
        </v-toolbar>
         <!-- -->

        <div v-show="!lmt_editMode" class="sticky-subheader white border-bottom blue050-border" v-if="permission('ft_tskRead')">
            <v-layout class="pa-2-5">
                <v-spacer></v-spacer>
                <v-btn text class="mr-2 px-1 custom-transform-class text-none grey900 normal-text" @click="goToTasks(false)" @click.middle="goToTasks(true)">
                    <i class="mr-1 icon-log icon-16 grey500-i"></i>View log
                </v-btn>
            </v-layout>
        </div>
        <div v-bar ref="lmt-property" :class="[lmt_editMode ? 'lmt-editable-property-class' : 'lmt-property-class']">
        <div>
        <div class="border-box">
        <c-group>
            <v-layout row wrap class="mt-2">
                <c-labeled-field v-if="lmt_editMode" class="px-3 mt-1 gd-prp-edt-name" xs="12" label="NAME" v-model="item.name" :editMode="lmt_editMode" required="true" :error="errors.name" />
                <c-labeled-field v-if="!lmt_editMode" class="px-3 gd-prp-created" xs="12" label="CREATED" v-model="item.prep.createDateFormatted"/>
                <c-labeled-slot v-if="glb_permissionPA" label="PROVIDER" class="px-3 mt-2"  xs="12">
                    <c-labeled-checkbox class="pl-0 mt-1 label-bigger-font-size"  cbid="lmt-blocked" label="Provider limit" v-model="item.isProviderLimit" :isDisable="!lmt_editMode || !permissionPA()"/>
                </c-labeled-slot>
            </v-layout>
        </c-group>

        <c-group caption="Location">
            <v-layout row wrap class="mt-2" >
                <c-labeled-combo-filter applyUnset="true" class="px-3 gd-prp-project" :editMode="lmt_editMode" xs="6" :items="projects" label="PROJECT" v-model="projectId"/>
                <c-labeled-combo-filter applyUnset="true" class="px-3 gd-prp-group" :editMode="lmt_editMode" xs="6" :items="groups"   label="GROUP"   v-model="groupId"/>
                <c-labeled-field xs="12" class="px-3 mt-3 gd-prp-location" label="LOCATION" v-model="item.prep.resourceProfileFullpath" v-if="!lmt_editMode" />
                <v-layout row wrap class="px-1 gd-prp-edt-location" >
                    <c-labeled-combo-filter v-model="serviceProvider" v-if="lmt_editMode" :items="serviceProviders" xs="6"  label="SERVICE PROVIDER" class="px-3" editMode="true" applyUnset="true" />
                    <c-labeled-combo-filter v-model="dataCenter"      v-if="lmt_editMode" :items="dataCenters"      xs="6"  label="DATACENTER"       class="px-3" editMode="true" applyUnset="true" />
                    <c-labeled-combo-filter v-model="resourceProfile" v-if="lmt_editMode" :items="resourceProfiles" xs="12" label="RESOURCE PROFILE" class="px-3" editMode="true" applyUnset="true" />
                </v-layout>
            </v-layout>
        </c-group>
        
        <c-group caption="Limits" class="pt-2 gd-prp-limits" v-if="!lmt_editMode">
            <v-layout row wrap v-for="(limit, index) in limitsToShow" :key="index">
                <c-labeled-check-combo  :hideLabel="index!=0" :cbid="'limits-items' + index" class="px-3" xs="6" label="LIMIT" :editMode="false" :items="limitsItems" v-model="limit.code" applyUnset="true" :isDisabled="!lmt_editMode" :suggestion="limitCodes[limit.code].description" :checked="limit.isActive"/>
                <c-labeled-field xs="4" :hideLabel="index!=0" class="pl-3 pt-1 text-right" label="VALUE" v-model="limit.value" :editMode="lmt_editMode" :leftText="true" :masked="true" mask="justDigits"/>
                <c-labeled-field xs="2" :hideLabel="index!=0" class="pt-1" label="UNIT" v-model="limitCodes[limit.code].unit" :editMode="false" />
            </v-layout>
        </c-group>

        <c-group caption="Limits" class="pt-2 gd-prp-edt-limits" v-if="lmt_editMode">
            <v-layout row wrap v-for="(limit, index) in limitsItemsEditedShow" :key="index">
                <c-labeled-check-combo  :hideLabel="index!=0" :cbid="'limits-items' + index" :class="['px-3', `gd-prp-lmt-item${index+1}`]" xs="6" label="LIMIT" :editMode="false" :items="limitsItems" v-model="limit.code" applyUnset="true" isDisabled="false" :suggestion="limitCodes[limit.code].description" :checked="limit.isActive" @checkClick="limit.isActive=!limit.isActive"/>
                <c-labeled-field xs="4" :hideLabel="index!=0" class="pl-3 pt-1 text-right" label="VALUE" v-model="limit.value" :editMode="lmt_editMode" :leftText="true" :masked="true" mask="justDigits" />
                <c-labeled-field xs="2" :hideLabel="index!=0" :class="[index!=0 ? 'align-self-center' : 'units-class']" class="pt-1" label="UNIT" v-model="limitCodes[limit.code].unit" :editMode="false" />
            </v-layout>
        </c-group>
        
        </div>
        </div>
        </div>
       <v-footer v-show="lmt_editMode" padless class="font-weight-medium px-4 py-3 justify-space-between blue050-b border-top grey100-border sticky-footer">
               <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-close" @click="close"    :disabled="disableInput" outlined><span class="blue900">Cancel</span></v-btn>
               <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-apply" @click="applyChanges" :loading="disableInput">{{ lmt_editNewObject ? 'Create':'Apply' }}</v-btn>
       </v-footer>
    </v-card>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';
import { objStatus } from '@/consts/_otherConsts';
import limitCodes from '@/consts/limitConsts';
import Vue from 'vue';

export default {  
    data(){
        return{
            objStatus,
            limitCodes,
            defaultLimitCodes: ['cpu', 'ram'],

            limits : [],

            projectId  : null,
            groupId    : null,

            serviceProvider   : null,
            dataCenter        : null,
            resourceProfile   : null,
            limitsItemsEdited : null,

            errors     : {
                name     : false,
            }
        }
    },

    watch:{
        lmt_editMode:{
            handler:function(value){
                if(value){
                    let limItems = {};
                    this.limits.forEach(i => {
                        limItems[i.code] = Object.assign({}, limitCodes[i.code],  { isActive: i.isActive, value: i.value });
                        // if(i.code != 'cpu')
                        //     i.value = i.value / 1024                        
                    });
                    var objLimits = Object.assign({}, this.limitCodes, limItems);  
                    this.limitsItemsEdited = Object.keys(objLimits).map((k,i)=>{ return Object.assign({}, objLimits[k], { code: k})  });
                    // this.limitsItemsEdited.forEach(item=>{
                    //     if(item.code != 'cpu')
                    //         item.value = item.value / 1024
                    // })
                }                    
            },
            deep: true,
            immediate:true
        },

        'item.prep.resourceProfile':{
            handler:function(newValue, oldValue){
                if(!isNullOrUndefined(newValue)){
                    if(!isNullOrUndefined(this.item.prep.serviceProvider))
                        this.serviceProvider = this.item.prep.serviceProvider.id;
                    if(!isNullOrUndefined(this.item.prep.datacenter))
                        this.dataCenter = this.item.prep.datacenter.id;
                    if(!isNullOrUndefined(this.item.prep.resourceProfile))
                        this.resourceProfile = this.item.prep.resourceProfile.id;
                }

                // if(!this.firstCheck)
                //     this.checkForError();
            },
            deep: true,
            immediate:true
        },

        'item.prep.projectId':{
            handler:function(newValue, oldValue){ this.projectId = newValue; },
            deep: true,
            immediate:true
        },

        'item.prep.groupId':{
            handler:function(newValue, oldValue){ this.groupId = newValue; },
            deep: true,
            immediate:true
        },

        serviceProvider:function(value){
            this.dataCenter=null;
            this.serviceProviderError = false;
        },
        
        dataCenter:function(value){
            if(isNullOrUndefined(this.resourceProfiles) 
                || !this.resourceProfiles.find(f=>f.code==this.resourceProfile))
            this.resourceProfile=null;
            this.dataCenterError = false;
        },

        resourceProfile:function(){
            this.resourceProfileError = false;
        },

        item:{
            handler:function(newValue, oldValue){
                if(!isNullOrUndefined(newValue)){
                    var limits = clone(newValue.limitItems)                    
                    limits.forEach(item => {
                        if(item.value == 0 || item.code == 'cpu')
                            return

                        item.value  = (item.value / 1024)// (item.value % 1024) > 0 ?  (item.value / 1024) :  (item.value / 1024).toFixed(2)  
                     });
                    this.limits = limits;
                }
                if(!this.firstCheck)
                     this.checkForError();
            },
            deep: true,
            immediate:true
        },

        lmt_editNewObject:{
            //обнуляем все ошибки при переходе к созданию нового объекта во время редактирования существующего
            handler:function(){ 
                this.serviceProvider = null;
                this.dataCenter      = null;
                this.resourceProfile = null;
                this.serviceProviderError = false;
                this.dataCenterError = false;
                this.resourceProfileError = false;
            }
        }
    },

    computed:{
        ...mapGetters(['lmt_showProperty', 'lmt_edited', 'lmt_editMode', 'lmt_editedApplying', 'glb_permissionPA', 'prj_itemsAll', 
            'grp_itemsAll', 'lmt_editNewObject', 'lctn_serviceProviders', 'lctn_defaultResourceProfile', 'diskPolicy_itemsAll']),

        datastoreTypes(){
            if(this.resourceProfile == null){
                return this.diskPolicy_itemsAll.reduce((unique, o) => {
                    if(!unique.some(obj => obj.code === o.code)) {
                        unique.push(o);
                    }
                    return unique;
                },[]).map(m => m.code)
            }else{
                return this.diskPolicy_itemsAll.filter(d => d.resourceProfileId == this.resourceProfile).map(m => m.code);
            }
        },

        limitsToShow(){
            return this.limits.filter(l => this.datastoreTypes.includes(l.code) || this.defaultLimitCodes.includes(l.code))
        },

        limitsItemsEditedShow(){
            return this.limitsItemsEdited.filter(l => this.datastoreTypes.includes(l.code) || this.defaultLimitCodes.includes(l.code))
        },

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

        title(){
            return this.lmt_editMode ? this.lmt_edited.prep.oldName : this.lmt_showProperty.name;
        },

        storageTotal(){
            return (isNullOrUndefined(this.item.prep.storageTotal) ? 0 : this.item.prep.storageTotal).toString() + " GB";
        },

        item(){
            return this.lmt_editMode ? this.lmt_edited : this.lmt_showProperty;
        },

        projects(){
            return this.prj_itemsAll.map(m=>{ return {code: m.id, name: m.name}});
        },

        groups(){
            var fList = this.grp_itemsAll.filter(f=>f.projectId==this.projectId).map(m=>{ return {code: m.id, name: m.name}});
            return fList;
        },

        limitsItems(){
            return Object.keys(this.limitCodes).map((k,i)=>{ return {code: k, name: this.limitCodes[k].name}});
        },

        disableInput(){
            return this.lmt_editedApplying;
        }
        
    },

    methods:{
        ...mapActions(['lmt_setEdited', 'lmt_applyChangesConfirm', 'lmt_setShowProperty']),

        checkForError(){
            for(let err in this.errors){
                if(this.item[err] == ''){
                    this.errors[err] = true;
                    this.hasError = true;
                }else{
                    this.errors[err] = false;
                }
            }
        },

        formatDate(date){
            return formatDate(date);
        },

        localePrice(a,b){
           return localePrice(a,b);
        },

        editClick(){
            if(this.lmt_editMode)
                this.lmt_setEdited(); // убираем объект из редактора
            else
                this.lmt_setEdited(this.lmt_showProperty.id)
        },
        
        close(){
            if(this.lmt_editMode && !this.lmt_editNewObject)
            {
                this.lmt_setShowProperty(this.lmt_showProperty.id);
                return;
            }
            this.lmt_setShowProperty();
        },

        applyChanges(){
            this.item.keyAttributes = [];

            // добавление кода resourceProfile
            if(!isNullOrUndefined(this.resourceProfile)){
                this.item.keyAttributes.push({ 
                    code    : 'resourceProfile', 
                    valueId : this.resourceProfile
                })
            }

            // добавление кода projectId
            if(!isNullOrUndefined(this.projectId)){
                this.item.keyAttributes.push({ 
                    code    : 'project', 
                    valueId : this.projectId
                })
            }

            // добавление кода groupId
            if(!isNullOrUndefined(this.groupId)){
                this.item.keyAttributes.push({ 
                    code    : 'group', 
                    valueId : this.groupId
                })
            }

            let limArr = [];
            this.limitsItemsEdited.forEach(i => {
                let value = parseInt(i.value)
                if(i.code!='cpu')
                    value = value * 1024;

                limArr.push({
                    code     : i.code, 
                    isActive : i.isActive,
                    value    : value 
                });
            });
            this.item.limitItems = limArr;
            this.firstCheck = false;
            this.hasError = false;
            this.checkForError();

            if(!this.hasError){
                this.lmt_applyChangesConfirm();
            }else{
                showMessage('inputError');
            }
        },

        goToTasks(newWindow){
            this.$nav.navigateTo('tasks', { use: true, objectName: this.item.id }, newWindow)
        }

    },

    mounted(){  
        // if(!isNullOrUndefined(this.item)){
        //     let limItems = {};
        //     this.item.limitItems.forEach(i => {
        //         limItems[i.code] = Object.assign({}, limitCodes[i.code],  { isActive: i.isActive, value: i.value });
        //     });
        //     var objLimits = Object.assign({}, this.limitCodes, limItems);  
        //     this.limitsItemsEdited = Object.keys(objLimits).map((k,i)=>{ return Object.assign({}, objLimits[k], { code: k})  });
        //     console.trace(this.limitsItemsEdited )
        // }

        // if(!isNullOrUndefined(this.item.serviceProvider))
        //     this.serviceProvider = this.item.serviceProvider.code;
        // if(!isNullOrUndefined(this.item.datacenter))
        //     this.dataCenter = this.item.datacenter.code;
        // if(!isNullOrUndefined(this.item.resourceProfile))
        //     this.resourceProfile = this.item.resourceProfile.code;
    }
}
</script>
<style lang="stylus" scoped>
.lmt-prop
    min-height 100vh
</style>
<style scoped>
    .lmt-property-class{
        height: calc(100vh - 60px - 56px);
    }
    .lmt-editable-property-class{
        height: calc(100vh - 60px - 69px);
    }
</style>
