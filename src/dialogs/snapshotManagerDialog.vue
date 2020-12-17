<template>
    <d-dialog-basic :dialogId="id" maxWidth="900px">
        <v-card class="d-snapshot-manager pa-6 white-light confirm-dialog gd-dlg-snapMngr">
            <v-layout>
                <v-card-text class="fs-l pa-0 grey700"> 
                    <v-layout>
                        <v-flex>
                            Snapshot manager <span class="blue700 fw-b">{{ vm.name }}</span>
                        </v-flex>
                        <v-flex class="d-snapshot-manager__close-btn-wrapper">
                            <v-btn icon tile text width="36" height="36" class="d-snapshot-manager__close-btn br-4 gd-dlg-close" @click="cancelClick"><i class="grey500-i icon-Close icon-24"></i></v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-layout>
            <v-layout class="mt-3 relative">
                <div v-if="isBusy && !guide_show" class="vm-busy-block d-flex text-center">
                    <div class="d-snapshot-manager__busy-vm-layout justify-space-around grey900 fw-b">
                        VM is busy... <v-progress-linear  class="blue600 login-progressbar mt-2" indeterminate rounded height="4"></v-progress-linear>
                    </div>
                </div>
                <v-flex xs7 class="blue050-border border-right">
                    <v-card-text class="fs-l pa-0 grey700 mt-2 overflow-treeview" v-bar>
                        <div :class="[!showTreeview && !guide_show ? 'd-flex align-strech justify-center' : '']">
                            <div v-if="!showTreeview && !guide_show" class="d-snapshot-manager__loading-layout align-self-center mx-18 text-center">
                                <div class="fs-ml pb-2">Loading...</div>
                                <v-progress-linear  class="blue600 login-progressbar" indeterminate rounded height="4"></v-progress-linear>
                            </div>
                        <v-treeview
                            :items="items"
                            :active.sync="active"
                            :open-all="true"
                            :open="open"
                            v-if="showTreeview || guide_show"
                            activatable
                            class="fs-m pointer mr-2 nonselect snapshot-treeview gd-dlg-snapMngr-treeview"
                            selection-type="leaf"
                            hoverable
                            item-disabled="isDisable"
                            @input="changeSnap(value)"
                        >
                            <template v-slot:prepend="{ item }">
                            <i v-if="item.name != 'You are here'" :class="[item.id === 1 ? 'icon-VM1' : 'icon-copy']" class="grey500-i icon-18"></i>
                            <i v-else class="icon-map-marker-outline blue700-i icon-18"></i>
                            </template>
                            <template v-slot:append="{ item }">
                            <v-btn v-if="item.id !== 1 && item.name != 'You are here' && permission('ft_snapRevert')" icon tile  class="pa-0 icon-14 control-button br-4 gd-dlg-snapMngr-revert display-on-hover-row" @click.stop="revertSnap(item)">
                                <i class="icon-undo-variant grey500-i icon-16"></i>
                            </v-btn>
                            <v-btn v-if="item.id !== 1 && item.name != 'You are here' && permission('ft_snapDelete')"  icon tile  class="pa-0 mr-2 icon-16 control-button gd-dlg-snapMngr-delete br-4 display-on-hover-row" @click.stop="deleteSnap(item)">
                                <i class="icon-trash grey500-i"></i>
                            </v-btn>
                            <div class="d-inline-flex" v-if="item.name != 'You are here' && showTreeview && permission('ft_prcRead') && !isNullOrUndefined(item.prep) && !isNullOrUndefined(item.prep.priceFormatted)">
                                <v-tooltip bottom  content-class="custom-tooltip fs-s">
                                    <template v-slot:activator="{ on }" class="pointer">
                                        <span v-on="on">
                                            <span v-if="glb_pricePeriod=='HOUR'" >{{item.prep.priceFormatted.perHour}}</span>
                                            <span v-if="glb_pricePeriod=='DAY'"  >{{item.prep.priceFormatted.perDay}}</span>
                                            <span v-if="glb_pricePeriod=='MONTH'">{{item.prep.priceFormatted.perMonth}}</span>
                                        </span>
                                    </template>
                                    <span class="custom-tooltip-accent fw-m">PRICE PER {{glb_pricePeriod}}</span>
                                </v-tooltip>
                            </div>
                            </template>
                            <template v-slot:label="{ item }">
                                <span :class="[item.name == 'You are here' ? 'blue700 fw-b' : 'grey900']">{{item.name}}</span>
                            </template>
                        </v-treeview>
                        </div>
                    </v-card-text>
                    <v-card-actions class="pa-0 mt-2">
                        <v-btn text class="px-2 fs-m grey900 normal-text gd-dlg-snapMngr-deleteAll" @click="deleteAll()" v-if="permission('ft_snapDelete')">Delete all</v-btn>
                        <v-btn text class="px-2 fs-m grey900 normal-text gd-dlg-snapMngr-takeSnap" @click="takeSnapshot()" v-if="permission('ft_snapCreate')">Take snapshot</v-btn>
                    </v-card-actions>
                </v-flex>
                <v-flex xs5 class="ml-4 relative" :class="[isNullOrUndefined(selected) ? 'd-flex align-center justify-center' : '']">
                    <div v-if="isNullOrUndefined(selected)" class="fs-l text-center">
                        <div class="grey300">snapshot not selected</div>
                    </div>
                    <div v-if="!isNullOrUndefined(selected)">
                    <v-card-text class="fs-l pa-0 grey700"> 
                        <v-layout class="mt-4">
                            <c-labeled-field class="px-0 gd-dlg-snapMngr-name" :xs="editMode ? 11 : 7" label="NAME" v-model="nameOfSelectedVM" :editMode="editMode"/>
                            <v-flex xs="4" class="py-0 px-2 gd-dlg-snapMngr-price" v-if="!editMode && !isNullOrUndefined(selected.prep.priceFormatted)">
                                <v-card flat tile class="d-snapshot-manager__price">
                                    <span class="grey700 fs-s prop-title nonselect">PRICE PER {{glb_pricePeriod}}</span>
                                    <v-tooltip bottom  content-class="custom-tooltip fs-s">
                                        <template v-slot:activator="{ on }" class="pointer">
                                            <h2 class="text-right pointer" v-on="on">
                                                <span v-if="glb_pricePeriod=='HOUR'"  class="border-dashed">{{selected.prep.priceFormatted.perHour}}</span>
                                                <span v-if="glb_pricePeriod=='DAY'"   class="border-dashed">{{selected.prep.priceFormatted.perDay}}</span>
                                                <span v-if="glb_pricePeriod=='MONTH'" class="border-dashed">{{selected.prep.priceFormatted.perMonth}}</span>
                                            </h2>
                                        </template>
                                        <div class="d-snapshot-manager__price-tooltip-wrapper">
                                            <div class="text-center fw-m custom-tooltip-accent mb-1">PRICE CONTAIN</div>
                                            <div v-if="glb_pricePeriod=='HOUR'"  class="d-flex justify-space-between fw-m"><span class="custom-tooltip-color">DISKS:</span><span class="monospace custom-tooltip-accent">{{selected.prep.diskPriceFormatted.perHour}}</span></div>
                                            <div v-if="glb_pricePeriod=='DAY'"   class="d-flex justify-space-between fw-m"><span class="custom-tooltip-color">DISKS:</span><span class="monospace custom-tooltip-accent">{{selected.prep.diskPriceFormatted.perDay}}</span></div>
                                            <div v-if="glb_pricePeriod=='MONTH'" class="d-flex justify-space-between fw-m"><span class="custom-tooltip-color">DISKS:</span><span class="monospace custom-tooltip-accent">{{selected.prep.diskPriceFormatted.perMonth}}</span></div>
                                            <div v-if="glb_pricePeriod=='HOUR'"  class="d-flex justify-space-between fw-m"><span class="custom-tooltip-color">RAM:</span><span class="monospace custom-tooltip-accent">{{selected.prep.ramPriceFormatted.perHour}}</span></div>
                                            <div v-if="glb_pricePeriod=='DAY'"   class="d-flex justify-space-between fw-m"><span class="custom-tooltip-color">RAM:</span><span class="monospace custom-tooltip-accent">{{selected.prep.ramPriceFormatted.perDay}}</span></div>
                                            <div v-if="glb_pricePeriod=='MONTH'" class="d-flex justify-space-between fw-m"><span class="custom-tooltip-color">RAM:</span><span class="monospace custom-tooltip-accent">{{selected.prep.ramPriceFormatted.perMonth}}</span></div>
                                        </div>
                                    </v-tooltip>
                                </v-card>
                            </v-flex>
                        </v-layout>                        
                        <v-layout class="mt-4">
                            <c-labeled-textArea class="px-0 gd-dlg-snapMngr-description" xs="11" label="DESCRIPTION" v-model="selected.description" :editMode="editMode"/>
                        </v-layout>
                        <v-layout class="mt-4" v-show="!editMode">
                            <c-labeled-slot label="MEMORY" xs="12" class="gd-dlg-snapMngr-memory">
                                <c-labeled-checkbox class="pl-0 mt-1 label-bigger-font-size" :isDisable="true" cbid="snap-memory" label="Snapshot memory" v-model="selected.isWithMemory" />
                            </c-labeled-slot>
                        </v-layout>
                        <v-layout class="mt-4" v-show="!editMode">
                            <c-labeled-slot label="QUIESCE" xs="12" class="gd-dlg-snapMngr-quiesce">
                                <c-labeled-checkbox class="pl-0 mt-1 label-bigger-font-size" :isDisable="true" cbid="snap-quiesce" label="Quiesce file system (VMware Tools required)" v-model="selected.isQuiesceGuestFS"/>
                            </c-labeled-slot>
                        </v-layout>
                    </v-card-text>
                    <v-card-actions class="d-snapshot-manager__footer pa-0 mt-6">
                        <v-btn v-if="editMode" class="blue700-b normal-text fs-ml elevation-0 white-light" small width="80" height="32" @click="editMode=false"> Cancel</v-btn>
                        <v-btn v-if="editMode" class="blue700-b normal-text fs-ml elevation-0 ml-2 white--text" small width="80" height="32" @click="saveChanges(selected)"> Save</v-btn>
                        <v-btn v-if="!editMode && permission('ft_snapEdit')"  class="blue700-b normal-text fs-ml elevation-0 white--text" small width="80" height="32" @click="editMode=true" >Edit</v-btn>
                    </v-card-actions>
                    </div>
                </v-flex>
            </v-layout>
        </v-card>
    </d-dialog-basic>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Vue from 'vue'
