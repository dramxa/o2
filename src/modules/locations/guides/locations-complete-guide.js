export default {
    // гайд по всему разделу, должен включать в себя все гайды раздела
    lctn_guide: {
        sectionPath  : 'location',
        prepareScript: (ds)=>{
            ds('lctn', 'fillList')
            setTimeout( ()=>qs('.gd-step1-list-item1').click(), 200)
        },
        steps        : [
            // показываем степпер
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-stepper',
                // текст описания шага
                // стиль для объекта текста (если нужно разместить в ином месте)
                textClass           : 'bottom-center',
                // выводить стрелку                                 *необязателен
                showArrow           : true,
                // тип стрелки (v-arrow вертикальная или h-arrow горизонтальная)        *необязателен
                arrowType           : 'v-arrow',
                // текст стрелки                                    *необязателен
                // подсветка внутреннего объекта                    *необязателен
                innerSelect         : null,

                // скрипт перед выполнением шага                    *необязателен
                scriptBeforeShow    : (ds)=>{ },
                // скрипт перехода назад                            *необязателен
                scriptBack          : null,
                // скрипт после выполнения шага                     *необязателен
                scriptNext          : null
            },

            // подсвечиваем первый шаг
            {
                type                : 'step',
                objectSelector      : '.gd-stepper-step1',
                textClass           : 'bottom-center',
                showArrow           : true,
            },

            // подсвечиваем список сервиспровайдеров
            {
                type                : 'step',
                objectSelector      : '.gd-step1-list',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // подсвечиваем описание сервиспровайдера
            {
                type                : 'step',
                objectSelector      : '.gd-step1-info',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // Выбираем
            {
                type                : 'step',
                objectSelector      : '.gd-step1-select-btn',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptNext          : ()=>qs('.gd-step1-select-btn').click(),
            },

            // подсвечиваем второй шаг
            {
                type                : 'step',
                objectSelector      : '.gd-stepper-step2',
                textClass           : 'bottom-center',
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-stepper-step1').click(), 
            },

            // Выбираем
            {
                type                : 'step',
                objectSelector      : '.gd-step2-select-btn',
                textClass           : 'bottom-center',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-step2-select-btn').click(),
            },


            // подсвечиваем третий шаг
            {
                type                : 'step',
                objectSelector      : '.gd-stepper-step3',
                textClass           : 'bottom-center',
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-stepper-step2').click(), 
            },

            // Выбираем
            {
                type                : 'step',
                objectSelector      : '.gd-step3-select-btn',
                textClass           : 'bottom-center',
                showArrow           : true,
            },            
        ]

    }

}