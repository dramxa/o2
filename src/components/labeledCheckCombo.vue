<template>
  <v-flex v-bind:[xsValue]="true">
    <v-card flat tile :class="{'mt-1': hideLabel}" class="c-labeled-check-combo">
        <span v-if="!hideLabel" class="font-regular prop-title fs-s pl-5 nonselect" :class="[isError ? 'red500' : 'grey700']">{{label}}</span><br v-if="!hideLabel" >
        <div v-if="!editMode" class="labeled-overflow grey900">
            <input type="checkbox"  :id="cbid" :disabled="isDisabled" :checked="checkState"> 
            <label class="c-labeled-check-combo__checkbox-label grey700 fs-xs" :class="{'default-cursor': isDisabled}" :for="cbid" @click.stop="onClick()"></label>   <!-- id и for должны быть одинаковыми и уникальными -->
            <span class="fs-m">{{selected}}</span>
            <v-tooltip bottom max-width="250" v-if="suggestion"  content-class="custom-tooltip fs-s">
                <template v-slot:activator="{ on }">
                    <div class="pr-2 ml-1 white inline-block" v-on="on">
                        <div class="c-labeled-check-combo__suggestion-btn grey500 grey100-b fs-m text-center pointer">?</div>
                    </div>
                </template>
                <span class="custom-tooltip-accent">{{suggestion}}</span>
            </v-tooltip>
        </div>
        <div v-if="editMode">
            <v-menu offset-y width="100%" v-model="showForm">
                <template v-slot:activator="{ on }">
                    <div class="relative" >
                        <span  @click.stop="onClick()">
                            <input type="checkbox"  :id="cbid"  :checked="checkState" :disabled="isDisabled"> 
                            <label class="c-labeled-check-combo__checkbox-label grey700 fs-xs" :for="cbid"></label>   <!-- id и for должны быть одинаковыми и уникальными -->
                        </span>
                        <input 
                            v-on="on" 
                            v-model="search" 
                            class="c-labeled-check-combo__input border br-2 py-1 pl-2 pr-5 fw-b fs-s"
                            :class="[isError ? 'red500 red500-border' : 'grey700 grey300-border', showForm ? '': 'pointer']"
                            @focus="$event.target.select()">
                        <i v-if="search != '' && showForm" :class="[isError ? 'red500-i': 'grey500-i']" class="c-labeled-check-combo__icon icon-Close pointer" @click="clear()"></i>
                        <i v-else :class="[isError ? 'red500-i': 'grey500-i']" class="c-labeled-check-combo__icon icon-ChDown pointer"  @click="showForm = !showForm"></i>
                    </div>
                </template>
                <div>
                <v-list class="control-combobox" max-height="240px">
                    <span v-for="item in filteredList" :key="item.code">
                        <v-list-item class="c-labeled-check-combo__list-item prop-edit-value px-3 fs-s fw-b grey700 white"  
                            @click="updateValue(item)">
                            {{item.name}}
                        </v-list-item>
                    </span>
                </v-list>
                </div>
            </v-menu>
            <v-tooltip bottom max-width="250" v-if="suggestion"  content-class="custom-tooltip fs-s">
                <template v-slot:activator="{ on }">
                    <div class="pr-2 ml-1 white inline-block" v-on="on">
                        <div class="c-labeled-check-combo__suggestion-btn  grey500 grey100-b fs-m text-center pointer">?</div>
                    </div>
                </template>
                <span class="custom-tooltip-accent">{{suggestion}}</span>
            </v-tooltip>
        </div>
        <v-row v-if="useBottomSlot">
            <v-flex xs12 class="pt-0">
                <slot name="bottomSlot"/>
            </v-flex>
        </v-row>
    </v-card>
  </v-flex>
</template>

<script>

const UNSET_TEXT = "- not selected -"


