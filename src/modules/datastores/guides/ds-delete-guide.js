export default {
    ds_del: {        
        name                : 'Удаление хранилищей данных',
        description         : 'Данный гайд расскажет про удаление хранилища данных',
        sectionPath         : 'datastores',
        features            : ['ft_dsDelete'],
        prepareScript       : (ds)=>{
            isNullOrUndefined(qs('.gd-prp-close'), { noFnc: v=>v.click() })
            ds('ds' , 'fillList'); // заполняем список
        },
        steps               : [
            // показываем кнопку создания
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-table',
                // текст описания шага
                textHtml            : 'Для удаления сети необходимо нажать на кнопку меню в таблице хранилищ данных',
                innerSelect         : '.gd-tb-row-item-menu-btn',
                showArrow           : true,
                arrowType           : 'v-arrow',
                arrowText           : 'Вариант 1<br>Меню сети',
                // скрипт перед выполнением шага                    *необязателен
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').classList.remove('visible-row-menu-button'),
                scriptBeforeShow    : ()=>qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button'),
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-btn').click(), 
            },

            // контекстное меню таблицы - Удаление 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                textHtml            : 'Удалить хранилище данных можно из данного меню, выбрав пункт "Delete"',
                innerSelect         : '.gd-tb-row-item-menu-delete', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Удаление хранилища данных',  
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // закрыть меню
                scriptNext          : ()=>{
                    qs('.gd-tb-row-item-menu-btn').click();
                    qs('.gd-tbcol-row-select-cb').click();
                }, // закрыть меню
            },

            // открываем область
            {
                type                : 'step',
                objectSelector      : '.gd-table',
                textHtml            : 'Так же можно выбрать нужные хранилища данных нажав на чекбокс в таблице',
                textClass           : 'bottom-center',
                innerSelect         : '.gd-tbcol-row-select-cell',
                showArrow           : true,
                arrowType           : 'v-arrow',
                arrowText           : 'Вариант 2<br>Выбрать строки',
                scriptBack          : ()=>{
                    qs('.gd-tb-row-item-menu-btn').click(); // Открыть меню
                    qs('.gd-tbcol-row-select-cb').click();
                }, 
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
                textHtml            : 'Удаление выбранных в таблице объектов',
                innerSelect         : '.gd-tb-menu-delete',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Удалить выбранные',
                scriptNext          : ()=>qs('.gd-tb-menu-btn').click(),  // закрыть меню
                scriptBack          : ()=>qs('.gd-tb-menu-btn').click(),  // закрыть меню
                returnScript        : ()=>qs('.gd-tb-menu-btn').click(), 
            },

        ]
    }
}