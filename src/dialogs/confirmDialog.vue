<template>
    <d-dialog-basic :dialogId="id" maxWidth="500px">
        <v-card class="d-confirm" :class="colorClass + ' pa-6 ' + colorClass + '-border confirm-dialog' ">
            <v-layout>
                <v-flex class="d-confirm__icon mr-5">
                    <i :class="icon + ' icon-24 ' + colorClass + '-i'"></i>
                </v-flex>
                <v-flex>
                    <v-card-text class="fs-l pa-0 grey700"> <span v-html="text"></span>
                        <br>
                        <span class="fw-b">
                            <div v-if="showRange">
                                <span class='fs-ml' :class="colorClass">{{rangeFirst}}</span>
                                <span class='fs-ml ml-2 mr-2 grey300'>...</span>
                                <span class='fs-ml' :class="colorClass">{{rangeLast}}</span>
                            </div>
                            <div v-else v-bar>
                                <div>
                                    <div class="d-confirm__item-list">
                                        <span  v-for="(obj, index) in objArray" :key="index" :class="colorClass" class="fs-ml"> {{ obj }}{{index < (objArray.length - 1) ? ', ' : '' }}</span>
                                    </div>
                                </div>
                            </div>
                        </span>
                    </v-card-text>
                    <v-card-actions v-if="okClick" class="pa-0 mt-10">
                        <v-spacer/>
                        <v-btn :class="colorClass + '-b normal-text fs-ml elevation-0 white--text'" small width="80" height="32" @click='clickYes'> Ok</v-btn>
                    </v-card-actions>
                    <v-card-actions v-else class="pa-0 mt-10">
                        <v-spacer/>
                        <v-btn class="normal-text white-light fs-ml elevation-0  grey700" small width="80" height="32" @click='cancelClick'> Cancel</v-btn>
                        <v-btn :class="colorClass + '-b normal-text fs-ml elevation-0 white--text'" small width="80" height="32" @click='clickYes'> Yes</v-btn>
                    </v-card-actions>
                </v-flex>
            </v-layout>
        </v-card>
    </d-dialog-basic>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';
import { dialogs } from '@/consts/dialogConsts';
import { async } from 'q';

import Vue from 'vue'
import dialogMixin from '@/dialogs/windows/windowMixin'


const component = Vue.extend({
    mixins: [ dialogMixin ],

    props:[
        'value', 
        'objArray', 
        'textConst', 
        'type', 
        'okClick',
        'rangeLength',
        'rangeFirst',
        'rangeLast'
        ],

    data(){
        return {            
            result     : false,
            showDialog : false
        }
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

    computed:{
        showRange(){
            return  !isNullOrUndefined(this.rangeLength);
        },

        text(){
            let res = dialogs[this.textConst];
            return isNullOrUndefined(res) ? 'unknown text const: ' + this.textConst : (this.showRange ? res.text(`<span class="fw-b ${this.colorClass}">${this.rangeLength}</span>`) : res.text); 
        },

        colorClass(){
            let res = dialogs[this.textConst];
            return isNullOrUndefined(res) ? 'white' : res.color;             
        },

        
        icon(){
            if(isNullOrUndefined(this.textConst))
                return '';
            let res = dialogs[this.textConst];
            return isNullOrUndefined(res) ? '' : res.icon;             
        }
    },

    methods:{
        clickYes(){
            this.acceptClick(this.type);
        } 
    },

    mounted(){
        this.showDialog = this.value
    }
})

export function register(){
    Vue.prototype.$windows.registerDialog({ dialogCode: 'confirmDialog', component})
}

export default component

</script>

<style lang="stylus" scoped>
.d-confirm
    border-left: 4px solid
    border-radius:0 !important
    &__icon
        max-width:30px
    &__item-list
        max-height: 50vh
</style>

