<template>
    <v-flex v-bind:[xsValue]="true" :class="classes" class="py-0">
        <v-card flat text tile :class="{'mt-1': hideLabel}" class="c-labeled-fiel-hdd">
            <span v-if="label && !hideLabel" class="prop-title grey700 fs-s nonselect" :class="{'error-input': error}">{{label}}</span><br v-if="label && !hideLabel">
            <div>
                <span v-if="!editMode" class="grey900">{{valueToShow}}</span>
                <v-layout v-if="editMode"  class="align-self-center">
                    <v-flex v-bind:[xsMain]="true">
                        <div class="relative">
                        <input 
                            v-if="masked"
                            v-imask="masks[mask]"
                            :type="type" 
                            :value="text" 
                            @complete="updateValueMasked"
                            class="c-labeled-fiel-hdd__input"
                            :class="[error ? 'red500 red500-border' : 'grey700 grey300-border', {'pr-6': inputIcon}]"
                            @focus="$event.target.select()"
                            >
                        <input 
                            v-else
                            :type="type" 
                            :value="text" 
                            @input="updateValue($event.target.value)"
                            class="c-labeled-fiel-hdd__input"
                            :class="[error ? 'red500 red500-border' : 'grey700 grey300-border', {'pr-6': inputIcon}]"
                            @focus="$event.target.select()"
                            >
                            <v-btn v-if="inputIcon && !advancedMode" flat tile class="c-labeled-fiel-hdd__btn white elevation-0"><i class="grey500-i icon-Create py-1" @click="applyClick"></i></v-btn>
                            <v-btn v-if="inputIcon && advancedMode"  flat tile class="c-labeled-fiel-hdd__btn white elevation-0"><i class="grey500-i icon-Create py-1" @click="applyClick"></i></v-btn>
                            </div>
                    </v-flex>
                    <v-flex v-if="useRightSlot" xs3>
                        <slot name="rightSlot"/>
                    </v-flex>
                </v-layout>
                <v-row v-if="useBottomSlot">
                    <v-flex xs12 class="pt-0">
                        <slot name="bottomSlot"/>
                    </v-flex>
                </v-row>
            </div>
        </v-card>
    </v-flex>
</template>

<script>
import Vue from 'vue'
import masks from '@/consts/maskConst'
import {IMaskDirective} from 'vue-imask';

export default {
    props:[
        'label',
        'value',
        'editMode',
        'xs',
        'useRightSlot',
        'useBottomSlot',
        'error',
        'type',
        'inputIcon',
        'classes',
        'hideLabel',
        'advancedMode',
        'divider',
        'masked',
        'mask'
    ],

    data(){
        return{
            text: "",
            dividerInner : 1,
            masks
        }
    },

    directives: {
      imask: IMaskDirective
    },

    methods: {
      updateValue: function (value) {
        this.text = value;
        this.$emit('input', value * this.dividerInner)        
      },

      updateValueMasked (e) {
        const maskRef = e.detail;
        // console.log(maskRef)
        if(this.masks[this.mask].mask != Number)
        {
            this.$emit('input', maskRef.unmaskedValue * this.dividerInner);
            return;
        }

        if(this.masks[this.mask].scale == 0)        
        {
            this.$emit('input', parseInt(maskRef.unmaskedValue) * this.dividerInner);
            return;
        }

        this.$emit('input', parseFloat(maskRef.unmaskedValue) * this.dividerInner);
      },

      applyClick(){
        if(!isNullOrUndefined(this.text) && this.text!= '')
           this.$emit('applyClick', this.text);
        this.updateValue('');
      }
    },

    computed: {
        valueToShow(){
            return isNullOrUndefined(this.text) ? "-" : this.text
        },

        xsValue(){
            return 'xs' + this.xs;
        },

        xsMain(){
            return !isNullOrUndefined(this.useRightSlot) ? 'xs9': 'xs12'
        }
    },

    watch:{
        value:{ 
            handler: function(value){
                this.text = value;
            },
            immediate: true
        },
        value:{ 
            handler: function(value){
                var divider = isNullOrUndefined(this.divider)? 1 : this.divider;
                this.text = Math.ceil((value/ divider) * 100) / 100;
            },
            immediate: true
        },

        divider:{
            handler: function(value){                
                this.dividerInner = isNullOrUndefined(value)? 1 : value;
            },
            immediate: true        
        }
    }

}
</script>

<style lang="stylus" scoped>
.c-labeled-fiel-hdd
    line-height: 1.1
    &__input
        height: 24px
        width: 100%
        border: 1px solid #B0BEC5
        border-radius: 2px
        padding: 4px 8px
        font-size: 12px
        font-weight: 600
    &__btn
        position: absolute
        right: 1px
        bottom: 5px
        font-size: 12px !important
        line-height: 16px
        cursor: pointer
        height: 22px !important
        width: 22px !important
        min-width: 22px !important
        padding: 0 !important
</style>