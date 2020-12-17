export default {
    sys_alarmMenu: {        
        sectionPath         : 'groups',
        prepareScript       : (ds) => {
            ds('sys', 'fillAlarmMenu')
        },

        steps               : [
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-error-menu-btn',
                // выводить стрелку
                showArrow           : true,
                // тип стрелки (v-arrow вертикальная или h-arrow горизонтальная)        *необязателен
                arrowType           : 'v-arrow',
                // скрипт перед выполнением шага
                scriptBeforeShow    : null, 
                // скрипт перехода назад
                scriptBack          : null,
                // скрипт после выполнения шага
                scriptNext          : null,

                innerSelect         : '.gd-error-menu-btn',
                scriptNext          : ()=>qs('.gd-error-menu-btn').click(), 
            },

            {
                type                : 'step',
                objectSelector      : '.gd-error-menu',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowPosition       : 'left',
                innerSelect         : '.gd-error-menu-title',
                scriptBack          : ()=>qs('.gd-error-menu-btn').click(), 
            },

            {
                type                : 'step',
                objectSelector      : '.gd-error-menu',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-error-menu-caption',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-error-menu',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-error-menu-description',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-error-menu',
                innerSelect         : '.gd-error-menu-confirmAll-btn',
                showArrow           : true,
                arrowType           : 'v-arrow',
                scriptNext          : ()=>qs('.gd-error-menu-btn').click(), 
                returnScript        : (ds)=>{
                    qs('.gd-error-menu-btn').click();
                    ds('sys', 'fillAlarmMenu');
                }, 
            },

        ]
    }
}