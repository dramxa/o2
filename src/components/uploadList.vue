<template>
  <v-card flat class="c-upload-list white-light gd-error-menu" v-bar>
    <div class="c-upload-list__wrapper">
      <v-layout class="c-upload-list__item-layout px-4 py-2 d-flex" v-for="file in files" :key="file.id">
        <v-expansion-panels class="pt-0" accordion flat v-if="!file.isFinished">
            <v-expansion-panel>
                <v-expansion-panel-header class="c-upload-list__expansion-panel-header px-0 d-flex align-center" expand-icon="mdi-chevron-down pl-1 mr-n1 grey500 pr-1">
                    <div class="c-upload-list__left-column d-flex mr-1 pr-4">
                        <i class="icon-30 grey700-i icon-ISO1 mr-4"></i>
                        <div>
                            <div class="grey600 fs-m fw-b name-overflow">{{file.name}}</div>
                            <v-tooltip bottom  content-class="custom-tooltip fs-s">
                                <template v-slot:activator="{ on }">
                                <span class="grey500 fs-s border-dashed grey500-border pointer" v-on="on">Public Cloud M1</span>
                                </template>
                                <div>
                                    <div class="text-center fw-m custom-tooltip-accent mb-1">LOCATION</div>
                                    <div class="d-flex">
                                        <div class="custom-tooltip-color mr-4">
                                            <div>Service Provider:</div>
                                            <div>Datacenter:</div>
                                            <div>Resource Profile:</div>
                                        </div>
                                        <div class="text-right custom-tooltip-accent fw-m">
                                            <div>Stack Telecom</div>
                                            <div>M1</div>
                                            <div>Public Cloud M1</div>
                                        </div>
                                    </div>
                                </div>
                            </v-tooltip>
                        </div>
                    </div>
                    <div class="c-upload-list__right-column">
                        <div class="d-flex align-center justify-space-between relative pb-1">
                            <div class="grey500 fw-b fs-s">{{file.isCheckMode ? 'CHECKING' : !file.isFinished ? 'UPLOADING' : file.isSuccess ? 'FINISHED' : 'ERROR'}}</div>
                            <v-tooltip bottom  content-class="custom-tooltip fs-s">
                                <template v-slot:activator="{ on }">
                                    <span class="grey500 fw-b fs-s border-dashed grey500-border pointer" v-on="on">1 day 01:00:15</span>
                                </template>
                                <div class="d-flex">
                                    <div class="custom-tooltip-color mr-4">Started</div>
                                    <div class="monospace text-right">
                                        <div class="custom-tooltip-accent fw-m">13:12</div>
                                        <div class="custom-tooltip-color fw-m">06.11.2020</div>
                                    </div>
                                </div>
                            </v-tooltip>
                            <div class="c-upload-list__item-percent text-center fw-b grey900 fs-m">{{file.isCheckMode ? file.checkProgress : file.progress}}%</div>
                        </div>
                        <!-- uploading -->
                        <div class="d-flex c-upload-list__main-loader align-center relative br-2 mt-1 overflow-hidden" v-if="!file.isFinished && !file.isCheckMode">
                            <div :style="{width: `${file.progress}%`}" class="blue700-b c-upload-list__main-loader-item"></div>
                            <div :style="{width: `${100 - file.progress}%`}" class="blue100-b c-upload-list__main-loader-item"></div>
                        </div>
                        
                        <!-- checking -->
                        <div class="d-flex c-upload-list__main-loader align-center relative br-2 mt-1 overflow-hidden" v-if="file.isCheckMode">
                            <div :style="{width: `${file.checkProgress}%`}" class="c-upload-list__checking-bg c-upload-list__main-loader-item"></div>
                            <div :style="{width: `${file.progress - file.checkProgress}%`}" class="c-upload-list__checking-in-progress-bg c-upload-list__main-loader-item"></div>
                            <div :style="{width: `${100 - file.progress}%`}" class="c-upload-list__checking-bg-light c-upload-list__main-loader-item"></div>
                        </div>
                        <!-- finished -->
                    </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="px-1">
                    <div class="d-flex">
                        <div class="c-upload-list__left-column pl-11 fs-s">
                            <div class="mb-2">
                                <div class="fw-b grey500">STARTED</div>
                                <div>
                                    <span>13:12 </span>
                                    <span class="grey600">06.11.2020</span>
                                </div>
                            </div>
                            <div>
                                <div class="fw-b grey500">UPLOADED</div>
                                <div>408 MB / 19 024 MB</div>
                            </div>
                        </div>
                        <div class="c-upload-list__right-column">
                            <div class="d-flex mb-1 align-center" v-for="n in 5" :key="n">
                                <div class="flex-grow-1 align-self-center">
                                    <div class="d-flex c-upload-list__thread-loader br-2 overflow-hidden" >
                                        <div class="c-upload-list__thread-loader-item" :class="[file.isCheckMode ? 'c-upload-list__checking-bg' : 'blue700-b']" :style="{width: `${n*19}%`}"></div>
                                        <div class="c-upload-list__thread-loader-item" :class="[file.isCheckMode ? 'c-upload-list__checking-bg-light' : 'blue100-b']" :style="{width: `${100 - n*19}%`}"></div>
                                    </div>
                                </div>
                                <div class="c-upload-list__threads-percent-column flex-grow-0 fs-s fw-b grey500 ml-1 monospace text-right">
                                    {{n*19}}%
                                </div>
                            </div>
                        </div>
                    </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <div v-else class="d-flex align-center flex-grow-1 py-4">
            <div class="d-flex flex-grow-1">
                <div class="c-upload-list__left-column d-flex mr-1 pr-4">
                    <i class="icon-30 grey700-i icon-ISO1 mr-4"></i>
                    <div>
                        <div class="grey600 fs-m fw-b name-overflow">{{file.name}}</div>
                        <v-tooltip bottom  content-class="custom-tooltip fs-s">
                            <template v-slot:activator="{ on }">
                                <span class="grey500 fs-s border-dashed grey500-border pointer" v-on="on">Public Cloud M1</span>
                            </template>
                            <div>
                                <div class="text-center fw-m custom-tooltip-accent mb-1">LOCATION</div>
                                <div class="d-flex">
                                    <div class="custom-tooltip-color mr-4">
                                        <div>Service Provider:</div>
                                        <div>Datacenter:</div>
                                        <div>Resource Profile:</div>
                                    </div>
                                    <div class="text-right custom-tooltip-accent fw-m">
                                        <div>Stack Telecom</div>
                                        <div>M1</div>
                                        <div>Public Cloud M1</div>
                                    </div>
                                </div>
                            </div>
                        </v-tooltip>
                    </div>
                </div>
                <div class="c-upload-list__right-column" v-if="file.isSuccess">
                    <div class="d-flex align-center justify-space-between relative pb-1">
                        <div class="grey500 fw-b fs-s">FINISHED</div>
                        <v-tooltip bottom  content-class="custom-tooltip fs-s">
                            <template v-slot:activator="{ on }">
                                <span class="grey500 fw-b fs-s border-dashed grey500-border pointer" v-on="on">1 day 01:00:15</span>
                            </template>
                            <div class="d-flex">
                                <div class="custom-tooltip-color mr-4">Started</div>
                                <div class="monospace text-right">
                                    <div class="custom-tooltip-accent fw-m">13:12</div>
                                    <div class="custom-tooltip-color fw-m">06.11.2020</div>
                                </div>
                            </div>
                        </v-tooltip>
                        <div class="c-upload-list__item-percent text-center fw-b grey900 fs-m">{{file.progress}}%</div>
                    </div>
                    <div class="c-upload-list__main-loader green500-b br-2 mt-1"></div>
                </div>
                <div class="c-upload-list__right-column" v-if="!file.isSuccess">
                    <div class="d-flex align-center justify-space-between relative pb-1">
                        <div class="grey500 fw-b fs-s">ERROR</div>
                        <v-tooltip bottom  content-class="custom-tooltip fs-s">
                            <template v-slot:activator="{ on }">
                                <span class="grey500 fw-b fs-s border-dashed grey500-border pointer" v-on="on">1 day 01:00:15</span>
                            </template>
                            <div class="d-flex">
                                <div class="custom-tooltip-color mr-4">Started</div>
                                <div class="monospace text-right">
                                    <div class="custom-tooltip-accent fw-m">13:12</div>
                                    <div class="custom-tooltip-color fw-m">06.11.2020</div>
                                </div>
                            </div>
                        </v-tooltip>
                        <div class="c-upload-list__item-percent text-center fw-b grey900 fs-m">{{file.progress}}%</div>
                    </div>
                    <div class="d-flex c-upload-list__main-loader align-center relative br-2 mt-1 overflow-hidden" v-if="file.isFinished && !file.isSuccess">
                        <div :style="{width: `${file.progress}%`}" class="red500-b c-upload-list__main-loader-item"></div>
                        <div :style="{width: `${100 - file.progress}%`}" class="red100-b c-upload-list__main-loader-item"></div>
                    </div>
                </div>
            </div>
            <div class="c-upload-list__close-btn-wrapper flex-grow-0">
                <v-btn icon tile class="br-4 ml-1" width="25" height="25"><i class="icon-Close icon-20" ></i></v-btn>
            </div>
        </div>
      </v-layout>
    </div>
    <v-layout class="pa-6">
      <v-spacer></v-spacer>
      <v-btn text class="normal-text fs-m fw-b grey500 px-2 " height="24px">View all</v-btn>
    </v-layout>
  </v-card>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: [ 'type' ],

  data(){
    return{
        files: [
            {
                "id": "1",
                "name": "VMware-vCenter-Chargeback-Manager-public-source-2.7.3.tar.gz",
                "size": 316120510,
                "chunkSize": 26214400,
                "isFinished": true,
                "isSuccess": true,
                "previousUploaded": 12,
                "totalChunks": 13,
                "uploadedChunks": 13,
                "checkedChunks": 12,
                "lastWorkChunk": 0,
                "isCheckMode": false,
                "progress": 100,
                "checkProgress": 92
            },
            {
                "id": "2",
                "name": "VMware-vCenter-Chargeback-Manager-public-source-2.7.3.tar.gz",
                "size": 316120510,
                "chunkSize": 26214400,
                "isFinished": false,
                "isSuccess": false,
                "previousUploaded": 12,
                "totalChunks": 13,
                "uploadedChunks": 13,
                "checkedChunks": 12,
                "lastWorkChunk": 0,
                "isCheckMode": true,
                "progress": 56,
                "checkProgress": 32
            },
            {
                "id": "3",
                "name": "VMware-vCenter-Chargeback-Manager-public-source-2.7.3.tar.gz",
                "size": 316120510,
                "chunkSize": 26214400,
                "isFinished": false,
                "isSuccess": false,
                "previousUploaded": 12,
                "totalChunks": 13,
                "uploadedChunks": 13,
                "checkedChunks": 12,
                "lastWorkChunk": 0,
                "isCheckMode": false,
                "progress": 72,
                "checkProgress": 72
            },
            {
                "id": "4",
                "name": "VMware-vCenter-Chargeback-Manager-public-source-2.7.3.tar.gz",
                "size": 316120510,
                "chunkSize": 26214400,
                "isFinished": true,
                "isSuccess": false,
                "previousUploaded": 12,
                "totalChunks": 13,
                "uploadedChunks": 13,
                "checkedChunks": 12,
                "lastWorkChunk": 0,
                "isCheckMode": false,
                "progress": 37,
                "checkProgress": 37
            },
        ]

    }
  },

  computed:{
    ...mapGetters([]),

  },

  methods:{
    ...mapActions([]),

    

  },
  
}
</script>
<style lang="stylus" scoped>
.c-upload-list
    width 760px
    border-radius 0 !important
    &__wrapper
        max-height 400px
    &__item-layout
        border-bottom 1px solid var(--white-accent050)
    &__main-loader
        height 12px
        width 100%
    &__main-loader-item
        height 12px
    &__thread-loader
        height 8px
        width 100%
    &__thread-loader-item
        height 8px
    &__checking-bg
        background #FFC107
    &__checking-bg-light
        background #FFECB4
    &__checking-in-progress-bg
        background repeating-linear-gradient( -45deg, #FFCC33, #FFCC33 10px, #FEDB71 10px, #FEDB71 20px )
    &__expansion-panel-header
        min-height 40px
    &__left-column
        flex 1 1 45%
    &__right-column
        flex 1 1 55%
    &__item-percent
        position absolute
        left 0
        right 0
        margin 0 80px
    &__threads-percent-column
        width 33px
    &__close-btn-wrapper
        width 28px
</style>