<template>
    <d-dialog-basic :dialogId="id" maxWidth="900px">
        <v-card class="d-platform-guide pa-6 white-light confirm-dialog">
            <v-layout>
                <v-card-text class="fs-l pa-0 grey700"> 
                    <v-layout>
                        <v-flex>
                            Documentation guides
                        </v-flex>
                        <v-flex class="d-platform-guide__close-btn-wrapper">
                            <v-btn icon tile text width="36" height="36" class="d-platform-guide__close-btn br-4" @click="closeDialog">
                                <i class="grey500-i icon-Close icon-24"></i>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-layout>
            <v-layout class="d-platform-guide__toolbar py-4 mt-2 border-top border-bottom blue050-border d-flex align-center">
                <input 
                type="text"
                placeholder="Search"
                class="d-platform-guide__search-input ml-6 border grey300-border px-2 py-1 br-2 fw-b fs-s grey700"
                >
                <v-spacer />
                <!-- <label class="switch mr-6">
                    <input type="checkbox" v-model="languageModel">
                    <span class="slider round grey900"></span>
                </label> -->
                <div class="d-flex mr-6">
                    <div v-for="lang in languages" class="mx-1" :key="lang.code">
                        <div 
                            class="fs-m pointer px-2 language-switch-border br-4" 
                            :class="glb_language.code == lang.code ? 'blue700 blue600-border fw-b' : 'grey700 grey100-border'" 
                            @click="glb_setLanguage(lang.code)">{{lang.name}}</div>
                    </div>
                </div>
            </v-layout>
            <v-layout class="mt-3">
                <v-flex xs6 class="blue050-border border-right">
                    <v-card-text class="fs-l pa-0 grey700 mt-2 overflow-treeview" v-bar>
                        <div >
                        <v-treeview
                            :items="guide_tree"
                            :active.sync="active"
                            :open.sync="open"
                            activatable
                            class="fs-m pointer mr-2 nonselect"
                            selection-type="leaf"
                            hoverable
                            item-disabled="isDisable"
                            @input="changeSnap(value)"
                        >
                            <template v-slot:prepend="{ item }">
                                <i :class="[item.id === 'sys_guide' ? 'icon-VM1' : 'icon-copy']" class="grey500-i icon-18"></i>
                            </template>
                            <template v-slot:label="{ item }">
                                <span class="grey900" :class="item.sectionPath">{{item.name}}</span>
                                <span class="grey300" v-if="glb_currentSection.pathName == item.sectionPath" > (current section)</span>
                            </template>
                        </v-treeview>
                        </div>
                    </v-card-text>
                </v-flex>
                <v-flex xs6 class="ml-4 relative">
                    <div class="mt-1">
                    <v-card-text class="pa-0 grey700" v-if="!isNullOrUndefined(selectedItem)"> 
                        <div class="blue700 fs-xl">{{selectedItem.name}}</div>
                        <!-- <div class="grey700 fs-m mt-1" @click="startGuide"><i class="mdi mdi-play-circle-outline mr-1"></i><span class="border-dashed">Start Guide</span></div> -->
                        <div class="mt-4" v-html="selectedItem.description"></div>
                        <v-btn class="blue700-b normal-text fs-ml elevation-0 white--text mt-4" small width="120" height="32" @click="startGuide"><i class="mdi mdi-play-circle-outline mr-1"></i>Start Guide</v-btn>
                    </v-card-text>
                    <v-card-actions class="d-platform-guide__close-dlg-btn pa-0 mt-6">
                        <v-btn class="blue700-b normal-text fs-ml elevation-0 white--text" small width="80" height="32" @click="closeDialog">Close</v-btn>
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
import {languages} from '@/lang'

const component = Vue.extend({
    mixins: [ dialogMixin ],

    props: [ 'fromGuide' ],

    data(){
        return{
            languages,
            editMode     : false,
            language     : 'RUS',
            languageModel: false,
            itemsFrmSrv  : [],
            itemsArr     : [],
            active       : [],
            open         : ["sys_guide"],
            selectedItem : null

        }
    },

    watch:{
        value: function(state){
            this.showDialog = value;
        },

        language: function(value){
            if(value == 'ENG')
                this.languageModel = true;
            else
                this.languageModel = false;
        },

        showDialog: function(state){
            if(!state)
                this.$emit('onClose');
        },

        guide_tree: {
            handler: function(value){ 
               var selectedItem = Object.values(this.guide_items).find(f=>f.sectionPath == this.glb_currentSection.pathName && f.id.endsWith('_guide'));
               if(!isNullOrUndefined(selectedItem)){
                   this.open.push(selectedItem.id)
               }else
                selectedItem = value[0];

               this.active = [ selectedItem.id ];
               this.selectedItem = selectedItem;
            },
            immediate : true
        },

        active: function(value){
            if(value.length > 0)
                this.selectedItem = this.guide_items[value[0]];
        }
    },

    computed:{
        ...mapGetters([
            'guide_tree', 
            'guide_items', 
            'glb_currentSection', 
            'glb_language'
            ])
    },


    methods:{
        ...mapActions(['glb_setLanguage']),

        closeDialog(){
            if(!isNullOrUndefined(this.fromGuide) && this.fromGuide)
                document.location.reload(true);
            this.cancelClick();
        },

        startGuide(){
            this.cancelClick();
            this.$guide.show(this.selectedItem.code);
        }
    },

    mounted(){
        var self = this;
        this.showDialog = this.value;
        // qs('.overflow-treeview .vb-content').scroll(0,qs('.'+glb_currentSection.pathName).offsetParent.offsetTop)
    }

})

export function register(){
    Vue.prototype.$windows.registerDialog({ dialogCode: 'platformGuideDialog', component})
}

export default component
</script>
<style lang="stylus">
.d-platform-guide
    border-radius 0 !important
    &__close-btn-wrapper
        max-width 36px
    &__close-btn
        margin-top -6px
        margin-right -6px
    &__toolbar
        margin-left -22px
        margin-right -22px
    &__search-input
        height 24px
        transition all 0.5s
        width 256px
    &__close-dlg-btn
        position absolute
        bottom 0
        right 0
</style>
<style>
.v-dialog--active{border-radius:0 !important;}
.v-treeview-node__root{min-height: 38px !important; height: 38px;}
.overflow-treeview{height:450px !important;}
/* .display-on-hover-row{visibility:hidden;}
.v-treeview-node__root:hover .display-on-hover-row{visibility:visible;} */
/* .v-treeview > .v-treeview-node > .v-treeview-node__root.v-treeview-node--active:hover::before, .v-treeview > .v-treeview-node > .v-treeview-node__root.v-treeview-node--active::before{opacity: 0 !important;}
.v-treeview--hoverable > .v-treeview-node > .v-treeview-node__root:hover::before, .v-treeview > .v-treeview-node > .v-treeview-node--click > .v-treeview-node__root:hover::before{opacity: 0 !important;} */
</style>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
    position: absolute;
    content: "RUS";
    font-weight: bold;
    font-size: 10px;
    padding-left: 3px;
    padding-top: 5px;
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
}

/* input:checked + .slider {
  background-color: #2196F3;
} */

input:checked + .slider::before {
  content: "ENG";
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
.guide-language{position:absolute;z-index:1;}
.guide-language-rus{top:9px;left:5px;}
.guide-language-eng{top:9px;right:5px;}
.language-switch-border{border: 2px solid;}
</style>