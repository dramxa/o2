<template>
    <v-app :class="[glb_current_theme == 'dark' ? 'dark-theme' : 'white-theme', showGuide ? 'guid-app' : '']">
        <div v-if="showGuide">
            <div class="guid-overlay-scrim"></div>
            <guideWiteHole></guideWiteHole>
            <div class="guide-treeview-block" v-bar :class="[open.includes(navigationTree[0].id) ? 'full-height guide-treeview-block-extend pb-12' : 'guide-treeview-block-close' ]">
                <v-treeview
                    :items="navigationTree"
                    :active.sync="active"
                    :open.sync="open"
                    activatable
                    class="fs-m pointer nonselect"
                    selection-type="leaf"
                    style="z-index:99999;"
                    hoverable
                >
                    <template v-slot:prepend="{ item }" >
                        <i @click="openClose(item.id)" style="position: relative;bottom: 2px;" v-if="!isNullOrUndefined(item.children)" class="mdi mdi-menu-down icon-24 mr-1" :class="[isOpen(item.id) ? '' : 'closed-icon', isNullOrUndefined(item.parentId) ? 'grey100-i' : item.id == active[0] ? 'yel600-i' : 'green500-i']"></i>
                        <!-- <i v-if="isNullOrUndefined(item.children)"  class="mdi mdi-checkbox-blank-circle-outline icon-10" :class="[isNullOrUndefined(item.parentId) ? 'grey100-i' : item.id == active[0] ? 'yel600-i' : 'green500-i']"></i> -->
                    </template>
                    <template  v-slot:label="{ item }">
                        <v-tooltip
                        left
                        open-delay=500
                        v-if="item.id != navigationTree[0].id" 
                        content-class="guide-custom-tooltip grey900"
                        >
                            <template v-slot:activator="{ on }">
                                <div 
                                v-on="on" 
                                :class="[ guide_currentStepIndex < item.stepFrom-1 ? 'grey300' :  guide_currentStepIndex > item.stepTo -1 ? 'green500' : 'yel600', item.id == navigationTree[0].id ? 'fs-ml' : '']" 
                                class="fw-b d-flex align-center"
                                @click="gotoGuide(item)"
                                style="height:38px;"
                                >{{item.name}}</div>
                            </template>
                            <div style="width:350px;">
                                <div class="fs-ml fw-b" style="line-height: 34px !important;">{{item.name}}</div>
                                <hr style="height: 1px;border: none;background-color: #80808047;">
                                <div class="fs-m my-2" v-html="item.description"></div>
                            </div>
                        </v-tooltip>

                        <div v-if="item.id ==  navigationTree[0].id" class="fw-b fs-ml grey100" @click="openClose(navigationTree[0].id)">{{item.name}}</div>

                    </template>
                    <template v-slot:append="{ item }">
                        <div v-if="!isNullOrUndefined(item.id)" style="height:38px;" class="d-flex align-center" @click="gotoGuide(item)">
                            <span  v-if="item.id != navigationTree[0].id" class="grey300 mr-2 monospace">{{`${item.stepFrom}-${item.stepTo}`}}</span>
                        </div>
                    </template>
                </v-treeview>
            </div>
            <transition name="fade">
                <div v-if="showPreview && stepTextShow" class="giude-text-block-bottom text-center guidePreviewClass">
                    <div class="grey300 mb-2 guideSection fs-xxl text-center">{{ guide_currentStep.sectionName}}</div>
                    <span v-if="stepTextShow" v-html="guide_currentStep.textHtml" class="grey100"></span>
                </div>
            </transition>
            <transition name="fade">
                <div v-if="!showPreview" class="giude-text-block-bottom text-center guideDefaultClass" >
                    <div class="grey300 mb-2 guideSection fs-ml text-left">{{ guide_currentStep.sectionName}}</div>
                    <transition name="fade">
                        <span v-if="stepTextShow" v-html="guide_currentStep.textHtml" class="grey100"></span>
                    </transition>
                </div>
            </transition>
            <div class='guideControls'>
                <v-btn large class="px-8 grey100-border mx-3" :class="[guide_currentStepIndex!=0 ? '' : 'giude-text-block-bottom-disabled']" @click="prevStep" outlined :disabled="guide_currentStepIndex==0"><span class="grey100 normal-text">Back</span></v-btn>
                <div class="grey100 px-3 fs-ml justify-space-around d-inline-flex monospace" style="width:115px;">{{guide_currentStepIndex+1}} / {{guide_steps.length}}</div>
                <v-btn large class="px-8 grey100-border mx-3" :class="[guide_currentStepIndex+1 != guide_steps.length ? '' : 'giude-text-block-bottom-disabled']" @click="nextStep" outlined :disabled="guide_currentStepIndex+1 == guide_steps.length"><span class="grey100 normal-text">Next</span></v-btn>
                <!-- <v-btn class="px-2 grey100-border mx-3" @click="nextGuide" outlined v-if="guide_currentStepIndex+1 == guide_steps.length"><span class="grey100 normal-text">Next guide</span></v-btn> -->
                <v-btn class="red500-border mx-3" style="position:fixed;bottom:10px;left:5px;padding:0 42px;background:rgba(0,0,0,0.3);" @click="exit" outlined><span class="red500 normal-text fw-b">Exit</span></v-btn>
                <v-btn class="blue500-border mx-3 grey700" style="position:fixed;bottom:10px;left:130px;padding:0 7px;background:rgba(0,0,0,0.3);min-width:20px;" @click="openGuideMenu()" outlined><i class="mdi mdi-menu blue500 icon-20"></i></v-btn>
            </div>
        </div>
    </v-app>    
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import guideWiteHole from './guide-whiteHole'

