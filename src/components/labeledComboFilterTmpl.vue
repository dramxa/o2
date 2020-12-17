<template>
  <v-flex v-bind:[xsValue]="true">
    <v-card flat tile :class="{'mt-1': hideLabel}" class="c-labeled-combo-filter">
        <span v-if="!hideLabel" class="font-regular prop-title fs-s nonselect" :class="[isError ? 'red500' : 'grey700']">{{label}}<span v-if="required && editMode" class="red500">*</span></span><br v-if="!hideLabel" >
        <span class="text--primary prop-value">
            <span v-if="!editMode" class="labeled-overflow grey900">{{selected}}</span>
            <div v-if="editMode">
                <v-menu offset-y class="c-labeled-combo-filter__menu" v-model="showForm">
                    <template v-slot:activator="{ on }">
                        <div class="relative" >
                            <input :readonly="!showForm"
                                v-on="on" 
                                v-model="search" 
                                class="c-labeled-combo-filter__input border br-2 py-1 pl-2 pr-6 fw-b fs-s"
                                :class="[isError ? 'red500 red500-border' : 'grey700 grey300-border', isActiveFilter ? 'blue500-border blue800' : 'grey300-border grey700', showForm ? '': 'pointer']"
                                @focus="$event.target.select()">
                            <i class="c-labeled-combo-filter__icon icon-Close"  v-if="search != '' && showForm" :class="[isError ? 'red500-i': '', isActiveFilter ? 'blue500-i' : '', isActiveFilter || isError ? '' : 'grey500-i']" @click="clear()"></i>
                            <i class="c-labeled-combo-filter__icon icon-ChDown" v-else :class="[isError ? 'red500-i': '', isActiveFilter ? 'blue500-i' : '', isActiveFilter || isError ? '' : 'grey500-i']" @click="showForm = !showForm"></i>
                        </div>
                    </template>
                    <div>
                    <v-list class="control-combobox" max-height="240px">
                        <span v-for="item in filteredList" :key="item.code">
                            <v-list-item class="c-labeled-combo-filter__list-item d-flex align-center px-3 fs-s fw-b grey700 white" @click="updateValue(item)">
                                <span>{{item.name}}</span>
                                <v-spacer/>
                                <v-tooltip bottom  content-class="custom-tooltip fs-s">
                                    <template v-slot:activator="{ on }">
                                        <i v-if="item.isPublic" v-on="on" class="ml-2 grey500-i icon-Routing1"></i>
                                    </template>
                                    <span class="custom-tooltip-accent fw-m">Public template</span>
                                </v-tooltip>
                                
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

const UNSET_TEXT = "- not selected -"


export default {

    data(){
        return{
            search: '',
            showForm: false,
            doFilter: false,
            firstStart: true,
            isError: false,
            itemsInner:[],
            excludeListInner: []
         //   isError: false
        }
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
        'isActiveFilter',
        'applyUnset',
        'required',
        'excludeList',
        'error',
        'customUnsetText'
    ],
    
    methods: {
        updateValue: function (item) {
            this.search = item.name;
            this.$emit('input', item.code);
            this.$emit('change');
        },
        clear(){
            this.search = !isNullOrUndefined(this.customUnsetText) ? this.customUnsetText : UNSET_TEXT;
            if(!isNullOrUndefined(this.customUnsetText))
                this.updateValue(this.filteredList[0]);
            else
                this.updateValue(this.search);
        },
        
        sortItemListBase(items, byProp = 'name'){
            return clone(items).sort((a, b)=>{
                var nameA = a[byProp].toLowerCase(), nameB = b[byProp].toLowerCase()
                if (nameA < nameB) return -1 // по возрастанию
                if (nameA > nameB) return 1
                return 0 
            });           
        },
        
        sortItemList(items){
            var others = this.sortItemListBase(items.filter(f=>f.code.toLowerCase().startsWith('other')), 'code')
            var excludeOthers = this.sortItemListBase(items.filter(f=>!f.code.toLowerCase().startsWith('other')))            
            return [...others, ...excludeOthers];
        },

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
            let items = this.itemsInner.filter(f=>!this.excludeListInner.includes(f.code));

            if(isNullOrUndefined(this.search) || !this.doFilter || this.search == UNSET_TEXT){
                let publicTmpl = items.filter(i=>i.isPublic || isNullOrUndefined(i.code));
                let isolatedTmpl = items.filter(i=>!i.isPublic && !isNullOrUndefined(i.code));
                return publicTmpl.concat(isolatedTmpl)
            }
                

            var res = items.filter(item => {
                 return item.name.toLowerCase().includes(this.search.toLowerCase()) && item.code!=null;
                })
            let sorted = res.sort((a,b)=>{
                return (''+a.name).localeCompare(b.name);
            });

            let publicTmpl = sorted.filter(p=>p.isPublic);
            let isolatedTmpl = sorted.filter(i=>!i.isPublic);

            return publicTmpl.concat(isolatedTmpl)
        },

        // isError(){
        //     var item = this.itemsInner.find(f=>f.name == this.search);
        //     if(!isNullOrUndefined(item) || this.applyUnset)
        //         return false;
        //     return true;
        // }
    },
    watch:{
        value: function(item){
            this.search=this.selected;
            //this.doFilter=false;
        },

        error: function(error){
            this.isError = error;
        },

        search: function(value){
            this.doFilter = true;
        },

        showForm: function(value){ 
            if(!value){
                this.doFilter = false;
                var item = this.itemsInner.find(f=>f.name==this.search);
                if(this.applyUnset && item == null && this.itemsInner.length > 1 && this.editMode)
                    this.$emit('input', null);
            }

            if(value && this.firstStart){
                this.doFilter = false;
                this.firstStart = false;
            }
       },

       items: {       
        handler: function(value){
            this.itemsInner = [];
            var items = value == null? [] : this.sortItemList(value);
            if(this.applyUnset)
                this.itemsInner.push({code: null, name: UNSET_TEXT}, ...items)
            else
                this.itemsInner.push(...items);
            this.search=this.selected;

            if(!this.showForm){
                this.doFilter = false;
                var item = this.itemsInner.find(f=>f.name==this.search);
                if(this.applyUnset && item == null && this.itemsInner.length > 1 && this.editMode)
                    this.$emit('input', null);
            } 
        },
        immediate: true 
       },

       excludeList: {
           handler: function(value){
               this.excludeListInner = value || [];
           },
           immediate: true
       }
    },

    mounted(){
        this.itemsInner = [];
        if(this.applyUnset)
            this.itemsInner.push({code: null, name: UNSET_TEXT});
        
        if(!isNullOrUndefined(this.items) && this.items.length>0)
            this.itemsInner.push(...this.sortItemList(this.items));

        var sel = this.selected;
        if(isNullOrUndefined(sel) || sel=='')
            sel= UNSET_TEXT;
        this.search=sel;
    }
}
</script>

<style lang="stylus" scoped>
.c-labeled-combo-filter
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