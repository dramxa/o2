export default {
    ds_crt: {        
        name                : 'Создание хранилища данных',
        description         : 'Данный гайд расскажет как создать хранилище данных',
        sectionPath         : 'datastores',
        features            : ['ft_dsCreate'],
        prepareScript       : (ds)=>{
            isNullOrUndefined(qs('.gd-prp-close'), { noFnc: v=>v.click() });
            ds('ds' , 'clearList');
            ds('lctn', 'fillList');
            ds('lctn', 'setLocation');
        },
        steps               : [
            // показываем кнопку создания
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-tb-create',
                // текст описания шага
                textHtml            : 'Для начала процедуры создания сети необходимо нажать кнопку создания хранилища данных',
                // стиль для объекта текста (если нужно разместить в ином месте)
                textClass           : 'bottom-center',
                // выводить стрелку                                 *необязателен
                showArrow           : true,
                // тип стрелки (v-arrow вертикальная или h-arrow горизонтальная)        *необязателен
                arrowType           : 'v-arrow',
                // текст стрелки                                    *необязателен
                arrowText           : 'Кнопка создания хранилища данных',
                // подсветка внутреннего объекта                    *необязателен
                innerSelect         : '.gd-tb-create',

                // скрипт перед выполнением шага                    *необязателен
                scriptBeforeShow    : null,
                // скрипт перехода назад                            *необязателен
                scriptBack          : null,
                // скрипт после выполнения шага                     *необязателен
                scriptNext          : null
            },

            // открываем область
            {
                type                : 'step',
                objectSelector      : '.gd-prop',
                textHtml            : 'Открывается область свойств с формой создания хранилища данных',
                textClass           : 'bottom-center',
                scriptBack          : ()=>qs('.gd-prp-close').click(), // закрыть меню
                scriptBeforeShow    : ()=>qs('.gd-tb-create').click(), // Открыть меню
            },

            // заполняем объект
            {
                type                : 'step',
                objectSelector      : '.gd-prop',
                textHtml            : 'Заполняем поля',
                textClass           : 'bottom-center',
                scriptBack          : (ds)=>ds('ds', 'create'),                
                scriptBeforeShow    : (ds)=>ds('ds', 'createFilled'),                
            },

            // заполняем объект и фокус на имя
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-name',
                textHtml            : 'Заполняем имя хранилища данных<br><b>Это обязательное для заполнения поле</b>',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Имя хранилища данных<br>Обязательно для заполнения',
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

            // фокус на location
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-location',
                textHtml            : 'Заполняем location для хранилища данных',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Location хранилища данных<br>Обязательно для заполнения',
            },

            // фокус на Comment
            {
                type                : 'step',
                objectSelector      : '.gd-prp-comment',
                textHtml            : 'Указываем комментарий к хранилищу данных',
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
                textHtml            : 'Завершаем процедуру создания объекта нажатием на соответствующую кнопку',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowText           : 'Создать объект'
            },

            // показываем кнопку закрытия внизу
            {
                type                : 'step',
                objectSelector      : '.gd-prp-bt-close',
                textHtml            : 'Отмена создания объекта',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Отмена'
            },            
            
            // показываем кнопку закрытия вверху
            {
                type                : 'step',
                objectSelector      : '.gd-prp-close',
                textHtml            : 'Отмена создания объекта',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowText           : 'Отмена',
                scriptNext          : ()=>qs('.gd-prp-close').click(), // закрыть меню
                returnScript        : (ds) => {
                    ds('ds', 'clearList');
                    setTimeout(()=>{
                        qs('.gd-tb-create').click()
                        ds('ds', 'createFilled');
                    }, 100);
                }
            },
        ]
    }
}