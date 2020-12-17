export default {
    // гайд по всему разделу, должен включать в себя все гайды раздела
    org_guide: {
        sectionPath  : 'orgs',
        prepareScript: (ds)=>{
            ds('sys', 'clear')
            ds('org', 'clearList')
        },
        features     : ['ft_orgShowSection'],
        childCodes   : [
            'org_tb',
            'org_filter',
            'org_dataTable',
            'org_crt',         
            'org_prp',
            'org_edt',
            'org_del'
        ],
        
        // здесь дублируется список, но могут быть промежуточные шаги
        steps        : [ 
            { type : 'guide', code : 'org_tb'        },
            { type : 'guide', code : 'org_filter'    },
            { type : 'guide', code : 'org_dataTable' },
            { type : 'guide', code : 'org_crt'       },
            { type : 'guide', code : 'org_prp'       },
            { type : 'guide', code : 'org_edt'       },
            { type : 'guide', code : 'org_del'       }
                 
        ]
    },
}