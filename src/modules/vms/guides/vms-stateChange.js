export default {
    vm_stateChange: {        
        sectionPath         : 'vms',
        prepareScript       : (ds)=>{
            isNullOrUndefined(qs('.gd-prp-close'), { n: v=>v.click() })
            ds('vm' , 'fillList'); // заполняем список
        },
        features            : ['ft_vmChangePowerState'],
        steps               : [
            // показываем кнопку создания
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-table',
                // текст описания шага
                innerSelect         : '.gd-tb-row-item-menu-btn',
                showArrow           : true,
                arrowType           : 'v-arrow',
                // скрипт перед выполнением шага                    *необязателен
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').classList.remove('visible-row-menu-button'),
                scriptBeforeShow    : ()=>qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button'),
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-btn').click(), 
            },

            // контекстное меню таблицы - Запуск 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-run', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // закрыть меню
                scriptNext          : ()=>{
                    qs('.gd-tb-row-item-menu-btn').click();
                    qs('.gd-tbcol-row-select-cb').click();
                }, // закрыть меню
            },

            // открываем область
            {
                type                : 'step',
                objectSelector      : '.gd-table',
                textClass           : 'bottom-center',
                innerSelect         : '.gd-tbcol-row-select-cell',
                showArrow           : true,
                arrowType           : 'v-arrow',
                scriptBack          : ()=>{
                    qs('.gd-tb-row-item-menu-btn').click(); // Открыть меню
                    qs('.gd-tbcol-row-select-cb').click();
                }, 
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-run',
                showArrow           : true,
                innerSelect         : '.gd-tb-run',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-suspend',
                showArrow           : true,
                innerSelect         : '.gd-tb-suspend',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-stop',
                showArrow           : true,
                innerSelect         : '.gd-tb-stop',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-reboot',
                showArrow           : true,
                innerSelect         : '.gd-tb-reboot',
            },

        ]
    }
}