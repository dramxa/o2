export default {
    org_prp: {        
        sectionPath         : 'orgs',
        prepareScript       : (ds)=>{
            ds('sys', 'clear')
            ds('org', 'fillList')
        },
        features            : ['ft_orgRead'],
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
                feature             : 'ft_orgUpdate',
            },

            // фокус на impersonate
            {
                type                : 'step',
                objectSelector      : '.gd-prp-impersonate',
                innerSelect         : '.gd-prp-impersonate',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },
            
            // фокус на меню
            {
                type                : 'step',
                objectSelector      : '.gd-prp-menu-btn',
                innerSelect         : '.gd-prp-menu-btn',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на lock state
            {
                type                : 'step',
                objectSelector      : '.gd-prp-menu',
                innerSelect         : '.gd-prp-menu-btn-lock',
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_orgUpdate',
                scriptBack          : ()=>qs('.gd-prp-menu-btn').click(), // закрыть меню
                scriptBeforeShow    : ()=>qs('.gd-prp-menu-btn').click(), // Открыть меню
                scriptNext          : ()=>qs('.gd-prp-menu-btn').click(), // закрыть меню
            },


            // фокус на delete
            {
                type                : 'step',
                objectSelector      : '.gd-prp-menu',
                innerSelect         : '.gd-prp-menu-btn-delete',
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_orgDelete',
                scriptBack          : ()=>qs('.gd-prp-menu-btn').click(), // закрыть меню
                scriptBeforeShow    : ()=>qs('.gd-prp-menu-btn').click(), // Открыть меню
                scriptNext          : ()=>qs('.gd-prp-menu-btn').click(), // закрыть меню
            },
            
            // фокус created
            {
                type                : 'step',
                objectSelector      : '.gd-prp-created',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус code
            {
                type                : 'step',
                objectSelector      : '.gd-prp-code',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на Full name
            {
                type                : 'step',
                objectSelector      : '.gd-prp-fullname',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на Locked
            {
                type                : 'step',
                objectSelector      : '.gd-prp-locked',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на Comment
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
                scriptNext          : (ds)=>ds('sys', 'clear'), // закрыть меню
                returnScript        : (ds)=>{
                    ds('org', 'fillList');
                    ds('org', 'showDetails');                    
                }
            }

        ]
    }
}