export default {

    data(){
        return{
            search     : '',
            showForm   : false,
            doFilter   : false,
            firstStart : true,
            itemsInner : [],
            checkState : false
         //   isError: false
        }
    },

    props:[
        'label', 'value', 'clearable', 'editMode', 'items', 'xs', 'useBottomSlot', 'hideLabel', 'applyUnset',  'cbid', 'isDisabled', 'checked', 'suggestion'
    ],
    
    methods: {
        updateValue: function (item) {
            this.search = item.name;
            this.$emit('input', item.code);
        },
        clear(){
            this.search = UNSET_TEXT;
            this.updateValue(this.search);
        },
        onClick(){
            //this.checkState = !this.checkState
            this.$emit('checkClick');
        },
        sortItemList(){
            return  clone(this.items).sort((a, b)=>{
                var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
                if (nameA < nameB) return -1 // по возрастанию
                if (nameA > nameB) return 1
                return 0 
            });
        }
    },

    computed: {
        xsValue(){
            return isNullOrUndefined(this.xs) ? 'xs12' : 'xs' + this.xs;
        },

        selected(){     
            if(isNullOrUndefined(this.value) && !this.applyUnset)
                return '';
            var item = this.itemsInner.find(f=>f.code==this.value);
            if(isNullOrUndefined(item))
                return '';
                
            this.search = item.name;
            return item.name;
        },

        filteredList() {
            if(isNullOrUndefined(this.search) || !this.doFilter)
                return this.itemsInner;

            var res = this.itemsInner.filter(item => {
                 return item.name.toLowerCase().includes(this.search.toLowerCase()) && item.code!=null;
                })
            return res
        },

        isError(){
            var item = this.itemsInner.find(f=>f.name == this.search);
            if(!isNullOrUndefined(item))
                return false;
            return true;
        }
    },
    watch:{
        value: function(item){
            this.search=this.selected;
            //this.doFilter=false;
        },

        search: function(value){
            this.doFilter = true;
        },

        checked:{
            handler: function(value){
                this.checkState = value;
            },
            immediate: true
        },

        showForm: function(value){ 
            if(!value)
                this.doFilter = false;

            if(value && this.firstStart){
                this.doFilter = false;
                this.firstStart = false;
            }
       },

       items: function(value){
            this.itemsInner = [];
            var tmpItemList = this.sortItemList();

            if(this.applyUnset)
                this.itemsInner.push({code: null, name: UNSET_TEXT}, ...tmpItemList)
            else
                this.itemsInner.push(...tmpItemList);
       }
    },

    mounted(){
        this.itemsInner = [];
        if(this.applyUnset)
            this.itemsInner.push({code: null, name: UNSET_TEXT});

        if(!isNullOrUndefined(this.items) && this.items.length>0)
            this.itemsInner.push(...this.sortItemList());

        var sel = this.selected;
        if(isNullOrUndefined(sel) || sel=='')
            sel= UNSET_TEXT;
        this.search=sel;
    }
}
</script>
<style lang="stylus" scoped>
.c-labeled-check-combo
    line-height: 1.1
    &__checkbox-label
        line-height: 12px !important
        height: 12px
    &__suggestion-btn
        border-radius: 50%
        width: 16px
        display: inline-block
    &__input
        width: calc(100% - 20px)
        height: 24px
    &__icon
        position: absolute
        right: 5px
        line-height: 24px
    &__list-item
        min-height: 30px
</style>
<style scoped>
label {
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
}
input[type="checkbox"]:checked, 
input[type="checkbox"]:not(:checked) {
    position: absolute;
    left: -9999px;
}

input[type="checkbox"]:checked + label, 
input[type="checkbox"]:not(:checked) + label {
    display: inline-block;
    position: relative;
    padding-left: 20px;
    line-height: 12px;
    cursor: pointer;
}

input[type="checkbox"]:checked + label:before, 
input[type="checkbox"]:not(:checked) + label:before {
    content: "";
    position: absolute;
    left: 0px;
    top: 0px;
    width: 13px;
    height: 13px;
    border: 1px solid #B0BEC5;     /* Цвет рамки */
    background-color: #ffffff;     /* Цвет фона */
}
input[type="checkbox"]:checked + label:before {
    background-color: var(--var-accent700);     /* Цвет фона (active) */
    border: 1px solid var(--var-accent700);     /* Цвет рамки (active) */
}

input[type="checkbox"]:checked + label:before, 
input[type="checkbox"]:not(:checked) + label:before {
    border-radius: 2px;
}

input[type="checkbox"]:checked + label:after, 
input[type="checkbox"]:not(:checked) + label:after {
    content: "";
    position: absolute;
}

input[type="checkbox"]:checked + label:after {
    left: 3px;
    top: 3px;
    width: 7px;
    height: 5px;
    border-radius: 1px;
    border-left: 2px solid #fff;      /* Цвет галочки */
    border-bottom: 2px solid #fff;    /* Цвет галочки */
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
}

.dark-theme input[type="checkbox"]:not(:checked) + label:before {
    border-color: rgb(58, 72, 79) !important;
    background-color: rgb(24, 26, 27) !important;
}

.dark-theme input[type="checkbox"]:checked + label:after {
    border-color: rgb(0, 0, 0) !important;
}

</style>
<style>
.units-class .prop-value{
    position: relative;
    top: 4px;
}
.v-card__text{
    padding: 6px;
}
.labeledComboboxBtn {
    width:100%;
    text-align:left;
    text-transform:none;
}

.control-combobox .v-input__slot{
    min-height: 30px !important;
}

.control-combobox .mdi-menu-down::before{
    content: "\e90b" !important;
    font-family: 'icomoon' !important;
    font-size: 16px;
}
</style>