import dialogMixin from '@/dialogs/windows/windowMixin'


const component = Vue.extend({
    mixins: [ dialogMixin ],
    props: ['vm'],

    data(){
        return{
            editMode     : false,
            itemsFrmSrv  : [],
            itemsArr     : [],
            active       : [],
            items        : [],
            showTreeview : false,
            open         : [],
            currentVm    : null,
            
            selected     : null
        }
    },

    watch:{
        value: function(state){
            this.showDialog = value;
        },

        showDialog: function(state){
            if(!state)
                this.$emit('onClose', this.result);
        },

        active: {
            handler: function(active){
                this.editMode = false;

                if (!active.length) 
                    this.selected = null;

                let id = active[0];
                if(id == 1) // если корневой
                    return;
                let snap = clone(this.itemsArr.find(item => item.id === id));
                if(isNullOrUndefined(snap.prep))
                    Vue.set(snap, 'prep', {})
                this.nameOfSelectedVM = snap == null ? ''  : snap.name;

                let currentPrcLst = this.prc_itemsAll.find(f=>f.id == this.currentVm.prep.prcLstId);

                if(!isNullOrUndefined(currentPrcLst)){
                    let snapDiskPrice = 0;
                    let snapRamPrice = 0;
                    snap.disks.forEach(disk=>{
                        snapDiskPrice += currentPrcLst.prep.prices[disk.policyCode] * (disk.size / 1024);
                    });
                    if(snap.isWithMemory){
                        snapRamPrice += currentPrcLst.prep.prices[snap.policyCodeRam] * (snap.sizeRam / 1024);
                    }

                    Vue.set(snap.prep, 'diskPrice', {
                        'perHour' : snapDiskPrice,
                        'perDay'  : snapDiskPrice * 24,
                        'perMonth': snapDiskPrice * 24 * getDaysInMonth()
                    });
                    Vue.set(snap.prep, 'diskPriceFormatted', {
                        'perHour' : localePrice(snapDiskPrice, currentPrcLst.currencyCode),
                        'perDay'  : localePrice(snapDiskPrice * 24, currentPrcLst.currencyCode),
                        'perMonth': localePrice(snapDiskPrice * 24 * getDaysInMonth(), currentPrcLst.currencyCode)
                    });
                    Vue.set(snap.prep, 'ramPrice' , {
                        'perHour' : snapRamPrice,
                        'perDay'  : snapRamPrice * 24,
                        'perMonth': snapRamPrice * 24 * getDaysInMonth()
                    });
                    Vue.set(snap.prep, 'ramPriceFormatted' , {
                        'perHour' : localePrice(snapRamPrice, currentPrcLst.currencyCode),
                        'perDay'  : localePrice(snapRamPrice * 24, currentPrcLst.currencyCode),
                        'perMonth': localePrice(snapRamPrice * 24 * getDaysInMonth(), currentPrcLst.currencyCode)
                    });
                }
                this.selected = snap;
            },
            deep: true
        },

        vm_itemsAll: {
            handler: function(vms){
                if(!this.guide_show){
                    this.currentVm = vms.find(f=>f.id == this.vm.id);
                    if(isNullOrUndefined(this.currentVm) || isNullOrUndefined(this.currentVm.prep.snapshots))
                        return;

                    let rootSnapshots = this.currentVm.prep.snapshots.filter(f=>f.parentId == null);                
                    this.items = [{ 
                        id: 1, 
                        name: this.vm.name, 
                        children: rootSnapshots, 
                        prep: isNullOrUndefined(this.vm.prep.prcLstId) ? { } :
                        {
                            "price":{"perHour":this.vm.prep.priceOnlyVmTotal.perHour,"perDay":this.vm.prep.priceOnlyVmTotal.perDay,"perMonth":this.vm.prep.priceOnlyVmTotal.perMonth},
                            "priceFormatted":{"perHour":this.vm.prep.priceOnlyVmTotalFormatted.perHour,"perDay":this.vm.prep.priceOnlyVmTotalFormatted.perDay,"perMonth":this.vm.prep.priceOnlyVmTotalFormatted.perMonth}
                        }
                    }];
                    this.itemsArr = this.currentVm.prep.snapshots;
                    this.open = [...this.itemsArr.map(m=>m.id), 1]
                    this.showTreeview = true;
                }
            },
            immediate : true,
            deep      : true
        }

    },

    computed:{
        ...mapGetters(['prc_itemsAll', 'vm_itemsAll', 'glb_pricePeriod', 'guide_show']),

        isBusy(){
            if(isNullOrUndefined(this.currentVm))
                return true;
            return this.currentVm.statusCode == 'busy';
        }
    },


    methods:{
        ...mapActions(['vm_getSnapshots', 'vm_editSnapshot', 'vm_deleteSnapshot', 'vm_deleteAllSnapshots', 'vm_revertSnapshot', 'vm_createSnapshot']),

        saveChanges(item){
            let edItem = clone(item);
            edItem.name = this.nameOfSelectedVM;
            this.vm_editSnapshot({ vmId: this.vm.id, snap: edItem});
            this.editMode = false;
        },

        changeSnap(value){
            // console.log(value)
        },

        deleteAll: async function(){
            let self = this;
            Vue.prototype.$windows.showDialog({

                dialogCode: 'confirmDialog', // тип выводимого окна (вьюха)
        
                props: {
                    textConst    : 'deleteAllSnapshots',       // константа текста
                    objArray     :  [this.vm.name]  
                },

                onAccept: async function(){
                    await self.vm_deleteAllSnapshots({ vmId: self.vm.id});
                    self.loadSnapList();
                }

            }) 
        },

        deleteSnap: async function(item){
            let self = this;
            Vue.prototype.$windows.showDialog({

                dialogCode: 'confirmDialog', // тип выводимого окна (вьюха)
        
                props: {
                    textConst    : 'deleteSnapshot',       // константа текста
                    objArray     :  [item.name]  
                },

                onAccept: async function(){
                    await self.vm_deleteSnapshot({ vmId: self.vm.id, snap: item});
                    self.loadSnapList();
                }

            }) 
        },

       revertSnap: async function(item){
            let self = this;
            Vue.prototype.$windows.showDialog({

                dialogCode: 'confirmDialog', // тип выводимого окна (вьюха)
        
                props: {
                    textConst    : 'revertSnapshot',       // константа текста
                    objArray     :  [item.name]  
                },

                onAccept: async function(){
                    await self.vm_revertSnapshot({ vmId: self.vm.id, snap: item});
                    self.loadSnapList();
                }

            }) 
        },

        takeSnapshot(){
            var self = this;
            Vue.prototype.$windows.showDialog({
                dialogCode: 'createSnapshotDialog',
                
                props: {
                    vm: self.vm
                },
        
                onAccept: function(res){
                    self.vm_createSnapshot(res);
                }
            });
        },
        // loadSnapList: async function(){
        //    // var res = await this.vm_getSnapshots(this.vm.id);             
        //     this.items = [{ id: 1, name: this.vm.name, children: res.rootChildrens}];
        //     this.itemsArr = res.items;
        //     this.showTreeview = true;                      
        // }
    },

    mounted(){
        this.showDialog = this.value;
     //   this.loadSnapList();
        if(this.guide_show){
            let rootSnapshots = this.vm.prep.snapshots.filter(f=>f.parentId == null);                
            this.items = [{ 
                id: 1, 
                name: this.vm.name, 
                children: rootSnapshots, 
                prep: isNullOrUndefined(this.vm.prep.prcLstId) ? { } :
                {
                    "price":{"perHour":this.vm.prep.priceOnlyVmTotal.perHour,"perDay":this.vm.prep.priceOnlyVmTotal.perDay,"perMonth":this.vm.prep.priceOnlyVmTotal.perMonth},
                    "priceFormatted":{"perHour":this.vm.prep.priceOnlyVmTotalFormatted.perHour,"perDay":this.vm.prep.priceOnlyVmTotalFormatted.perDay,"perMonth":this.vm.prep.priceOnlyVmTotalFormatted.perMonth}
                }
            }];
            this.itemsArr = this.vm.prep.snapshots;
            this.open = [...this.itemsArr.map(m=>m.id), 1]
            this.showTreeview = true;
            this.currentVm = this.vm
        }
    }

})

