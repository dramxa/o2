export default [
    {
        code        : 'guideShow',
        name        : 'Show Guides',
        groupName   : 'Guide',
        features    : ['ft_guideShow']
    },

    {
        code        : 'dashboardShow',
        name        : 'Show Dashboard',
        groupName   : 'Dashboard',
        features    : ['ft_dshbShowSection']
    },

    // PlatformAdministrator
    {
        code        : 'vmAdministrationTools',
        name        : 'VmAdministrationTools',
        groupName   : 'PlatformAdministrator',
        features    : ['ft_vmAdministrationTools']
    }, 
    {
        code        : 'netEditVlan',
        name        : 'NetworkEditVlan',
        groupName   : 'PlatformAdministrator',
        features    : ['ft_editNetworkVlan']
    },

    // StorageTypes
    {
        code        : 'dstCreate',
        name        : 'DatastoreTypeCreate',
        groupName   : 'Datastore Type permissions',
        features    : ['ft_dstCreate']
    },
    {
        code        : 'dstRead',
        name        : 'DatastoreTypeRead',
        groupName   : 'Datastore Type permissions',
        features    : ['ft_dstRead', 'ft_dstShowSection']
    },
    {
        code        : 'dstUpdate',
        name        : 'DatastoreTypeUpdate',
        groupName   : 'Datastore Type permissions',
        features    : ['ft_dstUpdate']
    },
    {
        code        : 'dstDelete',
        name        : 'DatastoreTypeDelete',
        groupName   : 'Datastore Type permissions',
        features    : ['ft_dstDelete']
    },

    // DatastoreBalancer
    {
        code        : 'dsCreate',
        name        : 'DatastoreCreate',
        groupName   : 'Datastore Balancer permissions',
        features    : ['ft_dsCreate']
    },
    {
        code        : 'dsRead',
        name        : 'DatastoreRead',
        groupName   : 'Datastore Balancer permissions',
        features    : ['ft_dsRead', 'ft_dsShowSection']
    },
    {
        code        : 'dsUpdate',
        name        : 'DatastoreUpdate',
        groupName   : 'Datastore Balancer permissions',
        features    : ['ft_dsUpdate']
    },
    {
        code        : 'dsDelete',
        name        : 'DatastoreDelete',
        groupName   : 'Datastore Balancer permissions',
        features    : ['ft_dsDelete']
    },


    // Location
    {
        code        : 'lctnEdit',
        name        : 'LocationCreate',
        groupName   : 'Location permissions',
        features    : ['ft_lctnShowSection']
    },
    {
        code        : 'lctnRead',
        name        : 'LocationRead',
        groupName   : 'Location permissions',
        features    : ['ft_lctnRead']
    },
    // {
    //     code        : 'lctnUpdate',
    //     name        : 'LocationUpdate',
    //     groupName   : 'Location permissions',
    //     features    : ['ft_lctnUpdate']
    // },
    // {
    //     code        : 'lctnDelete',
    //     name        : 'LocationDelete',
    //     groupName   : 'Location permissions',
    //     features    : ['ft_lctnDelete']
    // },

    // организации
    {
        code        : 'orgCreate',
        name        : 'OrganizationCreate',
        groupName   : 'Organization permissions',
        features    : ['ft_orgCreate']
    },
    {
        code        : 'orgRead',
        name        : 'OrganizationRead',
        groupName   : 'Organization permissions',
        features    : ['ft_orgRead', 'ft_orgShowSection']
    },
    {
        code        : 'orgUpdate',
        name        : 'OrganizationUpdate',
        groupName   : 'Organization permissions',
        features    : ['ft_orgUpdate']
    },
    {
        code        : 'orgDelete',
        name        : 'OrganizationDelete',
        groupName   : 'Organization permissions',
        features    : ['ft_orgDelete']
    },

    // Роли
    {
        code        : 'roleCreate',
        name        : 'RolesCreate',
        groupName   : 'Roles permissions',
        features    : ['ft_roleCreate']
    },
    {
        code        : 'roleRead',
        name        : 'RolesRead',
        groupName   : 'Roles permissions',
        features    : ['ft_roleRead', 'ft_roleShowSection']
    },
    {
        code        : 'roleUpdate',
        name        : 'RolesUpdate',
        groupName   : 'Roles permissions',
        features    : ['ft_roleUpdate']
    },
    {
        code        : 'roleDelete',
        name        : 'RolesDelete',
        groupName   : 'Roles permissions',
        features    : ['ft_roleDelete']
    },

    // пользователи
    {
        code        : 'usrCreate',
        name        : 'UserCreate',
        groupName   : 'User permissions',
        features    : ['ft_usrCreate']
    },
    {
        code        : 'usrRead',
        name        : 'UserRead',
        groupName   : 'User permissions',
        features    : ['ft_usrRead', 'ft_usrShowSection']
    },
    {
        code        : 'usrUpdate',
        name        : 'UserUpdate',
        groupName   : 'User permissions',
        features    : ['ft_usrUpdate']
    },
    {
        code        : 'usrDelete',
        name        : 'UserDelete',
        groupName   : 'User permissions',
        features    : ['ft_usrDelete']
    },

    // профиль
    {
        code        : 'profUpdate',
        name        : 'ProfileUpdate',
        groupName   : 'Profile permissions',
        features    : ['ft_profUpdate']
    },
    {
        code        : 'profUpdatePassword',
        name        : 'ProfileUpdatePassword',
        groupName   : 'Profile permissions',
        features    : ['ft_profUpdatePassword']
    },

    // проекты
    {
        code        : 'prjCreate',
        name        : 'ProjectCreate',
        groupName   : 'Project permissions',
        features    : ['ft_prjCreate']
    },
    {
        code        : 'prjRead',
        name        : 'ProjectRead',
        groupName   : 'Project permissions',
        features    : ['ft_prjRead', 'ft_prjShowSection']
    },
    {
        code        : 'prjUpdate',
        name        : 'ProjectUpdate',
        groupName   : 'Project permissions',
        features    : ['ft_prjUpdate']
    },
    {
        code        : 'prjDelete',
        name        : 'ProjectDelete',
        groupName   : 'Project permissions',
        features    : ['ft_prjDelete']
    },

    // группы
    {
        code        : 'grpCreate',
        name        : 'GroupCreate',
        groupName   : 'Group permission',
        features    : ['ft_grpCreate']
    },
    {
        code        : 'grpRead',
        name        : 'GroupRead',
        groupName   : 'Group permission',
        features    : ['ft_grpRead', 'ft_grpShowSection']
    },
    {
        code        : 'grpUpdate',
        name        : 'GroupUpdate',
        groupName   : 'Group permission',
        features    : ['ft_grpUpdate']
    },
    {
        code        : 'grpDelete',
        name        : 'GroupDelete',
        groupName   : 'Group permission',
        features    : ['ft_grpDelete']
    },

    // Лимиты
    {
        code        : 'lmtCreate',
        name        : 'LimitsCreate',
        groupName   : 'Limits permission',
        features    : ['ft_lmtCreate']
    },
    {
        code        : 'lmtRead',
        name        : 'LimitsRead',
        groupName   : 'Limits permission',
        features    : ['ft_lmtRead', 'ft_lmtShowSection']
    },
    {
        code        : 'lmtUpdate',
        name        : 'LimitsUpdate',
        groupName   : 'Limits permission',
        features    : ['ft_lmtUpdate']
    },
    {
        code        : 'lmtDelete',
        name        : 'LimitsDelete',
        groupName   : 'Limits permission',
        features    : ['ft_lmtDelete']
    },

    // ВМ 
    {
        code        : 'vmCreate',
        name        : 'VmCreate',
        groupName   : 'Virtual machine permissions',
        features    : ['ft_vmCreate']
    },
    {
        code        : 'vmRead',
        name        : 'VmRead',
        groupName   : 'Virtual machine permissions',
        features    : ['ft_vmRead', 'ft_vmShowSection']
    },
    {
        code        : 'vmUpdate',
        name        : 'VmUpdate',
        groupName   : 'Virtual machine permissions',
        features    : ['ft_vmUpdate']
    },
    {
        code        : 'vmDelete',
        name        : 'VmDelete',
        groupName   : 'Virtual machine permissions',
        features    : ['ft_vmDelete']
    },
    {
        code        : 'vmConsole',
        name        : 'VmConsole',
        groupName   : 'Virtual machine permissions',
        features    : ['ft_vmConsole']
    },
    {
        code        : 'vmClone',
        name        : 'VmClone',
        groupName   : 'Virtual machine permissions',
        features    : ['ft_vmClone']
    },
    {
        code        : 'vmMigration',
        name        : 'Migration VM',
        groupName   : 'Virtual machine permissions',
        features    : ['ft_vmMigration']
    },
    {
        code        : 'vmChangePowerState',
        name        : 'VmChangePowerState',
        groupName   : 'Virtual machine permissions',
        features    : ['ft_vmChangePowerState']
    },

    {
        code        : 'vmCopyToTemplate',
        name        : 'Copy VM To Template',
        groupName   : 'Virtual machine permissions',
        features    : ['ft_vmCopyToTemplate']
    },

    {
        code        : 'vmConvertToTemplate',
        name        : 'Convert VM To Template',
        groupName   : 'Virtual machine permissions',
        features    : ['ft_vmConvertToTemplate']
    },


    // Снепшот
    {
        code        : 'snapRead',
        name        : 'SnapRead',
        groupName   : 'Virtual machine permissions',
        features    : ['ft_snapRead']
    },
    {
        code        : 'snapCreate',
        name        : 'SnapCreate',
        groupName   : 'Virtual machine permissions',
        features    : ['ft_snapCreate']
    },
    {
        code        : 'snapUpdate',
        name        : 'SnapUpdate',
        groupName   : 'Virtual machine permissions',
        features    : ['ft_snapUpdate']
    },
    {
        code        : 'snapDelete',
        name        : 'SnapDelete',
        groupName   : 'Virtual machine permissions',
        features    : ['ft_snapDelete']
    },
    {
        code        : 'snapRevert',
        name        : 'SnapRevert',
        groupName   : 'Virtual machine permissions',
        features    : ['ft_snapRevert']
    },

    // задачи
    {
        code        : 'tskRead',
        name        : 'TaskRead',
        groupName   : 'Task permissions',
        features    : ['ft_tskRead', 'ft_tskShowSection']
    },
    {
        code        : 'tskAcknowledge',
        name        : 'TaskAcknowledge',
        groupName   : 'Task permissions',
        features    : ['ft_tskAcknowledge']
    },

    // прайслисты
    {
        code        : 'prcCreate',
        name        : 'PricelistCreate',
        groupName   : 'Pricelist permissions',
        features    : ['ft_prcCreate']
    },
    {
        code        : 'prcRead',
        name        : 'PricelistRead',
        groupName   : 'Pricelist permissions',
        features    : ['ft_prcRead', 'ft_prcShowSection']
    },
    {
        code        : 'prcUpdate',
        name        : 'PricelistUpdate',
        groupName   : 'Pricelist permissions',
        features    : ['ft_prcUpdate']
    },
    {
        code        : 'prcDelete',
        name        : 'PricelistDelete',
        groupName   : 'Pricelist permissions',
        features    : ['ft_prcDelete']
    },

    // медиа
    {
        code        : 'medImport',
        name        : 'MediaImport',
        groupName   : 'Media permissions',
        features    : ['ft_medImport']
    },
    {
        code        : 'medRead',
        name        : 'MediaRead',
        groupName   : 'Media permissions',
        features    : ['ft_medRead', 'ft_medShowSection']
    },
    {
        code        : 'medUpdate',
        name        : 'MediaUpdate',
        groupName   : 'Media permissions',
        features    : ['ft_medUpdate']
    },
    {
        code        : 'medDelete',
        name        : 'MediaDelete',
        groupName   : 'Media permissions',
        features    : ['ft_medDelete']
    },

    // сети
    {
        code        : 'netCreate',
        name        : 'NetworkCreate',
        groupName   : 'Network permissions',
        features    : ['ft_netCreate']
    },
    {
        code        : 'netRead',
        name        : 'NetworkRead',
        groupName   : 'Network permissions',
        features    : ['ft_netRead', 'ft_netShowSection']
    },
    {
        code        : 'netUpdate',
        name        : 'NetworkUpdate',
        groupName   : 'Network permissions',
        features    : ['ft_netUpdate']
    },
    {
        code        : 'netDelete',
        name        : 'NetworkDelete',
        groupName   : 'Network permissions',
        features    : ['ft_netDelete']
    },

    // шаблоны
    // {
    //     code        : 'templImport',
    //     name        : 'TemplateImport',
    //     groupName   : 'Template permissions'
    // },
    {
        code        : 'templRead',
        name        : 'TemplateRead',
        groupName   : 'Template permissions',
        features    : ['ft_templRead', 'ft_templShowSection']
    },
    {
        code        : 'templUpdate',
        name        : 'TemplateUpdate',
        groupName   : 'Template permissions',
        features    : ['ft_templUpdate']
    },
    {
        code        : 'templDelete',
        name        : 'TemplateDelete',
        groupName   : 'Template permissions',
        features    : ['ft_templDelete']
    }
]

