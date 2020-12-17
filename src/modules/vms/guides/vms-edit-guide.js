export default {
    vm_edt: {
        sectionPath         : 'vms',
        features            : ['ft_vmUpdate'],
        steps               : [
            // показываем кнопку создания
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-table',
                // скрипт перед выполнением шага                    *необязателен
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').classList.remove('visible-row-menu-button'),
                scriptBeforeShow    : (ds)=>{
                    isNullOrUndefined(qs('.gd-prp-close'), { noFnc: v=>v.click() })
                    ds('vm' , 'fillList'); // заполняем список
                    setTimeout(() => {
                        qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button');
                     }, 50)
                }
            },

            // контекстное меню таблицы - свойства 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-editAdv', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // закрыть меню
                scriptBeforeShow    : ()=>qs('.gd-tb-row-item-menu-btn').click(), // Открыть меню
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-prop').click(), // закрыть меню
            },

            // открываем область
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-btn',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>qs('.gd-prp-close').click(), // закрыть меню
                scriptNext          : ()=>qs('.gd-prp-edt-btn').click(), 
                //scriptBeforeShow    : ()=>qs('.gd-tb-create').click(), // Открыть меню
            },

            // открываем область
            {
                type                : 'step',
                objectSelector      : '.gd-prop',
                textClass           : 'bottom-center',
                scriptBack          : ()=>qs('.gd-prp-close').click(), // закрыть меню
                //scriptBeforeShow    : ()=>qs('.gd-tb-create').click(), // Открыть меню
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
                scriptNext          : ()=>qs('.editable-vm-property .vb-content').scroll(0,qs('.gd-prp-edt-storage').offsetTop)
            },

            // заполняем объект и фокус на storage
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-storage',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptNext          : ()=>qs('.editable-vm-property .vb-content').scroll(0,qs('.gd-prp-edt-networks').offsetTop)
            },

            // заполняем объект и фокус на networks
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-networks',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptNext          : ()=>qs('.editable-vm-property .vb-content').scroll(0,qs('.gd-prp-edt-media').offsetTop)
            },

            // заполняем объект и фокус на media
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-media',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptNext          : ()=>qs('.editable-vm-property .vb-content').scroll(0,qs('.gd-prp-edt-comment').offsetTop)
            },

            // заполняем объект и фокус на comment
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-comment',
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
            },


        ]
    }
}