export default {
    vm_convertTmpl: {        
        sectionPath         : 'vms',
        prepareScript       : (ds)=>{
            ds('sys', 'clear')
            ds('vm', 'fillList'); // заполняем список
            ds('sys', 'attachListClasses') // заполняем классами ячейки добавленной строки
        },
        features            : ['ft_vmConvertToTemplate'],
        steps               : [
            // показываем таблицу
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-table',
                // текст описания шага
                innerSelect         : '.gd-tb-row-item-menu-btn',  
                showArrow           : true,                
                // скрипт перед выполнением шага                    *необязателен
                scriptBeforeShow    : ()=>qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button'),
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // Открыть меню
            },

            // контекстное меню таблицы - migration 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-convertToTemplate', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), 
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-convertToTemplate').click(),
            },

            // Окно - saveTmpl - name
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-convertTmpl',
                innerSelect         : '.gd-dlg-convertTmpl-name', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>{
                    qs('.gd-dlg-convertTmpl .gd-dlg-close').click();
                    qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button');
                    qs('.gd-tb-row-item-menu-btn').click();
                },
                scriptBeforeShow    : ()=>{
                    setTimeout(() => {
                        qs('.gd-dlg-convertTmpl').parentElement.style.marginTop = '-20%'
                    }, 100); // на открытие
                }
            },

             // Окно - saveTmpl - comment
             {
                type                : 'step',
                objectSelector      : '.gd-dlg-convertTmpl',
                innerSelect         : '.gd-dlg-convertTmpl-comment', 
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // Окно - saveTmpl - locked
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-convertTmpl',
                innerSelect         : '.gd-dlg-convertTmpl-locked', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptNext          : ()=>qs('.gd-dlg-convertTmpl .gd-dlg-close').click(),
                returnScript        : (ds)=>{
                    ds('sys', 'clear')
                    ds('vm', 'convertToTemplate'); 
                    setTimeout(() => {
                        qs('.gd-dlg-convertTmpl').parentElement.style.marginTop = '-20%'
                    }, 100); // на открытие
                },
            },
           
        ]
    }
}