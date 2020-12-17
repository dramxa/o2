<template>
    <v-stepper v-model="stepperIndex" class="elevation-0 no-transition" style="width: 100%;">
      <v-stepper-header class="d-flex justify-space-between align-center px-8 elevation-0 border-bottom border-top blue050-border location-header">
          <div class="gd-stepper">
                <v-layout>
                    <template v-for="step in steps">
                    <v-stepper-step
                        :key="`${step.value}-step`"
                        :complete="complete"
                        :step="step.value"
                        @click="changeStep(step.value)"
                        :class="[stepperIndex == step.value ? 'blue100-b' : '', 'px-2 py-1 br-6 pointer', `gd-stepper-step${step.value}`]"
                    >
                        <p class="fs-m mb-0 fw-b" :class="[stepperIndex == step.value ? 'blue800' : 'grey500']"><span class="monospace">{{step.value}}. </span>{{step.name}}</p>
                        <p class="fs-s mb-0 pl-4" :class="[stepperIndex == step.value ? 'blue800' : 'grey500']">{{ isNullOrUndefined(step.item)? 'not selected': step.item.name }}</p>
                    </v-stepper-step>

                    <v-icon  class="mx-2 grey500"
                        v-if="step.value !== steps.length"
                        :key="step.value">mdi-arrow-right</v-icon>
                    </template>
                </v-layout> 
            </div>
        <!-- <v-btn text tile class="step-close-button p-0 elevation-0 white"><i class="icon-Close1 icon-24"></i></v-btn> -->
      </v-stepper-header>

      <v-stepper-items >
        <v-stepper-content
          v-for="step in steps"
          :key="`${step.value}-content`"
          :step="step.value"
          class="pa-0 elevation-0"
        >
        <v-container fluid class="pa-0" >
            <v-row class="ma-0">
                <v-col cols="5" class="pa-0 full-height-col blue050-border border-right" :class="[{'location-fixed-witdh-left-column': $vuetify.breakpoint.lgAndUp}, `gd-step${step.value}-list`]" v-bar>
                  <div>
                    <div class="border-box">
                      <div v-for="(item, index) in items" :key="index" class="pa-4 border-bottom border-right blue050-border d-flex align-center pointer"  :class="[{'blue100-b active-location-element': item.id == selectedItem.id}, `gd-step${step.value}-list-item${index+1}`]" style="margin-right: -17px;" @click="changeItem(item)"> 
                          <img v-if="!isNullOrUndefined(item.smallLogo) && item.smallLogo != ''" :src="require('../../assets/lctnIcons/' + item.smallLogo)" alt="" class="br-4 location-mini-img mr-3">
                          <div v-else class="location-mini-img mr-3"></div>
                          <span class="fs-xl fw-b blue800">{{item.name}}</span>
                          <v-spacer/>
                          <i v-if="item.isLocked" class="icon-lock grey500-i icon-24 mr-2"></i>
                      </div>
                    </div>
                  </div>
                </v-col>
                <v-col cols="7" :class="{'col col-7': !$vuetify.breakpoint.lgAndUp}" class="full-height-col pa-0">
                  <div style="max-width: 664px;">
                    <v-layout  v-if="!isNullOrUndefined(selectedItem)" class="border-bottom blue050-border d-flex align-center justify-space-between px-8" style="height:77px;">
                      <div class="fs-xxl fw-b blue800">{{selectedItem.name}}</div>
                      <div v-if="!isDialog && permissionPA()">
                              <v-btn v-if="!editMode" tile icon class="br-4 mr-2" @click="lctn_changeItemLockState()">
                                <i class="icon-lock grey500-i icon-24"></i>
                              </v-btn>  
                              <v-btn v-if="!editMode" tile icon class="br-4 mr-2" @click="lctn_setEdited(true)">
                                <i class="icon-Edit grey500-i icon-24"></i>
                              </v-btn> 
                              <v-btn v-if="!editMode" tile icon class="br-4" @click="lctn_deleteConfirm()">
                                <i class="icon-trash grey500-i icon-24"></i>
                              </v-btn>  
                        <v-btn v-if="editMode" tile icon class="br-4">
                            <i class="icon-Close grey500-i icon-24" @click="lctn_setEdited(false)"></i>
                        </v-btn>  
                      </div>
                    </v-layout>
                    <v-layout v-if="!isNullOrUndefined(selectedItem) && selectedItem.isLocked"  class="px-8 py-2 yellow-alert">
                      <i class="icon-alert-triangle grey800-i icon-24 mr-4"></i><span class="fw-m grey800">Service provider now is locked</span>
                    </v-layout>
                    <v-layout v-if="!isNullOrUndefined(selectedItem)" :class="`gd-step${step.value}-info`" class="d-flex px-8 mt-8">
                        <div v-if="!editMode" class="flex-grow-1 pr-4">
                            <div class="fs-m blue700 mb-3 pointer" @click="goToLink(selectedItem.site)">{{selectedItem.site}}</div>
                            <div class="fs-m grey900 mb-1" >{{description}}</div>
                            <div class="fs-m blue700 mb-8" v-if="!showFullText && largeText" @click="showFullText=!showFullText"><span class="border-dashed blue700-border pointer">Читать дальше</span></div>
                            <div class="fs-m blue700 mb-8" v-if="showFullText && largeText" @click="showFullText=!showFullText"><span class="border-dashed blue700-border pointer">Скрыть</span></div>
                        </div>

                        <div v-if="editMode" class="flex-grow-1 pr-6">
                            <c-labeled-field label="NAME" class="mt-n1" v-model="lctn_edited.name" editMode="true" required="true"/>
                            <c-labeled-field label="SITE" class="mt-2" v-model="lctn_edited.site" editMode="true" required="true"/>
                            <c-labeled-textArea label="DESCRIPTION" class="mt-2" v-model="lctn_edited.description" :editMode="true"/>
                        </div>

                        <div class="flex-grow-0" style="max-width:200px;">
                            <img :src="require('../../assets/lctnIcons/' + selectedItem.bigLogo)"
                            alt="" class="location-big-img">
                        </div>
                    </v-layout>
                    <v-layout v-if="!isNullOrUndefined(selectedItem)" class="mt-4 px-8">
                      <v-flex class="d-flex">
                        <v-btn
                          v-if="!editMode && stepperIndex == 1"
                          @click="backStep()"
                          text
                          disabled
                          outlined
                          :class="['normal-text grey300 fs-ml fw-b grey700-border br-4 mr-2', `gd-step${step.value}-select-btn`]"
                          height="32px"
                        >
                        Back
                        </v-btn>
                        <v-btn
                          v-if="!editMode && stepperIndex != 1"
                          @click="backStep()"
                          text
                          outlined
                          :class="['normal-text blue900 fs-ml fw-b blue700-border br-4 mr-2', `gd-step${step.value}-select-btn`]"
                          height="32px"
                        >
                        Back
                        </v-btn>
                        <span v-if="stepperIndex < 3">
                          <v-btn
                            v-if="(!editMode && !selectedItem.isLocked) || (!editMode && permissionPA() && !isDialog)"
                            @click="nextStep(selectedItem)"
                            text
                            :class="['normal-text blue050 fs-ml fw-b blue700-b', `gd-step${step.value}-select-btn`]"
                            height="32px"
                          >
                          Select
                          </v-btn>
                        </span>
                        <span v-if="stepperIndex == 3">
                          <v-btn
                            v-if="(!editMode && !selectedItem.isLocked) || (!editMode && permissionPA() && !isDialog)"
                            @click="setResourceProfile(selectedItem)"
                            text
                            :class="['normal-text blue050 fs-ml fw-b blue700-b', `gd-step${step.value}-select-btn`]"
                            height="32px"
                          >
                          Select & Finish
                          </v-btn>
                        </span>
                        <v-tooltip bottom v-if="!editMode && selectedItem.isLocked && (isDialog || !permissionPA())" content-class="custom-tooltip fs-s">
                          <template v-slot:activator="{ on }">
                            <div v-on="on">
                              <v-btn
                                text
                                disabled
                                :class="['normal-text white--text fs-ml fw-b grey300-b', `gd-step${step.value}-select-btn`]"
                                height="32px"
                              >
                              <span class="grey100">{{ stepperIndex == 3 ? 'Select & Finish': 'Select'}}</span>
                              </v-btn>
                            </div>
                          </template>
                          <span class="custom-tooltip-accent fw-m">You can't select this location <br/> because it's locked</span>
                        </v-tooltip>
                        <v-btn
                          @click="lctn_setEdited(false)"
                          v-if="editMode"
                          text
                          outlined
                          :class="['normal-text blue900 fs-ml fw-b blue700-border br-4', `gd-step${step.value}-save-btn`]"
                          height="32px"
                        >
                         Cancel
                        </v-btn>
                        <v-btn
                          @click="lctn_applyChangesConfirm()"
                          v-if="editMode"
                          text
                          :class="['normal-text blue050 fs-ml fw-b blue700-b ml-2', `gd-step${step.value}-save-btn`]"
                          height="32px"
                        >
                         Save
                        </v-btn>
                      </v-flex>
                    </v-layout>
                    </div>
                </v-col>
            </v-row>
        </v-container>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Vue from 'vue';

