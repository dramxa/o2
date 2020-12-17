<template>
    <v-menu :left="isLeft" :close-on-content-click="false" v-model="showForm">
        <template v-slot:activator="{ on }">
            <v-btn 
                v-on="on" 
                text 
                height="24px" 
                width="100%"
                class="c-filter-from-to__activator-btn justify-space-between align-center px-2 border"
                :class="[isActive ? 'blue800 blue000-b blue500-border':'grey700 grey300-border', `${menuClass}-button`]"
            >
                <div class="prop-edit-value fw-b" >{{isActive?'Set':'All'}}</div>
                <div class="c-filter-from-to__activator-btn-icon"> <i class="icon-ChDown" :class="[isActive ? 'blue500-i' : 'grey500-i']"></i> </div>
            </v-btn>
        </template>
        <div class="c-filter-from-to white-light border default-border-radius border elevation-0 grey300-border" :class="menuClass">
            <v-layout class="px-2 pt-1">
                <span class="normal-text fs-s fw-b grey700" >All</span><v-spacer></v-spacer><i class="grey500-i icon-ChDown"></i>
            </v-layout>
            <v-layout class="gd-filter-inputs">
                <v-flex xs6 >
                <v-card flat tile class="white-light gd-filter-dt-from">
                    <v-card-text >
                        <span class="font-regular prop-title fs-s grey700">≥ FROM</span><br>
                        <span class="text--primary">
                            <div  class="align-self-center">
                                <v-menu :left="isLeft" offset-y v-if="fromToType == 'date'" ref="menu1" v-model="menu1" :close-on-content-click="false">
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" text height="24px" width="100%" class="normal-text text-left justify-start align-center px-2 border br-2" :class="[isActive ? 'blue500-border blue800 blue000-b':'grey300-border grey500']">
                                            <div class="normal-text fs-s">{{dateFromCaption}}</div>
                                        </v-btn>
                                    </template>
                                    <v-date-picker :readonly="false" v-model="fromInner" no-title @change="menu1 = false"></v-date-picker>
                                </v-menu>
                                <template v-else>
                                    <input v-if="masked"
                                    type="text" 
                                    class="c-filter-from-to__input prop-edit-value border fw-b px-2 py-1 br-2"
                                    :class="[isActive ? 'blue500-border blue800 blue000-b':'grey300-border grey500']"
                                    placeholder="Set value"
                                    v-imask="masks[mask]"
                                    @complete="updateValueMaskedFrom"
                                    >
                                    <input v-else
                                    type="text" 
                                    class="c-filter-from-to__input prop-edit-value border fw-b px-2 py-1 br-2"
                                    :class="[isActive ? 'blue500-border blue800 blue000-b':'grey300-border grey500']"
                                    placeholder="Set value"
                                    v-model="fromInner"
                                    >
                                </template>
                                 <!-- v-no-first-digits -->
                            </div>
                        </span>
                    </v-card-text>
                </v-card>
                </v-flex>
                <v-flex xs6 >
                <v-card flat tile  class="white-light gd-filter-dt-to">
                    <v-card-text >
                        <span class="font-regular prop-title fs-s grey700">≤ TO</span><br>
                        <span class="text--primary">
                            <div  class="align-self-center">
                                <v-menu :left="isLeft" offset-y v-if="fromToType == 'date'" ref="menu2" v-model="menu2" :close-on-content-click="false">
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" text height="24px" width="100%" class="text-left normal-text justify-start align-center px-2 br-2 border" :class="[isActive ? 'blue500-border blue800 blue000-b':'grey300-border grey500']">
                                            <div class="normal-text fs-s">{{dateToCaption}}</div>
                                        </v-btn>
                                    </template>
                                    <v-date-picker :readonly="false" v-model="toInner" no-title @change="menu2 = false"></v-date-picker>
                                </v-menu>
                                <template v-else>
                                    <input v-if="masked"
                                    type="text" 
                                    class="c-filter-from-to__input prop-edit-value border fw-b px-2 py-1 br-2"
                                    :class="[isActive ? 'blue500-border blue800 blue000-b':'grey300-border grey500']"
                                    placeholder="Set value"
                                    v-imask="masks[mask]"
                                    @complete="updateValueMaskedTo"
                                    >
                                    <input v-else
                                    type="text" 
                                    class="c-filter-from-to__input prop-edit-value border fw-b px-2 py-1 br-2"
                                    :class="[isActive ? 'blue500-border blue800 blue000-b':'grey300-border grey500']"
                                    placeholder="Set value"
                                    v-model="toInner"
                                    >
                                </template>
                            </div>
                        </span>
                    </v-card-text>
                </v-card>
                </v-flex>
            </v-layout>
            <v-layout class="pa-2 gd-filter-control">
                <v-spacer></v-spacer>
                <v-btn text class="normal-text fs-s fw-b grey300 pa-0 mr-2" height="24px" @click="clearClick"><span class="btn-text">Clear all</span></v-btn>
                <v-btn text class="normal-text fs-s fw-b blue600 pa-0" height="24px" @click="applyClick"><span class="btn-text">Apply</span></v-btn>
            </v-layout>
            </div>
        </v-menu>
