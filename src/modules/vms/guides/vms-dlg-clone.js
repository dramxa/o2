export default {
    vm_clone: {        
        sectionPath         : 'vms',
        prepareScript       : (ds)=>{
            ds('sys', 'clear')
            ds('vm', 'fillList'); // заполняем список
            ds('sys', 'attachListClasses') // заполняем классами ячейки добавленной строки
        },
        features            : ['ft_vmClone'],
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

            // контекстное меню таблицы - clone 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-clone', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), 
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-clone').click(),
            },

            // Окно - clone - name
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-clone',
                innerSelect         : '.gd-dlg-clone-name', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>{
                    qs('.gd-dlg-clone .gd-dlg-close').click();
                    qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button');
                    qs('.gd-tb-row-item-menu-btn').click();
                },
                scriptBeforeShow    : ()=>{
                    setTimeout(() => {
                        qs('.gd-dlg-clone').parentElement.style.marginTop = '-20%'
                    }, 100); // на открытие
                }
            },

             // Окно - clone - location
             {
                type                : 'step',
                objectSelector      : '.gd-dlg-clone',
                innerSelect         : '.gd-dlg-clone-location', 
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

             // Окно - clone - project
             {
                type                : 'step',
                objectSelector      : '.gd-dlg-clone',
                innerSelect         : '.gd-dlg-clone-project', 
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // Окно - clone - group
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-clone',
                innerSelect         : '.gd-dlg-clone-group', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptNext          : ()=>qs('.gd-dlg-clone .gd-dlg-close').click(),
                returnScript        : (ds)=>{
                    ds('sys', 'clear')
                    ds('vm', 'cloneVmDialog'); 
                    setTimeout(() => {
                        qs('.gd-dlg-clone').parentElement.style.marginTop = '-20%'
                    }, 100); // на открытие
                },
            },
           
        ]
    }
}