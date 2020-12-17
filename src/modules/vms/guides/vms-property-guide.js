export default {
    vm_prp: {        
        sectionPath         : 'vms',
        prepareScript       : (ds)=>{
            ds('sys', 'clear')
            ds('vm', 'fillList')
        },
        features            : ['ft_vmRead', 'ft_vmShowSection'],
        steps               : [
            // показываем кнопку создания
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-table',
                // текст описания шага
                // скрипт перед выполнением шага                    *необязателен
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').classList.remove('visible-row-menu-button'),
                scriptBeforeShow    : ()=>qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button')
            },

            // контекстное меню таблицы - свойства 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-prop', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // закрыть меню
                scriptBeforeShow    : ()=>qs('.gd-tb-row-item-menu-btn').click(), // Открыть меню
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-prop').click(), // закрыть меню
            },

            // открываем область
            {
                type                : 'step',
                objectSelector      : '.gd-prop',
                textClass           : 'bottom-center',
                scriptBack          : ()=>qs('.gd-prp-close').click(), // закрыть меню
                //scriptBeforeShow    : ()=>qs('.gd-tb-create').click(), // Открыть меню
            },


            // фокус name
            {
                type                : 'step',
                objectSelector      : '.gd-prp-name',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },
            
            // фокус edit mode btn
            {
                type                : 'step',
                objectSelector      : '.gd-prp-edt-btn',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_vmUpdate',
            },

            // фокус на console
            {
                type                : 'step',
                objectSelector      : '.gd-prp-console',
                innerSelect         : '.gd-prp-console',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_vmConsole',
            },
            
            // фокус на меню
            {
                type                : 'step',
                objectSelector      : '.gd-prp-menu-btn',
                innerSelect         : '.gd-prp-menu-btn',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },
            
            // фокус status
            {
                type                : 'step',
                objectSelector      : '.gd-prp-status',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },
            
            // фокус price
            {
                type                : 'step',
                objectSelector      : '.gd-prp-price',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },
            
            // фокус created
            {
                type                : 'step',
                objectSelector      : '.gd-prp-created',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },
            
            // фокус snap
            {
                type                : 'step',
                objectSelector      : '.gd-prp-snap',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },
            
            // фокус pricelist
            {
                type                : 'step',
                objectSelector      : '.gd-prp-pricelist',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },
            
            // фокус tags
            {
                type                : 'step',
                objectSelector      : '.gd-prp-tags',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },
            
            // фокус project
            {
                type                : 'step',
                objectSelector      : '.gd-prp-project',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },
            
            // фокус group
            {
                type                : 'step',
                objectSelector      : '.gd-prp-group',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },
            
            // фокус location
            {
                type                : 'step',
                objectSelector      : '.gd-prp-location',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },
            
            // фокус presets
            {
                type                : 'step',
                objectSelector      : '.gd-prp-presets',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // фокус os
            {
                type                : 'step',
                objectSelector      : '.gd-prp-os',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptNext          : ()=>qs('.non-editable-vm-property .vb-content').scroll(0,qs('.gd-prp-storage').offsetTop)
            },

            // фокус storage
            {
                type                : 'step',
                objectSelector      : '.gd-prp-storage',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptNext          : ()=>qs('.non-editable-vm-property .vb-content').scroll(0,qs('.gd-prp-networks').offsetTop)
                
            },

            // фокус networks
            {
                type                : 'step',
                objectSelector      : '.gd-prp-networks',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptNext          : ()=>qs('.non-editable-vm-property .vb-content').scroll(0,qs('.gd-prp-media').offsetTop)
            },

            // фокус media
            {
                type                : 'step',
                objectSelector      : '.gd-prp-media',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptNext          : ()=>qs('.non-editable-vm-property .vb-content').scroll(0,qs('.gd-prp-comment').offsetTop)
            },

            // фокус comment
            {
                type                : 'step',
                objectSelector      : '.gd-prp-comment',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },


            // фокус close
            {
                type                : 'step',
                objectSelector      : '.gd-prp-close',
                textClass           : 'bottom-center',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptNext          : (ds)=>ds('sys', 'clear'), // закрыть меню
                returnScript        : (ds)=>{
                    ds('vm', 'fillList');
                    ds('vm', 'showDetails');                    
                }
            }
        ]
    }
}