export default {
  data () {
    return {
      complete: false,

      stepperIndex: 1,

      steps: [
          { value:1, name:'Service provider', item: null, isActive:true  },
          { value:2, name:'Datacenter'      , item: null, isActive:false },
          { value:3, name:'Resource profile', item: null, isActive:false }
      ],

      showFullText: false,
    }
  },

  props:[
    'isDialog'
  ],

  watch: {
    stepperIndex:function(index){
      this.steps.forEach((item, i)=>{
        item.isActive = false;
        if(index - 1==i)
          item.isActive = true;
      });
      var nextStep = this.steps[index-1];
      this.lctn_setEdited(false);
      var item = isNullOrUndefined(nextStep.item) ? this.items[0] : nextStep.item;
      this.lctn_setShowProperty(item.id);
    }
  },

  computed:{
    ...mapGetters([
      'lctn_serviceProviders', 
      'lctn_defaultResourceProfile', 
      'lctn_showProperty',
      'lctn_editMode',
      'lctn_edited'
      ]),
    
    selectedItem(){
      return this.lctn_showProperty;
    },

    editMode(){
      return this.lctn_editMode;
    },

    items(){
      var step = this.steps.find(f=>f.isActive).value;

      if(step == 1)
        return this.lctn_serviceProviders;
      
      if(step == 2)
        return this.steps[0].item.datacenters;
      
      if(step == 3)
        return this.steps[1].item.resourceProfiles;
    },
    

    description(){
      return !this.showFullText && (this.selectedItem.description.length > 230) 
        ? this.selectedItem.description.substring(0, 229) 
        : this.selectedItem.description;
    },

    largeText(){
      return this.selectedItem.description.length > 230
    }

  },


  methods: {
    ...mapActions([
      'lctn_getItems', 
      'lctn_setDefaultResourceProfile',
      'lctn_changeItemLockState',
      'lctn_applyChangesConfirm',
      'lctn_setShowProperty',
      'lctn_deleteConfirm',
      'lctn_setEdited'
      ]),

    goToLink(link){
      location.href = link;
    },

    nextStep(item) {
      var currentStep = this.steps.find(f=>f.isActive==true);
      if(!isNullOrUndefined(currentStep.item) && currentStep.item.id!=item.id){ // если выбран иной объект, чистим последующие этапы
        for(var i=currentStep.value; i<this.steps.length; i++)
          this.steps[i].item = null;
      }
      currentStep.item = item;
      if(currentStep.value<3)
        currentStep.isActive = false;

      if(currentStep.value < this.steps.length)
      {
        this.stepperIndex = currentStep.value + 1;
      }
    },

    setResourceProfile(item){
      this.lctn_setDefaultResourceProfile(item.id); 
      showMessage('setDefaultLocation', { message: "Default location was set to \r\n " + this.lctn_defaultResourceProfile.fullPath, subjectName : this.lctn_defaultResourceProfile.resourceProfile.name });
      this.$emit('choosen');
    },

    backStep(){
      this.stepperIndex--
    },

    changeStep(index){
      if(this.steps[index-1].item != null){
        this.stepperIndex = index;
      }
      this.lctn_setEdited(false);
    },

    changeItem(item){
      this.lctn_setEdited(false);
      this.lctn_setShowProperty(item.id);
    }
  },

  mounted(){
    var self = this;
    this.lctn_getItems().then(r=>{

      var selectedResourceProfile = isNullOrUndefined(this.lctn_defaultResourceProfile) ? null : this.lctn_defaultResourceProfile.resourceProfile.id;;
      
      var datacenters = self.lctn_serviceProviders.map(function(p){ return p.datacenters; }).reduce(function(a, b){ return a.concat(b); })
      var resourceProfiles = datacenters.map(function(p){ return p.resourceProfiles; }).reduce(function(a, b){ return a.concat(b); })

      var selectedDatacenter = isNullOrUndefined(datacenters) ? null : datacenters.find(w=>w.resourceProfiles.some(s=>s.id==selectedResourceProfile));
      var selectedServiceProvider = isNullOrUndefined(selectedDatacenter) ? null : self.lctn_serviceProviders.find(w=>w.datacenters.some(s=>s.id==selectedDatacenter.id));

      if(!isNullOrUndefined(selectedResourceProfile) &&  !isNullOrUndefined(selectedDatacenter) && !isNullOrUndefined(selectedServiceProvider))
      { 
        self.steps[0].item = selectedServiceProvider;
        self.steps[1].item = selectedDatacenter;
        self.steps[2].item = resourceProfiles.find(f=>f.id==selectedResourceProfile);
        
        this.lctn_setShowProperty(selectedServiceProvider.id);
        
        self.steps[0].isActive = false;
        self.steps[2].isActive = true;
        self.stepperIndex = 3;
      }else{
        this.lctn_setShowProperty(self.lctn_serviceProviders[0].id);
      }

    });
  }
}
</script>

<style>
.step-close-button{height: 24px !important; width: 24px !important; min-width: unset !important; padding:0 !important;}
.v-stepper__step__step{display:none !important;}
.v-stepper__step--active .v-stepper__label{text-shadow:none !important;}
.location-mini-img{width: 44px; height:44px;}
.location-big-img{width: 200px; height: 200px;}
.location-header{height:56px !important;}
.full-height-col{height:calc(100vh - 64px - 56px);}
.border-dashed{border-bottom:1px dashed;}
.full-height-col > .vb-dragger{left: 0 !important;}
.location-fixed-witdh-left-column{width:499px !important;max-width:499px !important;}
.v-stepper__label{display:flex !important;}
.no-transition .v-stepper__content { transition: none !important; }
</style>