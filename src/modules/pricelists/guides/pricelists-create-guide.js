export default {
    prc_crt: {        
        sectionPath         : 'pricelists',
        scriptBeforeShow    : (ds)=>{
            ds('sys', 'clear')
            ds('prc', 'clearList')
        },
        features            : ['ft_prcCreate'],
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
                // скрипт перед выполнением шага                    *необязателен
                scriptBeforeShow    : null,
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
                objectSelector      : '.gd-prop',
                textClass           : 'bottom-center',
                scriptBack          : ()=>qs('.gd-tb-create').click(),                
                scriptBeforeShow    : (ds)=>{
                    ds('prj', 'fillList');
                    ds('prc', 'createFilled');
                },                
            },

            // заполняем объект и фокус на имя
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-name',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

             // заполняем объект и фокус на currency
             {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-currency',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на description
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-description',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на project
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-project',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на group
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-group',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на location
            {
                type                : 'step',
                objectSelector      : '.gd-prp-location',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на цены
            {
                type                : 'step',
                objectSelector      : '.gd-prp-prices',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-prp-prices-item1',
                scriptNext          : ()=>qs('.gd-prp-prices-item1-btn').click()
            },

            // фокус на кнопку Add
            {
                type                : 'step',
                objectSelector      : '.gd-prp-prices-item1',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-prp-prices-item1-addBtn',
                scriptBack          : ()=>qs('.gd-prp-prices-item1-btn').click(),
                
            },

            // фокус на поле даты
            {
                type                : 'step',
                objectSelector      : '.gd-prp-prices-item1',
                textClass           : 'bottom-center',
                showArrow           : true,
                innerSelect         : '.gd-prp-prices-item1-dateInput',
                scriptBack          : ()=>qs('.gd-prp-prices-item1-cancelBtn').click(),
                scriptBeforeShow    : ()=>qs('.gd-prp-prices-item1-addBtn').click(),
            },

            // фокус на поле цены
            {
                type                : 'step',
                objectSelector      : '.gd-prp-prices-item1',
                textClass           : 'bottom-center',
                showArrow           : true,
                innerSelect         : '.gd-prp-prices-item1-priceInput',
            },

            // фокус на кнопку добавления
            {
                type                : 'step',
                objectSelector      : '.gd-prp-prices-item1',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-prp-prices-item1-pushBtn',
                scriptNext          : ()=>qs('.gd-prp-prices-item1-btn').click(),

            },

            // фокус на кнопку применения изменений
            {
                type                : 'step',
                objectSelector      : '.gd-prp-bt-apply',
                textClass           : 'bottom-center',
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-prp-prices-item1-btn').click(),
            },

            // показываем кнопку закрытия внизу
            {
                type                : 'step',
                objectSelector      : '.gd-prp-bt-close',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },            
            
            // показываем кнопку закрытия вверху
            {
                type                : 'step',
                objectSelector      : '.gd-prp-close',
                textClass           : 'bottom-center',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-prp-close').click(), // закрыть меню
                returnScript        : (ds) => {
                    ds('prc', 'clearList');
                    setTimeout(()=>{
                        qs('.gd-tb-create').click()
                        ds('prc', 'createFilled');
                    }, 100);
                }
            }
        ]
    }
}