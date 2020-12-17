export default {
    prj_dataTable: {        
        sectionPath         : 'projects',
        prepareScript       : (ds)=>{
            ds('sys', 'clear')
            ds('prj', 'fillList'); // заполняем список
            ds('sys', 'attachListClasses') // заполняем классами ячейки добавленной строки
        },
        features            : ['ft_prjRead', 'ft_prjShowSection'],
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

            // столбец - group
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-group',
                showArrow           : true,
            },

            // поле group в строке
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-group-item',
                showArrow           : true,
            },


            // столбец - vm
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-vm',
                showArrow           : true,
            },

            // поле vm в строке
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-vm-item',
                showArrow           : true,
            },



            // столбец - status
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-status',
                showArrow           : true,
            },

            // поле vm в строке
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-status-item',
                showArrow           : true,
            },

            // столбец - CPU
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-cpu',
                showArrow           : true,
            },

            // столбец - RAM
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-ram',
                showArrow           : true,
            },

            // столбец - created
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-created',
                showArrow           : true,
            },

            // столбец - expired
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-expired',
                showArrow           : true,
            },   
            
            // столбец - price
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-price',
                showArrow           : true,
            },

            // столбец - price - выбор периода
            {
                type                : 'step',
                objectSelector      : '.gd-tb-price-btn',
                innerSelect         : '.gd-tb-price-btn',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-tb-price-btn').click(), // Открыть меню
            },   
            
            // столбец - price - выбор периода - клик
            {
                type                : 'step',
                objectSelector      : '.gd-tb-price-menu',
                innerSelect         : '.gd-tb-price-menu-click', 
                scriptBack          : ()=>qs('.gd-tb-price-menu-click').click(), 
                scriptNext          : ()=>qs('.gd-tb-price-menu-click').click(), 
            },

            // Строка подсвечиваем меню
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item',
                innerSelect         : '.gd-tb-row-item-menu-btn',                
                showArrow           : true,
                scriptBack          : ()=>{
                    qs('.gd-tb-price-btn').click(), // Открыть меню
                    qs('.gd-tb-row-item-menu-btn').classList.remove('visible-row-menu-button')
                }, 
                scriptBeforeShow    : ()=>setTimeout(() => {
                   qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button');
                }, 50),
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // Открыть меню
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
                feature             : 'ft_prjUpdate',
            },
                        
            // контекстное меню таблицы - правка 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-delete', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_prjDelete',
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // закрыть меню
            },

            // Строка (объясняем реактивность)
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item',
                scriptBack          : ()=>{
                    qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button');
                    qs('.gd-tb-row-item-menu-btn').click()
                }
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
                    ds('prj', 'fillList'); // заполняем список
                    ds('sys', 'attachListClasses') // заполняем классами ячейки добавленной строки
                }
            },
        ]
    }
}