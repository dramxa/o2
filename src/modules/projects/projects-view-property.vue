<template>
    <v-card class="prj-prop" v-if="item!=null" tile>
        <v-toolbar fixed flat class="bg-gradient sticky-header" height="60px;">
            <v-toolbar-title class="font-white gd-prp-name">{{title}}</v-toolbar-title>
            <div class="flex-grow-1"></div>

            <v-btn tile :disabled="prj_editMode" :text="prj_editMode" :icon="!prj_editMode" class="font-white br-4 gd-prp-edt-btn" @click="editClick" v-if="permission('ft_prjUpdate')">
                <i v-if="!prj_editMode" class="icon-Edit iconmoon-unset icon-24"></i>
            </v-btn>

            <v-btn tile icon class="font-white br-4 gd-prp-close" @click="close">
                <i class="icon-Close iconmoon-unset icon-24"></i>
            </v-btn>                
        </v-toolbar>
        <div v-show="!prj_editMode" class="sticky-subheader white border-bottom blue050-border">
            <v-layout class="pa-2-5 gd-prp-vms-status">
                
                <v-flex class="d-flex align-center py-2">
                    <div class="pointer px-1 normal-text fs-xs fw-b green800 mr-2 gd-prp-running" @click="gotoRunningVms(false)" @click.middle="gotoRunningVms(true)">
                        <span class="border-bottom-dashed green800-border">Running</span><div class="inline-block ml-1 green100-b px-0-5 fs-xs default-border-radius">{{item.prep.runningTotal}}</div>
                    </div>
                    <div class="pointer px-1 normal-text fs-xs fw-b brown800 mr-2 gd-prp-suspended" @click="gotoSuspendedVms(false)" @click.middle="gotoSuspendedVms(true)">
                        <span class="border-bottom-dashed brown800-border">Suspended</span><div class="inline-block ml-1 brown100-b px-0-5 fs-xs default-border-radius">{{item.prep.suspendedTotal}}</div>
                    </div>
                    <div class="pointer px-1 normal-text fs-xs fw-b grey800 gd-prp-stopped"  @click="gotoStopedVms(false)" @click.middle="gotoStopedVms(true)">
                        <span class="border-bottom-dashed grey800-border">Stopped</span><div class="inline-block ml-1 grey100-b px-0-5 fs-xs default-border-radius">{{item.prep.stoppedTotal}}</div>
                    </div>
                </v-flex>
                <v-spacer></v-spacer>
                <v-btn text class=" px-1 custom-transform-class text-none grey900 normal-text" v-if="permission('ft_tskRead')" @click="goToTasks(false)" @click.middle="goToTasks(true)">
                    <i class="mr-1 icon-log icon-16 grey500-i"></i>View log
                </v-btn>
            </v-layout>
        <!-- -->
        </div>
        <div v-bar ref="prj-property" :class="[prj_editMode ? 'prj-prop--editable' :'prj-prop--non-editable']">
        <div>
        <div class="border-box">

        <c-group v-if="prj_editMode">
            <v-layout row wrap class="mt-2">
                <c-labeled-field    class="px-3 gd-prp-edt-name"          xs="6"  label="NAME"        v-model="item.name"        :editMode="prj_editMode" :disabled="disableInput" required="true"  :error="errors.name"/>
                <c-labeled-date     class="px-3 gd-prp-edt-expired mt-n1" xs="6"  label="EXPIRED"     v-model="item.expiryDate"  :editMode="prj_editMode" :clearIcon="true"></c-labeled-date>
                <c-labeled-textArea class="px-3 gd-prp-edt-description"   xs="12" label="DESCRIPTION" v-model="item.description" :editMode="prj_editMode" :disabled="disableInput"/>
            </v-layout>
        </c-group>

        <c-group v-if="!prj_editMode">
            <v-layout row wrap>
                <c-labeled-field class="px-3 mt-2 gd-prp-created" :xs="glb_pricePeriod=='MONTH' ? 5 : glb_pricePeriod=='HOUR' ? 7 : 6" label="CREATED" v-model="item.prep.createDateFormatted"/>
                <v-flex :xs="glb_pricePeriod=='MONTH' ? 7 : glb_pricePeriod=='HOUR' ? 5 : 6" class="px-3 pa-0 mt-1 gd-prp-price">
                    <v-card flat tile class="prc-prop__price">
                        <span class="grey700 fs-s prop-title nonselect">PRICE PER</span>
                        <v-menu offset-y left v-model="menuPeriod" width="218px">
                            <template v-slot:activator="{ }">
                            <v-tooltip bottom  content-class="custom-tooltip fs-s">
                                <template v-slot:activator="{ on }">
                                <v-btn text v-on="on" @click.stop="menuPeriod=true" class="grey600 fs-s normal-text mb-0-5 mx-1 px-0 border-none br-4" min-width="unset" height="24px">(<span class="prc-prop__price-period grey600-border border-bottom-dashed">{{glb_pricePeriod}}</span>)</v-btn>
                                </template>
                                <span class="custom-tooltip-accent fw-m">Choose period</span>
                            </v-tooltip>
                            </template>
                            <v-list width="150px" class="control-combobox py-2 border blue050-border br-4">
                                <v-list-item class="fs-m dropdown-menu-item" @click="glb_setPricePeriod('HOUR')"  ><span :class="glb_pricePeriod=='HOUR' ? 'blue800 fw-b':'grey700'">Hour</span></v-list-item>
                                <v-list-item class="fs-m dropdown-menu-item" @click="glb_setPricePeriod('DAY')"   ><span :class="glb_pricePeriod=='DAY' ? 'blue800 fw-b':'grey700'">Day</span></v-list-item>
                                <v-list-item class="fs-m dropdown-menu-item" @click="glb_setPricePeriod('MONTH')" ><span :class="glb_pricePeriod=='MONTH' ? 'blue800 fw-b':'grey700'">Month</span></v-list-item>
                            </v-list>
                        </v-menu>
                        <span class="text--primary prop-value"  v-if="!isNullOrUndefined(item.prep.prices)">
                            <div v-if="glb_pricePeriod=='HOUR'">
                                <div v-for="[key, value] in Object.entries(item.prep.prices)" :key="key" class="grey900 fs-xl text-right fw-b">{{value.priceTotalPerHourFormatted}}</div>
                            </div>
                            <div v-if="glb_pricePeriod=='DAY'">
                                <div v-for="[key, value] in Object.entries(item.prep.prices)" :key="key" class="grey900 fs-xl text-right fw-b">{{value.priceTotalPerDayFormatted}}</div>
                            </div>
                            <div v-if="glb_pricePeriod=='MONTH'">
                                <div v-for="[key, value] in Object.entries(item.prep.prices)" :key="key" class="grey900 fs-xl text-right fw-b">{{value.priceTotalPerMonthFormatted}}</div>
                            </div>
                        </span>
                    </v-card>
                </v-flex>
            </v-layout>
            <v-layout row wrap class="mt-2">
                <c-labeled-field class="px-3 gd-prp-expired" xs="6"  label="EXPIRED"     v-model="item.prep.expiryDateFormatted"/>
                <c-labeled-slot  class="px-3 gd-prp-pricelist" xs="6"  label="DEFAULT PRICE" v-if="!isNullOrUndefined(item.prep.priceListName)">
                    <span class="blue700 pointer" @click="gotoPriceList(false)" @click.middle="gotoPriceList(true)"><span class="blue700-border border-bottom-dashed">{{item.prep.priceListName || '-'}}</span> </span>
                </c-labeled-slot>

            </v-layout>
            <v-layout row wrap>
                <c-labeled-textArea class="px-3  mt-2 gd-prp-description" xs="12" label="DESCRIPTION" v-model="item.description"/>
            </v-layout>
        </c-group>


        <c-group v-if="!prj_editMode" caption="Main specs">
            <v-layout row wrap>
                    <c-labeled-field class="px-3 mt-3 gd-prp-cpu" xs="6" label="CPU"      v-model="item.prep.cpuTotal"/>
                    <c-labeled-field class="px-3 mt-3 gd-prp-ram" xs="6" label="RAM (GB)" v-model="item.prep.ramTotalFormatted"/>
                    <c-labeled-slot  class="px-3 mt-3 gd-prp-groups" xs="6" label="GROUPS">
                        <span class="blue700 pointer" @click="gotoGroups(false)" @click.middle="gotoGroups(true)"><span class="blue700-border border-bottom-dashed">{{item.prep.groupCount}}</span> </span>
                    </c-labeled-slot>
                    <c-labeled-slot  class="px-3 mt-3 gd-prp-vms" xs="6" label="VMS">
                        <span class="blue700 pointer" @click="gotoVms(false)" @click.middle="gotoVms(true)"><span class="blue700-border border-bottom-dashed">{{item.prep.vmCount}}</span> </span>
                    </c-labeled-slot>
            </v-layout>
        </c-group>

        <c-group caption="Meta data" class="gd-prp-comment">
            <v-layout row wrap>
                <c-labeled-textArea class="px-3" xs="12" label="COMMENT" v-model="item.comment" :editMode="prj_editMode"/>
            </v-layout>
        </c-group>
        </div>
        </div>
        </div>
        
       <v-footer v-show="prj_editMode" padless class="font-weight-medium px-4 py-3 justify-space-between blue050-b border-top grey100-border sticky-footer">
               <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-close" @click="close"        :disabled="disableInput" outlined><span class="blue900">Cancel</span></v-btn>
               <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-apply" @click="applyChanges" :loading ="disableInput">{{ prj_editNewObject ? 'Create':'Apply' }}</v-btn>
       </v-footer>
    </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Vue from 'vue';

