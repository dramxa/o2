export default {
    // гайд по всему разделу, должен включать в себя все гайды раздела
    lmt_guide: {
        sectionPath  : 'limits',
        prepareScript: (ds)=>{
            ds('sys', 'clear')
            ds('lmt', 'clearList')
        },
        features     : ['ft_lmtShowSection'],
        childCodes   : [
            'lmt_tb',
            'lmt_filter',
            'lmt_dataTable',
            'lmt_crt',         
            'lmt_prp',
            'lmt_edt',
            'lmt_del'
        ],
        
        // здесь дублируется список, но могут быть промежуточные шаги
        steps        : [ 
            { type : 'guide', code : 'lmt_tb'        },
            { type : 'guide', code : 'lmt_filter'    },
            { type : 'guide', code : 'lmt_dataTable' },
            { type : 'guide', code : 'lmt_crt'       },
            { type : 'guide', code : 'lmt_prp'       },
            { type : 'guide', code : 'lmt_edt'       },
            { type : 'guide', code : 'lmt_del'       }
                 
        ]
    },
}