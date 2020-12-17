<template>
    <v-layout>
        <v-card flat tile class="c-adv-editor-increment mr-2">
            <span class="fs-xs grey700 ws-pre">Multiple instances</span><br>
            <span class="text--primary prop-value">
                <v-flex>
                    <div class="c-adv-editor-increment__input-wrapper relative pointer pa-0 d-inline-block">
                        <v-btn text tile class="c-adv-editor-increment__minus-btn white elevation-0 pa-0 pointer">
                            <i class="grey500-i icon-MinusSign py-1"  @click="updateCount(countInner - 1)"></i>
                        </v-btn>
                        <input 
                            type="text" 
                            class="c-adv-editor-increment__input prop-edit-value grey700 text-center fw-b fs-s px-2 py-1 br-2 border grey300-border" 
                            v-model="countInner"
                            @input="updateCount($event.target.value)"
                            >
                        <v-btn text tile class="c-adv-editor-increment__plus-btn white elevation-0 pa-0 pointer">
                            <i class="grey500-i icon-PlusSign py-1"  @click="updateCount(countInner + 1)"></i>
                        </v-btn>
                    </div>
                    
                    <v-tooltip bottom max-width="250"  content-class="custom-tooltip fs-s">
                        <template v-slot:activator="{ on }">
                            <div v-on="on" class="c-adv-editor-increment__info-btn grey500 grey100-b fs-m text-center ml-3 mr-1 pointer">?</div>
                        </template>
                        <span class="custom-tooltip-accent fw-m">
                            Create many instances, where:<br>
                            Count instances - count new vms<br>
                            Starts with - first start vms<br>
                            Also you can use mask in VM name like:<br>
                            vm_{000}_test<br>
                            this will create vm with name "vm_001_test"<br>
                        </span>
                    </v-tooltip>
                </v-flex>
            </span>
        </v-card>
        <v-card flat tile class="c-adv-editor-increment">
            <span class="fs-xs grey700">Starts with</span><br>
            <span class="text--primary prop-value">
                <v-flex>
                    <div class="c-adv-editor-increment__input-wrapper relative pointer pa-0">
                        <v-btn text tile class="c-adv-editor-increment__minus-btn white elevation-0 pa-0 pointer">
                            <i class="grey500-i icon-MinusSign py-1"  @click="updateStart(startInner - 1)"></i>
                        </v-btn>
                        <input 
                            type="text" 
                            class="c-adv-editor-increment__input prop-edit-value grey700 text-center fw-b fs-s px-2 py-1 br-2 border grey300-border"
                            v-model="startInner"
                            @input="updateStart($event.target.value)"
                            >
                        <v-btn text tile class="c-adv-editor-increment__plus-btn white elevation-0 pa-0 pointer">
                            <i class="grey500-i icon-PlusSign py-1"  @click="updateStart(startInner + 1)"></i>
                        </v-btn>
                    </div>
                </v-flex>
            </span>
        </v-card>
    </v-layout>
</template>
<script>
export default {
    props: ['value'],
    
    data(){
        return {
            countInner : 1,
            startInner : 1
        }
    },

    methods:{
        updateCount(value){
            if(!Number.isInteger(value))
                value = parseInt(value);            
            if(isNaN(value))
                value = 1;
            this.countInner = value > 1 ? value : 1;
            this.sendData();
        },
        updateStart(value){
            if(!Number.isInteger(value))
                value = parseInt(value)     
            if(isNaN(value))
                value = 1;          
            this.startInner = value > 1 ? value : 1;
            this.sendData();
        },
        sendData(){
            this.$emit('input', { count: this.countInner, startWith: this.startInner })
        }
    },

    watch:{
        value: {
            handler: function({count, startWith}){
                this.countInner = count,
                this.startInner = startWith 
            },
            immediate: true
        }
    }


}
</script>
<style lang="stylus" scoped>
.c-adv-editor-increment
    line-height 1
    &__minus-btn
        position absolute
        left 1px
        top 1px
        font-size 16px
        height 22px !important
        width 16px !important
        min-width 16px !important
    &__input
        height 24px
        width 100%
    &__plus-btn
        position absolute
        right 1px
        top 1px
        font-size 16px
        height 22px !important
        width 16px !important
        min-width 16px !important
    &__input-wrapper
        width 50px
    &__info-btn
        border-radius 50%
        width 16px
        display inline-block
</style>