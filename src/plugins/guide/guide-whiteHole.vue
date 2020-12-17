<template>
    <div>  
        <div class="whiteHole" :class="[showPreview ? 'whiteHoleWithPreview' : 'whiteHoleWithoutPreview' , whPosition.transition ? 'transition' : '' ]" :style="`left:${whPosition.x}px;top:${whPosition.y}px;height:${whPosition.height}px;width:${whPosition.width}px`">
            <div class="whiteHoleInner"></div>
        </div>
        <div class="innerSelect" :class="[ insPosition.transition ? 'transition' : '' ]"  v-if="useInnerSelect" :style="`left:${insPosition.x}px;top:${insPosition.y}px;height:${insPosition.height}px;width:${insPosition.width}px`"></div>
        <svg class="svgCanvas" v-if="showArrow && !calculate">
              <defs>
                <marker id="triangle" viewBox="0 0 8 8"
                    refX="0" refY="4" 
                    markerUnits="strokeWidth"
                    markerWidth="8" markerHeight="8"
                    orient="auto">
                <path d="M 0 0 L 7 4 L 0 8 z" class="arrowColor"/>
                </marker>
            </defs>
            <path v-if="arrowPath!=''" :d="arrowPath" class="arrow-path"  marker-end="url(#triangle)"></path>
        </svg>
        <span v-if="showArrow" class="arrowText arrowText fs-l" :style="`left:${arrowTextPosition.x}px;top:${arrowTextPosition.y}px;opacity:${calculate ? 0: 1}`"  v-html="arrowText"></span>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    data(){
        return {
            whPosition  : { x: 0, y: 0, width: 0, height: 0, transition: false },
            insPosition : { x: 0, y: 0, width: 0, height: 0, transition: false },
            arrowTextPosition : { x: 0, y: 0 },
            arrowPath : '',
            calculate : false,
            arrowData : {},            
        }
    },

    watch:{
        guide_currentStepIndex:function(newValue, oldValue){
            if(isNullOrUndefined(newValue))
                return;
            
            this.calculate = true; 
            if(!isNullOrUndefined(this.guide_currentStep.objectSelector))
                this.timeoutCheck().then(()=>setTimeout(()=>this.setWhiteHolePosition(), this.guide_currentStep.sleepBeforeShow))
            else{
                this.whPosition.width = 0;
                this.whPosition.height = 0;
                
                this.insPosition.width = 0;
                this.insPosition.height = 0;
                
                this.whPosition.transition  = false;
                this.insPosition.transition = false;                  
            }
        },

        glb_menuExpanded:{
            handler: function(value){     
                this.calculate = true;           
                var sleepBeforeShow = this.guide_currentStep.sleepBeforeShow || 10;
                if(!isNullOrUndefined(this.guide_currentStep.objectSelector))
                    setTimeout(()=>this.setWhiteHolePosition(), sleepBeforeShow)         
            },
            immediate: true,
            deep:true
        },

        // objectBySelector:function(newValue, oldValue){
        //     if(isNullOrUndefined(newValue) && !isNullOrUndefined(oldValue)){
        //         this.whPosition.width = 0;
        //         this.whPosition.height = 0;
                
        //         this.insPosition.width = 0;
        //         this.insPosition.height = 0;
                
        //         this.whPosition.transition  = false;
        //         this.insPosition.transition = false;                
        //     }
        // }
    },

    computed:{
        ...mapGetters(['guide_currentStep', 'glb_menuExpanded', 'guide_currentStepIndex', 'guide_steps']),

        objectBySelector(){
            if(isNullOrUndefined(this.guide_currentStep) || isNullOrUndefined(this.guide_currentStep.objectSelector))
                return null;
            return qs(this.guide_currentStep.objectSelector)
        },

        useInnerSelect(){
            if(isNullOrUndefined(this.guide_currentStep) || isNullOrUndefined(this.guide_currentStep.innerSelect))
                return false;
            return true;
        },

        showArrow(){
            return isNullOrUndefined(this.guide_currentStep) && isNullOrUndefined(this.guide_currentStep.showArrow) ? false : this.guide_currentStep.showArrow;
        },

        arrowText(){
            return isNullOrUndefined(this.guide_currentStep) && isNullOrUndefined(this.guide_currentStep.arrowText) ? '' : this.guide_currentStep.arrowText;
        },

        showPreview(){
            return !isNullOrUndefined(this.guide_currentStep) && this.guide_currentStep.type == 'preview' ? true : false;
        },
    },

    methods:{
        objectCheck(){
            let obj = qs(this.guide_currentStep.objectSelector)
            if(obj == null)
                return false;
            let rect = obj.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0
        },

        timeout(ms){
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        async timeoutCheck() {
            var iteration = 10
            while(!this.objectCheck() && iteration > 0){
                await this.timeout(100);
                console.log(`iteration ${iteration}`)
                iteration--;
            }
        },


        setWhiteHolePosition(){
            var obj = qs(this.guide_currentStep.objectSelector);
            const ROUND_OFFSET = 10;
          

            let position =  obj.getBoundingClientRect();
            this.whPosition = {
                x: Math.ceil((document.body.scrollLeft + position.left) - ROUND_OFFSET),
                y: Math.ceil((document.body.scrollTop + position.top) - ROUND_OFFSET),
                width : obj.offsetWidth + ROUND_OFFSET * 2,
                height: obj.offsetHeight + ROUND_OFFSET * 2,
                transition: true
            }

            if(this.useInnerSelect){
                const INNER_SELECT_ROUND_OFFSET = 0;
                obj = qs(this.guide_currentStep.innerSelect);
                let position = obj.getBoundingClientRect();
                this.insPosition = {
                    x: Math.ceil((document.body.scrollLeft + position.left) - INNER_SELECT_ROUND_OFFSET),
                    y: Math.ceil((document.body.scrollTop + position.top) + 1 - INNER_SELECT_ROUND_OFFSET),
                    width : obj.offsetWidth + INNER_SELECT_ROUND_OFFSET * 2,
                    height: obj.offsetHeight - 1 + INNER_SELECT_ROUND_OFFSET * 2,
                    transition : true
                }  
            }

            this.arrowPath = '';
            setTimeout(() => this.calcArrow(), 200); 
        },

        calcArrow(){
            if(!this.showArrow){
                this.calculate = false;
                return;
            }

            const ARROW_WIDTH = 70;
            const ARROW_HEIGHT = 70;
            const ARROW_BEND = 10;
            // сектор расположения объекта
            var objPos = this.useInnerSelect ? this.insPosition : this.whPosition;

            var heightSector =  (globalThis.innerHeight / 2) > (objPos.y + objPos.height / 2) ? 1 : 2;
            var widthSector =  (globalThis.innerWidth / 2) > (objPos.x + objPos.width / 2) ? 1 : 2;

            let arrowPosition = this.guide_currentStep.arrowPosition;
            let hasArrowPosition = !isNullOrUndefined(arrowPosition);

            if(hasArrowPosition){
                if(arrowPosition == 'left')
                    widthSector  = 2;                
                if(arrowPosition == 'right')
                    widthSector  = 1;
                if(arrowPosition == 'top')
                    heightSector = 2;                
                if(arrowPosition == 'bottom')
                    heightSector = 1;
            }


            var controlKoefX = objPos.width / 2 < ARROW_BEND ? objPos.width / 2 : ARROW_BEND; 

            var arrowStartX = 0;
            var arrowStartY = 0;
            var arrowEndX = 0;
            var arrowEndY = 0;

            var arrowControlX = 0;
            var arrowControlY = 0;

            if(!isNullOrUndefined(this.guide_currentStep) && this.guide_currentStep.arrowType == 'h-arrow'){
                arrowStartX = widthSector == 1 ? objPos.x + objPos.width + 28 :  objPos.x - 28
                arrowStartY = Math.ceil(objPos.y + objPos.height / 2);// heightSector == 1 ? objPos.y + objPos.height  + 28 : objPos.y - 28;

                arrowEndX = widthSector == 1 ? arrowStartX + ARROW_WIDTH : arrowStartX - ARROW_WIDTH;
                arrowEndY = heightSector == 1 ? arrowStartY + ARROW_HEIGHT / 2 : arrowStartY - ARROW_HEIGHT / 2;

                arrowControlX = widthSector == 1 ? arrowStartX + ARROW_WIDTH / 2 : arrowStartX - ARROW_WIDTH / 2;
                arrowControlY = arrowStartY;
            }else{ // v-arrow
                arrowStartX = Math.ceil(objPos.x + objPos.width / 2);
                arrowStartY = heightSector == 1 ? objPos.y + objPos.height  + 28 : objPos.y - 28;

                arrowEndX = widthSector == 1 ? arrowStartX + ARROW_WIDTH / 2 : arrowStartX - ARROW_WIDTH / 2;
                arrowEndY = heightSector == 1 ? arrowStartY + ARROW_HEIGHT : arrowStartY - ARROW_HEIGHT;

                arrowControlX = widthSector == 1 ? arrowStartX - controlKoefX : arrowStartX + controlKoefX;
                arrowControlY =  heightSector == 1 ? arrowEndY - 30 : arrowEndY + 30;
            }


            var objText = qs('.arrowText');
            var textSize = objText.getBoundingClientRect();

            if(this.guide_currentStep.arrowType == 'h-arrow'){
                this.arrowTextPosition = {
                    x: widthSector == 1 ? arrowEndX + 15 : arrowEndX - textSize.width + 10,
                    y: heightSector == 1 ? arrowEndY + 5 :   arrowEndY - 25               
                    }
            } else{
                this.arrowTextPosition = {
                    x: widthSector == 1 ? arrowEndX + 15 : arrowEndX - textSize.width  - 10,
                    y: heightSector == 1 ? arrowEndY - 5 :   arrowEndY - 25              
                    }
            }
            this.arrowData = { arrowEndX, arrowEndY , arrowControlX , arrowControlY , arrowStartX, arrowStartY }
            this.arrowPath = `M ${arrowEndX} ${arrowEndY} Q ${arrowControlX} ${arrowControlY} ${arrowStartX} ${arrowStartY}`
            this.calculate = false;
        },

        isInsideRect({x, y, height, width}, left, top) {
            return (left > x && left < (x + width)) && (top > y && top < (y + height))
        },

        resize(){
            this.calculate = true;
            var sleepBeforeShow = this.guide_currentStep.sleepBeforeShow || 10;
            if(!isNullOrUndefined(this.guide_currentStep.objectSelector))
                setTimeout(()=>this.setWhiteHolePosition(), sleepBeforeShow) 
        }
    },

    mounted() {
        globalThis.addEventListener("resize", this.resize);
    },
    beforeDestroy() {
        globalThis.removeEventListener("resize", this.resize);
    },
}
</script>

