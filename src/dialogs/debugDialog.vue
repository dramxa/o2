<template>
    <d-dialog-basic :dialogId="id" width="90%" maxWidth="1200px" height>
        <v-card class="d-debug pa-6 white-light">
            <v-layout>
                <v-flex>
                    <v-card-text class="fs-l pa-0 grey700"> 
                        <v-layout>
                            <v-flex class="pl-6">
                                DEBUG 
                            </v-flex>
                            <v-flex class="d-debug__close-btn-wrapper">
                                <v-btn icon tile text width="36" height="36" class="d-debug__close-btn br-4" @click="cancelClick">
                                    <i class="grey500-i icon-Close icon-24"></i>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                        <v-layout class="pt-4 pl-6 fs-ml">
                            <div @click="activeTab='roles'" :class="{'grey100-b':activeTab=='roles'}" class="px-7 py-3 pointer">Edit roles</div>
                            <div @click="activeTab='json'"  :class="{'grey100-b':activeTab=='json'}"  class="px-7 py-3 pointer">Send JSON</div>
                        </v-layout>
                        <v-layout class="mt-4" v-if="activeTab=='roles'">
                            <v-data-table
                                :headers="headers"
                                :items  ="permissions"
                                item-key="code"
                                show-select
                                disable-pagination
                                hide-default-header
                                hide-default-footer
                                class="edit-perm-dialog-table"
                                style="width:100%;"
                                fixed-header
                                group-by="groupName"
                                show-group-by
                                v-bar
                                > 
                                <template v-slot:header="data">
                                    <thead class="border-bottom blue050-border">
                                    <tr>
                                    <template v-for="header in data.props.headers">
                                    <th :key="header.value" class="table-header-text pa-2 fw-n" :style="{width: header.width}">
                                        <div v-if="header.value != 'data-table-select'">
                                        <div class="pointer d-flex align-center">
                                            <span class="fs-s grey600 nonselect">{{header.text}}</span>
                                        </div>
                                        </div>
                                        <div v-else >
                                            <c-table-checkbox 
                                            logging="true"  
                                            class="ml-2 d-flex align-center justify-space-around mt-0"  
                                            cbid="net-table-header-cb"
                                            @click="selectAll"
                                            />
                                        </div>
                                    </th>
                                    </template>
                                    </tr>
                                    </thead>

                                </template>
                                <template v-slot:group="data">
                                    <tr class="v-row-group__header pointer border-bottom grey100-border" :fake="addGroup(data)" @click="selectGroup(data)">
                                        <td colspan="3">
                                        <v-layout class="white-light">
                                            <c-table-checkbox 
                                                logging="true"  
                                                class="mr-3 d-flex pl-0 pt-2 align-center justify-space-around mt-0"  
                                                cbid="perm-table-header-cb"                                                
                                                :state="groups[data.group].isSelected"
                                                :indeterminate="groups[data.group].indeterminate"
                                                @click="selectGroup(data)"
                                                />
                                            <div class="fs-ml fw-b blue700 nonselect">{{data.group}}</div>
                                        </v-layout>
                                        </td>
                                    </tr>
                                    <tr class="row-with-hidden-menu border-bottom grey100-border pointer" v-for="item in data.items" :key="item.code" @click="selectItem(item, data)">
                                    <template v-for="(header, index) in data.headers">
                                    <td :key="index" v-if="index==0"  >
                                        <div>
                                        <c-table-checkbox class="d-debug__table-checkbox" cbid="perm-table-row" :state="item.isSelected" @click="selectItem(item, data)"/>
                                        </div>
                                    </td>
                                    <td v-else :key="index" >
                                        <!-- name -->
                                        <div v-if="header.value=='name'">
                                        <span class="grey900 fs-m">{{item.name}}</span>
                                        </div>

                                        <!-- description -->
                                        <div v-if="header.value=='description'">
                                        <span class="grey900 fs-m">{{item.description}}</span>
                                        </div>
                                    </td>
                                    </template>
                                    </tr>
                                </template>
                            </v-data-table>
                        </v-layout>
                        <v-layout class="mt-4" v-if="activeTab=='json'">
                            <c-labeled-textArea v-model="debugJson" customRows="15" class="px-7 text-area-80" xs="12" label="PASTE JSON HERE" :editMode="true"/>
                        </v-layout>
                    </v-card-text>
                    <v-card-actions class="d-debug__actions-row pa-0 mt-6" v-if="activeTab=='roles'">
                        <v-spacer/>
                        <v-btn class="white--text blue700-b normal-text fs-ml elevation-0" small width="80" height="32" @click="savePermissions()"> Save</v-btn>
                    </v-card-actions>
                    <v-card-actions class="d-debug__actions-row pa-0 mt-6" v-if="activeTab=='json'">
                        <v-spacer/>
                        <v-btn class="white--text blue700-b normal-text fs-ml elevation-0" small width="80" height="32" @click="sendJson()"> Send</v-btn>
                    </v-card-actions>
                </v-flex>
            </v-layout>
        </v-card>
    </d-dialog-basic>
