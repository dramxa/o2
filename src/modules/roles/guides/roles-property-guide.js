export default {
    role_prp: {        
        sectionPath         : 'roles',
        prepareScript       : (ds)=>{
            ds('sys', 'clear')
            ds('role', 'fillList')
        },

        features            : ['ft_roleRead', 'ft_roleShowSection'],

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
            
            // // фокус edit mode btn
            // {
            //     type                : 'step',
            //     objectSelector      : '.gd-prp-edt-btn',
            //     textClass           : 'bottom-center',
            //     showArrow           : true,
            //     arrowType           : 'h-arrow',
            //     feature             : 'ft_roleUpdate',
            // },

            // фокус created
            {
                type                : 'step',
                objectSelector      : '.gd-prp-created',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },
            
            // фокус system
            {
                type                : 'step',
                objectSelector      : '.gd-prp-system',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },
            

            // фокус на description
            {
                type                : 'step',
                objectSelector      : '.gd-prp-description',
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
                    ds('role', 'fillList');
                    ds('role', 'showDetails');                    
                }
            }
        ]
    }
}