<style scoped>
    .whiteHole{
        position: absolute;
        z-index: 9991;     
        border-radius: 2px;
        /* transform: translate3d(0px, -50%, 0px); 0.8 -> 0.65 */
    }

    .whiteHoleWithPreview{box-shadow: rgba(0, 0, 0, 0.85) 0px 0px 0px 9999px;transition: box-shadow .8s ease;}
    .whiteHoleWithoutPreview{box-shadow: rgba(0, 0, 0, 0.6) 0px 0px 0px 9999px;transition: box-shadow .8s ease;}

    .transition{
        transition: all 0.3s ease 0s;
    }


    .whiteHoleInner{
        position: relative;
        width: 100%;
        height: 100%;
        box-shadow: inset 0px 0px 2px 5px rgba(0, 0, 0, 0.6);
    }

    .innerSelect{
        position: absolute;
        z-index: 9992;     
        background-color: rgba(78, 145, 222, 0.3);
        border-radius: 2px;
    }

    .svgCanvas{
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 9992;  
        filter: drop-shadow( 0 0 2px rgba(0, 0, 0, .7)); 
    }


    .arrowColor{
        fill: #ffffff;
    }

    .arrow-path {        
        fill: none;
        stroke: #ffffff;
        stroke-width: 2px;
        stroke-linecap: round;
    }

    .arrowText{
        position: absolute;
        color: white;
        z-index: 9992;
        top: 0;  
        font-weight: bold;
        filter: drop-shadow( 0 0 2px rgba(0, 0, 0, .7));
    }
</style>