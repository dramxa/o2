export default {
    prc_prp: {        
        sectionPath         : 'pricelists',
        prepareScript       : (ds)=>{
            ds('sys', 'clear')
            ds('prc', 'fillList')
        },
        features            : ['ft_prcRead', 'ft_prcShowSection'],
        steps               : [
            // показываем кнопку создания
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-table',
                // скрипт перед выполнением шага                    *необязателен
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').classList.remove('visible-row-menu-button'),
                scriptBeforeShow    : ()=>qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button')
            },

            // контекстное меню таблицы - свойства 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-prop', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // закрыть меню
                scriptBeforeShow    : ()=>qs('.gd-tb-row-item-menu-btn').click(), // Открыть меню
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-prop').click(), // закрыть меню
            },

            // открываем область
            {
                type                : 'step',
                objectSelector      : '.gd-prop',
                textClass           : 'bottom-center',
                scriptBack          : ()=>qs('.gd-prp-close').click(), // закрыть меню
                //scriptBeforeShow    : ()=>qs('.gd-tb-create').click(), // Открыть меню
            },


            // фокус name
            {
                type                : 'step',
                objectSelector      : '.gd-prp-name',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },
            
            // фокус edit mode btn
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-btn',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_prcUpdate',
            },
            
            // фокус currency
            {
                type                : 'step',
                objectSelector      : '.gd-prp-currency',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },
            
            // фокус created
            {
                type                : 'step',
                objectSelector      : '.gd-prp-created',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },
            
            // фокус provider
            {
                type                : 'step',
                objectSelector      : '.gd-prp-provider',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },
            
            // фокус description
            {
                type                : 'step',
                objectSelector      : '.gd-prp-description',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на project
            {
                type                : 'step',
                objectSelector      : '.gd-prp-project',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на group
            {
                type                : 'step',
                objectSelector      : '.gd-prp-group',
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

            // фокус на prices
            {
                type                : 'step',
                objectSelector      : '.gd-prp-prices',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },


            // фокус close
            {
                type                : 'step',
                objectSelector      : '.gd-prp-close',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptNext          : (ds)=>ds('sys', 'clear'), // закрыть меню
                returnScript        : (ds)=>{
                    ds('prc', 'fillList');
                    ds('prc', 'showDetails');                    
                }
            }
        ]
    }
}