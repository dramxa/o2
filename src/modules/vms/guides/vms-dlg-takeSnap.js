export default {
    vm_takeSnap: {        
        sectionPath         : 'vms',
        features            : ['ft_snapCreate'],
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
                scriptBeforeShow    : (ds)=>{
                    ds('sys', 'clear')
                    ds('vm', 'fillList'); // заполняем список
                    ds('sys', 'attachListClasses') // заполняем классами ячейки добавленной строки
                    qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button');
                },
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // Открыть меню
            },

            // контекстное меню таблицы - TakeSnap 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-snapTake', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), 
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-snapTake').click(),
            },

            // Окно - TakeSnap - имя снепшота
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-snpCrt',
                innerSelect         : '.gd-dlg-snpCrt-name', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>{
                    qs('.gd-dlg-snpCrt .gd-dlg-close').click();
                    qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button');
                    qs('.gd-tb-row-item-menu-btn').click();
                },
                scriptBeforeShow    : ()=>{
                    setTimeout(() => {
                        qs('.gd-dlg-snpCrt').parentElement.style.marginTop = '-20%'
                    }, 100); // на открытие
                }
            },

             // Окно - TakeSnap - description
             {
                type                : 'step',
                objectSelector      : '.gd-dlg-snpCrt',
                innerSelect         : '.gd-dlg-snpCrt-description', 
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // Окно - TakeSnap - memory
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-snpCrt',
                innerSelect         : '.gd-dlg-snpCrt-memory', 
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // Окно - TakeSnap - quiesce
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-snpCrt',
                innerSelect         : '.gd-dlg-snpCrt-quiesce', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptNext          : ()=>qs('.gd-dlg-snpCrt .gd-dlg-close').click(),
                returnScript        : (ds)=>{
                    ds('sys', 'clear')
                    ds('vm', 'createSnapshotDialog'); 
                    setTimeout(() => {
                        qs('.gd-dlg-snpCrt').parentElement.style.marginTop = '-20%'
                    }, 100); // на открытие
                },
            },
           
        ]
    }
}