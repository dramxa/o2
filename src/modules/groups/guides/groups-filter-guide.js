export default {
    grp_filter: {        
        sectionPath         : 'groups',
        prepareScript       : (ds)=>{
            ds('sys', 'clear')
            ds('grp', 'fillList')
        },

        features            : ['ft_grpRead', 'ft_grpShowSection'],

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


            // столбец - name
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-name',
                showArrow           : true,
            },

            // столбец - project
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-project',
                showArrow           : true,
            },

            
            // столбец - vm
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-vm',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-tbcol-vm button').click(), // вперед: открываем окно vm
            },
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-vm-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-vm-filter .gd-filter-inputs',
                scriptBack          : ()=>qs('.gd-tbcol-vm button').click(), // назад: закрываем окно vm
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-vm-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-vm-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-vm button').click(), // вперед: закрываем окно vm
            }, 


            // столбец - status
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-status',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-tbcol-status input').click(), // вперед: открываем окно status
                scriptBack          : ()=>qs('.gd-tbcol-vm button').click(), // назад: открываем окно vm
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
            

            // столбец - cpu
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-cpu',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-tbcol-cpu button').click(), // вперед: открываем окно cpu
                scriptBack          : ()=>qs('.gd-tbcol-status input').click(), // назад: открываем окно status
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
            

            // столбец - ram
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-ram',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-tbcol-ram button').click(), // вперед: открываем окно ram
                scriptBack          : ()=>qs('.gd-tbcol-cpu button').click(), // назад: открываем окно cpu
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
            

            // столбец - created
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-created',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-tbcol-created button').click(), // вперед: открываем окно created
                scriptBack          : ()=>qs('.gd-tbcol-ram button').click(), // назад: открываем окно ram
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
                scriptNext          : ()=>qs('.gd-tbcol-price-filter-button').click(), // вперед: открываем окно price
                scriptBack          : ()=>qs('.gd-tbcol-created button').click(), // назад: открываем окно created
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
                    setTimeout(()=>qs('.gd-tbcol-price-filter-button').click(), 200)
                }
            }, 
        ]
    }
}