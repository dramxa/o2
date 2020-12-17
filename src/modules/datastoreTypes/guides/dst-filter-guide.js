export default {
    dst_filter: {        
        name                : 'Фильтры таблицы типов хранилищ данных',
        description         : 'Данный гайд расскажет как использовать фильтры в таблице типов хранилищ данных',
        sectionPath         : 'dstypes',
        features            : ['ft_dstRead', 'ft_dstShowSection'],
        prepareScript       :  (ds)=>{
            isNullOrUndefined(qs('.gd-prp-close'), { noFnc: v=>v.click() })
            ds('dst', 'fillList')
        },
        steps               : [
            // показываем кнопку создания
            {
                // тип, если guide, значит шаги копируются из гайда с кодом code
                type                : 'step',
                // селектор объекта, который нужно подсветить
                objectSelector      : '.gd-tb-filter',
                // текст описания шага
                textHtml            : 'Кнопка включения фильтрации значений в таблице по столбцам',
                // выводить стрелку                                 *необязателен
                showArrow           : true,
                // тип стрелки (v-arrow вертикальная или h-arrow горизонтальная)        *необязателен
                arrowType           : 'v-arrow',
                // текст стрелки                                    *необязателен
                arrowText           : 'Вызов фильтров',
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
                textHtml            : 'В режиме фильтрации доступна информация о количестве объектов в списке',
                showArrow           : true,
                arrowText           : 'Количество выбранных объектов',
                scriptBack          : ()=>qs('.gd-tb-filter').click(), // закрываем фильтры
            },


            // столбец - name
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-name',
                textHtml            : 'Фильтрация по названию сети',
                showArrow           : true,
                arrowText           : 'Фильтр по названию',
            },


            // столбец - status
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-status',
                textHtml            : 'Фильтр по статусу сети',
                showArrow           : true,
                arrowText           : 'Фильтр по статусу',
                scriptNext          : ()=>qs('.gd-tbcol-status input').click(), // вперед: открываем окно status
            },            
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-status-filter',
                textHtml            : 'Список доступных статусов для фильтрации',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Список статусов',
                innerSelect         : '.gd-tbcol-status-filter .gd-filter-list',
                scriptBack          : ()=>qs('.gd-tbcol-status input').click(), // назад: закрываем окно status
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-status-filter',
                textHtml            : 'Кнопки очистки фильтра или применения выбранных значений',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Очистить или применить',
                innerSelect         : '.gd-tbcol-status-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-status input').click(), // вперед: закрываем окно status
            }, 


            // столбец - location
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-location',
                textHtml            : 'Фильтр по location',
                showArrow           : true,
                arrowText           : 'Фильтр по location',
                scriptBack          : ()=>qs('.gd-tbcol-status input').click(), // назад: открываем окно status
                scriptNext          : ()=>qs('.gd-tbcol-location button').click(), // вперед: открываем окно location
            },            
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-location-filter',
                textHtml            : 'Заполняем фильтр location выбирая нужные',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Списки location',
                innerSelect         : '.gd-tbcol-location-filter .gd-filter-inputs',
                scriptBack          : ()=>qs('.gd-tbcol-location button').click(), // назад: закрываем окно location
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-location-filter',
                textHtml            : 'Кнопки очистки фильтра или применения выбранных значений',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Очистить или применить',
                innerSelect         : '.gd-tbcol-location-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-location button').click(), // вперед: закрываем окно location
            }, 


            
            // столбец - vms
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-vms',
                textHtml            : 'Фильтр по количеству виртуальных машин использующих сеть',
                showArrow           : true,
                arrowText           : 'Фильтр по количеству виртуальных машин',
                scriptBack          : ()=>qs('.gd-tbcol-location button').click(), // назад: закрываем окно location
                scriptNext          : ()=>qs('.gd-tbcol-vms button').click(), // вперед: открываем окно vms
            },
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-vms-filter',
                textHtml            : 'Заполняем диапазон фильтрации',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Заполняем диапазон',
                innerSelect         : '.gd-tbcol-vms-filter .gd-filter-inputs',
                scriptBack          : ()=>qs('.gd-tbcol-vms button').click(), // назад: закрываем окно vms
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-vms-filter',
                textHtml            : 'Кнопки очистки фильтра или применения выбранных значений',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Очистить или применить',
                innerSelect         : '.gd-tbcol-vms-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-vms button').click(), // вперед: закрываем окно vms
            }, 


            // столбец - type
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-type',
                textHtml            : 'Фильтр по типу сети',
                showArrow           : true,
                arrowText           : 'Фильтр по типу',
                scriptBack          : ()=>qs('.gd-tbcol-vms button').click(), // назад: открываем окно vms
                scriptNext          : ()=>qs('.gd-tbcol-type input').click(), // вперед: открываем окно type
            },            
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-type-filter',
                textHtml            : 'Список доступных статусов для фильтрации',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Список статусов',
                innerSelect         : '.gd-tbcol-type-filter .gd-filter-list',
                scriptBack          : ()=>qs('.gd-tbcol-type input').click(), // назад: закрываем окно type
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-type-filter',
                textHtml            : 'Кнопки очистки фильтра или применения выбранных значений',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Очистить или применить',
                innerSelect         : '.gd-tbcol-type-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-type input').click(), // вперед: закрываем окно type
            }, 

            
            // столбец - comment
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-comment',
                textHtml            : 'Фильтрация по коментарию',
                showArrow           : true,
                arrowText           : 'Фильтр по коментарию',
                scriptBack          : ()=>qs('.gd-tbcol-type input').click(), // назад: открываем окно type
            },


            // столбец - created
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-created',
                textHtml            : 'Фильтр по дате создания объекта',
                showArrow           : true,
                arrowText           : 'Фильтр по дате создания',
                scriptNext          : ()=>qs('.gd-tbcol-created button').click(), // вперед: открываем окно created
            },
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-created-filter',
                textHtml            : 'Заполняем диапазон фильтрации',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Заполняем диапазон',
                innerSelect         : '.gd-tbcol-created-filter .gd-filter-inputs',
                scriptBack          : ()=>qs('.gd-tbcol-created button').click(), // назад: закрываем окно created
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-created-filter',
                textHtml            : 'Кнопки очистки фильтра или применения выбранных значений',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Очистить или применить',
                innerSelect         : '.gd-tbcol-created-filter .gd-filter-control',
                scriptNext          : ()=>{
                    qs('.gd-tbcol-created button').click() // вперед: закрываем окно created
                    qs('.gd-tb-filter').click()  // закрываем фильтры
                },
                returnScript        : (ds)=>{
                    ds('dst', 'fillList')
                    qs('.gd-tb-filter').click()
                    setTimeout(()=>qs('.gd-tbcol-created button').click(), 100)
                }
            }, 

        ]
    }
}