</template>
<script>
import { masks } from '@/consts/directiveConsts'
import {IMaskDirective} from 'vue-imask';

export default {
     props: [
        'isLeft',
        'fromToType',
        'data',
        'factor',
        'masked',
        'mask',
        'menuClass'
    ],
    
    data(){
        return{
            fromInner : '',
            toInner   : '',
            menu1     : false,
            menu2     : false,
            showForm  : false,
            apply     : false,
            masks
        }
    },

    directives: {
      imask: IMaskDirective
    },

    computed:{
        dateFromCaption(){
            return this.fromInner == '' ? 'Set date' : formatDate(this.fromInner); 
        },
        dateToCaption(){
            return this.toInner == '' ? 'Set date' : formatDate(this.toInner); 
        },

        isActive(){
            return this.fromInner == '' && this.toInner == '' ? false : true;
        }
    },
    
    methods:{
        clearClick(){
            this.fromInner = "";
            this.toInner = "";
            this.showForm = false;
        },
        applyClick(){
            this.showForm = false;
        },
        updateValueMaskedFrom (e) {
            const maskRef = e.detail;
            // console.log(this.mask.mask.name)
            if(this.masks[this.mask].mask != Number)
            {
                this.fromInner = maskRef.unmaskedValue;
                return;
            }

            if(this.masks[this.mask].scale == 0)        
            {
                this.fromInner = parseInt(maskRef.unmaskedValue);
                return;
            }

            this.fromInner = parseFloat(maskRef.unmaskedValue);
        },
        updateValueMaskedTo (e) {
            const maskRef = e.detail;
            // console.log(this.mask.mask.name)
            if(this.masks[this.mask].mask != Number)
            {
                this.toInner = maskRef.unmaskedValue;
                return;
            }

            if(this.masks[this.mask].scale == 0)        
            {
                this.toInner = parseInt(maskRef.unmaskedValue);
                return;
            }

            this.toInner = parseFloat(maskRef.unmaskedValue);
        },
    },

    watch:{
        showForm: function(value){
            if(!value){
                if(this.fromToType == 'date')
                    this.$emit('doChange', { from: this.fromInner, to: this.toInner, use: this.isActive });
                else
                    this.$emit('doChange', { from: this.fromInner, to: this.toInner, use: this.isActive });
            }
        },

        data: {
            handler: function(data){
                this.fromInner = isNullOrUndefined(data) ? '' : data.from.toString();
                this.toInner = isNullOrUndefined(data) ? '' : data.to.toString();
            },
            deep: true
        }
    },    

    mounted(){
        this.fromInner = isNullOrUndefined(this.data) ? '' : this.data.from.toString();
        this.toInner = isNullOrUndefined(this.data) ? '' : this.data.to.toString();
    }

}
</script>
<style lang="stylus" scoped>
.c-filter-from-to
    min-width 217px
    &__activator-btn
        text-align left
        text-transform none
        border-radius 2px
    &__activator-btn-icon
        margin-bottom -3px
    &__input
        height 24px
        width 100%
        font-size 12px
    
</style>