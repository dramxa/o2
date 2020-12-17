<template>
<div class="w-table white pa-4 br-2 relative">
<div v-if="loading" class="w-table__loading-overlay white">
    <div class="fs-m fw-b pa-3 widgets-title-opacity">RESOURCE PROFILES</div>
    <div class="w-table__loading-message fs-ml text-center">Loading...</div>
</div>
<v-layout>
    <v-flex class="fs-m fw-b grey700">
        RESOURCE PROFILES (Total : {{rpItems.length}})
    </v-flex>
    <v-flex class="w-table__export text-right">
         <v-menu offset-y left width="170px">
            <template v-slot:activator="{ on, value }">
                <v-btn v-on="on" :class="{'grey100-b': value}" icon tile text width="24" height="24" class="w-table__export-btn br-4">
                    <i class="grey500-i icon-Donner icon-16"></i>
                </v-btn>
            </template>
            <v-list width="170px" class="control-combobox py-2 border blue050-border br-4">
                <v-list-item height="32px" class="fs-m" @click="exportCsv()">Export list (CSV)</v-list-item>
            </v-list>
        </v-menu>
    </v-flex>
</v-layout>
<v-layout class="relative">
    <div 
    class="w-table__tooltip grey100 fs-s px-4 py-2" 
    :class="[tooltip.show ? '' : 'w-table__tooltip--hide']"
    :style="{left: `${tooltip.left}px`, top: `${tooltip.top}px`, transform: `${!tooltip.show ? 'scale(0)' : 'none'}`}"
    >   
    <!-- :style="{left: `${tooltip.left}px`, top: `${tooltip.top}px`}" -->
        <div class="custom-tooltip-accent text-center fs-m mb-2 fw-b">{{tooltip.headerToShow}}</div>
        <div class="d-flex">
            <div class="custom-tooltip-color flex-grow-1 ">
                <div class="fw-b">Total:</div>
                <div class="fw-b">Active:</div>
            </div>
            <div class="custom-tooltip-accent flex-grow-0 text-right">
                <div class="fw-b">{{tooltip.total}}</div>
                <div class="fw-b">{{tooltip.active}}</div>
            </div>
            <div class="custom-tooltip-color flex-grow-0 ml-1">
                <div>{{tooltip.unit}}</div>
                <div>{{tooltip.unit}}</div>
            </div>
        </div>
    </div>
    <v-data-table
        v-if="!loading"
        :headers="tableHeaders"
        :items="rpItems"
        item-key="id"
        fixed-header
        disable-pagination
        hide-default-header
        hide-default-footer
        class="w-table__table dashboard-table"
        > 
        <template v-slot:header="data">
            <thead class="border-bottom blue050-border">
            <tr>
            <template v-for="header in data.props.headers">
            <th :key="header.value" class="table-header-text pa-2 fw-n">
                <div class="d-flex align-center">
                    <span class="fs-s grey600 nonselect">{{header.text}}</span>
                </div>
            </th>
            </template>
            </tr>
            </thead>

        </template>
        <template v-slot:item="data">
            <tr class="row-with-hidden-menu border-bottom grey100-border">
            <template v-for="(header, index) in data.headers">
                <td :key="index" >
                    <!-- name -->
                    <div v-if="header.value=='name'">
                        <div class="blue800 fs-ml" v-if="!isNullOrUndefined(data.item.rp)">{{data.item.rp}}</div>
                        <div class="grey700 fs-s" v-if="!isNullOrUndefined(data.item.dc)">{{data.item.dc}}</div>
                    </div>

                    <!-- vms -->
                    <div v-if="header.value=='vms'">
                    <span class="grey900 fs-ml pointer" @mouseenter="hover($event, isNullOrUndefined(data.item.vm) ? 0 : data.item.vm.count, isNullOrUndefined(data.item.vm) ? 0 : data.item.vm.active, header.value), tooltip.show = true" @mouseleave="tooltip.show = false"><span class="border-dashed grey900-border">{{isNullOrUndefined(data.item.vm) ? 0 : data.item.vm.count}}</span><span class="grey300"> / <span class="border-dashed grey300-border">{{isNullOrUndefined(data.item.vm) ? 0 : data.item.vm.active}}</span></span></span>
                    </div>

                    <!-- cpu -->
                    <div v-if="header.value=='cpu'">
                    <span class="grey900 fs-ml pointer" @mouseenter="hover($event, isNullOrUndefined(data.item.cpu) ? 0 : data.item.cpu.count, isNullOrUndefined(data.item.cpu) ? 0 : data.item.cpu.active, header.value), tooltip.show = true" @mouseleave="tooltip.show = false"><span class="border-dashed grey900-border">{{isNullOrUndefined(data.item.cpu) ? 0 : data.item.cpu.count}}</span><span class="grey300"> / <span class="border-dashed grey300-border">{{isNullOrUndefined(data.item.cpu) ? 0 : data.item.cpu.active}}</span></span></span>
                    </div>

                    <!-- ram -->
                    <div v-if="header.value=='ram'">
                    <span class="grey900 fs-ml pointer" @mouseenter="hover($event, isNullOrUndefined(data.item.ram) ? 0 : toGb(data.item.ram.count), isNullOrUndefined(data.item.ram) ? 0 : toGb(data.item.ram.active), header.value), tooltip.show = true" @mouseleave="tooltip.show = false"><span class="border-dashed grey900-border">{{isNullOrUndefined(data.item.ram) ? 0 : toGb(data.item.ram.count)}}</span><span class="grey300"> / <span class="border-dashed grey300-border">{{isNullOrUndefined(data.item.ram) ? 0 : toGb(data.item.ram.active)}}</span></span></span>
                    </div>

                    <!-- storage -->
                    <div v-if="header.value=='storage'">
                    <span class="grey900 fs-ml pointer" @mouseenter="hover($event, isNullOrUndefined(data.item.storage.count) ? 0 : toGb(data.item.storage.count), isNullOrUndefined(data.item.storage.active) ? 0 : toGb(data.item.storage.active), header.value), tooltip.show = true" @mouseleave="tooltip.show = false"><span class="border-dashed grey900-border">{{isNullOrUndefined(data.item.storage.count) ? 0 : toGb(data.item.storage.count)}}</span><span class="grey300"> / <span class="border-dashed grey300-border">{{isNullOrUndefined(data.item.storage.active) ? 0 : toGb(data.item.storage.active)}}</span></span></span>
                    </div>
                </td>
            </template>
            </tr>
        </template>
    </v-data-table>
