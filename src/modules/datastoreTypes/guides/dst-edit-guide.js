export default {
    dst_edt: {        
        name                : 'Редактирование типа хранилища данных',
        description         : 'Данный гайд расскажет как отредактировать тип хранилища данных',
        sectionPath         : 'dstypes',
        features            : ['ft_dstUpdate'],
        steps               : [
            // показываем кнопку создания
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-table',
                // текст описания шага
                textHtml            : 'Для открытия свойств типа хранилища данных необходимо нажать на название типа хранилища данных в таблице',
                // скрипт перед выполнением шага                    *необязателен
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').classList.remove('visible-row-menu-button'),
                scriptBeforeShow    : (ds)=>{
                    isNullOrUndefined(qs('.gd-prp-close'), { noFnc: v=>v.click() })
                    ds('dst' , 'fillList'); // заполняем список
                    setTimeout(() => {
                        qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button');
                     }, 50)
                }
            },

            // контекстное меню таблицы - свойства 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                textHtml            : 'Открыть режим редактирования типа хранилища данных можно так же и из данного меню, выбрав пункт "Edit"',
                innerSelect         : '.gd-tb-row-item-menu-edit', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Свойства типа хранилища данных',    
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // закрыть меню
                scriptBeforeShow    : ()=>qs('.gd-tb-row-item-menu-btn').click(), // Открыть меню
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-edit').click(), // закрыть меню
            },

            // открываем область
            {
                type                : 'step',
                objectSelector      : '.gd-prop',
                textHtml            : 'Открывается область свойств типа хранилища данных в режиме редактирования',
                textClass           : 'bottom-center',
                scriptBack          : ()=>qs('.gd-prp-close').click(), // закрыть меню
                //scriptBeforeShow    : ()=>qs('.gd-tb-create').click(), // Открыть меню
            },

            // заполняем объект и фокус на имя
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-name',
                textHtml            : 'Название сети<br><b>Это обязательное для заполнения поле</b>',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Название сети<br>Обязательно для заполнения',
            },

            // заполняем объект и фокус на код
            {
                type                : 'step',
                objectSelector      : '.gd-prp-code',
                textHtml            : 'Код типа хранилища данных<br><b>Это обязательное для заполнения поле</b>',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Код<br>Обязательно для заполнения',
            },

            // фокус на описание
            {
                type                : 'step',
                objectSelector      : '.gd-prp-description',
                textHtml            : 'Описание типа хранилища данных',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Описание',
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