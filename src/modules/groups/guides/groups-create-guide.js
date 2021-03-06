export default {
    grp_crt: {        
        sectionPath         : 'groups',
        prepareScript       : (ds)=>{
            ds('sys', 'clear')
            ds('grp', 'clearList')
        },

        features    : ['ft_grpCreate'],

        steps               : [
            // показываем кнопку создания
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-tb-create',
                // стиль для объекта текста (если нужно разместить в ином месте)
                textClass           : 'bottom-center',
                // выводить стрелку                                 *необязателен
                showArrow           : true,
                // тип стрелки (v-arrow вертикальная или h-arrow горизонтальная)        *необязателен
                arrowType           : 'v-arrow',
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
                textClass           : 'bottom-center',
                scriptBack          : ()=>qs('.gd-prp-close').click(), // закрыть меню
                scriptBeforeShow    : ()=>qs('.gd-tb-create').click(), // Открыть меню
            },

            // заполняем объект
            {
                type                : 'step',
                objectSelector      : '.gd-prop',
                textClass           : 'bottom-center',
                scriptBack          : (ds)=>ds('grp', 'create'),                
                scriptBeforeShow    : (ds)=>{
                    ds('prj', 'fillList');
                    ds('grp', 'createFilled');
                },                
            },            

            // фокус на имя
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-name',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : (ds)=>ds('grp', 'create'),                
                scriptBeforeShow    : (ds)=>{
                    ds('prj', 'fillList');
                    ds('grp', 'createFilled');
                },                
            },

            // фокус на expired
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-project',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на description
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-description',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус на Comment
            {
                type                : 'step',
                objectSelector      : '.gd-prp-comment',
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
                    ds('grp', 'clearList');
                    setTimeout(()=>{
                        qs('.gd-tb-create').click()
                        ds('grp', 'createFilled');
                    }, 100);
                } 
            },
                       

        ]
    }
}