</v-layout>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {

    data() {
        return{
            rpItems: [],
            tooltip:{
                show: false,
                left: 0,
                top: 0,
                header: '',
                headerToShow: '',
                total: 0,
                active: 0,
                unit: ''
            }
        }
    },

    props:[
        'tableHeaders'
    ],

    methods: {

        hover(e, total, active, header){
            this.tooltip.left = e.target.offsetParent.offsetLeft + e.target.offsetLeft - 140 + 20
            this.tooltip.top = e.target.offsetParent.offsetTop + e.target.offsetTop - 6 - 72
            this.tooltip.total = total
            this.tooltip.active = active
            this.tooltip.header = header
            this.tooltipUnitCalc()
        },

        prepareData(){
            if(this.dsbrd_res_items.length > 0){
                let nonStorageCodes = ['cpu', 'ram', 'vm']
                var lastObj = this.dsbrd_res_items[this.dsbrd_res_items.length - 1]
                var res = lastObj.resourceProfiles.reduce((r, v)=>{
                    let rpId = v.resourceProfileId;
                    let resourceProfileData = this.lctn_itemsAll.find(v=>v.id == rpId);
                    if(r[rpId] == undefined)
                        r[rpId] = { 
                                rpId    :  rpId, 
                                storage : { active: 0, count: 0 },
                                rpData  : resourceProfileData,
                                rp      : resourceProfileData.resourceProfile.name,
                                dc      : `${resourceProfileData.serviceProvider.name}/${resourceProfileData.datacenter.name}`
                            };

                    if(r[rpId][v.code] == undefined)
                        r[rpId][v.code] = { active: 0, count: 0 }
                    
                    r[rpId][v.code].count += v.count;
                    r[rpId][v.code].active += v.active;
                    if(!nonStorageCodes.some(m=>m == v.code)){
                       r[rpId].storage.count += v.count
                       r[rpId].storage.active += v.active
                    }
                    return r;
                }, {})
                this.rpItems = Object.values(res);
            }
        },

        toGb(val){
            return Math.round(val/1024)
        },

        toTb(val){
            return Math.round(val/1024/1024)
        },

        exportCsv(){
            var toCsv = this.rpItems.map(item=>{ return { 
                'SERVICE PROVIDER'   : item.rpData.serviceProvider.name, 
                'DATACENTER'         : item.rpData.datacenter.name,
                'RESOURCE PROFILE'   : item.rpData.resourceProfile.name,
                'VMS_TOTAL'          : item.vm.count,
                'VMS ACTIVE'         : item.vm.active,
                'CPU TOTAL'          : item.cpu.count,
                'CPU ACTIVE'         : item.cpu.active,
                'RAM TOTAL(MB)'      : item.ram.count,
                'RAM ACTIVE(MB)'     : item.ram.active,
                'STORAGE TOTAL(MB)'  : item.storage.count,
                'STORAGE ACTIVE(MB)' : item.storage.active,
            } });

            this.$export.csv(toCsv, 'resource_profiles.csv')
        },

        tooltipUnitCalc(){
            switch(this.tooltip.header){
                case 'vms':
                    this.tooltip.unit = ''
                    this.tooltip.headerToShow = 'VMs'
                    break;
                case 'cpu':
                    this.tooltip.unit = 'Cores'
                    this.tooltip.headerToShow = 'CPU'
                    break;
                case 'ram':
                    this.tooltip.unit = 'GB'
                    this.tooltip.headerToShow = 'RAM'
                    break;
                case 'storage':
                    this.tooltip.unit = 'GB'
                    this.tooltip.headerToShow = 'STORAGE'
                    break;
                default:
                    this.tooltip.unit = ''
            }
        }
    },

        
    watch:{
        loading(value){
            if(!value){
                this.prepareData();
            }
        },
    },

    computed: {
        ...mapGetters(['lctn_itemsAll', 'lctn_loading', 'dsbrd_res_loading', 'dsbrd_res_items']),

        loading(){
            return this.dsbrd_res_loading || this.lctn_loading
        }


    }
}
</script>
<style lang="stylus" scoped>
.w-table
    height 262px
    &__loading-overlay
        position absolute
        top 0
        bottom 0
        left 0
        right 0
        left 0
        z-index 1
    &__loading-message
        position absolute
        top calc(50% - 12px)
        width 100%
    &__export
        max-width 36px
    &__export-btn
        margin-top -6px
        margin-right -3px
    &__tooltip
        transition all .5s, opacity .5s ease
        z-index 3
        background rgba(0,0,0,0.8)
        position absolute
        width 140px
        &::after
            content " "
            position absolute
            top 100%
            right 0
            width 0
            height 0
            border-top 6px solid rgba(0, 0, 0, 0.8)
            border-left 8px solid transparent
    &__tooltip--hide
        opacity 0
        transition all .5s, transform 0s linear .5s, opacity .5s ease
    &__table
        width 100%
</style>