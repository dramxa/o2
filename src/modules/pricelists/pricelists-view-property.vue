<template>
    <v-card class="prc-prop" v-if="item!=null" tile>
        <v-toolbar fixed flat class="bg-gradient sticky-header" height="60px;">
            <v-toolbar-title class="font-white gd-prp-name">{{title}}</v-toolbar-title>
            <div class="flex-grow-1"></div>

            <v-btn tile :disabled="prc_editMode" :text="prc_editMode" :icon="!prc_editMode" class="font-white br-4 gd-prp-edt-btn" @click="editClick" v-if="permissionObj('ft_prcUpdate', item.id)">
                <i v-if="!prc_editMode" class="icon-Edit iconmoon-unset icon-24"></i>
            </v-btn>

            <v-btn tile icon class="font-white br-4 gd-prp-close" @click="close">
                <i class="icon-Close iconmoon-unset icon-24"></i>
            </v-btn>              
        </v-toolbar>
         <!-- -->

        <div v-show="!prc_editMode" class="sticky-subheader white border-bottom blue050-border" v-if="permission('ft_tskRead')">
            <v-layout class="pa-2-5">
                <v-spacer></v-spacer>
                <v-btn text class="mr-2 px-1 custom-transform-class text-none grey900 normal-text" @click="goToTasks(false)" @click.middle="goToTasks(true)">
                    <i class="mr-1 icon-log icon-16 grey500-i"></i>View log
                </v-btn>
            </v-layout>
        </div>
        <div v-bar ref="prc-property" :class="[prc_editMode ? 'prc-prop--editable' : 'prc-prop--non-editable']">
        <div>
            <div class="border-box">
            <c-group>
                <v-layout row wrap class="mt-2">
                    <c-labeled-field v-if="prc_editMode" class="px-3 mt-1 gd-prp-edt-name" xs="6" label="NAME" v-model="item.name" :editMode="prc_editMode" required="true" :error="errors.name"/>
                    <c-labeled-combo-filter class="px-3 gd-prp-currency" xs="6" label="CURRENCY" v-model="item.currencyCode" :items="currenciesCode" :editMode="prc_editNewObject" required="true" :error="errors.currencyCode"/>
                    <c-labeled-field v-if="!prc_editMode" class="px-3 gd-prp-created" xs="6" label="CREATED" v-model="item.prep.createDateFormatted"/>
                    <c-labeled-slot label="PROVIDER" class="px-3 mt-2 gd-prp-provider"  xs="12">
                        <c-labeled-checkbox class="pl-0 mt-1 label-bigger-font-size"  cbid="prc-blocked" label="Provider price" v-model="item.isProviderPrice" :isDisable="!prc_editMode"/>
                    </c-labeled-slot>
                </v-layout>
            </c-group>

            <c-group>
                <v-layout class="mb-0 gd-prp-description">
                    <v-flex xs12>
                        <c-labeled-textArea class="px-2" xs="12" label="DESCRIPTION" v-model="item.description" :editMode="prc_editMode"/>
                    </v-flex>
                </v-layout>
            </c-group>

            <c-group caption="Location">
                <v-layout row wrap class="mt-2" >
                    <c-labeled-combo-filter applyUnset="true" class="px-3 gd-prp-project" :editMode="prc_editMode" xs="6" :items="projects" label="PROJECT" v-model="item.projectId"/>
                    <c-labeled-combo-filter applyUnset="true" class="px-3 gd-prp-group" :editMode="prc_editMode" xs="6" :items="groups"   label="GROUP" v-model="item.groupId"/>
                    <c-labeled-field xs="12" class="px-3 mt-3 gd-prp-location" label="LOCATION" v-model="item.prep.resourceProfileFullpath" v-if="!prc_editMode" />
                    
                    <v-layout row wrap class="px-1 gd-prp-edt-location">
                        <c-labeled-combo-filter v-model="serviceProvider" v-if="prc_editMode" :items="serviceProviders" xs="6"  label="SERVICE PROVIDER" class="px-3" editMode="true" applyUnset="true" required="true" :error="serviceProviderError" />
                        <c-labeled-combo-filter v-model="dataCenter"      v-if="prc_editMode" :items="dataCenters"      xs="6"  label="DATACENTER"       class="px-3" editMode="true" applyUnset="true" required="true" :error="dataCenterError" />
                        <c-labeled-combo-filter v-model="resourceProfile" v-if="prc_editMode" :items="resourceProfiles" xs="12" label="RESOURCE PROFILE" class="px-3" editMode="true" applyUnset="true" required="true" :error="resourceProfileError" />
                    </v-layout>
                    
                </v-layout>
            </c-group>
            
            <c-group class="gd-prp-prices">
                <v-expansion-panels accordion  v-for="(service, index) in servicesToShow" :key="index" :class="[`gd-prp-prices-item${ index + 1 }`, !prc_editMode && item.prep.prices[service.serviceCode] == 0 ? 'd-none': '']">
                    <v-expansion-panel flat>
                        <v-expansion-panel-header :class="['px-0', `gd-prp-prices-item${ index + 1 }-btn`]" expand-icon="mdi-chevron-down grey500">
                                <v-container class="pt-0">
                                    <v-layout row>
                                        <v-flex grow>
                                            <label class="prc-prop__price-name pointer blue500 white fs-ml">{{services[service.serviceCode].name}}<span class="fs-s grey300"> per hour</span></label>  
                                            <v-tooltip bottom max-width="250"  content-class="custom-tooltip fs-s">
                                                <template v-slot:activator="{ on }">
                                                <div class="pr-2 white inline-block" v-on="on"><div class="prc-prop__price-info grey500 grey100-b fs-m text-center pointer d-inline-block">?</div></div>
                                                </template>
                                                <span class="custom-tooltip-accent fw-m">{{services[service.serviceCode].description}}</span>
                                            </v-tooltip>
                                            <v-spacer class="price-spacer border-bottom grey100-border" />
                                        </v-flex>
                                        <v-flex shrink class="pt-2">
                                            <label class="text-xs-right fs-m">{{localePrice(item.prep.prices[service.serviceCode], item.currencyCode, 4)}}</label>
                                        </v-flex>          
                                    </v-layout>
                                </v-container>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content class="px-4 monospace pb-2">
                            <v-layout row wrap>
                                <v-flex xs8 class="fs-m grey700">From</v-flex>
                                <v-flex xs4 class="fs-m pl-4 grey700">Price</v-flex>
                                <v-flex xs12 v-for="(history, index) in service.history" :key="index">
                                    <v-layout>
                                        <v-flex xs7 class="fs-m pl-4">{{formatDate(history.dateFrom)}}</v-flex>
                                        <v-flex xs5 class="fs-m text-right">{{localePrice(history.price, item.currencyCode, 4)}}<v-btn v-if="prc_editMode" @click="deletePriceHistory(index, service.serviceCode)" icon class="ml-1" width="20" height="20"><i class="icon-trash icon-16"></i></v-btn></v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 v-if="prc_editMode && forNew[service.serviceCode].newModel">
                                    <v-layout>
                                        <v-flex xs7 class="pa-1 pl-4" v-if="prc_editMode">
                                            <c-labeled-date 
                                                xs="12" 
                                                v-model="forNew[service.serviceCode].date"  
                                                :editMode="prc_editMode" 
                                                :error="forNew[service.serviceCode].dateError"
                                                :class="[`gd-prp-prices-item${ index + 1 }-dateInput`]"                                            
                                                />
                                        </v-flex>
                                        <v-flex xs5>
                                            <v-layout class="relative">
                                                <c-labeled-field 
                                                    v-if="prc_editMode" 
                                                    :masked="true" 
                                                    mask="currency_4" 
                                                    v-model="forNew[service.serviceCode].price" 
                                                    class="mt-1-5" 
                                                    :class="[`gd-prp-prices-item${ index + 1 }-priceInput`]"                                            
                                                    :leftText="true" 
                                                    editMode="true" 
                                                    :error="forNew[service.serviceCode].priceError"
                                                    />
                                                <v-btn 
                                                    @click="addNew(service.serviceCode)" 
                                                    text 
                                                    height="24px" 
                                                    width="24px" 
                                                    class="prc-prop__add-new-price-btn mt-1-5 br-2 normal-text justify-space-between align-center fs-s fw-b grey700 grey300-border px-1" 
                                                    :class="[`gd-prp-prices-item${ index + 1 }-pushBtn`]"                                            
                                                    outlined
                                                    >
                                                    <i class="grey500-i icon-Create icon-14"></i>
                                                </v-btn>
                                                <v-btn 
                                                    icon 
                                                    @click="forNew[service.serviceCode].newModel = false" 
                                                    class="cancel-add-new-button"
                                                    :class="[`gd-prp-prices-item${ index + 1 }-cancelBtn`]"                                            
                                                    >
                                                    <i class="grey500-i icon-Close icon-16"></i>
                                                </v-btn>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                
                                <v-flex xs12 class="mt-2 pr-0" v-if="prc_editMode && !forNew[service.serviceCode].newModel">
                                    <v-btn @click="forNew[service.serviceCode].newModel = true" text height="24px"
                                        :class="[`gd-prp-prices-item${ index + 1 }-addBtn`]"
                                        class="prc-prop__add-new-btn normal-text justify-space-between align-center fs-s fw-b grey700 grey300-border px-2" outlined>
                                        <div>Add new</div>
                                        <div> <i class="grey500-i icon-Create icon-10"></i> </div>
                                    </v-btn>
                                </v-flex>
                            </v-layout>                     
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
        </c-group>
            </div>
        </div>
        </div>
       <v-footer v-show="prc_editMode" padless class="font-weight-medium px-4 py-3 justify-space-between blue050-b border-top grey100-border sticky-footer">
            <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-close" @click="close"    :disabled="disableInput" outlined><span class="blue900">Cancel</span></v-btn>
            <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-apply" @click="applyChanges" :loading="disableInput">{{ prc_editNewObject ? 'Create':'Apply' }}</v-btn>
       </v-footer>
    </v-card>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';
