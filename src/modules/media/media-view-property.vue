<template>
    <v-card class="med-prop" v-if="item!=null" tile>
        <v-toolbar fixed flat class="bg-gradient sticky-header" :class="{'locked-location-bg': item.prep.isLocationLocked}" height="60px;">
            <v-toolbar-title class="font-white gd-prp-name">{{title}}</v-toolbar-title>
            <div class="flex-grow-1"></div>

            <v-btn tile :disabled="med_editMode" :text="med_editMode" :icon="!med_editMode" class="font-white br-4 gd-prp-edt-btn" @click="editClick" v-if="permissionObj('ft_medUpdate', item.id) && !item.prep.isLocationLocked">
                <i v-if="!med_editMode" class="icon-Edit iconmoon-unset icon-24"></i>
            </v-btn>

            <v-btn tile icon class="font-white br-4 gd-prp-close" @click="close">
                <i class="icon-Close iconmoon-unset icon-24"></i>
            </v-btn>              
        </v-toolbar>
        <div v-show="!med_editMode" class="sticky-subheader white border-bottom blue050-border" v-if="permission('ft_tskRead')">
            <v-layout class="pa-2 py-2-5">
                <v-spacer></v-spacer>
                <v-btn text class="mr-2 px-1 custom-transform-class text-none grey900 normal-text" @click="goToTasks(false)" @click.middle="goToTasks(true)">
                    <i class="mr-1 icon-log icon-16 grey500-i"></i>View log
                </v-btn>
            </v-layout>
        </div>

        <c-group>
            <v-layout row wrap class="mt-2">
                <c-labeled-field v-if="med_editMode"  class="px-3 gd-prp-edt-name" xs="12" label="NAME" v-model="item.name" :editMode="med_editMode" :disabled="disableInput" required="true" :error="errors.name"/>
                <c-labeled-slot v-if="!med_editMode" class="px-3 pa-0 gd-prp-status" xs="8" label="STATUS">
                    <v-flex v-if="item.statusCode=='busy'" class="d-flex align-center px-0">
                        <v-progress-circular  rotate="90" size="20" indeterminate width="2" class="blue800 fs-xs fw-b mr-1"></v-progress-circular>
                        <span class="blue800 fw-b fs-s border-bottom-dashed blue800-border">{{objStatus[item.statusCode]}}</span>
                    </v-flex>
                    <v-flex v-if="item.statusCode=='error'" class="red500 fw-b fs-s d-flex align-center px-0">
                        <i class="icon-x-circle icon-20 mr-1"></i>
                        <span class="border-bottom-dashed red500-border">{{objStatus[item.statusCode]}}</span>
                    </v-flex>
                    <v-flex v-if="item.statusCode=='ready'" class="fs-s d-flex align-center px-0">
                        <i class="icon-check-circle grey300-i icon-20 mr-1"></i>
                        <span class="grey300 fs-s">{{objStatus[item.statusCode]}}</span>
                    </v-flex>
                </c-labeled-slot>
                <c-labeled-field v-if="!med_editMode" class="px-3 gd-prp-size" xs="4" label="SIZE (GB)" v-model="item.size" />
                <c-labeled-field v-if="!med_editMode" class="px-3 mt-3 gd-prp-created" xs="12" label="CREATED"  v-model="item.prep.createDateFormatted" />
                <c-labeled-slot v-if="permissionPA()" label="STATUS" class="mt-2 px-3 gd-prp-locked"  xs="12">
                    <c-labeled-checkbox class="mt-1 label-bigger-font-size"  cbid="med-public" label="Public" :isDisable="!med_editMode" v-model="item.isPublic" />
                </c-labeled-slot>
                <c-labeled-field xs="12" class="px-3 mt-3 gd-prp-location" label="LOCATION" v-model="item.prep.resourceProfileFullpath" :editMode="false" />
                <c-labeled-field v-if="!med_editMode" class="px-3 mt-2 gd-prp-vms" xs="12" label="VM#" v-model="item.connectedVmIds.length" />
                
            </v-layout>
        </c-group>

       <v-footer v-if="med_editMode" padless class="font-weight-medium px-4 py-3 justify-space-between blue050-b border-top grey100-border sticky-footer">
               <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-close" @click="close"    :disabled="disableInput" outlined><span class="blue900">Cancel</span></v-btn>
               <v-btn large color="primary" class="normal-text px-2 gd-prp-bt-apply" @click="applyChanges" :loading="disableInput">{{ med_editNewObject ? 'Create':'Apply' }}</v-btn>
       </v-footer>
    </v-card>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';
import { objStatus } from '@/consts/_otherConsts';
import Vue from 'vue';

export default {  
    data(){
        return{
            objStatus,
            hasError   : false,
            firstCheck : true,
            errors     : {
                name         : false

            },
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
        med_editNewObject:{
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
        ...mapGetters(['med_showProperty', 'med_edited', 'med_editMode', 'med_editedApplying', 'med_editNewObject']),

        title(){
            return this.med_editMode ? this.med_edited.prep.oldName : this.med_showProperty.name;
        },

        item(){
            return this.med_editMode ? this.med_edited : this.med_showProperty;
        },

        disableInput(){
            return this.med_editedApplying;
        }
    },

    methods:{
        ...mapActions(['med_setEdited', 'med_applyChangesConfirm', 'med_setShowProperty']),

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
            if(this.med_editMode)
                this.med_setEdited(); // убираем объект из редактора
            else
                this.med_setEdited(this.med_showProperty.id)
        },
        
        close(){
            if(this.med_editMode && !this.med_editNewObject)
            {
                this.med_setShowProperty(this.med_showProperty.id);
                return;
            }
            this.med_setShowProperty();
        },

        applyChanges(){
            this.firstCheck = false;
            this.hasError = false;
            this.checkForError();

            if(!this.hasError){
                this.med_applyChangesConfirm();
            }else{
                showMessage('inputError');
            }
        },

        goToTasks(newWindow){
            this.$nav.navigateTo('tasks', { use: true, objectName: this.item.id }, newWindow)
        }

    }
}
</script>
<style lang="stylus" scoped>
.med-prop
    min-height 100vh
</style>
