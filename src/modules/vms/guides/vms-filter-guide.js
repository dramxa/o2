export default {
    vm_filter: {        
        sectionPath         : 'vms',
        prepareScript       : (ds)=>{
            ds('sys', 'clear')
            ds('vm', 'fillList')
        },

        features            : ['ft_vmRead', 'ft_vmShowSection'],

        steps               : [
            // показываем кнопку создания
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-tb-filter',
                // текст описания шага
                // выводить стрелку                                 *необязателен
                showArrow           : true,
                // тип стрелки (v-arrow вертикальная или h-arrow горизонтальная)        *необязателен
                arrowType           : 'v-arrow',
                // текст стрелки                                    *необязателен
                // подсветка внутреннего объекта                    *необязателен
                innerSelect         : '.gd-tb-filter',
                // скрипт перед выполнением шага                    *необязателен
                scriptBeforeShow    : null,
                // скрипт перехода назад                            *необязателен
                scriptBack          : null,
                // скрипт после выполнения шага                     *необязателен
                scriptNext          : ()=>qs('.gd-tb-filter').click(),  // открываем фильтры
            },

            // столбец - select
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-select',
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-tb-filter').click(), // закрываем фильтры
            },




            // столбец - state
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-state',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-tbcol-state input').click(), // вперед: открываем окно state
            },
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-state-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-state-filter .gd-filter-list',
                scriptBack          : ()=>qs('.gd-tbcol-state input').click(), // назад: закрываем окно state
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-state-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-state-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-state input').click(), // вперед: закрываем окно state
            }, 




            // столбец - name
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-name',
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-tbcol-state input').click(), // назад: открываем окно state
            },




            // столбец - status
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-status',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-tbcol-status input').click(), // вперед: открываем окно status
            },            
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-status-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-status-filter .gd-filter-list',
                scriptBack          : ()=>qs('.gd-tbcol-status input').click(), // назад: закрываем окно status
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-status-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-status-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-status input').click(), // вперед: закрываем окно status
            }, 






            // столбец - location
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-location',
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-tbcol-status input').click(),    // назад: открываем окно status
                scriptNext          : ()=>qs('.gd-tbcol-location button').click(), // вперед: открываем окно location
            },            
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-location-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-location-filter .gd-filter-inputs',
                scriptBack          : ()=>qs('.gd-tbcol-location button').click(), // назад: закрываем окно location
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-location-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-location-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-location button').click(), // вперед: закрываем окно location
            }, 



            
            // столбец - project
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-project',
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-tbcol-location button').click(), // назад: открываем окно location
            },

            // столбец - group
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-group',
                showArrow           : true,
            },




            // столбец - CPU
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-cpu',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-tbcol-cpu button').click(), // вперед: открываем окно cpu
            },
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-cpu-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-cpu-filter .gd-filter-inputs',
                scriptBack          : ()=>qs('.gd-tbcol-cpu button').click(), // назад: закрываем окно cpu
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-cpu-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-cpu-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-cpu button').click(), // вперед: закрываем окно cpu
            }, 



            // столбец - RAM
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-ram',
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-tbcol-cpu button').click(), // назад: открываем окно cpu
                scriptNext          : ()=>qs('.gd-tbcol-ram button').click(), // вперед: открываем окно ram

            },
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-ram-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-ram-filter .gd-filter-inputs',
                scriptBack          : ()=>qs('.gd-tbcol-ram button').click(), // назад: закрываем окно ram
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-ram-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-ram-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-ram button').click(), // вперед: закрываем окно ram
            }, 





            // столбец - STORAGE
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-storage',
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-tbcol-ram button').click(),     // назад: открываем окно ram
                scriptNext          : ()=>qs('.gd-tbcol-storage button').click(), // вперед: открываем окно storage
            },
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-storage-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-storage-filter .gd-filter-inputs',
                scriptBack          : ()=>qs('.gd-tbcol-storage button').click(), // назад: закрываем окно storage
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-storage-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-storage-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-storage button').click(), // вперед: закрываем окно storage
            }, 




            // столбец - OS
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-os',
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-tbcol-storage button').click(), // назад: открываем окно storage
                scriptNext          : ()=>qs('.gd-tbcol-os input').click(),       // вперед: открываем окно os
            },            
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-os-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-os-filter .gd-filter-list',
                scriptBack          : ()=>qs('.gd-tbcol-os input').click(), // назад: закрываем окно os
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-os-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-os-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-os input').click(), // вперед: закрываем окно os
            }, 




            // столбец - created
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-created',
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-tbcol-os input').click(),      // назад: открываем окно os
                scriptNext          : ()=>qs('.gd-tbcol-created button').click(), // вперед: открываем окно created
            },
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-created-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-created-filter .gd-filter-inputs',
                scriptBack          : ()=>qs('.gd-tbcol-created button').click(), // назад: закрываем окно created
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-created-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-created-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-created button').click(), // вперед: закрываем окно created
            }, 


            
            
            // столбец - price
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-price',
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-tbcol-created button').click(),      // назад: открываем окно created
                scriptNext          : ()=>qs('.gd-tbcol-price-filter-button').click(), // вперед: открываем окно price
            },
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-price-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-price-filter .gd-filter-inputs',
                scriptBack          : ()=>qs('.gd-tbcol-price-filter-button').click(), // назад: закрываем окно price
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-price-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-price-filter .gd-filter-control',
                scriptNext          : ()=>{
                    qs('.gd-tbcol-price-filter-button').click() // вперед: закрываем окно price
                    qs('.gd-tb-filter').click()  // закрываем фильтры
                },
                returnScript        : (ds)=>{
                    qs('.gd-tb-filter').click()
                    setTimeout(() => {
                        qs('.gd-tbcol-price-filter-button').click()
                    }, 100); 
                }
            }, 

        ]
    }
}