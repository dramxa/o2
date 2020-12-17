export default {
    org_filter: {        
        sectionPath    : 'orgs',
        prepareScript  : (ds)=>{
            ds('sys', 'clear')
            ds('org', 'fillList')
        },
        features       : ['ft_orgRead', 'ft_orgShowSection'],
        steps          : [
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
            

            // столбец - projects
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-projects',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-tbcol-projects button').click(), // вперед: открываем окно projects
                scriptBack          : ()=>qs('.gd-tbcol-status input').click(), // назад: открываем окно status
            },
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-projects-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-projects-filter .gd-filter-inputs',
                scriptBack          : ()=>qs('.gd-tbcol-projects button').click(), // назад: закрываем окно projects
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-projects-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-projects-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-projects button').click(), // вперед: закрываем окно projects
            }, 
            

            // столбец - groups
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-groups',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-tbcol-groups button').click(), // вперед: открываем окно groups
                scriptBack          : ()=>qs('.gd-tbcol-projects button').click(), // назад: открываем окно projects
            },
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-groups-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-groups-filter .gd-filter-inputs',
                scriptBack          : ()=>qs('.gd-tbcol-groups button').click(), // назад: закрываем окно groups
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-groups-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-groups-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-groups button').click(), // вперед: закрываем окно groups
            }, 
            

            // столбец - created
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-created',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-tbcol-created button').click(), // вперед: открываем окно created
                scriptBack          : ()=>qs('.gd-tbcol-groups button').click(), // назад: открываем окно groups
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
                    qs('.gd-tbcol-created button').click() // вперед: закрываем окно created
                    qs('.gd-tb-filter').click()  // закрываем фильтры
                },
                returnScript        : (ds)=>{
                    ds('org', 'fillList')
                    qs('.gd-tb-filter').click()
                    setTimeout(()=>qs('.gd-tbcol-created button').click(), 100)
                }
            }, 
        ]
    }
}