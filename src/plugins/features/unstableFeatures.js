export default [
    {
        code         : 'vmPerformance', 
        name         : 'Show VM Performance', 
        description  : 'Вкладка Performance в мониторинге', 
        enable       : false,
        hiddenOnProd : true,
        features     : ['ft_vmPerformance']
    },   
    
    {
        code         : 'guides', 
        name         : 'Guides', 
        description  : 'UI Guide system', 
        enable       : false,
        hiddenOnProd : true,
        features     : ['ft_guideShow']
    },

    {
        code         : 'uploadManager', 
        name         : 'Uploads', 
        description  : 'UI Upload Manager', 
        enable       : false,
        hiddenOnProd : true,
        features     : ['ft_uploadManager']
    },
    // {
    //     code         : 'dashboard',
    //     name         : 'Dashboard', 
    //     description  : 'Раздел дашбоард', 
    //     enable       : false,
    //     hiddenOnProd : true,
    //     features     : ['ft_dshbShowSection']
    // },

    {
        code         : 'datastoreBalancer',
        name         : 'Datastore Balancer', 
        description  : 'Раздел балансировки датасторов', 
        enable       : false,
        hiddenOnProd : false,
        features     : ['ft_dsShowSection', 'ft_dsCreate', 'ft_dsRead', 'ft_dsUpdate', 'ft_dsDelete']
    },

    {
        code         : 'storageTypes',
        name         : 'Storage Types', 
        description  : 'Раздел Storage Types. Связан с балансировкой датасторов', 
        enable       : false,
        hiddenOnProd : false,
        features     : ['ft_dstShowSection', 'ft_dstCreate', 'ft_dstRead', 'ft_dstUpdate', 'ft_dstDelete']
    },

    {
        code         : 'tasks',
        name         : 'Tasks', 
        description  : 'Раздел Tasks и все что с ним связано', 
        enable       : false,
        hiddenOnProd : true,
        features     : ['ft_tskShowSection', 'ft_tskRead', 'ft_tskAcknowledge']
    },

    {
        code         : 'mediaImport',
        name         : 'Import Media', 
        description  : 'Окно импорта медиа', 
        enable       : false,
        hiddenOnProd : true,
        features     : ['ft_medImport']
    },

    // {
    //     code         : 'saveVmAsTemplate',
    //     name         : 'Save VM as Template', 
    //     description  : 'Сохранение ВМ в шаблоны через клонирование', 
    //     enable       : false,
    //     hiddenOnProd : false,
    //     features     : ['ft_vmCopyToTemplate']
    // },

    // {
    //     code         : 'convertVmToTemplate',
    //     name         : 'Convert VM to Template', 
    //     description  : 'Миграция ВМ в список шаблонов', 
    //     enable       : false,
    //     hiddenOnProd : false,
    //     features     : ['ft_vmConvertToTemplate']
    // },

    {
        code         : 'migrateVm',
        name         : 'Migrate VM', 
        description  : 'Миграция ВМ в другой ресурсный профиль', 
        enable       : false,
        hiddenOnProd : false,
        features     : ['ft_vmMigration']
    }
]