export default {  
    data(){
        return{
            hasError   : false,
            firstCheck : true,
            menuPeriod : false,
            errors     : {
                name : false
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
        prj_editNewObject:{
            //обнуляем все ошибки при переходе к созданию нового объекта во время редактирования существующего
            handler:function(){ 
                this.firstCheck = true;
                for(let err in this.errors){
                    this.hasError = false;
                    this.errors[err] = false;
                }
            }
        }
    },

    computed:{
        ...mapGetters(['prj_showProperty', 'prj_edited', 'prj_editMode', 'prj_editedApplying', 'prj_editNewObject', 'glb_pricePeriod']),

        title(){
            return this.prj_editMode ? this.prj_edited.prep.oldName : this.prj_showProperty.name;
        },

        item(){
            return this.prj_editMode ? this.prj_edited : this.prj_showProperty;
        },

        disableInput(){
            return this.prj_editedApplying;
        },
    },

    methods:{
        ...mapActions(['prj_setEdited', 'prj_applyChangesConfirm', 'prj_setShowProperty', 'glb_setPricePeriod']),

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

        editClick(){
            if(this.prj_editMode)
                this.prj_setEdited(); // убираем объект из редактора
            else
                this.prj_setEdited(this.prj_showProperty.id)
        },

        close(){
            if(this.prj_editMode && !this.prj_editNewObject)
            {
                this.prj_setShowProperty(this.prj_showProperty.id);
                return;
            }
            this.prj_setShowProperty();
        },

        gotoPriceList(newWindow){
            this.$nav.navigateTo('pricelists', { use: true, name: this.item.prep.priceListName }, newWindow)
        },

        gotoVms(newWindow){
            this.$nav.navigateTo('vms', { use: true, projectName: this.item.name }, newWindow)
        },

        gotoGroups(newWindow){
            this.$nav.navigateTo('groups', { use: true, projectName: this.item.name }, newWindow)
        },


        applyChanges(){
            this.firstCheck = false;
            this.hasError = false;
            this.checkForError();

            if(!this.hasError){
                this.prj_applyChangesConfirm();
            }else{
                showMessage('inputError');
            }
        },

        gotoRunningVms(newWindow){
            this.$nav.navigateTo('vms', { use: true, projectName: this.title, states: ['running'] }, newWindow)
        },

        gotoSuspendedVms(newWindow){
            this.$nav.navigateTo('vms', { use: true, projectName: this.title, states: ['suspended'] }, newWindow)
        },

        gotoStopedVms(newWindow){ 
            this.$nav.navigateTo('vms', { use: true, projectName: this.title, states: ['stopped'] }, newWindow)
        },

        goToTasks(newWindow){
            this.$nav.navigateTo('tasks', { use: true, objectName: this.item.id }, newWindow)
        }
    }
}
</script>
<style lang="stylus" scoped>
.prj-prop
    min-height 100vh
    &--editable
        height calc(100vh - 60px - 69px)
    &--non-editable
        height calc(100vh - 60px - 57px)
    &__price
        line-height 1.1
    &__price-period
        position relative
        top 1px
</style>
<style scoped>
    .sticky-subheader{height:57px;}
</style>

