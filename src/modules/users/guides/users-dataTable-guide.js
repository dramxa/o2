export default {
    usr_dataTable: {        
        sectionPath         : 'users',
        prepareScript       : (ds)=>{
            ds('sys', 'clear')
            ds('usr', 'fillList'); // заполняем список
            ds('sys', 'attachListClasses') // заполняем классами ячейки добавленной строки
        },

        features            : ['ft_usrRead', 'ft_usrShowSection'],

        steps               : [
            // показываем таблицу
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-table',
                // текст описания шага
            },

            // столбец - select
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-select',
                showArrow           : true,
            },

            // столбец - name
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-name',
                showArrow           : true,
            },

            // столбец - name - в строке
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-name-item',
                showArrow           : true,
            },

            // столбец - login
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-login',
                showArrow           : true,
            },

            // столбец - email
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-email',
                showArrow           : true,
            },

            // столбец - status
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-status',
                showArrow           : true,
            },

            // столбец - created
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-created',
                showArrow           : true,
            },


            // Строка подсвечиваем меню
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item',
                innerSelect         : '.gd-tb-row-item-menu-btn',                
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').classList.remove('visible-row-menu-button'), 
                scriptBeforeShow    : ()=>setTimeout(()=>qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button'), 50),
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // закрыть меню
            },


            // контекстное меню таблицы - свойства 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-prop', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // закрыть меню
            },

            
            // контекстное меню таблицы - правка 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-edit', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_usrUpdate',
            },

            // контекстное меню таблицы - change password 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-pass', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_usrUpdate',
            },

            // контекстное меню таблицы - lock state
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-lock', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_usrUpdate',
            },
                        
            // контекстное меню таблицы - Удаление 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-delete', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_usrDelete',
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // закрыть меню
            },

            // Строка (объясняем реактивность)
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item',
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // закрыть меню
            },

            // Строка - изменение или добавление по реактивности
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item',
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-tb-row-item').classList.remove('green100-b'), 
                scriptBeforeShow    : ()=>qs('.gd-tb-row-item').classList.add('green100-b'), 
                scriptNext          : ()=>qs('.gd-tb-row-item').classList.remove('green100-b'), 
            },

            // Строка - изменение или добавление по реактивности
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item',
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-tb-row-item').classList.remove('red100-b'), 
                scriptBeforeShow    : ()=>setTimeout(()=>qs('.gd-tb-row-item').classList.add('red100-b'), 100), 
                scriptNext          : ()=>qs('.gd-tb-row-item').classList.remove('red100-b'),
                returnScript        : (ds)=>{
                    ds('sys', 'clear')
                    ds('usr', 'fillList'); // заполняем список
                    ds('sys', 'attachListClasses') // заполняем классами ячейки добавленной строки
                }            
            },
        ]
    }
}