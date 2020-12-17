<!--noindex-->Модуль основного меню<!--/noindex-->
<template>
    <!-- <v-navigation-drawer app :expand-on-hover="$vuetify.breakpoint.smAndDown" permanent mini-variant-width="64" width="200" > -->
    <nav 
        :class="{'grey100-b permission-pa' : glb_permissionPA}"
        class="v-navigation-drawer v-navigation-drawer--fixed v-navigation-drawer--open theme--light border-right blue050-border gd-menu" 
        style="height: 100vh;top: 0px;max-height: calc(100% - 0px);transform: translateX(0%);" 
        :style="{width: menuWidth + 'px'}" 
        data-booted="true"
        @mouseenter="expandingMenu()"
        @mouseleave="mouseLeave()"
        v-bar
     >  <!-- @mouseenter="expandingMenu()" -->
        <div class="v-navigation-drawer__content">
            <span>
                <v-list-item class="pt-4 pl-4" :class="{'grey100-b' : glb_permissionPA}">
                    <v-list-item-icon v-if="$vuetify.breakpoint.smAndDown"  @click="openMenu" class="align-self-center justify-center pointer" >
                        <i class="grey500-i icon-Menu1 icon-20"></i>
                    </v-list-item-icon>
                    <v-list-item-title :class="{'drawer-item-title':$vuetify.breakpoint.smAndDown}">
                        <v-layout  class="align-center fw-m" style="padding-top: 10px;">
                            <!-- <img src="@/assets/logo.svg" alt="LogoO2" height="38" width="125" class="mr-1"> -->
                            <div class="mr-1 menu-logo"></div>
                        </v-layout>
                    </v-list-item-title>
                </v-list-item>
            </span>
            <v-list dense class="pt-5" :class="{'grey100-b' : glb_permissionPA}">
                <span v-if="glb_impersonated">
                    <v-list-item disabled class="menu-item"  style="background-color:#FFD800 !important;opacity: 1;">
                        <v-list-item-title class="drawer-item-title fs-m text-center grey900 fw-b" style="margin-left: -10px;margin-right: -10px;" >
                            {{$vuetify.breakpoint.smAndDown ? orgName : orgName}}
                        </v-list-item-title>
                    </v-list-item>
                    <div class="mt-4"></div>
                </span>
                <v-list-item-group mandatory  v-model="selectedMenu" active-class="primary--text">
                    <span v-for="(item, index) in menuItems" :key="index" >
                        <div v-if="item.marginBefore" class="mt-4"></div>
                        <v-list-item :class="['menu-item', `gd-menu-item-${item.code}`]" active-class="blue700 blue050-b active-menu-item blue600-border iconmoon-active" @click.native.stop="menuItemClick(item, false)" @click.middle="menuItemClick(item, true)">
                            <v-list-item-icon class="align-self-center justify-center" style="margin-bottom: 6px;">
                                <i :class="item.icon" class="icon-20 iconmoon grey500-i"></i>
                            </v-list-item-icon>
                            <v-list-item-title class="menu-item-title drawer-item-title fs-m ml-n4">
                                {{item.name}}
                            </v-list-item-title>
                        </v-list-item>
                    </span>
                </v-list-item-group>
            </v-list>
        </div>
    </nav>
    <!-- </v-navigation-drawer> -->
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { sections } from '@/consts/menuConsts'
import Vue from 'vue'

export default {
    data() {
        return {
            isClickOpen : false,
            menuExpand  : false,
            timeoutObj  : null,

            orgName     : '',

            selectedMenu : null
        }
    },

    computed:{
        ...mapGetters(['glb_currentSection', 'glb_permissions', 'glb_permissionPA', 'glb_impersonatedOrgId', 'org_itemsAll', 'glb_impersonated']),

        menuWidth(){
            if(this.$vuetify.breakpoint.smAndDown && !this.menuExpand){
                this.glb_setMenuExpanded(false);
                return 60
            }else{
                this.glb_setMenuExpanded(true);
                return 200
            }
        },

        menuItems(){
            return sections.filter(f=>{ return !f.hidden && this.permission(f.featureCode) && !(this.glb_impersonated && f.code == 'org')})
        },
    }, 

    watch:{
        org_itemsAll: function(values){
            if(this.glb_impersonated){
               this.orgName = values.find(w=>w.id == this.glb_impersonatedOrgId).name;
            }
        },

        glb_currentSection: {
            handler: function(value){
                var res = 0;
                if(this.glb_currentSection != null)
                    res = this.menuItems.indexOf(this.glb_currentSection)

                this.selectedMenu = res >= 0 ? res : 0
            },
            immediate: true
        }
    },  

    mounted() {
        if(this.glb_impersonated)
            this.org_getItems();
    },

    methods:{
        ...mapActions(['org_getItems', 'glb_setMenuExpanded']),

        menuItemClick(item, newWindow){
            var self = this;
            if(this.glb_currentSection.pathName == item.pathName && !newWindow) 
                return;
                          
            this.$nav.navigateTo(item.pathName, {}, newWindow);            
        },

        timeout(ms){
            return new Promise(resolve =>{ 
                this.timeoutObj = setTimeout(resolve, ms);
                return this.timeoutObj;
            });
        },

        expandingMenu(){
            if(!this.menuExpand)
                this.timeout(1500).then(() =>this.menuExpand = true);
        },

        clearTimeoutObj(){
            clearTimeout(this.timeoutObj);
        },

        openMenu(){
            this.clearTimeoutObj();
            this.menuExpand = !this.menuExpand;
        },

        mouseLeave(){
            this.clearTimeoutObj();
            this.menuExpand = false;
        }
    //    ...mapActions(["glb_setPageName"])
    }
}
</script>

<style scoped>
    .drawer-item-title{
        margin-left: -16px;
    }
    .v-navigation-drawer{position: absolute !important;}
    .v-navigation-drawer .v-list{ background: transparent; }
    /* .v-navigation-drawer:hover{transition: all 0.2s ease-in 1.5s !important;} */
    .permission-pa.v-navigation-drawer .v-list-item.menu-item{background-color: transparent !important;}
</style>