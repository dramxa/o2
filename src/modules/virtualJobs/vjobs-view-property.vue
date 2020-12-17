<template>
    <v-card class="vjob-prop" v-if="item!=null" tile>
        <v-toolbar fixed flat class="bg-gradient sticky-header" height="60px;">
            <v-toolbar-title class="font-white">{{title}}</v-toolbar-title>
            <div class="flex-grow-1"></div>

            <v-btn tile icon class="font-white br-4" @click="close">
                <i class="icon-Close iconmoon-unset icon-24"></i>
            </v-btn>              
        </v-toolbar>

        <div class="sticky-subheader white border-bottom blue050-border" v-show="item.acknowledge.needAcknowledge">
            <v-layout class="pa-2-5" v-if="item.acknowledge.needAcknowledge && !item.acknowledge.isAcknowledged">
                <v-spacer></v-spacer>
                <v-btn text class="mr-2 px-2 custom-transform-class text-none grey900 normal-text fs-s gd-prp-impersonate fw-n" @click="vjob_acknowledge(item)" >
                    <i class="vjob-prop__aknw-icon mdi mdi-message-alert-outline grey900 mr-1 icon-20"></i>ACKNOWLEDGE
                </v-btn>
            </v-layout>
            <v-layout class="py-5 pl-4 fs-m" v-if="item.acknowledge.needAcknowledge && item.acknowledge.isAcknowledged">
                <span class="grey600 fs-s">ACKNOWLEDGED BY</span>&nbsp;&nbsp;<span class="grey700 fw-b">{{item.prep.acknowledgeFirstName}} {{item.prep.acknowledgeLastName}}</span>
            </v-layout>
        </div>

        <c-group>
            <v-layout row wrap class="mt-2">
                <c-labeled-slot class="px-3 py-0" xs="6" label="STATUS">
                    <v-flex v-if="item.stateCode == 'running'" class="d-flex align-center pa-0">
                        <v-flex class="vjob-prop__status-progress-wrapper pa-0">
                            <v-progress-circular  rotate="90" size="20" 
                            :indeterminate="false" 
                            :value="item.prep.lastTask.percentCompleted" 
                            width="2" class="blue800 fs-xs fw-b mr-2">{{item.prep.lastTask.percentCompleted}}</v-progress-circular> 
                            <!-- value="66"  {{ value }} -->
                        </v-flex>
                        <v-flex class="pa-0">
                            <div class="blue800 fw-b fs-m"> 
                                In progress
                            </div>
                        </v-flex>
                    </v-flex>
                    <v-flex v-if="item.stateCode == 'error'" class="red500 fw-b fs-s d-flex align-center pa-0">
                        <i class="icon-x-circle icon-20 mr-2"></i>
                        <span class="fs-m">Error</span>
                    </v-flex>
                    <v-flex v-if="item.stateCode == 'completed'" class="fs-s d-flex align-center pa-0">
                        <i class="icon-check-circle grey300-i icon-20 mr-2"></i>
                        <span class="grey300 fs-m">Completed</span>
                    </v-flex>
                </c-labeled-slot>
                <c-labeled-field class="px-3" xs="6" label="DURATION" :value="getDuration(item.dateStart, item.dateEnd)" />
            </v-layout>
            <v-layout row wrap class="mt-3">
                <c-labeled-slot class="px-3 py-0" xs="6" label="TARGET">
                    <v-tooltip bottom  content-class="custom-tooltip fs-s">
                        <template v-slot:activator="{ on }">
                            <div v-on="on" class="name-overflow pointer grey900">{{item.objectName}}</div>
                        </template>
                        <span class="custom-tooltip-accent fw-m">{{item.objectName}}</span>
                    </v-tooltip>
                </c-labeled-slot>
                <c-labeled-slot class="px-3 py-0" xs="6" label="INITIATOR">
                    <div class="name-overflow grey900"><span v-if="permissionPA()">{{item.prep.initiatorDomain}}\</span>{{item.prep.initiatorFirstName}} {{item.prep.initiatorLastName}}</div>
                </c-labeled-slot>
            </v-layout>
            <v-layout row wrap class="mt-3">
                <c-labeled-slot class="px-3 py-0" xs="6" label="START TIME">
                    <span class="grey500 fs-m">{{formatDate(item.dateStart)}}</span>&nbsp;&nbsp;<span class="grey600 fs-m fw-b">{{formatTime(item.dateStart)}}</span>
                </c-labeled-slot>
                <c-labeled-slot class="px-3 py-0" xs="6" label="COMPLETION TIME">
                    <span class="grey500 fs-m">{{formatDate(item.dateEnd)}}</span>&nbsp;&nbsp;<span class="grey600 fs-m fw-b">{{formatTime(item.dateEnd)}}</span>
                </c-labeled-slot>
            </v-layout>
        </c-group>

        <c-group caption="Tasks">
            <v-expansion-panels class="pt-0 px-3 tsk-expansion-panels" accordion>
                <v-expansion-panel v-for="(task, index) in item.tasks" :key="task.id" flat :class="{'mt-1': index > 0}">
                    <v-expansion-panel-header class="vjob-prop__expansion-panel-header px-0" expand-icon="mdi-chevron-down grey500">
                        <div class="d-flex align-center justify-space-between">
                            <div class="d-flex align-center">
                                <i v-if="task.isCompleted && task.isSuccess" class="icon-check icon-16 green500-i mb-n1 mr-2"></i>
                                <i v-if="task.isCompleted && !task.isSuccess" class="icon-Close icon-16 red500-i mr-2"></i>
                                <i v-if="!task.isCompleted" class="mdi mdi-play-outline icon-18 blue600-i mr-2"></i>
                                <span class="fs-m grey900">{{tskLabel(task.typeCode)}}</span>
                            </div>
                            <div class="mr-1">
                                <div v-if="task.isCompleted" class="text-right fs-s"><div class="grey500">{{formatDate(task.dateEnd)}}</div><div class="grey600 fw-b">{{formatTime(task.dateEnd)}}</div></div>
                                <div v-else class="text-right blue800 fw-b fs-m">{{task.percentCompleted}}%</div>
                            </div>
                        </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="px-1">
                        <div class="d-flex pl-6">
                            <div class="fs-s flex-grow-0 grey500 mr-12">
                                <div>STATUS</div>
                                <div class="my-1">START TIME</div>
                                <div>COMPLETION TIME</div>
                            </div>
                            <div class="fs-s flex-grow-1">
                                <div>
                                    <span v-if="task.isCompleted && task.isSuccess" class="fw-b green500">Completed</span>
                                    <span v-if="task.isCompleted && !task.isSuccess" class="fw-b red500">Error</span>
                                    <span v-if="!task.isCompleted" class="fw-b blue800">In progress</span>
                                </div>
                                <div class="my-1"><span class="grey500">{{formatDate(task.dateEnd)}}</span>&nbsp;&nbsp;<span class="grey600 fw-b">{{formatTime(task.dateEnd)}}</span></div>
                                <div><span class="grey500">{{formatDate(task.dateEnd)}}</span>&nbsp;&nbsp;<span class="grey600 fw-b">{{formatTime(task.dateEnd)}}</span></div>
                            </div>     
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </c-group>
    </v-card>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';
