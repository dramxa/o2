export default {
    med_imprt: {        
        sectionPath         : 'media',
        prepareScript       : (ds)=>{
            ds('sys', 'clear')
            ds('med', 'fillList'); // заполняем список
            ds('sys', 'attachListClasses') // заполняем классами ячейки добавленной строки
        },
        features            : ['ft_medImport'],
        steps               : [
            {
                type                : 'step',
                objectSelector      : '.gd-tb-import',
                showArrow           : true,
                innerSelect         : '.gd-tb-import',
                scriptNext          : ()=>qs('.gd-tb-import').click(),
            },

            // Окно - import - name
            {
                type                : 'step',
                objectSelector      : '.gd-dlg-import',
                innerSelect         : '.gd-dlg-import-name', 
                showArrow           : true,
                arrowType           : 'h-arrow',
                scriptBack          : ()=>{
                    qs('.gd-dlg-import .gd-dlg-close').click();
                    qs('.gd-tb-row-item-menu-btn').classList.add('visible-row-menu-button');
                    qs('.gd-tb-row-item-menu-btn').click();
                },
                scriptBeforeShow    : ()=>{
                    setTimeout(() => {
                        qs('.gd-dlg-import').parentElement.style.marginTop = '-20%'
                    }, 100); // на открытие
                }
            },

             // Окно - import - location
             {
                type                : 'step',
                objectSelector      : '.gd-dlg-import',
                innerSelect         : '.gd-dlg-import-location', 
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

             // Окно - import - form
             {
                type                : 'step',
                objectSelector      : '.gd-dlg-import',
                innerSelect         : '.gd-dlg-import-form', 
                showArrow           : true,
                arrowType           : 'h-arrow',
            },

           
        ]
    }
}