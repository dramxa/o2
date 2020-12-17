
<template>
    <v-flex >
        <v-card flat tile class="c-labeled-date">
            <span class="fs-s grey700 nonselect" v-if="label">{{label}}<span v-if="required" class="red500">*</span></span><br v-if="label">
            <span class="prop-value">
                <v-menu offset-y ref="menu" v-model="menu" :close-on-content-click="false">
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" text height="23px" class="c-labeled-date__btn justify-start align-center px-2 br-2 border relative" :class="[isError ? 'red500-border red500':'grey300-border grey500']" >
                            <div class="normal-text fs-s" :class="[inner == '' ? '': 'fw-b']">{{dateCaption}}</div>
                            <i v-if="clearIcon && !isNullOrUndefined(inner) && inner!=''" class="c-labeled-date__icon icon-Close pointer" @click.stop="clear()"></i>
                        </v-btn>
                    </template>
                    <v-date-picker :readonly="false" v-model="inner" no-title @change="updateValue($event)"></v-date-picker>
                </v-menu>
            </span>
        </v-card>
    </v-flex>
</template>
<script>
import { watch } from 'fs';

export default {
     props: [
        'data',
        'label', 
        'value',
        'error',
        'required',
        'clearIcon'
    ],
    
    data(){
        return{
            inner: '',
            menu: false,
            isError: false
        }
    },

    methods:{
        updateValue(value){
            this.menu = false;
            this.$emit('input', value)
        },
        clear(){
            this.inner='';
        }
    },

    computed:{
        dateCaption(){
            return isNullOrUndefined(this.inner) || this.inner=='' ? 'Set date' : formatDate(this.inner); 
        },
    },

    watch:{
        value:{
            handler:function(data){
                this.inner = data
            },
            immediate: true
        },
        error: function(error){
            this.isError = error;
        }
    },

    mounted(){
        this.isError = isNullOrUndefined(this.error) ? false : this.error;

    }

}
</script>

<style lang="stylus" scoped>
.c-labeled-date
    line-height: 1.1
    &__btn
        width: 100%
        text-align: left
        text-transform: none
    &__icon
        position: absolute
        right: -5px
        line-height: 24px
</style>