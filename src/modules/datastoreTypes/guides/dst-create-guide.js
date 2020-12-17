export default {
    dst_crt: {        
        name                : 'Создание типа хранилища данных',
        description         : 'Данный гайд расскажет как создать тип хранилища данных',
        sectionPath         : 'dstypes',
        features            : ['ft_dstCreate'],
        prepareScript       : (ds)=>{
            isNullOrUndefined(qs('.gd-prp-close'), { noFnc: v=>v.click() });
            ds('dst' , 'clearList');
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
                textHtml            : 'Для начала процедуры создания типа хранилища данных необходимо нажать кнопку создания типа хранилища данных',
                // стиль для объекта текста (если нужно разместить в ином месте)
                textClass           : 'bottom-center',
                // выводить стрелку                                 *необязателен
                showArrow           : true,
                // тип стрелки (v-arrow вертикальная или h-arrow горизонтальная)        *необязателен
                arrowType           : 'v-arrow',
                // текст стрелки                                    *необязателен
                arrowText           : 'Кнопка создания типа хранилища данных',
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
                textHtml            : 'Открывается область свойств с формой создания типа хранилища данных',
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
                scriptBack          : (ds)=>ds('dst', 'create'),                
                scriptBeforeShow    : (ds)=>ds('dst', 'createFilled'),                
            },

            // заполняем объект и фокус на имя
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-name',
                textHtml            : 'Заполняем имя типа хранилища данных<br><b>Это обязательное для заполнения поле</b>',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Имя типа хранилища данных<br>Обязательно для заполнения',
            },

            // заполняем объект и фокус на имя
            {
                type                : 'step',
                objectSelector      : '.gd-prp-code',
                textHtml            : 'Заполняем код типа хранилища данных<br><b>Это обязательное для заполнения поле</b>',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Код типа хранилища данных<br>Обязательно для заполнения',
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
                    ds('dst', 'clearList');
                    setTimeout(()=>{
                        qs('.gd-tb-create').click()
                        ds('dst', 'createFilled');
                    }, 100);
                }
            },
        ]
    }
}