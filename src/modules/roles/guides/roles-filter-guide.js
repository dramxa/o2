export default {
    role_filter: {        
        sectionPath         : 'roles',
        prepareScript       : (ds)=>{
            ds('sys', 'clear')
            ds('role', 'fillList')
        },    

        features            : ['ft_roleRead', 'ft_roleShowSection'],

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

            // столбец - description
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-description',
                showArrow           : true,
            },


            // столбец - system
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-system',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-tbcol-system input').click(), // вперед: открываем окно system
            },
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-system-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-system-filter .gd-filter-list',
                scriptBack          : ()=>qs('.gd-tbcol-system input').click(), // назад: закрываем окно system
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-system-filter',
                showArrow           : true,
                arrowType           : 'h-arrow',
                innerSelect         : '.gd-tbcol-system-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-system input').click(), // вперед: закрываем окно system
            }, 
            

            // столбец - created
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-created',
                showArrow           : true,
                scriptNext          : ()=>qs('.gd-tbcol-created button').click(), // вперед: открываем окно created
                scriptBack          : ()=>qs('.gd-tbcol-system input').click(), // назад: открываем окно system
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
                    qs('.gd-tb-filter').click()
                    qs('.gd-tbcol-created button').click()
                }
            }, 
        ]
    }
}