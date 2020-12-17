<template>
  <v-flex v-bind:[xsValue]="true" class="py-0">
    <v-card flat tile :class="{'blue000-b':isActiveFilter, 'mt-1': hideLabel}" class="c-labeled-combobox">
        <span v-if="!hideLabel" class="font-regular prop-title fs-s nonselect" :class="[isError ? 'red500' : 'grey700']">{{label}}<span v-if="required && editMode" class="red500">*</span></span><br v-if="!hideLabel" >
        <span class="text--primary prop-value">
            <span v-if="!editMode" class="grey900">{{selected}}</span>
            <div v-if="editMode">
                <v-menu offset-y class="c-labeled-combobox__menu">
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" text height="24px" class="c-labeled-combobox__btn justify-space-between align-center px-2 normal-text fs-s fw-b br-2" :class="[isError ? 'red500 red500-border' : 'grey700 grey300-border', isActiveFilter ? 'blue500-border blue800' : 'grey300-border grey700']" outlined>
                            <div class="prop-edit-value">{{selected}}</div>
                            <div class="c-labeled-combobox__icon"> <i class="icon-ChDown" :class="[isActiveFilter ? 'blue500-i' : 'grey500-i']"></i> </div>
                        </v-btn>
                    </template>
                    <div>
                    <v-list :class="{'blue000-b':isActiveFilter}" max-height="240px">
                        <span v-for="item in itemsInner" :key="item.code">
                            <v-list-item class="c-labeled-combobox__list-item px-3 fs-s fw-b grey700 white"  
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
        </span>
    </v-card>
  </v-flex>
</template>

<script>

export default {

    props:[
        'label',
        'value',
        'clearable',
        'editMode',
        'items',
        'xs',
        'useBottomSlot',
        'isActiveFilter',
        'hideLabel',
        'required',
        'sorted',
        'error'
    ],

    data(){
        return {
            itemsInner: [],
            isError: false,
        }
    },
    
    methods: {
        updateValue: function (item) {
            this.$emit('input', item.code)
        },

        sortItemList(items){
            return clone(items).sort((a, b)=>{
                var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
                if (nameA < nameB) return -1 // по возрастанию
                if (nameA > nameB) return 1
                return 0 
            });           
        },
    },

    watch:{
        items:{
            handler: function(values){
                this.itemsInner = isNullOrUndefined(this.sorted) && this.sorted == true ? this.sortItemList(this.items) : this.items;
            },
            deep: true,
            immediate: true
        },
        error: function(error){
            this.isError = error;
        },
    },

    computed: {
        xsValue(){
            return isNullOrUndefined(this.xs) ? 'xs12' : 'xs' + this.xs;
        },

        selected(){
            if(isNullOrUndefined(this.value))
                return '';
            var item = this.items.find(f=>{return f.code == this.value});
            if(isNullOrUndefined(item))
                return '';
            return item.name;
        }
    },
    mounted() {
        // new SimpleBar(qs(".control-combobox"), { autoHide: true });
      },

}
</script>

<style lang="stylus" scoped>
.c-labeled-combobox
    line-height: 1.1
    &__menu
        width: 100%
    &__btn
        width: 100%
        text-align: left
        text-transform: none
        min-width: unset !important
    &__icon
        margin-bottom: -3px
    &__list-item
        min-height: 30px
</style>