import { objStatus } from '@/consts/_otherConsts';
import { vmPresets, vmPrecision, vmDiskPolicyTypes } from '@/consts/vmConsts';
import { currencies, currenciesCode, services } from '@/consts/pricelistConst';
import Vue from 'vue';

export default {  
    data(){
        return{
            defaultServiceCodes: ['cpu', 'ram'],
            objStatus,
            vmDiskPolicyTypes,
            currencies,
            currenciesCode,
            services,
            serviceProvider : null,
            dataCenter      : null,
            resourceProfile : null,
            hasError   : false,
            firstCheck : true,
            serviceProviderError : false,
            dataCenterError      : false,
            resourceProfileError : false,
            errors     : {
                name            : false,
                currencyCode    : false,
            },
            forNew: {
                cpu : {
                    date: null,
                    price: null,
                    newModel: false,
                    datePicker: false,
                    dateError: false,
                    priceError: false,
                },

                ram : {
                    date: null,
                    price: null,
                    newModel: false,
                    datePicker: false,
                    dateError: false,
                    priceError: false,
                },

                sas : {
                    date: null,
                    price: null,
                    newModel: false,
                    datePicker: false,
                    dateError: false,
                    priceError: false,
                },

                sata : {
                    date: null,
                    price: null,
                    newModel: false,
                    datePicker: false,
                    dateError: false,
                    priceError: false,
                },

                ssd : {
                    date: null,
                    price: null,
                    newModel: false,
                    datePicker: false,
                    dateError: false,
                    priceError: false,
                },

                winlic : {
                     date: null,
                     price: null,
                     newModel: false,
                     datePicker: false,
                    dateError: false,
                    priceError: false,
                },

                edge : {
                    date: null,
                    price: null,
                    newModel: false,
                    datePicker: false,
                    dateError: false,
                    priceError: false,
                } 
            }
        }
    },

    watch:{
        item:{
            handler:function(){
                if(!this.firstCheck)
                    this.checkForError();
            },
            deep: true,
            immediate:true
        },
        prc_editNewObject:{
            //обнуляем все ошибки при переходе к созданию нового объекта во время редактирования существующего
            handler:function(){ 
                this.serviceProvider = null;
                this.dataCenter      = null;
                this.resourceProfile = null;
                this.firstCheck = true;
                for(let err in this.errors){
                    this.hasError = false;
                    this.errors[err] = false;
                }
            }
        }
    },

    computed:{
        ...mapGetters(['prc_showProperty', 'prc_edited', 'prc_editMode', 'prc_editedApplying', 'prj_itemsAll', 'grp_itemsAll', 'prc_editNewObject',
         'lctn_serviceProviders', 'lctn_defaultResourceProfile', 'diskPolicy_itemsAll']),

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

        servicesToShow(){
            return this.item.services.filter(s => this.datastoreTypes.includes(s.serviceCode) || this.defaultServiceCodes.includes(s.serviceCode))
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
            return this.prc_editMode ? this.prc_edited.prep.oldName : this.prc_showProperty.name;
        },

        item(){
            return this.prc_editMode ? this.prc_edited : this.prc_showProperty;
        },

        projects(){
            return this.prj_itemsAll.map(m=>{ return {code: m.id, name: m.name}});
        },

        groups(){
            var fList = this.grp_itemsAll.filter(f=>f.projectId==this.item.projectId).map(m=>{ return {code: m.id, name: m.name}});
            return fList;
        },

        networks(){
            return this.net_itemsAll.map(m=>{ return {code: m.id, name: m.name}});
        },

        disableInput(){
            return this.prc_editedApplying;
        }
        
    },

    methods:{
        ...mapActions(['prc_setEdited', 'prc_applyChangesConfirm', 'prc_setShowProperty']),

        

        checkForError(){
            for(let err in this.errors){
                if(this.item[err] == '' || isNullOrUndefined(this.item[err])){
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

        localePrice(a,b, c){
           return localePrice(a,b, c);
        },

        addNew(code){
            this.forNew[code].dateError  = false;
            this.forNew[code].priceError = false;
            if(isNullOrUndefined(this.forNew[code].date)) {
                this.forNew[code].dateError = true;
            }
            if(isNullOrUndefined(this.forNew[code].price) || this.forNew[code].price == ''){
                this.forNew[code].priceError = true;
            }
            if(this.forNew[code].dateError || this.forNew[code].priceError){
                return;
            }
            
            var newPrice = {dateFrom:this.forNew[code].date, price:this.forNew[code].price};
            this.item.services.forEach(srvc => {
                if(srvc.serviceCode == code){
                    srvc.history.push(newPrice);
                    let tempHistArr = srvc.history;
                    tempHistArr.forEach(t => {
                        if(!Number.isInteger(t.dateFrom))
                            t.dateFrom = Date.parse(t.dateFrom);
                    });
                    tempHistArr.sort((a, b) => a.dateFrom < b.dateFrom ? 1 : -1);
                    tempHistArr.forEach(t => {
                        let date = new Date(t.dateFrom);
                        let dd   = date.getDate();
                        let mm   = date.getMonth() + 1;
                        if (dd<10)
                            dd = '0' + dd;
                        if (mm<10)
                            mm = '0' + mm;
                        let yyyy = date.getFullYear();
                        t.dateFrom = yyyy + '-' + mm + '-' + dd;
                    });
                    srvc.history = tempHistArr;
                    this.item.prep.prices[code] = tempHistArr[0].price;
                }
            });
            this.forNew[code].date = null
            this.forNew[code].price = null
            this.forNew[code].newModel = false
        },

        deletePriceHistory(index, code){
            this.item.services.forEach(srvc => {
                if(srvc.serviceCode == code)
                    srvc.history.splice(index, 1);
            });
        },

        editClick(){
            if(this.prc_editMode)
                this.prc_setEdited(); // убираем объект из редактора
            else
                this.prc_setEdited(this.prc_showProperty.id)
        },
        
        close(){
            if(this.prc_editMode && !this.prc_editNewObject)
            {
                this.prc_setShowProperty(this.prc_showProperty.id);
                return;
            }
            this.prc_setShowProperty();
        },

        applyChanges(){
            this.firstCheck = false;
            this.hasError = false;
            this.checkForError();
            if(isNullOrUndefined(this.serviceProvider))
                this.serviceProviderError = true;
            else
                this.serviceProviderError = false;
            if(isNullOrUndefined(this.dataCenter))
                this.dataCenterError = true;
            else
                this.dataCenterError = false;
            if(isNullOrUndefined(this.resourceProfile))
                this.resourceProfileError = true;
            else
                this.resourceProfileError = false;
            if(this.serviceProviderError || this.dataCenterError || this.resourceProfileError){
                showMessage('inputError');
                return;
            }
            this.item.resourceProfileId = this.resourceProfile;
            if(!this.hasError){
                this.prc_applyChangesConfirm();
            }else{
                showMessage('inputError');
            }
        },

        goToTasks(newWindow){
            this.$nav.navigateTo('tasks', { use: true, objectName: this.item.id }, newWindow)
        }

    },

    mounted(){     
        if(!isNullOrUndefined(this.item) && !isNullOrUndefined(this.item.prep.serviceProvider)){
            this.serviceProvider = this.item.prep.serviceProvider.id;
            if(!isNullOrUndefined(this.item.prep.datacenter))
                this.dataCenter = this.item.prep.datacenter.id;
            if(!isNullOrUndefined(this.item.prep.resourceProfile))
                this.resourceProfile = this.item.prep.resourceProfile.id;
        }
    }
}
</script>
<style lang="stylus" scoped>
.prc-prop
    min-height 100vh
    &--editable
        height calc(100vh - 60px - 69px)
    &--non-editable
        height calc(100vh - 60px)
    &__price-name
        padding 12px 6px !important
        font-size 14px
        line-height 16px
    &__price-info
        border-radius 50%
        width 16px
    &__add-new-price-btn
        min-width 24px !important
        padding-left 3px !important
    &__add-new-btn
        width 100% !important
        text-align left
        text-transform none
        border-style dashed
</style>
<style scoped>
    .cancel-add-new-button{position: absolute;right: -27px;top: 5px;width: 24px;height: 24px;}
</style>
