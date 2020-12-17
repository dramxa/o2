<template>
    <v-menu :close-on-content-click="false" offset-y v-model="showForm">
        <template v-slot:activator="{ on }">
            <div class="relative">
                <input v-on="on" v-model="title" class="c-filter-select__activator-input border br-2 py-1 pl-2 pr-4 fw-b fs-s" :class="[isActive ? 'blue500-border blue000-b blue800':'grey300-border grey500']">
                <i @click="showForm = !showForm" class="c-filter-select__activator-icon grey500-i icon-ChDown pointer"></i>
            </div>
        </template>
        <div class="c-filter-select border blue050-border" :class="[menuClass]">
            <v-list class="c-filter-select__list control-combobox pb-0 pt-3 gd-filter-list" max-height="240px">
                <span v-for="(item) in selfItems" :key="item.code">
                    <v-list-item class="c-filter-select__list-item prop-edit-value px-3 fs-s fw-b grey700">
                        <c-table-checkbox v-model="item.isSelected" class="pl-0" :cbid="'filter-select-item-' + item.code" :label="item.name" />
                    </v-list-item>
                </span>
            </v-list>
            <v-layout class="pa-2 white-light gd-filter-control mt-n2">
                <v-spacer></v-spacer>
                <v-btn text class="normal-text fs-s fw-b grey300 pa-0 mr-2" height="24px" @click="clearClick"><span class="btn-text">Clear all</span></v-btn>
                <v-btn text class="normal-text fs-s fw-b blue600 pa-0" height="24px" @click="applyClick"><span class="btn-text">Apply</span></v-btn>
            </v-layout>
        </div>
    </v-menu>
</template>

<script>
export default {
    props: [
        'items', 
        'value', 
        'menuClass'
    ],

    data(){
        return{            
            selfItems   : [],
            showForm    : false,
            init        : true,
            lastValueIn : null,
            apply       : false,
           // isActive : true
        }
    },

    computed:{
        title(){
            var selected = this.selfItems.filter(f=>f.isSelected==true)
            if(selected.length == 0)
                return 'All';
            var res = selected.length > 1? 'Multi' : selected[0].name;
            return res;
        },

        isActive(){
            return this.selfItems.some(f=>f.isSelected)
        }
    },

    methods:{
        clearClick(){
            this.selfItems.forEach(f=>{
                f.isSelected = false
            });
            var selected = this.selfItems.filter(f=>f.isSelected).map(m=>m.code)
            this.$emit('doChange', selected)
            this.showForm = false;
            this.apply = true;
        },
        applyClick(){
            var selected = this.selfItems.filter(f=>f.isSelected).map(m=>m.code)
            this.$emit('doChange', selected)
            this.showForm = false;
            this.apply = true;
        },
        setItems(value){
            this.selfItems = this.items.map(i=>{
            let selected = !isNullOrUndefined(value.find(f=>f==i.code));
                return { isSelected : selected, ...i}
            });
        }
    },
    
    watch:{
        showForm: function(data){
                if(data)
                {
                  this.apply = false;
                  this.lastValueIn = JSON.stringify(this.value);
                }
                else
                    if(!this.apply){
                        this.setItems(JSON.parse(this.lastValueIn))
                    }
        },

        value:{
            handler: function(value){
                if(this.lastValueIn == JSON.stringify(value))
                    return;
                
                this.lastValueIn = JSON.stringify(value);
                this.setItems(value);
            },
            deep: true,
            immediate: true
        },
    },

    // mounted(){
    //     this.lastValueIn = JSON.stringify(this.value);
    //     this.selfItems = this.items.map(i=>{
    //         let selected = !isNullOrUndefined(this.value.find(f=>f==i.code));
    //         return { isSelected : selected, ...i}
    //         });
    // }
    
}
</script>
<style lang="stylus">
.c-filter-select
    &__activator-input
        width 100%
        height 24px
    &__activator-icon
        position absolute
        right 6px
        line-height 24px
    &__list
        overflow auto
        padding-left 5px
    &__list-item
        min-height 30px
</style>
<style scoped>
.v-menu{display:none !important;}
</style>
