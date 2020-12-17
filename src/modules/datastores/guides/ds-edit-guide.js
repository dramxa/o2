export default {
    ds_edt: {        
        name                : 'Редактирование хранилищ данных',
        description         : 'Данный гайд расскажет как отредактировать хранилища данных',
        sectionPath         : 'datastores',
        features            : ['ft_dsUpdate'],
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
                textHtml            : 'Открыть режим редактирования хранилища данных можно так же и из данного меню, выбрав пункт "Edit"',
                innerSelect         : '.gd-tb-row-item-menu-edit', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Свойства хранилища данных',  
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // закрыть меню
                scriptBeforeShow    : ()=>qs('.gd-tb-row-item-menu-btn').click(), // Открыть меню
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-edit').click(), // закрыть меню
            },

            // открываем область
            {
                type                : 'step',
                objectSelector      : '.gd-prop',
                textHtml            : 'Открывается область свойств хранилища данных в режиме редактирования',
                textClass           : 'bottom-center',
                scriptBack          : ()=>qs('.gd-prp-close').click(), // закрыть меню
                //scriptBeforeShow    : ()=>qs('.gd-tb-create').click(), // Открыть меню
            },

            // заполняем объект и фокус на имя
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-name',
                textHtml            : 'Название хранилища данных<br><b>Это обязательное для заполнения поле</b>',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Название хранилища данных<br>Обязательно для заполнения',
            },

            // заполняем объект и фокус на type
            {
                type                : 'step',
                objectSelector      : '.gd-prp-type',
                textHtml            : 'Тип хранилища данных',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Тип хранилища данных',
            },

            // заполняем объект и фокус на status
            {
                type                : 'step',
                objectSelector      : '.gd-prp-status',
                textHtml            : 'Блокировка хранилища данных',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Блокировка хранилища данных',
            },

            // фокус на Comment
            {
                type                : 'step',
                objectSelector      : '.gd-prp-comment',
                textHtml            : 'Комментарий к хранилищу данных',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Комментарий',
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

            // фокус на кнопку применения изменений
            {
                type                : 'step',
                objectSelector      : '.gd-prp-bt-apply',
                textHtml            : 'Завершаем процедуру редактирования объекта нажатием на соответствующую кнопку',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowText           : 'Сохранить объект'
            },

            // показываем кнопку закрытия внизу
            {
                type                : 'step',
                objectSelector      : '.gd-prp-bt-close',
                textHtml            : 'Отмена редактирования объекта',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Отмена'
            },            
            
            // показываем кнопку закрытия вверху
            {
                type                : 'step',
                objectSelector      : '.gd-prp-close',
                textHtml            : 'Отмена редактирования объекта',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowText           : 'Отмена'
            },


        ]
    }
}