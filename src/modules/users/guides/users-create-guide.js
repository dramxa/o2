export default {
    usr_crt: {        
        sectionPath         : 'users',
        prepareScript       : (ds)=>{
            ds('sys', 'clear')
            ds('usr', 'clearList');
            ds('role', 'fillList');
        },        

        features            : ['ft_usrCreate'],
                
        steps               : [
            // показываем кнопку создания
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-tb-create',
                // текст описания шага
                // стиль для объекта текста (если нужно разместить в ином месте)
                textClass           : 'bottom-center',
                // выводить стрелку                                 *необязателен
                showArrow           : true,
                // тип стрелки (v-arrow вертикальная или h-arrow горизонтальная)        *необязателен
                arrowType           : 'v-arrow',
                // текст стрелки                                    *необязателен
                // подсветка внутреннего объекта                    *необязателен
                innerSelect         : '.gd-tb-create',
                // скрипт перед выполнением шага                    *необязателен

                // скрипт перехода назад                            *необязателен
                scriptBack          : null,
                // скрипт после выполнения шага                     *необязателен
                scriptNext          : null
            },

            // открываем область
            {
                type                : 'step',
                objectSelector      : '.gd-prop',
                textClass           : 'bottom-center',
                scriptBack          : ()=>qs('.gd-prp-close').click(), // закрыть меню
                scriptBeforeShow    : ()=>qs('.gd-tb-create').click(), // Открыть меню
            },

            // заполняем объект
            {
                type                : 'step',
                objectSelector      : '.gd-prop',
                textClass           : 'bottom-center',
                scriptBack          : (ds)=>ds('usr', 'create'),                
                scriptBeforeShow    : (ds)=>ds('usr', 'createFilled'),                
            },

            // заполняем объект и фокус на имя
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-name',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // заполняем объект и фокус на фамилию
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-lastname',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // заполняем объект и фокус на отчество
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-middlename',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // заполняем объект и фокус на email
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-email',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // заполняем объект и фокус на login
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-login',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // заполняем объект и фокус на password
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-password',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // заполняем объект и фокус на status
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-status',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // заполняем объект и фокус на roles
            {
                type                : 'step',
                objectSelector      : '.gd-prp-roles',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на кнопку применения изменений
            {
                type                : 'step',
                objectSelector      : '.gd-prp-bt-apply',
                textClass           : 'bottom-center',
                showArrow           : true,
            },

            // показываем кнопку закрытия внизу
            {
                type                : 'step',
                objectSelector      : '.gd-prp-bt-close',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },            
            
            // показываем кнопку закрытия вверху
            {
                type                : 'step',
                objectSelector      : '.gd-prp-close',
                textClass           : 'bottom-center',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-prp-close').click(), // закрыть меню
                returnScript        : (ds) => {
                    ds('usr', 'clearList');
                    setTimeout(()=>{
                        qs('.gd-tb-create').click()
                        ds('usr', 'createFilled');
                    }, 100);
                } 
            },


        ]
    }
}