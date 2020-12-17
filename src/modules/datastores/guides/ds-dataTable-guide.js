export default {
    ds_dataTable: {        
        name                : 'Список хранилищ данных',
        description         : 'Данный гайд расскажет о списке хранилищ данных',
        sectionPath         : 'datastores',
        features            : ['ft_dsRead', 'ft_dsShowSection'],
        prepareScript       : (ds)=>{
            isNullOrUndefined(qs('.gd-prp-close'), { noFnc: v=>v.click() })
            ds('ds', 'fillList'); // заполняем список
            ds('sys' , 'attachListClasses') // заполняем классами ячейки добавленной строки
        },
        steps               : [
            // показываем таблицу
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-table',
                // текст описания шага
                textHtml            : 'В данной таблице представлен список хранилищ данных. Столбцы таблицы отображаются в зависимости от размера окна и открытой или закрытой области свойств',
            },

            // столбец - select
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-select',
                textHtml            : 'Чекбокс выбора всех объектов выводимых в данной таблице',
                showArrow           : true,
                arrowText           : 'Выбор всех объектов в таблице'
            },

            // столбец - name
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-name',
                textHtml            : 'Название хранилища данных. В данном столбце доступна сортировка.',
                showArrow           : true,
                arrowText           : 'Название <br>(Сортировка при клике)'
            },

            // столбец - name - в строке
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-name-item',
                textHtml            : 'Название хранилища данных. Клик по ячейке открывает область свойств',
                showArrow           : true,
                arrowText           : 'Клик открывает свойства объекта'
            },

            // столбец - статус
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-status',
                textHtml            : 'Статус хранилища данных. Доступна сортировка',
                showArrow           : true,
                arrowText           : 'Статус хранилища данных<br>(Сортировка при клике)'
            },

            // столбец - тип
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-type',
                textHtml            : 'Тип хранилища данных. Доступна сортировка',
                showArrow           : true,
                arrowText           : 'Тип хранилища данных<br>(Сортировка при клике)'
            },

            // столбец - location
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-location',
                textHtml            : 'Location хранилища данных. Доступна сортировка',
                showArrow           : true,
                arrowText           : 'Location хранилища данных<br>(Сортировка при клике)'
            },

            // столбец - vm
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-vms',
                textHtml            : 'Разрешение на хранение данных для ВМ',
                showArrow           : true,
                arrowText           : 'Разрешение для ВМ.(Сортировка при клике)'
            },

            // столбец - templates
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-templates',
                textHtml            : 'Разрешение на хранение данных для шаблонов',
                showArrow           : true,
                arrowText           : 'Разрешение для шаблонов.(Сортировка при клике)'
            },

            // столбец - media
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-media',
                textHtml            : 'Разрешение на хранение данных для образов',
                showArrow           : true,
                arrowText           : 'Разрешение для образов.(Сортировка при клике)'
            },


            // Строка подсвечиваем меню
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item',
                textHtml            : 'При наведении на строку появляется кнопка контекстного меню',
                innerSelect         : '.gd-tb-row-item-menu-btn',                
                showArrow           : true,
                arrowText           : 'Кнопка контекстного меню',               
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').classList.remove('visible-row-menu-button'), 
                scriptBeforeShow    : ()=>setTimeout(() => {
                   qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button');
                }, 50),
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // закрыть меню
            },


            // контекстное меню таблицы - свойства 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                textHtml            : 'Открыть свойства проекта можно так же и из данного меню, выбрав пункт "свойства"',
                innerSelect         : '.gd-tb-row-item-menu-prop', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Свойства проекта',  
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // закрыть меню
            },

            
            // контекстное меню таблицы - правка 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                textHtml            : 'Редактирование проекта',
                innerSelect         : '.gd-tb-row-item-menu-edit', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Изменить свойства',               
            },
                        
            // контекстное меню таблицы - удаление 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                textHtml            : 'Удаление проекта производится с подтверждение.',
                innerSelect         : '.gd-tb-row-item-menu-delete', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Удаление проекта',     
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-btn').click(),
            },

            // Строка (объясняем реактивность)
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item',
                textHtml            : 'Строка так же может изменять цвет, демонстрируя что объект добавил, изменил или удалил другой пользователь',
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), 
            },

            // Строка - изменение или добавление по реактивности
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item',
                textHtml            : 'Данный цвет строки означает, что другой пользователь создал или изменил в данный момент этот проект',
                showArrow           : true,
                arrowText           : 'Создан или отредактирован',
                scriptBack          : ()=>qs('.gd-tb-row-item').classList.remove('green100-b'), 
                scriptBeforeShow    : ()=>qs('.gd-tb-row-item').classList.add('green100-b'), 
                scriptNext          : ()=>qs('.gd-tb-row-item').classList.remove('green100-b'), 
            },

            // Строка - изменение или добавление по реактивности
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item',
                textHtml            : 'Данный цвет строки означает, что другой пользователь уже удалил этот проект. Строка в скором времени исчезнет',
                showArrow           : true,
                arrowText           : 'Удален',               
                scriptBack          : ()=>qs('.gd-tb-row-item').classList.remove('red100-b'), 
                scriptBeforeShow    : ()=>setTimeout(()=>qs('.gd-tb-row-item').classList.add('red100-b'), 100), 
                scriptNext          : ()=>qs('.gd-tb-row-item').classList.remove('red100-b'),             
                returnScript        : (ds)=>{
                    isNullOrUndefined(qs('.gd-prp-close'), { noFnc: v=>v.click() })
                    ds('ds', 'fillList'); // заполняем список
                    ds('sys', 'attachListClasses') // заполняем классами ячейки добавленной строки
                }            
            }
        ]
    }
}