export function register(){
    Vue.prototype.$windows.registerDialog({ dialogCode: 'snapshotManagerDialog', component})
}

export default component
</script>
<style lang="stylus">
.d-snapshot-manager
    border-radius:0 !important
    &__close-btn-wrapper
        max-width 36px
    &__close-btn
        margin-top -6px
        margin-right -6px
    &__busy-vm-layout
        width 50%
        margin auto
        margin-top 23%
    &__loading-layout
        width 100%
    &__price
        line-height 1.1
    &__price-tooltip-wrapper
        width 130px
    &__footer
        position absolute
        bottom 0
        right 0
</style>

<style>
.v-dialog--active{border-radius:0 !important;}
.v-treeview-node__root{min-height: 38px !important; height: 38px;}
.overflow-treeview{height:450px !important;}
.display-on-hover-row{visibility:hidden;}
.v-treeview-node__root:hover .display-on-hover-row{visibility:visible;}
.snapshot-treeview.v-treeview > .v-treeview-node > .v-treeview-node__root.v-treeview-node--active:hover::before, .snapshot-treeview.v-treeview > .v-treeview-node > .v-treeview-node__root.v-treeview-node--active::before{opacity: 0 !important;}
.snapshot-treeview.v-treeview--hoverable > .v-treeview-node > .v-treeview-node__root:hover::before, .snapshot-treeview.v-treeview > .v-treeview-node > .v-treeview-node--click > .v-treeview-node__root:hover::before{opacity: 0 !important;}
</style>
<style scoped>
.vm-busy-block{
    position: absolute;
    background: rgba(255, 255, 255, 0.6);
    top: 0;
    bottom: -24px;
    left: -24px;
    right: -24px;
    z-index:3;
}
</style>