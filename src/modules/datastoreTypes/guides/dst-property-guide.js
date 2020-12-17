export default {
    dst_prp: {        
        name                : 'Свойства типа хранилища данных',
        description         : 'Данный гайд расскажет про свойства типа хранилища данных',
        sectionPath         : 'dstypes',
        features            : ['ft_dstRead', 'ft_dstShowSection'],
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
                    ds('grp' , 'fillList'); // заполняем список
                    setTimeout(() => {
                        qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button');
                     }, 50)
                }
            },

            // контекстное меню таблицы - свойства 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                textHtml            : 'Открыть свойства типа хранилища данных можно так же и из данного меню, выбрав пункт "свойства"',
                innerSelect         : '.gd-tb-row-item-menu-prop', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Свойства типа хранилища данных',  
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // закрыть меню
                scriptBeforeShow    : ()=>qs('.gd-tb-row-item-menu-btn').click(), // Открыть меню
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-prop').click(), // закрыть меню
            },

            // открываем область
            {
                type                : 'step',
                objectSelector      : '.gd-prop',
                textHtml            : 'Открывается область свойств типа хранилища данных',
                textClass           : 'bottom-center',
                scriptBack          : ()=>qs('.gd-prp-close').click(), // закрыть меню
                //scriptBeforeShow    : ()=>qs('.gd-tb-create').click(), // Открыть меню
            },


            // фокус name
            {
                type                : 'step',
                objectSelector      : '.gd-prp-name',
                textHtml            : 'Наименование типа хранилища данных',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Наименование',
            },
            
            // фокус edit mode btn
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-btn',
                textHtml            : 'Кнопка для перехода в режим редактирования типа хранилища данных',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Редактирование типа хранилища данных',
                feature             : 'ft_dstUpdate',
            },
            
            // фокус code
            {
                type                : 'step',
                objectSelector      : '.gd-prp-code',
                textHtml            : 'Код типа хранилища данных',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Код',
            },

            // фокус на comment
            {
                type                : 'step',
                objectSelector      : '.gd-prp-comment',
                textHtml            : 'Коментарий к сети',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Коментарий',
            },


            // фокус close
            {
                type                : 'step',
                objectSelector      : '.gd-prp-close',
                textHtml            : 'Закрытие свойств сети',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Закрыть',
            },

        ]
    }
}