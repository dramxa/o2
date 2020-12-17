<template>
    <div class="w-task tasks-widget-block white pa-3 br-2 relative items-shadow">
        <div v-if="loading" class="w-task__loading-overlay white">
            <div class="fs-m fw-b pa-3 widgets-title-opacity">LATEST TASKS</div>
            <div class="w-task__loading-message fs-ml text-center">Loading...</div>
        </div>
        <div class="fw-b fs-m" :class="[type == 'error' ? 'red500' : 'grey900']">{{type == 'error' ? 'LATEST 10 ERRORS' : 'LATEST TASKS'}}</div>
        <div class="w-task__list mt-2" v-bar v-show="!loading">
            <div>
                <v-layout class="mt-1 pointer" v-for="(vJob, index) in items" :key="index">
                    <v-flex class="w-task__left-column flex-grow-0 relative pt-1">
                        <div :class="['w-task__left-column-circle', vJob.stateCode == 'error' ? 'red500-border' : (vJob.stateCode == 'running' ? 'blue700-border' : 'green500-border')] "></div>
                        <div class="w-task__left-column-line"></div>
                    </v-flex>
                    <v-flex class="w-task__item flex-grow-1 relative ml-2 pr-2 pl-1 pb-1">
                        <div class="grey900 fw-b fs-ml pr-5">{{jobLabel(vJob.virtualJobTypeCode)}}</div>
                        <div class="w-task__item-target task-widget-text-overflow fs-m">Target <span class="blue800 fw-b">{{vJob.objectName}}</span></div>
                        <div class="fs-s grey500 d-flex align-center mt-1"><i class="mdi mdi-clock-outline mr-1"></i>{{formatDate(vJob.dateStart)}}<span class="grey700 fs-s fw-b pl-1">{{formatTime(vJob.dateStart)}}</span></div>
                        <div v-if="vJob.acknowledge.needAcknowledge && !vJob.acknowledge.isAcknowledged" class="w-task__item-acknowledge">
                            <i class="mdi mdi-message-alert-outline icon-18 red500"></i>
                        </div>
                    </v-flex>
                </v-layout>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { jobTypes } from '@/consts/taskConsts';

export default {

    data(){
        return{
            formatDate,
            formatTime,
            loading: false,
        }
    },

    props:[
        'tasks', 
        'type'
    ],
    
    methods: {
        jobLabel(code){
            var data = jobTypes[code];
            return isNullOrUndefined(data) ? code : data;
        },
    },

    computed: {
        ...mapGetters([
            'dsbrd_vjobs_items',
            'dsbrd_vjobs_errors_items'
        ]),

        items(){
            return this.type == "error" ?
             this.dsbrd_vjobs_errors_items : 
             this.dsbrd_vjobs_items;
        }
        
    }
}
</script>
<style lang="stylus" scoped>
.w-task
    height 356px
    overflow hidden
    &__loading-overlay
        position absolute
        top 0
        bottom 0
        left 0
        right 0
        left 0
        z-index 1
    &__loading-message
        position absolute
        top calc(50% - 12px)
        width 100%
    &__list
        height 308px
    &__left-column
        width 15px
        &-circle
            width 12px
            height 12px
            border 4px solid
            border-radius 50%
            margin-left 2px
            margin-top 2px
            box-sizing border-box
        &-line
            position absolute
            top 21px
            bottom -8px
            left 7px
            width 2px
            background rgb(233, 233, 233)
    &__item:hover
        background rgba(0, 0, 0, 0.05)
    &__item-target
        overflow hidden
        max-height 3em
        display -webkit-box
        -webkit-line-clamp 2
        line-clamp 2
        -webkit-box-orient vertical
    &__item-acknowledge
        position absolute
        top 2px
        right 8px
</style>