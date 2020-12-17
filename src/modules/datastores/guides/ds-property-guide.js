export default {
    ds_prp: {        
        name                : 'Свойства хранилищ данных',
        description         : 'Данный гайд расскажет про свойства хранилища данных',
        sectionPath         : 'datastores',
        features            : ['ft_dsRead', 'ft_dsShowSection'],
        steps               : [
            // показываем кнопку создания
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-table',
                // текст описания шага
                textHtml            : 'Для открытия свойств хранилища данных необходимо нажать на название хранилища данных в таблице',
                // скрипт перед выполнением шага                    *необязателен
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').classList.remove('visible-row-menu-button'),
                scriptBeforeShow    : (ds)=>{
                    isNullOrUndefined(qs('.gd-prp-close'), { noFnc: v=>v.click() })
                    ds('ds' , 'fillList'); // заполняем список
                    setTimeout(() => {
                        qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button');
                     }, 50)
                }
            },

            // контекстное меню таблицы - свойства 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                textHtml            : 'Открыть свойства хранилища данных можно так же и из данного меню, выбрав пункт "свойства"',
                innerSelect         : '.gd-tb-row-item-menu-prop', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Свойства хранилища данных',  
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // закрыть меню
                scriptBeforeShow    : ()=>qs('.gd-tb-row-item-menu-btn').click(), // Открыть меню
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-prop').click(), // закрыть меню
            },

            // открываем область
            {
                type                : 'step',
                objectSelector      : '.gd-prop',
                textHtml            : 'Открывается область свойств хранилища данных',
                textClass           : 'bottom-center',
                scriptBack          : ()=>qs('.gd-prp-close').click(), // закрыть меню
                //scriptBeforeShow    : ()=>qs('.gd-tb-create').click(), // Открыть меню
            },


            // фокус name
            {
                type                : 'step',
                objectSelector      : '.gd-prp-name',
                textHtml            : 'Наименование хранилища данных',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Наименование хранилища данных',
            },
            

            // фокус edit mode btn
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-btn',
                textHtml            : 'Кнопка для перехода в режим редактирования хранилища данных',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Редактирование хранилища данных',
            },

            // фокус disable datastore
            {
                type                : 'step',
                objectSelector      : '.gd-prp-disable-btn',
                textHtml            : 'Блокировка хранилища данных',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Блокировка хранилища данных',
            },
            
            
            // фокус type
            {
                type                : 'step',
                objectSelector      : '.gd-prp-type',
                textHtml            : 'Тип хранилища данных',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Тип хранилища данных',
            },

            // фокус status
            {
                type                : 'step',
                objectSelector      : '.gd-prp-status',
                textHtml            : 'Статус хранилища данных',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Статус хранилища данных',
            },
            
            // фокус location
            {
                type                : 'step',
                objectSelector      : '.gd-prp-location',
                textHtml            : 'Location хранилища данных',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Location хранилища данных',
            },


            // фокус на comment
            {
                type                : 'step',
                objectSelector      : '.gd-prp-comment',
                textHtml            : 'Коментарий к хранилищу данных',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Коментарий',
            },

            // фокус на allowed
            {
                type                : 'step',
                objectSelector      : '.gd-prp-allowed',
                textHtml            : 'Допустимые типы данных для хранилища данных',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Допустимые типы данных для хранилища данных',
            },


            // фокус close
            {
                type                : 'step',
                objectSelector      : '.gd-prp-close',
                textHtml            : 'Закрытие свойств хранилища данных',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Закрыть',
            },

        ]
    }
}