export default {
    vm_snapMngr: {        
        sectionPath         : 'vms',
        prepareScript       : (ds)=>{
            ds('sys', 'clear')
            ds('vm', 'fillList'); // заполняем список
            ds('prc', 'fillList'); // заполняем список
            ds('sys', 'attachListClasses') // заполняем классами ячейки добавленной строки
        },
        features            : ['ft_snapRead'],
        steps               : [
            // показываем таблицу
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-table',
                innerSelect         : '.gd-tb-row-item-menu-btn',  
                showArrow           : true,                
                // скрипт перед выполнением шага                    *необязателен
                scriptBeforeShow    : ()=>qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button'),
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-btn').click(), // Открыть меню
            },

            // контекстное меню таблицы - snapMngr 
            {
                type                : 'step',
                objectSelector      : '.gd-tb-row-item-menu',
                innerSelect         : '.gd-tb-row-item-menu-snapMgr', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>qs('.gd-tb-row-item-menu-btn').click(), 
                scriptNext          : ()=>qs('.gd-tb-row-item-menu-snapMgr').click(),
            },

            // Окно - snapMngr - список
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-snapMngr',
                innerSelect         : '.gd-dlg-snapMngr-treeview', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>{
                    qs('.gd-dlg-snapMngr .gd-dlg-close').click();
                    qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button');
                    qs('.gd-tb-row-item-menu-btn').click();
                },
                scriptNext          : ()=>document.getElementsByClassName('v-treeview-node__root')[1].click(),
                scriptBeforeShow    : ()=>{
                    setTimeout(() => {
                        qs('.gd-dlg-snapMngr').parentElement.style.marginTop = '-10%'
                    }, 100); // на открытие
                }
            },

             // Окно - snapMngr - name
             {
                type                : 'step',
                objectSelector      : '.gd-dlg-snapMngr',
                innerSelect         : '.gd-dlg-snapMngr-name', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>document.getElementsByClassName('v-treeview-node__root')[1].click(),
            },

            // Окно - snapMngr - price
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-snapMngr',
                innerSelect         : '.gd-dlg-snapMngr-price', 
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // Окно - snapMngr - description
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-snapMngr',
                innerSelect         : '.gd-dlg-snapMngr-description', 
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // Окно - snapMngr - memory
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-snapMngr',
                innerSelect         : '.gd-dlg-snapMngr-memory', 
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // Окно - snapMngr - quiesce
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-snapMngr',
                innerSelect         : '.gd-dlg-snapMngr-quiesce', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptNext          : ()=>document.getElementsByClassName('v-treeview-node__root')[1].querySelectorAll('.v-treeview-node__append button').forEach(e=>e.classList.remove('display-on-hover-row')),
            },
            
            // Окно - snapMngr - revert
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-snapMngr',
                innerSelect         : '.gd-dlg-snapMngr-revert', 
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

            // Окно - snapMngr - delete
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-snapMngr',
                innerSelect         : '.gd-dlg-snapMngr-delete', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_snapDelete',   
            },

            // Окно - snapMngr - deleteAll
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-snapMngr',
                innerSelect         : '.gd-dlg-snapMngr-deleteAll', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_snapDelete',   
            },

            // Окно - snapMngr - takeSnap
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-snapMngr',
                innerSelect         : '.gd-dlg-snapMngr-takeSnap', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                feature             : 'ft_snapCreate', 
                scriptNext          : ()=>qs('.gd-dlg-snapMngr .gd-dlg-close').click(),
                returnScript        : (ds)=>{
                    ds('sys', 'clear')
                    ds('vm', 'snapshotManagerDialog'); 
                    setTimeout(() => {
                        qs('.gd-dlg-snapMngr').parentElement.style.marginTop = '-20%'
                    }, 100); // на открытие
                },
            },


           
        ]
    }
}