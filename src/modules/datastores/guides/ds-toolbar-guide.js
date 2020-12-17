export default {
    ds_tb: {        
        name                : 'Тулбар хранилищ данных',
        description         : 'Данный гайд расскажет какие функции доступны в тулбаре хранилищ данных',
        sectionPath         : 'datastores',
        features            : ['ft_dsRead', 'ft_dsShowSection'],
        steps               : [
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-tb-search',
                // текст описания шага
                textHtml            : 'Строка поиска дает возможность производить поиск по всем объектам и их параметрам. Результат вы впоследствии можете фильтровать.<br><b>Для применения требуется нажатие Enter</b>',
                // выводить стрелку
                showArrow           : true,
                // тип стрелки (v-arrow вертикальная или h-arrow горизонтальная)        *необязателен
                arrowType           : 'v-arrow',
                // текст стрелки
                arrowText           : 'Поле поиска объектов',
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
                textHtml            : 'Кнопка включения фильтрации значений в таблице по столбцам',
                showArrow           : true,
                arrowText           : 'Вызов фильтров',
                innerSelect         : '.gd-tb-filter',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-create',
                textHtml            : 'Нажатие на кнопку открывает область создания объекта',
                showArrow           : true,
                arrowText           : 'Создание сети',
                innerSelect         : '.gd-tb-create',
                feature             : 'ft_dsCreate',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-menu-btn',
                textHtml            : 'Меню групповых операций. Выполняет действия над несколькими выделенными объектами',
                showArrow           : true,
                arrowText           : 'Меню групповых операций',
                innerSelect         : '.gd-tb-menu-btn',
                scriptNext          : ()=>qs('.gd-tb-menu-btn').click(), 
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-menu',
                textHtml            : 'Выгрузка списка объектов в таблице в файл CSV',
                innerSelect         : '.gd-tb-menu-csv',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Выгрузить в CSV',
                scriptBack          : ()=>qs('.gd-tb-menu-btn').click(), // закрыть меню
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-menu',
                textHtml            : 'Удаление выбранных в таблице объектов',
                innerSelect         : '.gd-tb-menu-delete',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Удалить выбранные',
                feature             : 'ft_dsDelete',
                scriptNext          : ()=>qs('.gd-tb-menu-btn').click(), // закрыть меню
                returnScript        : ()=>qs('.gd-tb-menu-btn').click()
            },
        ]
    }
}