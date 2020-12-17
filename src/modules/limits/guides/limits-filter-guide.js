export default {
    lmt_filter: {        
        sectionPath         : 'limits',
        prepareScript       :  (ds)=>{
            ds('sys', 'clear')
            ds('lmt', 'fillList')
        },
        features            : ['ft_lmtRead', 'ft_lmtShowSection'],
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

            
            // столбец - location
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-location',
                showArrow           : true,
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


            // столбец - provider
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-provider',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-tbcol-provider input').click(), // вперед: открываем окно provider
                scriptBack          : ()=>qs('.gd-tbcol-location button').click(), // назад: открываем окно location
            },
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-provider-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-provider-filter .gd-filter-list',
                scriptBack          : ()=>qs('.gd-tbcol-provider input').click(), // назад: закрываем окно provider
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-provider-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-provider-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-provider input').click(), // вперед: закрываем окно provider
            }, 
            

            // столбец - created
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-created',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-tbcol-created button').click(), // вперед: открываем окно created
                scriptBack          : ()=>qs('.gd-tbcol-provider input').click(), // назад: открываем окно provider
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
                    ds('lmt', 'fillList')
                    qs('.gd-tb-filter').click()
                    setTimeout(()=>qs('.gd-tbcol-created button').click(), 100)
                }
            }, 
        ]
    }
}