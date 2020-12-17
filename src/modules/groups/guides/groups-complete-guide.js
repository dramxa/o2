export default {
    // гайд по всему разделу, должен включать в себя все гайды раздела
    grp_guide: {
        sectionPath  : 'groups',
        
        prepareScript: (ds) => {
            ds('sys', 'clear')
            ds('grp', 'clearList')
        },

        features: ['ft_grpShowSection'],

        childCodes   : [
            'grp_tb',
            'grp_filter',
            'grp_dataTable',
            'grp_crt',         
            'grp_prp',
            'grp_edt',
            'grp_del'
        ],
        
        // здесь дублируется список, но могут быть промежуточные шаги
        steps        : [ 
            { type : 'guide', code : 'grp_tb'        },
            { type : 'guide', code : 'grp_filter'    },
            { type : 'guide', code : 'grp_dataTable' },
            { type : 'guide', code : 'grp_crt'       },
            { type : 'guide', code : 'grp_prp'       },
            { type : 'guide', code : 'grp_edt'       },
            { type : 'guide', code : 'grp_del'       }
                 
        ]
    },
}