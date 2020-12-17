export default {
    vm_dataTable: {        
        sectionPath         : 'vms',
        prepareScript       : (ds)=>{
            ds('sys', 'clear')
            ds('vm' , 'fillList'); // заполняем список
            ds('sys', 'attachListClasses') // заполняем классами ячейки добавленной строки
        },

        features            : ['ft_vmRead', 'ft_vmShowSection'],

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

            // столбец - state
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-state',
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

            // столбец - status
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-status',
                showArrow           : true,
            },

            // столбец - location
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-location',
                showArrow           : true,
            },            
            
            // столбец - project
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-project',
                showArrow           : true,
            },

            // столбец - group
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-group',
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

            // столбец - STORAGE
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-storage',
                showArrow           : true,
            },

            // столбец - OS
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-os',
                showArrow           : true,
            },            

            // столбец - created
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-created',
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
            },   
            
            // столбец - price - выбор периода - клик
            {
                type                : 'step',
                objectSelector      : '.gd-tb-price-menu',
                innerSelect         : '.gd-tb-price-menu-click',
                scriptBack          : ()=>qs('.gd-tb-price-menu-click').click(), // закрыть меню
                scriptBeforeShow    : ()=>qs('.gd-tb-price-btn').click(), // Открыть меню
                scriptNext          : ()=>qs('.gd-tb-price-menu-click').click(), // закрыть меню
            },

            // Строка подсвечиваем меню
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item',
                innerSelect         : '.gd-tb-row-item-menu-btn',                
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').classList.remove('visible-row-menu-button'), 
                scriptBeforeShow    : ()=>setTimeout(() => {
                   qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button');
                }, 50),
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // Открыть меню
            },

            // контекстное меню таблицы - Консоль 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-console', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_vmConsole',       
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // закрыть меню
            },

            // контекстное меню таблицы - Консоль 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-run', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_vmConsole',
            },

           // контекстное меню таблицы - свойства 
           {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-prop', 
                showArrow           : true,
                arrowType           : 'h-arrow',
            },


            // контекстное меню таблицы - правка 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-editAdv', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_vmUpdate',
            },

            // контекстное меню таблицы - administration tools 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-adminTools', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_vmAdministrationTools',
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-adminTools').click(),
            },

            // контекстное меню таблицы - administration tools synchronize
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-sinchronize', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_vmAdministrationTools',
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-backFromAdminTools').click(),
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-backFromAdminTools').click(),
            },

            // контекстное меню таблицы - TakeSnap 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-snapTake', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_snapCreate',
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-adminTools').click(),
            },

            // контекстное меню таблицы - snapMgr 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-snapMgr', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_snapRead',
            },

            // контекстное меню таблицы - clone 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-clone', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_vmClone',
            },

            // контекстное меню таблицы - migrate 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-migrate', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_vmMigration',
            },

            // контекстное меню таблицы - toTemplate 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-toTemplate', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_vmConvertToTemplate',
            },

            // контекстное меню таблицы - Удаление 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-delete', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_vmDelete',
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-btn').click(),
            },    
            
            // Строка (объясняем реактивность)
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item',
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(),
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
                    ds('vm', 'fillList'); // заполняем список
                    ds('sys', 'attachListClasses') // заполняем классами ячейки добавленной строки
                }
            },           





        ]
    }
}