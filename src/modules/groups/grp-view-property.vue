<template>
    <v-card class="grp-prop" v-if="item!=null" tile>
        <v-toolbar fixed flat class="bg-gradient sticky-header" height="60px;">
            <v-toolbar-title class="font-white gd-prp-name">{{title}}</v-toolbar-title>
            <div class="flex-grow-1"></div>

            <v-btn tile :disabled="grp_editMode" :text="grp_editMode" :icon="!grp_editMode" class="font-white br-4 gd-prp-edt-btn" @click="editClick" v-if="permissionObj('ft_grpUpdate', item.id)">
                <i v-if="!grp_editMode" class="icon-Edit iconmoon-unset icon-24"></i>
            </v-btn>

            <v-btn tile icon class="font-white br-4 gd-prp-close" @click="close">
                <i class="icon-Close iconmoon-unset icon-24"></i>
            </v-btn>                 
        </v-toolbar>
        

        <div v-bar ref="grp-property" :class="[grp_editMode ? 'grp-prop--editable':'grp-prop--non-editable']">
        <div>
        <div class="border-box">
            <div v-if="!grp_editMode" class="sticky-subheader white border-bottom blue050-border">
                <v-layout class="pa-2-5 gd-prp-vms-status">
                    <v-flex class="d-flex align-center py-2">
                        <div class="pointer px-1 normal-text fs-xs fw-b green800" @click="gotoRunningVms(false)" @click.middle="gotoRunningVms(true)">
                            <span class="border-bottom-dashed green800-border">Running</span><div class="inline-block ml-1 green100-b px-0-5 fs-xs default-border-radius">{{item.prep.runningTotal}}</div>
                        </div>
                        <div class="pointer px-1 normal-text fs-xs fw-b brown800" @click="gotoSuspendedVms(false)" @click.middle="gotoSuspendedVms(true)">
                            <span class="border-bottom-dashed brown800-border">Suspended</span><div class="inline-block ml-1 brown100-b px-0-5 fs-xs default-border-radius">{{item.prep.suspendedTotal}}</div>
                        </div>
                        <div class="pointer px-1 normal-text fs-xs fw-b grey800" @click="gotoStopedVms(false)" @click.middle="gotoStopedVms(true)">
                            <span class="border-bottom-dashed grey800-border">Stopped</span><div class="inline-block ml-1 grey100-b px-0-5 fs-xs default-border-radius">{{item.prep.stoppedTotal}}</div>
                        </div>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-btn text class="mr-2 px-1 custom-transform-class text-none grey900 normal-text" v-if="permission('ft_tskRead')" @click="goToTasks(false)" @click.middle="goToTasks(true)">
                        <i class="mr-1 icon-log icon-16 grey500-i"></i>View log
                    </v-btn>
                </v-layout>
            </div>
        <c-group v-if="grp_editMode">
            <v-layout row wrap>
                <c-labeled-field        class="px-3 mt-2 gd-prp-edt-name" xs="12" label="NAME"         v-model="item.name"        :editMode="grp_editMode" :disabled="disableInput" required="true" :error="errors.name"/>
                <c-labeled-combo-filter class="px-3 mt-2 gd-prp-edt-project" xs="12" label="PROJECT"      v-model="item.projectId"   :editMode="grp_editMode" :items="projects"        required="true" :error="errors.projectId"/>
                <c-labeled-textArea     class="px-3 mt-1 gd-prp-edt-description" xs="12" label="DESCRIPTION"  v-model="item.description" :editMode="grp_editMode" :disabled="disableInput"/>
            </v-layout>
        </c-group>

        <c-group v-if="!grp_editMode">
            <v-layout row wrap>
                <c-labeled-field class="px-3 mt-2 gd-prp-created" :xs="glb_pricePeriod=='HOUR' ?  7 : 6" label="CREATED" v-model="item.prep.createDateFormatted"/>
                <v-flex :xs="glb_pricePeriod=='HOUR' ? 5 : 6" class="py-0 px-2 gd-prp-price">
                    <v-card flat tile class="grp-prop__price">
                        <span class="grey700 fs-s prop-title nonselect">PRICE PER</span>
                        <v-menu offset-y left v-model="menuPeriod" width="218px">
                            <template v-slot:activator="{ }">
                            <v-tooltip bottom  content-class="custom-tooltip fs-s">
                                <template v-slot:activator="{ on }">
                                    <v-btn text v-on="on" @click.stop="menuPeriod=true" class="grey600 fs-s normal-text mb-0-5 mx-1 px-0 border-none br-4" min-width="unset" height="24px">(<span class="grp-prop__price-period grey600-border border-bottom-dashed">{{glb_pricePeriod}}</span>)</v-btn>
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
                        <!-- <span v-if="label" class="prop-title grey700 fs-s nonselect">{{label}}</span><br> -->
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

                <c-labeled-slot  class="px-3 mt-2 gd-prp-project" xs="6" label="PROJECT">
                    <span class="blue700 pointer" @click="gotoProject(false)" @click.middle="gotoProject(true)"><span class="blue700-border border-bottom-dashed">{{item.prep.projectName}}</span> </span>
                </c-labeled-slot>             
                <c-labeled-slot  class="px-3 mt-2 gd-prp-pricelist" xs="6" label="PRICE" v-if="!isNullOrUndefined(item.prep.priceListName)">
                    <span class="blue700 pointer" @click="gotoPriceList(false)" @click.middle="gotoPriceList(true)"><span class="blue700-border border-bottom-dashed">{{item.prep.priceListName}}</span> </span>
                </c-labeled-slot>

                <c-labeled-textArea class="px-3 mt-1 gd-prp-description" xs="12" label="DESCRIPTION" v-model="item.description"/>
            </v-layout>
        </c-group>

        <c-group v-if="!grp_editMode" caption="Main specs">
            <v-layout row wrap class="mt-1">
                <c-labeled-field class="px-3 gd-prp-cpu" xs="6" label="CPU"      v-model="item.prep.cpuTotal"/>
                <c-labeled-field class="px-3 gd-prp-ram" xs="6" label="RAM (GB)" v-model="item.prep.ramTotalFormatted"/>
            </v-layout>
            <v-layout row wrap class="mt-2">
                <c-labeled-slot  class="px-3 gd-prp-vms" xs="12" label="VMS IN GROUP">
                    <span class="blue700 pointer" @click="gotoVms(false)" @click.middle="gotoVms(true)"><span class="blue700-border border-bottom-dashed">{{item.prep.vmCount}}</span> </span>
                </c-labeled-slot>
            </v-layout>
        </c-group>

        <c-group caption="Meta data" class="gd-prp-comment">
            <v-layout row wrap>
                <c-labeled-textArea class="px-3" xs="12" label="COMMENT" v-model="item.comment" :editMode="grp_editMode"/>
            </v-layout>
        </c-group>
        
        </div>
        </div>
        </div>
        <v-footer v-if="grp_editMode" padless class="font-weight-medium px-4 py-3 justify-space-between border-top grey100-border blue050-b sticky-footer">
               <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-close" @click="close"    :disabled="disableInput" outlined><span class="blue900">Cancel</span></v-btn>
               <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-apply" @click="applyChanges" :loading ="disableInput">{{ grp_editNewObject ? 'Create':'Apply' }}</v-btn>
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
                name      : false,
                projectId : false
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
        grp_editNewObject:{
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
        ...mapGetters(['grp_showProperty', 'grp_edited', 'grp_editMode', 'grp_editedApplying', 'grp_editNewObject', 'prj_itemsAll', 'glb_pricePeriod']),

        projects(){
            return this.prj_itemsAll.map(m=>{return {code: m.id, name: m.name }})
        },

        title(){
            return this.grp_editMode ? this.grp_edited.prep.oldName : this.grp_showProperty.name;
        },

        item(){
            return this.grp_editMode ? this.grp_edited : this.grp_showProperty;
        },

        disableInput(){
            return this.grp_editedApplying;
        },
    },

    methods:{
        ...mapActions(['grp_setEdited', 'grp_applyChangesConfirm', 'grp_setShowProperty', 'glb_setPricePeriod']),

        checkForError(){
            for(let err in this.errors){
                if(isNullOrUndefined(this.item[err]) || this.item[err] == ''){
                    this.errors[err] = true;
                    this.hasError = true;
                }else{
                    this.errors[err] = false;
                }
            }
        },

        editClick(){
            if(this.grp_editMode)
                this.grp_setEdited(); // убираем объект из редактора
            else
                this.grp_setEdited(this.grp_showProperty.id)
        },

        close(){
            if(this.grp_editMode && !this.grp_editNewObject)
            {
                this.grp_setShowProperty(this.grp_showProperty.id);
                return;
            }
            this.grp_setShowProperty();
        },

        gotoPriceList(newWindow){
            this.$nav.navigateTo('pricelists', { use: true, name: this.item.prep.priceListName }, newWindow)
        },

        applyChanges(){
            this.firstCheck = false;
            this.hasError = false;
            this.checkForError();

            if(!this.hasError){
                this.grp_applyChangesConfirm();
            }else{
                showMessage('inputError');
            }
        },

        gotoVms(newWindow){
            this.$nav.navigateTo('vms', { use: true, projectName: this.item.prep.projectName,  groupName: this.item.name }, newWindow)
        },

        gotoProject(newWindow){
            this.$nav.navigateTo('projects', { use: true, name: this.item.prep.projectName }, newWindow)
        },

        gotoRunningVms(newWindow){
            this.$nav.navigateTo('vms', { use: true, projectName: this.item.prep.projectName, groupName: this.item.name, states: ['running'] }, newWindow)
        },

        gotoSuspendedVms(newWindow){
            this.$nav.navigateTo('vms', { use: true, projectName: this.item.prep.projectName,  groupName: this.item.name, states: ['suspended'] }, newWindow)
        },

        gotoStopedVms(newWindow){
            this.$nav.navigateTo('vms', { use: true, projectName: this.item.prep.projectName,  groupName: this.item.name, states: ['stopped'] }, newWindow)
        },

        goToTasks(newWindow){
            this.$nav.navigateTo('tasks', { use: true, objectName: this.item.id }, newWindow)
        }
    },

    // updated() {
    //     this.$vuebar.refreshScrollbar(this.$refs['grp-property']);
    //   },
}
</script>
<style lang="stylus" scoped>
.grp-prop
    min-height 100vh
    &--editable
        height calc(100vh - 60px - 69px)
    &--non-editable
        height calc(100vh - 60px)
    &__price
        line-height 1.1
    &__price-period
        position relative
        top 1px
</style>
<style scoped>
    .sticky-subheader{top:0px; height: 57px;}
</style>

