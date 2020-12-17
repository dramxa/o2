export default {
    prc_del: {        
        sectionPath         : 'pricelists',
        prepareScript       : (ds)=>{
            ds('sys', 'clear')
            ds('prc' , 'fillList'); // заполняем список
        },
        features            : ['ft_prcDelete'],
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

            // контекстное меню таблицы - Удаление 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-delete', 
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
                objectSelector      : '.gd-tb-menu-btn',
                showArrow           : true,
                innerSelect         : '.gd-tb-menu-btn',
                scriptNext          : ()=>qs('.gd-tb-menu-btn').click(), 
            },

            {
                type                : 'step',
                objectSelector      : '.gd-tb-menu',
                innerSelect         : '.gd-tb-menu-delete',
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptNext          : ()=>qs('.gd-tb-menu-btn').click(),  // закрыть меню
                scriptBack          : ()=>qs('.gd-tb-menu-btn').click(),  // закрыть меню
                returnScript        : ()=>qs('.gd-tb-menu-btn').click(), 
            },

        ]
    }
}