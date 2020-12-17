<template>
<div class="relative">
    <div class="dashboard-top-shadow"></div>
    <div class="dashboard relative" v-bar>
        <div>
            <div class="pa-10 pt-5 border-box">
            <div style="" class="d-flex align-center fs-m grey700 justify-end mb-4" ><span>Time to reload: <span class="monospace">{{timeFormatted}}</span></span><v-btn text class="px-0 ml-2 grey700" style="min-width:24px;height:24px;font-size:20px;" @click="reload()"><i class="mdi mdi-refresh"></i></v-btn></div>
            <!-- <w-notification class="mb-5 mt-4" date="26.06.2020" time="18:00" period="2" /> -->
            <v-layout>
                <v-flex style="max-width:280px;" class="mr-5">
                    <w-price :items="totalPrice" class="items-shadow mb-5" v-if="permission('ft_prcRead')" />
                    <div v-if="permission('ft_vmRead')">
                    <w-resource 
                        v-for="(resource, index) in sortedResourcesCodes" 
                        :key="index" 
                        :code="resource" 
                        class="mb-5 items-shadow" 
                        />
                    </div>
                </v-flex>
                <v-flex>
                    <w-cost :items="costsItems" class="items-shadow mb-5" v-if="permission('ft_prcRead')" />
                    <div class="d-flex mb-5" v-if="permission('ft_vmRead')">
                        <w-vms :item="vms" class="mr-5 flex-grow-0 items-shadow" />
                        <w-project class="flex-grow-1 items-shadow" />
                    </div>
                    <w-table class="items-shadow" :tableHeaders="rpHeaders" v-if="permission('ft_vmRead')" />
                    <div class="d-flex mt-5" v-if="$vuetify.breakpoint.mdAndDown">
                        <w-tasks class="flex-grow-1 mr-5" :tasks="tasks" />
                        <w-tasks class="flex-grow-1" :tasks="tasks2" type="error" />
                    </div>
                    <!-- <w-table class="mt-5" :tableItems="errorsForTable" :tableHeaders="errorsHeaders" type="error" title="LAST 10 ERRORS" /> -->
                </v-flex>
                <v-flex style="max-width:280px;" class="ml-5" v-if="permission('ft_tskShowSection') && !$vuetify.breakpoint.mdAndDown">
                    <w-tasks style="width:280px;"/>
                    <w-tasks style="width:280px;" class="mt-5" type="error" />
                </v-flex>
            </v-layout>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    data(){
        return{
            /* FOR TABLE */
            time: 300,
            resourceCodes: ['vm', 'cpu', 'ram'],

            sortingResources: ['vm', 'templates', 'cpu', 'ram', 'ssd', 'sas', 'sata'],

            errorsForTable: [
                {
                    id:"1",
                    date: "10.03.2020 10:46",
                    object: {
                        type: "Virtual Machine",
                        name: "M-12"
                    },
                    description: "Vitrual machine cannot be started"
                },
            ],
            errorsHeaders: [
                {text: "DATE"        , value: "date"        , width: "auto"},
                {text: "OBJECT"      , value: "object"      , width: "auto"},
                {text: "DESCRIPTION" , value: "description" , width: "auto"},
            ],
            rpHeaders: [
                {text: "NAME"         , value:"name"    , width: "auto"},
                {text: "VMs"          , value:"vms"     , width: "auto"},
                {text: "CPU"          , value:"cpu"     , width: "auto"},
                {text: "RAM (GB)"     , value:"ram"     , width: "auto"},
                {text: "STORAGE (GB)" , value:"storage" , width: "auto"},
            ] 

        }
    },

    watch:{
        time: function(val){
            if(val <= 0){
                this.reload()
                this.timeoutCheck(this)
            }
        },

        dsbrd_res_items: {
            handler: function(resources){
                if(resources.length > 0){
                    resources[resources.length - 1].resourceProfiles.forEach(rp=>{
                        if(!this.resourceCodes.includes(rp.code))
                            this.resourceCodes.push(rp.code)
                    })

                }
            },
            deep: true
        },
    },

    


    computed: {
        ...mapGetters([
            'glb_current_theme', 
            'dsbrd_amount_items', 
            'dsbrd_costs_items', 
            'dsbrd_prj_items', 
            'dsbrd_res_items', 
            'dsbrd_vms_item'
            ]),

        timeFormatted(){
            let minutes = Math.floor(this.time/60)
            let second = this.time % 60
            second = (second >= 10) ? second : '0' + second;
            return `${minutes}:${second}`;
        },

        vms(){
            return !isNullOrUndefined(this.dsbrd_vms_item) ? this.dsbrd_vms_item : {};
        },

        totalPrice(){
            return !isNullOrUndefined(this.dsbrd_amount_items) ? this.dsbrd_amount_items : [];
        },

        costsItems(){
            return !isNullOrUndefined(this.dsbrd_costs_items) ? this.dsbrd_costs_items : [];
        },

        sortedResourcesCodes(){
            return clone(this.resourceCodes).sort((a, b)=>{
                let indexA = this.sortingResources.indexOf(a), 
                    indexB = this.sortingResources.indexOf(b)
                
                if (indexA == -1) return  1
                if (indexB == -1) return -1
                
                if (indexA < indexB) return -1 // по возрастанию
                if (indexA > indexB) return  1
                return 0
            });   
        }
    },

    methods: {
        ...mapActions([ 
        'dsbrd_amount_getItems', 
        'dsbrd_costs_getItems', 
        'dsbrd_prj_getItems', 
        'dsbrd_res_getItems', 
        'dsbrd_vms_getItems',
        'dsbrd_vjobs_getItems',
        'dsbrd_vjobs_errors_getItems',
        'lctn_getItems' 
        ]),

        reloadFnc(){
            if(this.permission('ft_prcRead')){
                this.dsbrd_amount_getItems();
                this.dsbrd_costs_getItems();
            }

            if(this.permission('ft_vmRead')){
                this.dsbrd_prj_getItems();
                this.dsbrd_res_getItems();
                this.dsbrd_vms_getItems();
            }

            if(this.permission('ft_tskShowSection')){ // ставлю не ft_tskRead потому что он жестко залочен в security.js потому что много где якоря в интерфейсена этот код
                this.dsbrd_vjobs_getItems();
                this.dsbrd_vjobs_errors_getItems(); 
            }

            this.lctn_getItems();           
        },

        reload(){
            this.reloadFnc();
            this.time = 300;
        },

        async timeoutCheck() {
            while(this.time>0){
                await timeout(1000);
                this.time--;
            }
        },
    },

    mounted(){
        this.timeoutCheck(this);
        this.reloadFnc();        
    }
}
</script>

<style scoped>
.dashboard{height:calc(100vh - 60px);background: #ECF0FB;box-shadow: inset 1px 1px 10px #cdd2e0;cursor: default;}
.dashboard-top-shadow{
    z-index: 1;
    position: absolute;
    box-shadow: 0px 0px 17px 4px #cdd2e0;
    height: 1px;
    background: #fff;
    top: 0;
    left: 0;
    right: 0;
}
</style>