export default {
    vm_crtAdv: {        
        sectionPath         : 'vms',
        prepareScript       : (ds)=>{
            isNullOrUndefined(qs('.gd-prp-close'), { noFnc: v=>v.click() })
            ds('vm', 'clearList');
            ds('lctn', 'fillList');
            ds('lctn', 'setLocation');
        },

        features            : ['ft_vmCreate'],

        steps               : [
            // показываем кнопку создания
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-tb-create',
                // текст описания шага
                // стиль для объекта текста (если нужно разместить в ином месте)
                textClass           : 'bottom-center',
                // выводить стрелку                                 *необязателен
                showArrow           : true,
                // тип стрелки (v-arrow вертикальная или h-arrow горизонтальная)        *необязателен
                arrowType           : 'v-arrow',
                // текст стрелки                                    *необязателен
                // подсветка внутреннего объекта                    *необязателен
                innerSelect         : '.gd-tb-create',
                // скрипт перехода назад                            *необязателен
                scriptBack          : null,
                // скрипт после выполнения шага                     *необязателен
                scriptNext          : null
            },

            // открываем область
            {
                type                : 'step',
                objectSelector      : '.gd-prop',
                textClass           : 'bottom-center',
                scriptBack          : ()=>qs('.gd-prp-close').click(), // закрыть меню
                scriptBeforeShow    : ()=>qs('.gd-tb-create').click(), // Открыть меню
            },

            // заполняем объект
            {
                type                : 'step',
                objectSelector      : '.gd-prp-bt-advanced',
                textClass           : 'bottom-center',
                scriptBack          : (ds)=>ds('vm', 'create'),                
                scriptBeforeShow    : (ds)=>ds('vm', 'createFilled'),  
                scriptNext          : ()=>qs('.gd-prp-bt-advanced').click(), // Открыть расширенный редактор       
            },

            // Расширенный редактор
            {
                type                : 'step',
                objectSelector      : '.gd-adv-editor',
                textClass           : 'bottom-center',
                scriptBack          : ()=>qs('.gd-adv-bt-simpleMode').click(),        
            },

            // заполняем объект и фокус на имя
            {
                type                : 'step',
                objectSelector      : '.gd-adv-name',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'v-arrow',
            },

            // заполняем объект и фокус на имя
            {
                type                : 'step',
                objectSelector      : '.gd-adv-template',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'v-arrow',
            },

            // заполняем объект и фокус на tags
            {
                type                : 'step',
                objectSelector      : '.gd-adv-tags',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'v-arrow',
                arrowText           : 'Тэги',
            },

            // заполняем объект и фокус на project
            {
                type                : 'step',
                objectSelector      : '.gd-adv-project',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'v-arrow',
            },

            // заполняем объект и фокус на group
            {
                type                : 'step',
                objectSelector      : '.gd-adv-group',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'v-arrow',
            },

            // заполняем location sp
            {
                type                : 'step',
                objectSelector      : '.gd-adv-lctn-sp',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'v-arrow',
            },

            // заполняем location dc
            {
                type                : 'step',
                objectSelector      : '.gd-adv-lctn-dc',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'v-arrow',
            },

            // заполняем location rp
            {
                type                : 'step',
                objectSelector      : '.gd-adv-lctn-rp',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'v-arrow',
            },

            // заполняем объект и фокус на presets
            {
                type                : 'step',
                objectSelector      : '.gd-adv-presets',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'v-arrow',
            },

            // заполняем объект и фокус на cpu
            {
                type                : 'step',
                objectSelector      : '.gd-adv-cpu',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'v-arrow',
            },

            // заполняем объект и фокус на cpu
            {
                type                : 'step',
                objectSelector      : '.gd-adv-ram',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'v-arrow',
            },

            // заполняем объект и фокус на os
            {
                type                : 'step',
                objectSelector      : '.gd-adv-os',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'v-arrow',
            },

            // заполняем объект и фокус на storage
            {
                type                : 'step',
                objectSelector      : '.gd-adv-storages',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBeforeShow    : ()=>qs('.simplebar-content-wrapper').scroll(0,qs('.gd-adv-storages').offsetTop), // Скролим вниз
                scriptBack          : ()=>qs('.simplebar-content-wrapper').scroll(0,0), // Скролим вверх
            },

            // заполняем объект и фокус на networks
            {
                type                : 'step',
                objectSelector      : '.gd-adv-networks',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBeforeShow    : ()=>qs('.simplebar-content-wrapper').scroll(0,qs('.gd-adv-networks').offsetTop), // Скролим вниз
                scriptBack          : ()=>qs('.simplebar-content-wrapper').scroll(0,qs('.gd-adv-storages').offsetTop), // Скролим вверх
            },

            // заполняем объект и фокус на media
            {
                type                : 'step',
                objectSelector      : '.gd-adv-media',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBeforeShow    : ()=>qs('.simplebar-content-wrapper').scroll(0,qs('.gd-adv-media').offsetTop), // Скролим вниз
                scriptBack          : ()=>qs('.simplebar-content-wrapper').scroll(0,qs('.gd-adv-networks').offsetTop), // Скролим вверх
            },

            // заполняем объект и фокус на comment
            {
                type                : 'step',
                objectSelector      : '.gd-adv-comment',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBeforeShow    : ()=>qs('.simplebar-content-wrapper').scroll(0,qs('.gd-adv-comment').offsetParent.offsetTop), // Скролим вниз
                scriptBack          : ()=>qs('.simplebar-content-wrapper').scroll(0,qs('.gd-adv-media').offsetTop), // Скролим вверх
            },

            // фокус на кнопку применения изменений
            {
                type                : 'step',
                objectSelector      : '.gd-adv-bt-apply',
                textClass           : 'bottom-center',
                showArrow           : true,
            },

            // фокус на кнопку advanced редактора
            {
                type                : 'step',
                objectSelector      : '.gd-adv-bt-simpleMode',
                textClass           : 'bottom-center',
                showArrow           : true,
            },

            // показываем кнопку закрытия внизу
            {
                type                : 'step',
                objectSelector      : '.gd-adv-bt-cancel',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptNext          : ()=>{
                    qs('.gd-adv-bt-cancel').click() // закрыть 
                    setTimeout(()=>{
                        qs('.gd-prp-close').click() // закрыть 
                    }, 100);
                    
                },
                returnScript        : (ds) => {
                    ds('vm', 'clearList');
                    setTimeout(()=>{
                        qs('.gd-tb-create').click()
                        ds('vm', 'createFilled');
                    }, 100);
                } 
            },     


        ]
    }
}