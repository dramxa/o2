export default {
    dst_dataTable: {        
        name                : 'Список типов хранилищ данных',
        description         : 'Данный гайд расскажет о списке типов хранилищ данных',
        sectionPath         : 'dstypes',
        features            : ['ft_dstRead', 'ft_dstShowSection'],
        prepareScript       : (ds)=>{
            isNullOrUndefined(qs('.gd-prp-close'), { noFnc: v=>v.click() })
            ds('dst', 'fillList'); // заполняем список
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
                textHtml            : 'В данной таблице представлен список сетей. Столбцы таблицы отображаются в зависимости от размера окна и открытой или закрытой области свойств',
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
                textHtml            : 'Название сети. В данном столбце доступна сортировка.',
                showArrow           : true,
                arrowText           : 'Название с описанием<br>(Сортировка при клике)'
            },

            // столбец - name - в строке
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-name-item',
                textHtml            : 'Название сети. Клик по ячейке открывает область свойств',
                showArrow           : true,
                arrowText           : 'Клик открывает свойства объекта'
            },

            // столбец - статус
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-status',
                textHtml            : 'Статус сети. Доступна сортировка',
                showArrow           : true,
                arrowText           : 'Статус сети<br>(Сортировка при клике)'
            },

            // столбец - location
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-location',
                textHtml            : 'Location сети. Доступна сортировка',
                showArrow           : true,
                arrowText           : 'Location сети<br>(Сортировка при клике)'
            },

            // столбец - vm
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-vms',
                textHtml            : 'Количество подключенных ВМ. Доступна сортировка',
                showArrow           : true,
                arrowText           : 'Подключенные ВМ<br>(Сортировка при клике)'
            },

             // столбец - type
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-type',
                textHtml            : 'Тип сети. Доступна сортировка',
                showArrow           : true,
                arrowText           : 'Тип сети<br>(Сортировка при клике)'
            },

            // столбец - comment
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-comment',
                textHtml            : 'Коментарий для сети. Доступна сортировка',
                showArrow           : true,
                arrowText           : 'Коментарий<br>(Сортировка при клике)'
            },

            // столбец - created
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-created',
                textHtml            : 'Дата создания сети',
                showArrow           : true,
                arrowText           : 'Дата создания сети<br>(Сортировка при клике)'
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
                feature             : 'ft_dstUpdate',             
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
                feature             : 'ft_dstDelete',       
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
                    ds('dst', 'fillList'); // заполняем список
                    ds('sys', 'attachListClasses') // заполняем классами ячейки добавленной строки
                }            
            }
        ]
    }
}