export default {
    components:{
        guideWiteHole
    },

    data(){
        return {
            active         : [3],
            open           : [],
            navigationTree : [],
            stepTextShow   : true,
        }
    },

    watch:{
        guide_currentStepIndex:function(index){
            if(isNullOrUndefined(index))
                return;          

            this.fillNavigationTree();
        },
        guide_currentStep:function(){
            this.stepTextShow = false;
            setTimeout(()=>{this.stepTextShow = true}, 100);
        }
    },

    computed:{
        ...mapGetters([
            'guide_items',
            'guide_current', 
            'guide_currentStep', 
            'guide_steps', 
            'glb_current_theme', 
            'guide_currentStepIndex', 
            'guide_currentCode']),   

        showGuide(){
            return !isNullOrUndefined(this.guide_currentStep);
        },

        showPreview(){
            return !isNullOrUndefined(this.guide_currentStep) && this.guide_currentStep.type == 'preview' ? true : false;
        },

        showGuideControls(){
            return !isNullOrUndefined(this.guide_currentStep) && this.guide_currentStep.type == 'step' ? true : false;
        }
        // currentGuideName(){
        //     return isNullOrUndefined(this.guide_steps) ? '': this.guide_items[this.guide_currentStep].name
        // }
    },

    methods:{
        openGuideMenu(){
            this.hide();
            this.$windows.showDialog({          
                props: {
                    fromGuide : true
                },
                dialogCode: 'platformGuideDialog',
                }        
            );
        },
        openClose(id){
            console.log(id)
            let index = this.open.indexOf(id);
            if(index == -1)
                this.open.push(id);
            else
                this.open.splice(index,1);

        },

        isOpen(id){
            if(this.open.includes(id))
                return true;
            else
                return false;
        },

        hide(){
            this.$guide.hide();
        },

        gotoGuide(item){
            this.$guide.goToStep(item.stepFrom);
            this.open = [];
        },

        nextStep(){
            this.$guide.nextStep();
        },

        prevStep(){
            this.$guide.prevStep();
        },

        exit(){
            this.$guide.hide();
            document.location.reload(true);
        },

        clickOnGuideOverlay(){
            //console.log('click')
        },

        keyHandler(e){
            if(this.showGuide)
                switch(e.code){
                    case 'ArrowLeft'  : this.prevStep(); break;
                    case 'ArrowRight' : this.nextStep(); break;
                    case 'Escape'     : this.exit(); break;
                    default:
                        break;
                }
        },

        fillNavigationTree(){
            var self = this;

            let root = {
                children: []
            }
            
            var panelOpened = this.navigationTree.length > 0 && this.open.length > 0 &&  this.open.includes(this.navigationTree[0].id);
            if(panelOpened)
                this.open = []

            var lastIndex = 0
            var fillNodes = function(guideCode, parentObj, parentIndex){
                var guide = self.guide_items[guideCode];
                var name = parentIndex == undefined ? guide.name : `step ${parentIndex}: ${guide.name}`;

                var el = {
                    id:   guide.code,
                    code: guide.code,
                    description: guide.description,
                    name : guide.name,
                    stepFrom: lastIndex + 1
                }

                lastIndex++;

                if(guide.steps.filter(f=>f.type == 'guide').length == 0){
                    el.stepTo = lastIndex + guide.steps.length;
                    el.name = name;
                    lastIndex = el.stepTo;
                    parentObj.children.push(el);
                    return;
                }
                    
                
                el.children = [];
                
                var innerIndex = 1;
                guide.steps.forEach((step) => {
                    if(step.type == 'step'){
                        el.children.push({
                            id: `${guide.code}-step-${innerIndex}`,
                            name: `step ${innerIndex}`,
                            description: guide.description,
                            stepFrom: lastIndex + 1,
                            stepTo: lastIndex + 1
                        });
                        innerIndex++;
                        lastIndex++;
                    }
                    else // type == 'guide'
                        if(!isNullOrUndefined(self.guide_items[step.code])){
                            fillNodes(step.code, el, innerIndex)
                            innerIndex++;
                        }
                    
                });

                el.stepTo = lastIndex;
                parentObj.children.push(el)
                if( panelOpened && 
                   !isNullOrUndefined(el.id) &&
                   self.guide_currentStepIndex >= el.stepFrom && self.guide_currentStepIndex < el.stepTo
                   )
                    self.open.push(el.id);
            }

            fillNodes(this.guide_currentCode, root);
            this.navigationTree = root.children;
        },
    },

    created() {
      globalThis.addEventListener('keyup', this.keyHandler);
    },

    beforeDestroy() {
      globalThis.removeEventListener('keyup', this.keyHandler);
    }
}
</script>

