export default {
    tmpl_prp: {
        sectionPath         : 'templates',
        prepareScript       : (ds)=>{
            isNullOrUndefined(qs('.gd-prp-close'), { noFnc: v=>v.click() })
            ds('tmpl', 'fillList')
        },
        features            : ['ft_templRead', 'ft_templShowSection'],
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
                feature             : 'ft_templUpdate',
            },
            
            // фокус status
            {
                type                : 'step',
                objectSelector      : '.gd-prp-status',
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
            
            
            // фокус cpu
            {
                type                : 'step',
                objectSelector      : '.gd-prp-cpu',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус ram
            {
                type                : 'step',
                objectSelector      : '.gd-prp-ram',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус os
            {
                type                : 'step',
                objectSelector      : '.gd-prp-os',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус storage
            {
                type                : 'step',
                objectSelector      : '.gd-prp-storage',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                
            },

            // фокус networks
            {
                type                : 'step',
                objectSelector      : '.gd-prp-networks',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус media
            {
                type                : 'step',
                objectSelector      : '.gd-prp-media',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус comment
            {
                type                : 'step',
                objectSelector      : '.gd-prp-comment',
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
            },

        ]
    }
}