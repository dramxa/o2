export default {
    vm_migration: {        
        sectionPath         : 'vms',
        prepareScript       : (ds)=>{
            ds('sys', 'clear');
            ds('vm', 'fillList'); // заполняем список
        },
        features            : ['ft_vmMigration'],
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
                innerSelect         : '.gd-tb-row-item-menu-migrate', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), 
                scriptNext          : ()=>{
                    qs('.gd-tb-row-item-menu-migrate').click()
                    setTimeout(() => {
                        qs('.gd-dlg-migrate').parentElement.style.marginTop = '-20%'
                    }, 100); // на открытие
                }
            },

            // Окно - migration - location
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-migrate',
                innerSelect         : '.gd-dlg-migrate-location', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>{
                    qs('.gd-dlg-migrate .gd-dlg-close').click();
                    qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button');
                    qs('.gd-tb-row-item-menu-btn').click();
                },
            },

             // Окно - migration - project
             {
                type                : 'step',
                objectSelector      : '.gd-dlg-migrate',
                innerSelect         : '.gd-dlg-migrate-project', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowPosition       : 'left',
            },

            // Окно - migration - group
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-migrate',
                innerSelect         : '.gd-dlg-migrate-group', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowPosition       : 'right',
                scriptNext          : ()=>qs('.gd-dlg-migrate .gd-dlg-close').click(),
                returnScript        : (ds)=>{
                    ds('sys', 'clear');
                    ds('vm', 'showDlg', 'migrateVmDialog'); 
                    setTimeout(() => {
                        qs('.gd-dlg-migrate').parentElement.style.marginTop = '-20%'
                    }, 100); // на открытие
                },
            },
           
        ]
    }
}