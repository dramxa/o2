export default {
    vm_crt: {        
        sectionPath         : 'vms',
        prepareScript       : (ds)=>{
            ds('sys', 'clear')
            ds('vm', 'clearList');
            ds('lctn', 'fillList');
            ds('lctn', 'setLocation');
        },

        features            : ['ft_vmCreate'],

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
                scriptBack          : (ds)=>ds('vm', 'create'),                
                scriptBeforeShow    : (ds)=>ds('vm', 'createFilled'),                
            },

            // заполняем объект и фокус на имя
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-name',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // заполняем объект и фокус на tags
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-tags',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // заполняем объект и фокус на project
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-project',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // заполняем объект и фокус на group
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-group',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // заполняем объект и фокус на presets
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-presets',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // заполняем объект и фокус на os
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-os',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // заполняем объект и фокус на storage
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-storage',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBeforeShow    : ()=>qs('.editable-vm-property .vb-content').scroll(0,qs('.gd-prp-edt-storage').offsetTop), // Скролим вниз
                scriptBack          : ()=>qs('.editable-vm-property .vb-content').scroll(0,0), // Скролим вверх
            },

            // заполняем объект и фокус на networks
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-networks',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBeforeShow    : ()=>qs('.editable-vm-property .vb-content').scroll(0,qs('.gd-prp-edt-networks').offsetTop), // Скролим вниз
                scriptBack          : ()=>qs('.editable-vm-property .vb-content').scroll(0,qs('.gd-prp-edt-storage').offsetTop), // Скролим вверх
            },

            // заполняем объект и фокус на media
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-media',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBeforeShow    : ()=>qs('.editable-vm-property .vb-content').scroll(0,qs('.gd-prp-edt-media').offsetTop), // Скролим вниз
                scriptBack          : ()=>qs('.editable-vm-property .vb-content').scroll(0,qs('.gd-prp-edt-networks').offsetTop), // Скролим вверх
            },

            // заполняем объект и фокус на comment
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-comment',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBeforeShow    : ()=>qs('.editable-vm-property .vb-content').scroll(0,qs('.gd-prp-edt-comment').offsetTop), // Скролим вниз
                scriptBack          : ()=>qs('.editable-vm-property .vb-content').scroll(0,qs('.gd-prp-edt-media').offsetTop), // Скролим вверх
            },

            // фокус на кнопку применения изменений
            {
                type                : 'step',
                objectSelector      : '.gd-prp-bt-apply',
                textClass           : 'bottom-center',
                showArrow           : true,
            },

            // фокус на кнопку advanced редактора
            {
                type                : 'step',
                objectSelector      : '.gd-prp-bt-advanced',
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
                    ds('vm', 'clearList');
                    setTimeout(()=>{
                        qs('.gd-tb-create').click()
                        ds('vm', 'createFilled');
                    }, 100);
                } 
            },


        ]
    }
}