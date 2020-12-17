<template>
  <v-flex v-bind:[xsValue]="true">
    <v-card flat tile :class="{'mt-1': hideLabel}" class="c-labeled-input-combo">
        <span v-if="!hideLabel" class="font-regular prop-title fs-s grey700 nonselect">{{label}}<span v-if="required && editMode" class="red500">*</span></span><br v-if="!hideLabel">
        <div class="text--primary prop-value">
            <span v-if="!editMode">{{selected}}</span>
            <div v-if="editMode">
                <v-menu offset-y class="c-labeled-input-combo__menu" v-model="showForm">
                    <template v-slot:activator="{ on }">
                        <div class="relative">
                            <input 
                                v-if="masked"
                                v-imask="masks[mask]"
                                :value="search"
                                @complete="updateValueMasked"
                                v-on="on"
                                class="c-labeled-input-combo__input border grey300-border br-2 py-1 pl-2 pr-4 fw-b fs-s grey700"
                                @focus="$event.target.select()">
                            <input 
                                v-else
                                v-on="on" 
                                v-model="search"
                                class="c-labeled-input-combo__input border grey300-border br-2 py-1 pl-2 pr-4 fw-b fs-s grey700"
                                @focus="$event.target.select()">
                            <i class="c-labeled-input-combo__icon grey500-i icon-ChDown" @click="showForm = true"></i>
                        </div>
                    </template>
                    <div>
                    <v-list class="control-combobox" max-height="240px">
                        <span v-for="item in filteredList" :key="item.code">
                            <v-list-item class="c-labeled-input-combo__list-item prop-edit-value px-3 fs-s fw-b grey700 white"  
                                @click="updateValue(item)">
                                {{item.name}}
                            </v-list-item>
                        </span>
                    </v-list>
                    </div>
                </v-menu>
            </div>
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

    data(){
        return{
            search: '',
            showForm: false,
            masks,
        }
    },
    
    directives: {
      imask: IMaskDirective
    },

    props:[
        'label',
        'value',
        'clearable',
        'editMode',
        'items',
        'xs',
        'useBottomSlot',
        'hideLabel',
        'required',
        'masked',
        'mask'
    ],
    
    methods: {
      updateValue: function (item) {
        this.search = item.code;
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
    },

    computed: {
        xsValue(){
            return isNullOrUndefined(this.xs) ? 'xs12' : 'xs' + this.xs;
        },

        selected(){               
           if(isNullOrUndefined(this.value))
                return '';
            var item = this.items.find(f=>f.code==this.value);
            if(isNullOrUndefined(item))
                return this.value;
                
            this.search = item.name;
            return item.name;
        },
        filteredList() {
            return this.items;
        }
    },
    
    watch:{
        value: function(item){
            this.search=this.selected;
        },

        search: function(value){
            this.$emit('input', value);
        },

    },

    mounted(){
        this.search=this.selected;
    }
}
</script>
<style lang="stylus" scoped>
.c-labeled-input-combo
    line-height: 1.1
    &__menu
        width: 100%
    &__input
        width: 100%
        height: 24px
    &__icon
        position: absolute
        right: 5px
        line-height: 24px
    &__list-item
        min-height: 30px
</style>