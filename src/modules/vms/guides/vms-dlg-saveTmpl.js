export default {
    vm_saveTmpl: {        
        sectionPath         : 'vms',
        prepareScript       : (ds)=>{
            ds('sys', 'clear');
            ds('vm', 'fillList'); // заполняем список
            ds('sys', 'attachListClasses') // заполняем классами ячейки добавленной строки
        },
        features            : ['ft_vmCopyToTemplate'],
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

            // контекстное меню таблицы - saveTmpl 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-toTemplate', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), 
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-toTemplate').click(),
            },

            // Окно - saveTmpl - name
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-saveTmpl',
                innerSelect         : '.gd-dlg-saveTmpl-name', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>{
                    qs('.gd-dlg-saveTmpl .gd-dlg-close').click();
                    qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button');
                    qs('.gd-tb-row-item-menu-btn').click();
                },
                scriptBeforeShow    : ()=>{
                    setTimeout(() => {
                        qs('.gd-dlg-saveTmpl').parentElement.style.marginTop = '-20%'
                    }, 100); // на открытие
                }
            },

             // Окно - saveTmpl - comment
             {
                type                : 'step',
                objectSelector      : '.gd-dlg-saveTmpl',
                innerSelect         : '.gd-dlg-saveTmpl-comment', 
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // Окно - saveTmpl - locked
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-saveTmpl',
                innerSelect         : '.gd-dlg-saveTmpl-locked', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptNext          : ()=>qs('.gd-dlg-saveTmpl .gd-dlg-close').click(),
                returnScript        : (ds)=>{
                    ds('sys', 'clear');
                    ds('vm', 'saveAsTemplate'); 
                    setTimeout(() => {
                        qs('.gd-dlg-saveTmpl').parentElement.style.marginTop = '-20%'
                    }, 100); // на открытие
                },
            },
           
        ]
    }
}