// export default {
//     med_crt: {        
//         name                : 'Создание образа',
//         description         : 'Данный гайд расскажет как создать образ',
//         sectionPath         : 'media',
//         steps               : [
//             // показываем кнопку создания
//             {
//                 // тип, если guide, значит шаги копируются из гайда с кодом code
//                 type                : 'step',
//                 // селектор объекта, который нужно подсветить
//                 objectSelector      : '.gd-med-tb-create',
//                 // текст описания шага
//                 textHtml            : 'Для начала процедуры создания проекта необходимо нажать кнопку создания проекта',
//                 // стиль для объекта текста (если нужно разместить в ином месте)
//                 textClass           : 'bottom-center',
//                 // выводить стрелку                                 *необязателен
//                 showArrow           : true,
//                 // тип стрелки (v-arrow вертикальная или h-arrow горизонтальная)        *необязателен
//                 arrowType           : 'v-arrow',
//                 // текст стрелки                                    *необязателен
//                 arrowText           : 'Кнопка создания проекта',
//                 // подсветка внутреннего объекта                    *необязателен
//                 innerSelect         : '.gd-med-tb-create',

//                 // скрипт перед выполнением шага                    *необязателен
//                 scriptBeforeShow    : (ds)=>ds('med', 'clearList'),
//                 // скрипт перехода назад                            *необязателен
//                 scriptBack          : null,
//                 // скрипт после выполнения шага                     *необязателен
//                 scriptNext          : null
//             },

//             // открываем область
//             {
//                 type                : 'step',
//                 objectSelector      : '.gd-prop',
//                 textHtml            : 'Открывается область свойств с формой создания проекта',
//                 textClass           : 'bottom-center',
//                 scriptBack          : ()=>qs('.gd-prp-close').click(), // закрыть меню
//                 scriptBeforeShow    : ()=>qs('.gd-med-tb-create').click(), // Открыть меню
//             },

//             // заполняем объект
//             {
//                 type                : 'step',
//                 objectSelector      : '.gd-prop',
//                 textHtml            : 'Заполняем поля',
//                 textClass           : 'bottom-center',
//                 scriptBack          : (ds)=>ds('med', 'create'),                
//                 scriptBeforeShow    : (ds)=>ds('med', 'createFilled'),                
//             },

//             // заполняем объект и фокус на имя
//             {
//                 type                : 'step',
//                 objectSelector      : '.gd-prp-edt-name',
//                 textHtml            : 'Заполняем имя проекта<br><b>Это обязательное для заполнения поле</b>',
//                 textClass           : 'bottom-center',
//                 showArrow           : true,
//                 arrowText           : 'Имя проекта<br>Обязательно для заполнения',
//             },

//             // фокус на expired
//             {
//                 type                : 'step',
//                 objectSelector      : '.gd-prp-edt-expired',
//                 textHtml            : 'При необходимости, заполняем дату дедлайна проекта',
//                 textClass           : 'bottom-center',
//                 showArrow           : true,
//                 arrowText           : 'Дедлайн проекта',
//             },

//             // фокус на description
//             {
//                 type                : 'step',
//                 objectSelector      : '.gd-prp-edt-description',
//                 textHtml            : 'Заполняем описание проекта',
//                 textClass           : 'bottom-center',
//                 showArrow           : true,
//                 arrowText           : 'Описание',
//             },

//             // фокус на Comment
//             {
//                 type                : 'step',
//                 objectSelector      : '.gd-prp-comment',
//                 textHtml            : 'Указываем комментарий к проекту',
//                 textClass           : 'bottom-center',
//                 showArrow           : true,
//                 arrowText           : 'Комментарий',
//             },

//             // фокус на кнопку применения изменений
//             {
//                 type                : 'step',
//                 objectSelector      : '.gd-prp-bt-apply',
//                 textHtml            : 'Завершаем процедуру создания объекта нажатием на соответствующую кнопку',
//                 textClass           : 'bottom-center',
//                 showArrow           : true,
//                 arrowText           : 'Создать объект'
//             },

//             // показываем кнопку закрытия внизу
//             {
//                 type                : 'step',
//                 objectSelector      : '.gd-prp-bt-close',
//                 textHtml            : 'Отмена создания объекта',
//                 textClass           : 'bottom-center',
//                 showArrow           : true,
//                 arrowType           : 'h-arrow',
//                 arrowText           : 'Отмена'
//             },            
            
//             // показываем кнопку закрытия вверху
//             {
//                 type                : 'step',
//                 objectSelector      : '.gd-prp-close',
//                 textHtml            : 'Отмена создания объекта',
//                 textClass           : 'bottom-center',
//                 showArrow           : true,
//                 arrowText           : 'Отмена'
//             },


//         ]
//     }
// }