import { tskStates, tskObjTypes, tskStateCodes, jobTypes, tskTypes } from '@/consts/taskConsts';

export default {  
    data(){
        return{
            formatTime,
            formatDate,

            tskStates,
            tskObjTypes,
            jobTypes,
            tskTypes,
        }
    },

    computed:{
        ...mapGetters(['vjob_showProperty']),

        title(){
            return this.jobLabel(this.vjob_showProperty.virtualJobTypeCode);
        },

        item(){
            return this.vjob_showProperty;
        },
    },

    methods:{
        ...mapActions([
        'vjob_applyChangesConfirm', 
        'vjob_setShowProperty',
        'vjob_acknowledge'
      ]),
        
        jobLabel(code){
        var data = jobTypes[code];
        return isNullOrUndefined(data) ? code : data;
        },

        tskLabel(code){
        var data = tskTypes[code];
        return isNullOrUndefined(data) ? code : data;
        },

        getDuration(start,end){
            if(end == null)
                return '';
            let duration = new Date(end).getTime() - new Date(start).getTime()
            //дни
            if(duration/(86400*1000) > 1)
                return `${Math.floor(duration/(86400*1000))} days`
            //часы
            if(duration/(3600*1000) > 1)
                return `${Math.floor(duration/(3600*1000))} hours`
            //минуты
            if(duration/(60*1000) > 1)
                return `${Math.floor(duration/(60*1000))} minutes`
            //секунды
            if(duration/1000 > 1)
                return `${Math.floor(duration/1000)} seconds`

            return `${duration} ms`
        },

        close(){
            this.vjob_setShowProperty();
        },

        applyChanges(){
            this.vjob_applyChangesConfirm();
        }

    }
}
</script>
<style lang="stylus" scoped>
.vjob-prop
    min-height 100vh
    &__aknw-icon
        margin-bottom -2px
    &__status-progress-wrapper
        max-width 30px
    &__expansion-panel-header
        min-height 40px
</style>
<style scoped>
    .sticky-subheader{top:60px;background: #fff;}
</style>
<style>
.tsk-expansion-panels.v-expansion-panels--accordion > .v-expansion-panel::after {opacity: 0;}
</style>
