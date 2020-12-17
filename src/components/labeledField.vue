<template>
    <v-flex v-bind:[xsValue]="true" :class="classes" class="pt-0 pb-0">
        <v-card flat text tile :class="{'mt-1': hideLabel}" class="c-labeled-field">
            <span v-if="label && !hideLabel" class="fs-s nonselect" :class="[isError ? 'red500' : '',loginPage ? 'grey100': 'grey700' ]">{{label}}<span v-if="required && editMode" class="red500">*</span></span><br v-if="label && !hideLabel">
            <span class="fs-m" >
                <span v-if="!editMode" class="grey900">{{valueToShow}}</span>
                <v-layout v-if="editMode"  class="align-self-center">
                    <v-flex v-bind:[xsMain]="true">
                        <form autocomplete="off" v-if="ac=='off'">
                        <div class="relative">
                            <input v-if="masked"
                                :type="typeInner" 
                                :value="text" 
                                class="c-labeled-field__input fs-s"
                                :class="[isError ? 'red500 red500-border' : 'grey700 grey300-border', inputIcon ? 'pr-6' : '', leftText ? 'text-right' : '', loginPage ? 'grey100-b' : '']"
                                @focus="$event.target.select()"
                                :name="inputName"
                                @complete="updateValueMasked"
                                v-on:keyup.enter="onEnter"
                                v-imask="masks[mask]"
                                @keyup="checkCaps($event)"
                            >
                            <input v-else
                                :type="typeInner" 
                                :value="text" 
                                @input="updateValue($event.target.value)"
                                class="c-labeled-field__input fs-s"
                                :class="[isError ? 'red500 red500-border' : 'grey700 grey300-border', inputIcon ? 'pr-6' : '', leftText ? 'text-right' : '', loginPage ? 'grey100-b' : '']"
                                @focus="$event.target.select()"
                                :name="inputName"
                                :autocomplete="ac"
                                v-on:keyup.enter="onEnter"
                                :disabled="disabled"
                                @keyup="checkCaps($event)"
                            ><!-- v-imask="mask" -->
                            <v-btn v-if="inputIcon && !advancedMode" text tile class="white elevation-0 c-labeled-field__btn"><i class="grey500-i icon-Create py-1"   @click="applyClick"></i></v-btn>
                            <v-btn v-if="inputIcon && advancedMode"  text tile class="white elevation-0 c-labeled-field__btn"><i class="grey500-i icon-Create py-1"   @click="applyClick"></i></v-btn>
                            <v-btn v-if="showButton && value != ''"  text tile class="white elevation-0 c-labeled-field__btn" @mousedown="typeInner='text'" @mouseup="typeInner='password'" @mouseout="typeInner='password'"><i class="grey500-i icon-eye icon-14 py-1" :class="{'red500-i': isError}"></i></v-btn>
                        </div>
                        </form>
                        <div class="relative" v-else>
                            <input v-if="masked"
                                :type="typeInner" 
                                :value="text" 
                                class="c-labeled-field__input fs-s"
                                :class="[isError ? 'red500 red500-border' : 'grey700 grey300-border', inputIcon ? 'pr-6' : '', leftText ? 'text-right' : '', loginPage ? 'grey100-b' : '']"
                                @focus="$event.target.select()"
                                :name="inputName"
                                @complete="updateValueMasked"
                                v-on:keyup.enter="onEnter"
                                v-imask="masks[mask]"
                                @keyup="checkCaps($event)"
                            >
                            <input v-else
                                :type="typeInner" 
                                :value="text" 
                                @input="updateValue($event.target.value)"
                                class="c-labeled-field__input fs-s"
                                :class="[isError ? 'red500 red500-border' : 'grey700 grey300-border', inputIcon ? 'pr-6' : '', leftText ? 'text-right' : '', loginPage ? 'grey100-b' : '']"
                                @focus="$event.target.select()"
                                :name="inputName"
                                :autocomplete="ac"
                                v-on:keyup.enter="onEnter"
                                :disabled="disabled"
                                @keyup="checkCaps($event)"
                            >
                            <v-btn v-if="inputIcon && !advancedMode" text tile class="white elevation-0 c-labeled-field__btn"><i class="grey500-i icon-Create py-1"   @click="applyClick"></i></v-btn>
                            <v-btn v-if="inputIcon && advancedMode"  text tile class="white elevation-0 c-labeled-field__btn"><i class="grey500-i icon-Create py-1"   @click="applyClick"></i></v-btn>
                            <v-btn v-if="showButton && value != ''"  text tile class="white elevation-0 c-labeled-field__btn" @mousedown="typeInner='text'" @mouseup="typeInner='password'" @mouseout="typeInner='password'"><i class="grey500-i icon-eye icon-14 py-1" :class="{'red500-i': isError}"></i></v-btn>
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
            </span>
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
        'leftText',
        'showButton',
        'inputName',
        'isAutocomplete',
        'isCurrency',
        'masked',
        'mask',
        'required',
        'disabled',
        'capsCheck',
        'loginPage',
    ],

    data(){
        return{
            text     : "",
            typeInner: 'text',
            isError: false,
            ac: '',
            masks,
        }
    },
    directives: {
      imask: IMaskDirective
    },

    methods: {
        checkCaps(event){
            try {
                if(isNullOrUndefined(this.capsCheck) && !this.capsCheck)
                    return;

                if (event.getModifierState("CapsLock")) 
                    this.$emit('caps', true)
                else 
                    this.$emit('caps', false)               
            } catch {   }
        },

      updateValue: function (value) {
        this.text = value;
        this.$emit('input', value)        
      },

      updateValueMasked (e) {
        const maskRef = e.detail;
        // console.log(maskRef)
        if(this.masks[this.mask].mask != Number)
        {
            this.$emit('input', maskRef.unmaskedValue);
            return;
        }

        if(this.masks[this.mask].scale == 0)        
        {
            this.$emit('input', parseInt(maskRef.unmaskedValue));
            return;
        }

        this.$emit('input', parseFloat(maskRef.unmaskedValue));
      },

      applyClick(){
        if(!isNullOrUndefined(this.text) && this.text!= '')
           this.$emit('applyClick', this.text);
        this.updateValue('');
      },

      onEnter(){
        this.$emit('onPressEnter', this.text)       
      }
    },

    computed: {
        valueToShow(){
            return isNullOrUndefined(this.value) ? "-" : this.value
        },

        xsValue(){
            return 'xs' + this.xs;
        },

        xsMain(){
            return !isNullOrUndefined(this.useRightSlot) ? 'xs9': 'xs12'
        }
    },

    watch:{
        value: function(value){
            this.text = value;
        },
        error: function(error){
            this.isError = error;
        }
    },

    mounted(){
        this.text = this.value;
        this.typeInner = isNullOrUndefined(this.type) ? 'text' : this.type;
        this.isError = isNullOrUndefined(this.error) ? false : this.error;
        this.ac = isNullOrUndefined(this.isAutocomplete) ? 'off' : this.isAutocomplete;

    }

}
</script>
<style lang="stylus" scoped>
    .c-labeled-field
        line-height: 1.1
        & &__input
            height: 24px
            width: 100%
            border: 1px solid var(--white-primary300)
            border-radius: 2px
            padding: 4px 8px
            font-weight: 600
        & &__btn
            position: absolute
            right: 1px
            bottom: 1px
            font-size: 12px !important
            line-height: 16px
            cursor: pointer
            height: 22px !important
            width: 22px !important
            min-width: 22px !important
            padding: 0 !important
</style>