</template>

<script>
import extBus from '@/modules/_system/_extension/_bus'
import { wsObjectTypes } from '@/consts/websocketConsts'
import { mapGetters, mapActions } from 'vuex';
import Vue from 'vue'
import dialogMixin from '@/dialogs/windows/windowMixin'
import perms from '@/plugins/security/permConst'
import features from '@/plugins/features/allFeatures'


const component = Vue.extend({

    mixins: [ dialogMixin ],

    data(){
        return{
            sortBy     : "name",
            descending : false,
            permissions: [],
            activeTab  : 'roles',
            debugJson  : '',
            groups: {},
            headers: [
                { text: 'NAME'       , value: 'name'       , width: '200px' },
                { text: 'DESCRIPTION', value: 'description', width: 'auto' },
            ]
        }
    },

    computed:{
        ...mapGetters(['glb_permissions']),

    },

    watch:{
        value: function(state){
            this.showDialog = value;
        },

        showDialog: function(state){
            if(!state)
                this.$emit('onClose', this.result);
        }       
    },


    methods:{
        ...mapActions(['glb_setPermissions']),

        addGroup(item){
            if(isNullOrUndefined(this.groups[item.group])){
                Vue.set(item, 'isSelected', false)
                Vue.set(item, 'indeterminate', false)

                this.groups[item.group] = item;
                item.isSelected = item.items.filter(f=>!f.isSelected).length == 0;
                item.indeterminate = item.items.filter(f=>f.isSelected).length > 0 && !item.isSelected;
            }
        },

        savePermissions(){
            let selectedPermissionsCodes = [];
            this.permissions.filter(f=>f.isSelected).forEach(p=>{
                p.features.forEach(ft=>selectedPermissionsCodes.push(ft))
            })
            this.glb_setPermissions({permissions: selectedPermissionsCodes, globalAdministrator: false});
            this.acceptClick(
                    // массив permissionCodes
                    selectedPermissionsCodes
                )         
        },

        isJsonString(str){
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        },

        sendJson(){
            if(this.isJsonString(this.debugJson)){
                let obj = JSON.parse(this.debugJson);
                extBus.$emit('websocket-message-' + wsObjectTypes[obj.objectCode], obj.object);
            }
        },

        selectAll(state){
            Object.values(this.groups).forEach(group=>{
                group.isSelected = state;
                group.indeterminate = false;
                group.items.forEach(item=>{
                    item.isSelected = state;
                })
            })
        },

        selectItem(item, data){
            item.isSelected = !item.isSelected;
            var group = this.groups[data.group]
            group.isSelected = group.items.filter(f=>!f.isSelected).length == 0;
            group.indeterminate = group.items.filter(f=>f.isSelected).length > 0 && !group.isSelected;
        },

        selectGroup(item){
            var selected = !this.groups[item.group].isSelected;
            this.groups[item.group].isSelected = selected;

            item.items.forEach(i => {
                i.isSelected = selected;
            });
        }
        
    },

    mounted(){
        this.showDialog = this.value;

        this.permissions = clone(perms)
        this.permissions.forEach(t=>{ 
            let ftEnabled = true;
            t.features.forEach(ft=>{
                if(!this.glb_permissions.includes(ft))
                    ftEnabled = false;
            })
            Vue.set(t, 'isSelected', ftEnabled ? true : false);
            let desc = '';
            t.features.forEach(ft=>{
                desc += features.find(f=>f.code == ft).description + ' ';
            })
            Vue.set(t, 'description', desc)
        });
        //new SimpleBar(qs(".edit-perm-dialog-table .v-data-table__wrapper"), { autoHide: true }); 
    }

})

export function register(){
    Vue.prototype.$windows.registerDialog({ dialogCode: 'debugDialog', component});
}

export default component
</script>

<style lang="stylus" scoped>
.d-debug
    border-radius: 0 !important
    overflow: hidden
    &__close-btn-wrapper
        max-width: 36px
    &__close-btn
        margin-top: -6px
        margin-right: -6px
    &__table-checkbox
        margin-left: 32px
    &__actions-row
        position: sticky
        bottom: 0
</style>
<style>
.edit-perm-dialog-table .v-data-table__wrapper{max-height:calc(100vh - 64px - 48px - 66px - 16px - 56px);}
.v-dialog:not(.v-dialog--fullscreen){max-height:90% !important;overflow: hidden;}
</style>