<style>
    .guide-treeview-block > .v-treeview > .v-treeview-node > .v-treeview-node__root{
        background-color: black;
    }
    .guide-treeview-block .v-treeview-node__append {
        margin-left: 10px !important;
    }

    .guide-treeview-block .v-treeview-node__children .v-treeview-node--leaf .v-treeview-node__content .v-treeview-node__prepend{
        display:none;
    }
    .guide-treeview-block .v-treeview-node__children .v-treeview-node--leaf .v-treeview-node__content{
        margin-left: 12px;
    }
    .guide-treeview-block .closed-icon::before{
        transform: rotate(-90deg);
    }
    .guide-treeview-block .v-treeview-node__toggle{
        display:none;
    }
    .guide-treeview-block .v-treeview-node__content{
        margin-left:0;
    }
    .guide-treeview-block .v-treeview-node__level {
        width: 16px;
    }
    .guide-treeview-block .theme--light.v-treeview .v-treeview-node__root.v-treeview-node--active:hover::before, .guide-treeview-block .theme--light.v-treeview .v-treeview-node__root.v-treeview-node--active::before {
        opacity: 0;
    }
    .guide-treeview-block .theme--light.v-treeview--hoverable .v-treeview-node__root:hover::before, .guide-treeview-block .theme--light.v-treeview .v-treeview-node--click > .v-treeview-node__root:hover::before {
        opacity: 0;
    }
    .guide-treeview-block .v-treeview-node__prepend {
        margin-right: 0 !important;
    }

    .guid-app{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
    }
</style>
<style scoped>
    .guide-custom-tooltip{
        opacity: 1 !important;
        background-color: #dedede;
        margin-left: 80px;
        margin-top: 60px;
    }   

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to  {
        opacity: 0;
    }
    .guideDefaultClass{
        bottom: 23%;
    }

    .guidePreviewClass{
        top: 20%;
    }

    .guideControls{
        position: absolute;
        width: 100%;
        bottom: 14%;
        z-index: 9999; 
        left: calc(50% - 165px);
        width:600px;
        font-size:20px;

    }

    .giude-text-block-bottom-disabled{
        opacity: 0.3;
    }
    .theme--light.v-application{
        background: unset !important;
    }

    .guide-treeview-block{
        position:absolute;
        top:0;
        left:0;
        z-index: 9999;
        background: rgba(0,0,0,0.6);
    }
    .guide-treeview-block-close{ min-width: 200px; width:200px;}
    .guide-treeview-block-extend{
        min-width:250px;  
        max-width:400px;
        }
    .giude-text-block-bottom{
        position: absolute; 
        /* bottom: 12%;  */
        z-index: 9999; 
        left: calc(50% - 300px);
        width:600px;
        font-size:20px;
        transition: all 0.3s ease 0s;
    }
    .guid-overlay-scrim{
        border-radius: inherit;
        bottom: 0;
        height: 100%;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        -webkit-transition: inherit;
        transition: inherit;
        width: 100%;
        will-change: opacity; 
        z-index: 500;   
    }
</style>