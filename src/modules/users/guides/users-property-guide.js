export default {
    usr_prp: {
        sectionPath         : 'users',
        features            : ['ft_usrRead', 'ft_usrShowSection'],
        steps               : [
            // показываем кнопку создания
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-table',
                // скрипт перед выполнением шага                    *необязателен
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').classList.remove('visible-row-menu-button'),
                scriptBeforeShow    : (ds)=>{
                    isNullOrUndefined(qs('.gd-prp-close'), { noFnc: v=>v.click() })
                    ds('usr' , 'fillList'); // заполняем список
                    setTimeout(() => {
                        qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button');
                     }, 50)
                }
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
                feature             : 'ft_usrUpdate',
            },

            // фокус на chngPass
            {
                type                : 'step',
                objectSelector      : '.gd-prp-chngPass',
                innerSelect         : '.gd-prp-chngPass',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_usrUpdate',
            },
            
            // фокус на меню
            {
                type                : 'step',
                objectSelector      : '.gd-prp-menu-btn',
                innerSelect         : '.gd-prp-menu-btn',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_usrUpdate',
            },

            // фокус на lock state
            {
                type                : 'step',
                objectSelector      : '.gd-prp-menu',
                innerSelect         : '.gd-prp-menu-btn-lock',
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_usrUpdate',
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
                feature             : 'ft_usrUpdate',
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

            // фокус login
            {
                type                : 'step',
                objectSelector      : '.gd-prp-login',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на firstname
            {
                type                : 'step',
                objectSelector      : '.gd-prp-firstname',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на lastname
            {
                type                : 'step',
                objectSelector      : '.gd-prp-lastname',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на middlename
            {
                type                : 'step',
                objectSelector      : '.gd-prp-middlename',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на email
            {
                type                : 'step',
                objectSelector      : '.gd-prp-email',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на status
            {
                type                : 'step',
                objectSelector      : '.gd-prp-status',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на roles
            {
                type                : 'step',
                objectSelector      : '.gd-prp-roles',
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