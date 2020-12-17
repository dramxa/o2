export default {
    sys_errMsg: {        
        sectionPath         : 'groups',
        prepareScript       : (ds) => {
            ds('sys', 'errorMsg');        
        },

        steps               : [
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-dlg-notifyMsg',
                // выводить стрелку
                showArrow           : true,
                // тип стрелки (v-arrow вертикальная или h-arrow горизонтальная)        *необязателен
                arrowType           : 'v-arrow',
                // скрипт перехода назад
                scriptBack          : null,
                // скрипт после выполнения шага
                scriptNext          : null,

                scriptBeforeShow    : (ds)=>{                    
                    setTimeout(() => {
                        qs('.custom-snackbar').style.bottom = '40%'
                    }, 100); // на открытие
                },
                scriptBack          : ()=>qs('.gd-dlg-notifyMsg-close').click(),
            },

            {
                type                : 'step',
                objectSelector      : '.gd-dlg-notifyMsg',
                showArrow           : true,
                innerSelect         : '.gd-dlg-notifyMsg-caption',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-dlg-notifyMsg',
                showArrow           : true,
                innerSelect         : '.gd-dlg-notifyMsg-subjectName',
            },

            {
                type                : 'step',
                objectSelector      : '.gd-dlg-notifyMsg',
                showArrow           : true,
                innerSelect         : '.gd-dlg-notifyMsg-message',
                scriptNext          : ()=>qs('.gd-dlg-notifyMsg-close').click(),
                returnScript       : (ds) => {
                    ds('sys', 'errorMsg');
                    setTimeout(() => {
                        qs('.custom-snackbar').style.bottom = '40%'
                    }, 100); // на открытие
                },
            },

        ]
    }
}