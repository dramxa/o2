export default {
    tmpl_tb: {        
        sectionPath         : 'templates',
        features            : ['ft_templRead', 'ft_templShowSection'],
        steps               : [
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-tb-search',
                // текст описания шага
                // выводить стрелку
                showArrow           : true,
                // тип стрелки (v-arrow вертикальная или h-arrow горизонтальная)        *необязателен
                arrowType           : 'v-arrow',
                // текст стрелки
                // скрипт перед выполнением шага
                scriptBeforeShow    : null, 
                // скрипт перехода назад
                scriptBack          : null,
                // скрипт после выполнения шага
                scriptNext          : null,

                innerSelect         : '.gd-tb-search',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-filter',
                showArrow           : true,
                innerSelect         : '.gd-tb-filter',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-menu-btn',
                showArrow           : true,
                innerSelect         : '.gd-tb-menu-btn',
                scriptNext          : ()=>qs('.gd-tb-menu-btn').click(), 
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-menu',
                innerSelect         : '.gd-tb-menu-csv',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>qs('.gd-tb-menu-btn').click(), // закрыть меню
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-menu',
                innerSelect         : '.gd-tb-menu-delete',
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_templDelete',
                scriptNext          : ()=>qs('.gd-tb-menu-btn').click(), // закрыть меню
                returnScript        : ()=>qs('.gd-tb-menu-btn').click()
            },
        ]
    }
}