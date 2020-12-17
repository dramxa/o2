export default {
    ds_filter: {        
        name                : 'Фильтры таблицы хранилищ данных',
        description         : 'Данный гайд расскажет как использовать фильтры в таблице хранилищ данных',
        sectionPath         : 'datastores',
        features            : ['ft_dsRead', 'ft_dsShowSection'],
        prepareScript       :  (ds)=>{
            isNullOrUndefined(qs('.gd-prp-close'), { noFnc: v=>v.click() })
            ds('ds', 'fillList')
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
                textHtml            : 'Фильтрация по названию хранилища данных',
                showArrow           : true,
                arrowText           : 'Фильтр по названию',
            },


            // столбец - enabled
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-enabled',
                textHtml            : 'Фильтр по статусу хранилища данных',
                showArrow           : true,
                arrowText           : 'Фильтр по статусу',
                scriptNext          : ()=>qs('.gd-tbcol-enabled input').click(), // вперед: открываем окно enabled
            },            
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-enabled-filter',
                textHtml            : 'Список доступных статусов для фильтрации',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Список статусов',
                innerSelect         : '.gd-tbcol-enabled-filter .gd-filter-list',
                scriptBack          : ()=>qs('.gd-tbcol-enabled input').click(), // назад: закрываем окно enabled
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-enabled-filter',
                textHtml            : 'Кнопки очистки фильтра или применения выбранных значений',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Очистить или применить',
                innerSelect         : '.gd-tbcol-enabled-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-enabled input').click(), // вперед: закрываем окно enabled
            }, 

            // столбец - type
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-type',
                textHtml            : 'Фильтр по типу хранилища данных',
                showArrow           : true,
                arrowText           : 'Фильтр по типу',
                scriptBack          : ()=>qs('.gd-tbcol-enabled input').click(),
                scriptNext          : ()=>qs('.gd-tbcol-type input').click(), // вперед: открываем окно type
            },            
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-type-filter',
                textHtml            : 'Список доступных типов для фильтрации',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Список типов',
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


            // столбец - location
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-location',
                textHtml            : 'Фильтр по location',
                showArrow           : true,
                arrowText           : 'Фильтр по location',
                scriptBack          : ()=>qs('.gd-tbcol-type input').click(), // назад: открываем окно type
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
                textHtml            : 'Фильтр по статусу сети',
                showArrow           : true,
                arrowText           : 'Фильтр по статусу',
                scriptBack          : ()=>qs('.gd-tbcol-location button').click(),
                scriptNext          : ()=>qs('.gd-tbcol-vms input').click(), // вперед: открываем окно vms
            },            
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-vms-filter',
                textHtml            : 'Список доступных статусов для фильтрации',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Список статусов',
                innerSelect         : '.gd-tbcol-vms-filter .gd-filter-list',
                scriptBack          : ()=>qs('.gd-tbcol-vms input').click(), // назад: закрываем окно vms
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-vms-filter',
                textHtml            : 'Кнопки очистки фильтра или применения выбранных значений',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Очистить или применить',
                innerSelect         : '.gd-tbcol-vms-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-vms input').click(), // вперед: закрываем окно vms
            }, 

            // столбец - templates
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-templates',
                textHtml            : 'Фильтр по статусу сети',
                showArrow           : true,
                arrowText           : 'Фильтр по статусу',
                scriptBack          : ()=>qs('.gd-tbcol-vms input').click(),
                scriptNext          : ()=>qs('.gd-tbcol-templates input').click(), // вперед: открываем окно templates
            },            
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-templates-filter',
                textHtml            : 'Список доступных статусов для фильтрации',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Список статусов',
                innerSelect         : '.gd-tbcol-templates-filter .gd-filter-list',
                scriptBack          : ()=>qs('.gd-tbcol-templates input').click(), // назад: закрываем окно templates
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-templates-filter',
                textHtml            : 'Кнопки очистки фильтра или применения выбранных значений',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Очистить или применить',
                innerSelect         : '.gd-tbcol-templates-filter .gd-filter-control',
                scriptNext          : ()=>qs('.gd-tbcol-templates input').click(), // вперед: закрываем окно templates
            }, 

            // столбец - media
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-media',
                textHtml            : 'Фильтр по статусу сети',
                showArrow           : true,
                arrowText           : 'Фильтр по статусу',
                scriptBack          : ()=>qs('.gd-tbcol-templates input').click(),
                scriptNext          : ()=>qs('.gd-tbcol-media input').click(), // вперед: открываем окно type
            },            
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-media-filter',
                textHtml            : 'Список доступных статусов для фильтрации',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Список статусов',
                innerSelect         : '.gd-tbcol-media-filter .gd-filter-list',
                scriptBack          : ()=>qs('.gd-tbcol-media input').click(), // назад: закрываем окно media
            }, 
            {
                type                : 'step',
                objectSelector      : '.gd-tbcol-media-filter',
                textHtml            : 'Кнопки очистки фильтра или применения выбранных значений',
                showArrow           : true,
                arrowType           : 'h-arrow',
                arrowText           : 'Очистить или применить',
                innerSelect         : '.gd-tbcol-media-filter .gd-filter-control',
                scriptNext          : ()=>{
                    qs('.gd-tbcol-media input').click(), // вперед: закрываем окно media
                    qs('.gd-tb-filter').click()  // закрываем фильтры
                },
                returnScript        : (ds)=>{
                    ds('ds', 'fillList')
                    qs('.gd-tb-filter').click()
                    setTimeout(()=>qs('.gd-tbcol-media input').click(), 100)
                }
            }, 

        ]
    }
}