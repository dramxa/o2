import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex';
import { languages } from '@/lang'

const store = Vue.prototype.$store

const guideMgr = {

    store,

    data(){
        return {
            allScripts : {}            
        }
    },

    computed:{
        ...mapGetters([
            'guide_current', 
            'guide_currentCode',

            'guide_currentStep', 
            'guide_currentStepIndex', 

            'guide_steps', 
            'guide_scripts',
            'guide_items', 
 
            'glb_currentSection',
            'glb_language',
            'glb_permissions'
        ])
    },

    watch:{
        glb_language(){
            this.init();
        },
        glb_permissions(){
            this.init();
        },
    },

    methods:{
        ...mapActions([
            'guide_show', 
            'guide_setItems', 
            'guide_setFilteredItems',
            'guide_setScripts', 
            'guide_setCurrentCode', 
            'guide_setSteps', 
            'guide_setCurrentStepIndex', 
            'guide_setTree'
        ]),
        /**
         * Добавление гайда из модуля
         * @param {*} guides 
         */

        prepareLangGuide: async () => {
            let guide = (await import('@/modules/vms/guides/vms-dlg-snapMngr.js')).default;
            var obj = { }
            var togTrans = {
                ru: [],
                en: []
            }
            Object.keys(guide).forEach(k=>{
                var item = guide[k];

                if(!togTrans.ru.some(s=>s == item.name))
                    togTrans.ru.push(item.name)

                if(!togTrans.ru.some(s=>s == item.description))
                    togTrans.ru.push(item.description)

                obj[k] = {
                    ru_name : item.name,
                    en_name : item.name,
                    ru_descr : item.description,
                    en_descr : item.description,
                    steps : []
                }
                item.steps.forEach(step=>{
                    if(!togTrans.ru.some(s=>s == step.textHtml))
                        togTrans.ru.push(step.textHtml)
                    if(!togTrans.ru.some(s=>s == step.arrowText))
                        togTrans.ru.push(step.arrowText)

                    obj[k].steps.push({
                        ru_text: step.textHtml,
                        en_text: step.textHtml,
                        ru_arrow: step.arrowText,
                        en_arrow: step.arrowText,
                    })
                })
            })
            togTrans.en = togTrans.ru;
            Vue.prototype.$export.downloadBlob(togTrans, 'toTranslate.js')
    //        $export.downloadBlob('toTranslate', togTrans)
    //        console.log(togTrans)
        },

        prepareLangGuide2: async () => {
            var translate = (await import('./tempGuide')).default;
            let guide = (await import('@/modules/vms/guides/vms-dlg-snapMngr.js')).default;
            var obj = { }
            var togTrans = {
                ru: [],
                en: []
            }
            Object.keys(guide).forEach(k=>{
                var item = guide[k];


                obj[k] = {
                    ru_name : item.name,
                    en_name : item.name,
                    ru_descr : item.description,
                    en_descr : item.description,
                    steps : []
                }
                
                var index = translate.ru.indexOf(item.name)
                if(index>=0)
                    obj[k].en_name = translate.en[index];

                index = translate.ru.indexOf(item.description)
                if(index>=0)
                    obj[k].en_descr = translate.en[index];
    


                item.steps.forEach((step, i)=>{
                    obj[k].steps.push({
                        ru_text: step.textHtml,
                        en_text: step.textHtml,
                        ru_arrow: step.arrowText,
                        en_arrow: step.arrowText,
                    });

                    index = translate.ru.indexOf(step.textHtml)
                    if(index>=0)
                        obj[k].steps[i].en_text = translate.en[index];
                    
                    index = translate.ru.indexOf(step.arrowText)
                    if(index>=0)
                        obj[k].steps[i].en_arrow = translate.en[index];    
                })
            })
            Vue.prototype.$export.downloadBlob(obj, 'guide.js')
    //        $export.downloadBlob('toTranslate', togTrans)
    //        console.log(togTrans)
        },


        add(guides){
            this.guide_setItems({ ...this.guide_items, ...guides})
        },

        addDataScripts(moduleCode, functions){    
            this.allScripts[moduleCode] = functions;
        },

        // /**
        //  * Фильтр гайдов по фичам
        //  * @param {*} guides 
        //  */
        // filterGuides(guides){ 
        //     console.log(this.glb_permissions)
        //     console.log(guides)

        //     let newAllGuides = {}
        //     for(let key in { net_crt : guides['net_crt'] } ){                
        //         let verify = false;
        //         verify = isNullOrUndefined(guides[key].features, {
        //             y: ()  => true,
        //             n: (v) => v.reduce((res, item)=>res + this.glb_permissions.includes(item) ? 1 : 0, 0) == v.length // обязательно наличие всех фич в списке разрешений
        //         })
               
        //         let verifiedGuideSteps = [];
        //         guides[key].steps.forEach(step=>{
        //             console.log(step.feature, step)
        //             if(isNullOrUndefined(step.feature)){
        //                 verifiedGuideSteps.push(step)
        //             }else{
        //                 if(step.feature=='ft_editNetworkVlan'){
        //                     console.log('founded');
        //                     console.log(this.glb_permissions);
        //                 } 
                           
        //                 if(this.glb_permissions.includes(step.feature))
        //                     verifiedGuideSteps.push(step)
        //             }
        //         });
        //         guides[key].steps = verifiedGuideSteps;

        //         if(verify)
        //             newAllGuides[key] = guides[key];

        //     }
        //     console.log(newAllGuides)
        //     this.guide_setItems(newAllGuides);
        // },

        init(){

            // динамическая загрузка всех гайдов
            const guideComponents = require.context('@/modules', true, /.*_register.+-guides\.js$/i);
            var allGuides = guideComponents.keys().map(x => guideComponents(x).default).reduce((r, i)=> { r = { ...r, ...i };  return r} , { });

            // формируем скрипты гайдов
            guideComponents.keys().map(x => guideComponents(x).initScripts).forEach(i=>i())
            this.guide_setScripts(this.allScripts);

            // динамическая загрузка языков гайдов
            const components = require.context('@/lang/guides', false, /\.js$/);
            var lang = components.keys().map(x => components(x).default).reduce((r, i)=> { r = { ...r, ...i };  return r} , { });

            // список кодов языков и получение дефолтного или уже выбранного
            var langCode = languages.find(w=>w.isDefault).code;
            if(!isNullOrUndefined(this.glb_language))
                langCode = this.glb_language.code;
            var parameter = (name) => `${langCode}_${name}`

     //       var allGuides = this.guide_items;
            Object.entries(allGuides).forEach(([key, entity])=>{
                try{
                    var lGuide = lang[key];
                    if(lGuide != undefined){
                        Vue.set(entity, 'name'       , lGuide[parameter('name')]);
                        Vue.set(entity, 'description', lGuide[parameter('descr')]);
                        try{
                            entity.steps.forEach((e, i)=>{
                                if(e.type=='guide')
                                    return;
                                Vue.set(entity.steps[i], 'textHtml' , lGuide.steps[i][parameter('text')]);
                                Vue.set(entity.steps[i], 'arrowText', lGuide.steps[i][parameter('arrow')]);
                            })
                        }catch(err){
                            console.group(key)
                            console.error(err);
                            console.log(entity)
                            console.log(lGuide)
                            console.groupEnd()
                        }
                    }
                }catch(err){
                    console.error(err)
                    console.log(entity)
                }
            })
            
            this.guide_setItems(allGuides);



            // var guides = clone(this.guide_items);
            // Object.entries(guides).forEach(([key, entry])=>{
            //     var steps = entry.steps.map(m=>{return { textHtml : m.textHtml, arrowText: m.arrowText}})
                 
            //     guides[key] = {
            //             name        : entry.name,
            //             description : entry.description,
            //             steps       : steps
            //         }
            // });
            // Vue.prototype.$export.downloadBlob(guides, 'ru_.js');

            // var rand =  function() {
            //     var result       = '';
            //     var words        = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
            //     var max_position = words.length - 1;
            //         for(var i = 0; i < 5; ++i ) {
            //             var position = Math.floor ( Math.random() * max_position );
            //             result = result + words.substring(position, position + 1);
            //         }
            //     return result;
            // }

            // собираем дерево
            // добавляем параметр родителя каждому
            Object.entries(this.guide_items).forEach(([key, item])=>{
                Vue.set(item, 'code', key);  
                Vue.set(item, 'id', key);  
                Vue.set(item, 'parent', null); 
                Vue.set(item, 'children', []); 
                item.steps.forEach(step=>{
                    Vue.set(step, 'parentGuide', key);
                    Vue.set(step, 'sectionName', item.name);
                    if(isNullOrUndefined(step.sectionPath))
                        Vue.set(step, 'sectionPath', item.sectionPath);
                })
            });

            Object.values(this.guide_items).forEach(parent=>{
                // нет детей, пропускаем элемент
                if(isNullOrUndefined(parent.childCodes))
                    return;

                parent.childCodes.forEach(childCode=>{
                    // заполняем в детях кто их родитель а родителю добавляем объекты детей
                    if(!isNullOrUndefined(this.guide_items[childCode])){
                        let child = this.guide_items[childCode];
                        child.parent = parent.code;
                        parent.children.push(child)
                    }
                })
            });

            var rootItems = Object.values(this.guide_items).filter(w=>w.parent == null);
            this.guide_setTree(rootItems);
        },
        /**
         * Начало демонстрации определенного гайда
         * @param {*} guigeCode 
         */
        show: async function(guigeCode, stepIndex = 1){
            this.guide_show(true);
            this.guide_setCurrentCode(guigeCode);
            
            // ----------- готовим список шагов ---------
            // TODO: собрать из вложенных гайдов общий список шагов
            var allSteps = [];
            var allGuides = this.guide_items;
            var permissionList = this.glb_permissions

            var fillGuideSteps = function(guideCode, root = true){
                let guide = allGuides[guideCode];

                if(isNullOrUndefined(guide))
                    return;

                allSteps.push({
                    type        : 'preview',
                    sectionPath : guide.sectionPath,
                    sectionName : guide.name,
                    textHtml    : guide.description,
                    scriptBeforeShow : guide.prepareScript
                })

                guide.steps.forEach(step=>{
                    if(step.type == 'step'){
                        if(isNullOrUndefined(step.feature, {
                            y: ()  => true,
                            n: (v) => permissionList.includes(v)
                        }))
                            allSteps.push(step)
                    }
                    else // type == 'guide'
                        fillGuideSteps(step.code, false)
                })

                if(root)
                    allSteps.push({
                        type        : 'preview',
                        sectionPath : guide.sectionPath,
                        sectionName : guide.name,
                        textHtml    : 'Гайд завершен, спасибо за внимание'
                    })
            }

            fillGuideSteps(guigeCode);

            await this.changeSection(this.guide_current.sectionPath);
            this.guide_setSteps(allSteps); 
            this.guide_setCurrentStepIndex(stepIndex - 1) // начинаем с первого шага
            await this.changeSection(this.guide_currentStep.sectionPath);
            if(!isNullOrUndefined(this.guide_currentStep.scriptBeforeShow)){
                this.guide_currentStep.scriptBeforeShow(this.dataScript);
            }
            // ------------------------------------------

        },


        changeSection: async function(pathName){
            if(this.glb_currentSection.pathName == pathName)
                return;

            if(!isNullOrUndefined(pathName))
                await Vue.prototype.$nav.navigateTo(pathName)
        },

        goToStep: async function(stepIndex){
            this.guide_setCurrentStepIndex(stepIndex - 1);

            await this.changeSection(this.guide_currentStep.sectionPath);

            if(!isNullOrUndefined(this.guide_currentStep.scriptBeforeShow)){
                this.guide_currentStep.scriptBeforeShow(this.dataScript);
            }
        },

        /**
         * Следующий шаг гайда
         */
        nextStep: async function(){
            var index = this.guide_currentStepIndex;
            if(this.guide_steps.length -1 == index)
                return null;
            

            if(!isNullOrUndefined(this.guide_currentStep.scriptNext))
                this.guide_currentStep.scriptNext(this.dataScript);                

            this.guide_setCurrentStepIndex(index + 1);

            await this.changeSection(this.guide_currentStep.sectionPath);

            if(!isNullOrUndefined(this.guide_currentStep.scriptBeforeShow)){
                this.guide_currentStep.scriptBeforeShow(this.dataScript);
            }

        },

        /**
         * Предыдущий шаг гайда
         */
        prevStep: async function(){
            var index = this.guide_currentStepIndex;
            if(index == 0)
                return null;
            
            let prevGuideCode = this.guide_currentStep.parentGuide;
            if(!isNullOrUndefined(this.guide_currentStep.scriptBack))
                this.guide_currentStep.scriptBack(this.dataScript);

            this.guide_setCurrentStepIndex(index - 1);
            await this.changeSection(this.guide_currentStep.sectionPath);

            if(prevGuideCode != this.guide_currentStep.parentGuide
                && !isNullOrUndefined(this.guide_currentStep.returnScript))
                this.guide_currentStep.returnScript(this.dataScript)


            if(!isNullOrUndefined(this.guide_currentStep.scriptBeforeShow)){
                this.guide_currentStep.scriptBeforeShow(this.dataScript);
            }

        },

        /**
         * Завершить гайд
         */
        hide(){ // TODO: переименовать
            this.guide_setCurrentCode(null);
            this.guide_setCurrentStepIndex(null);
            this.guide_setSteps(null); 
            this.guide_show(false);       
        },

        dataScript(module, scriptName, options){
            this.guide_scripts[module][scriptName](options);
        }
    }
}


export default function (){    
    Vue.prototype.$guide = new Vue (guideMgr);    
}