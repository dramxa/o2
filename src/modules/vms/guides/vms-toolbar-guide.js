export default {
    vm_tb: {        
        sectionPath         : 'vms',
        features            : ['ft_vmRead', 'ft_vmShowSection'],
        steps               : [
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-tb-search',
                // текст описания шага
                // выводить стрелку
                showArrow           : true,
                // тип стрелки (v-arrow вертикальная или h-arrow горизонтальная)        *необязателен
                arrowType           : 'v-arrow',
                // текст стрелки
                // скрипт перед выполнением шага
                scriptBeforeShow    : null, 
                // скрипт перехода назад
                scriptBack          : null,
                // скрипт после выполнения шага
                scriptNext          : null,

                innerSelect         : '.gd-tb-search',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-filter',
                showArrow           : true,
                innerSelect         : '.gd-tb-filter',
            },
            
            {
                type                : 'step',
                objectSelector      : '.gd-tb-console',
                showArrow           : true,
                innerSelect         : '.gd-tb-console',
                feature             : 'ft_vmConsole',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-run',
                showArrow           : true,
                innerSelect         : '.gd-tb-run',
                feature             : 'ft_vmChangePowerState',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-suspend',
                showArrow           : true,
                innerSelect         : '.gd-tb-suspend',
                feature             : 'ft_vmChangePowerState',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-stop',
                showArrow           : true,
                innerSelect         : '.gd-tb-stop',
                feature             : 'ft_vmChangePowerState',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-reboot',
                showArrow           : true,
                innerSelect         : '.gd-tb-reboot',
                feature             : 'ft_vmChangePowerState',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-create',
                showArrow           : true,
                innerSelect         : '.gd-tb-create',
                feature             : 'ft_vmCreate',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-menu-btn',
                showArrow           : true,
                innerSelect         : '.gd-tb-menu-btn',
                scriptNext          : ()=>qs('.gd-tb-menu-btn').click(), // закрыть меню
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-menu',
                innerSelect         : '.gd-tb-menu-clone',
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_vmClone',
                scriptBack          : ()=>qs('.gd-tb-menu-btn').click(), // закрыть меню
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-menu',
                innerSelect         : '.gd-tb-menu-migration',
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_vmMigration',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-menu',
                innerSelect         : '.gd-tb-menu-save-template',
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_vmCopyToTemplate',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-menu',
                innerSelect         : '.gd-tb-menu-csv',
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-menu',
                innerSelect         : '.gd-tb-menu-delete',
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_vmDelete',
                scriptNext          : ()=>qs('.gd-tb-menu-btn').click(),
                returnScript        : ()=>qs('.gd-tb-menu-btn').click()
            },
        ]
    }
}