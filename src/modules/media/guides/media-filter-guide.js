export default {
    med_filter: {        
        sectionPath         : 'media',
        prepareScript       : (ds)=>{
            ds('sys', 'clear')
            ds('med', 'fillList')
        },
        features            : ['ft_medRead', 'ft_medShowSection'],
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


            // столбец - vms
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-vms',
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-tbcol-status input').click(), // назад: открываем окно status
                scriptNext          : ()=>qs('.gd-tbcol-vms button').click(), // вперед: открываем окно vms
            },
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-vms-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-vms-filter .gd-filter-inputs',
                scriptBack          : ()=>qs('.gd-tbcol-vms button').click(), // назад: закрываем окно vms
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-vms-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-vms-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-vms button').click(), // вперед: закрываем окно vms
            }, 


            // столбец - location
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-location',
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-tbcol-vms button').click(),    // назад: открываем окно vms
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


            // столбец - size
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-size',
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-tbcol-location button').click(),     // назад: открываем окно location
                scriptNext          : ()=>qs('.gd-tbcol-size button').click(), // вперед: открываем окно size
            },
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-size-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-size-filter .gd-filter-inputs',
                scriptBack          : ()=>qs('.gd-tbcol-size button').click(), // назад: закрываем окно size
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-size-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-size-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-size button').click(), // вперед: закрываем окно size
            }, 



            // столбец - created
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-created',
                showArrow           : true,
                scriptBack          : ()=>qs('.gd-tbcol-size button').click(),      // назад: открываем окно size
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
                scriptNext          : ()=>{
                    qs('.gd-tbcol-created button').click() // вперед: закрываем окно price
                    qs('.gd-tb-filter').click()  // закрываем фильтры
                },
                returnScript        : (ds)=>{
                    ds('med', 'fillList')
                    qs('.gd-tb-filter').click()
                    setTimeout(()=>qs('.gd-tbcol-created button').click(), 100)
                }
            }, 

        ]
    }
}