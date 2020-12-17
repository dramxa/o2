export default {
    // гайд по всему разделу, должен включать в себя все гайды раздела
    prc_guide: {
        sectionPath  : 'pricelists',
        prepareScript: (ds)=>{
            ds('sys', 'clear')
            ds('prc', 'clearList')
        },
        features     : ['ft_prcShowSection'],
        childCodes   : [
            'prc_tb',
            'prc_filter',
            'prc_dataTable',
            'prc_crt',         
            'prc_prp',
            'prc_edt',
            'prc_del'
        ],
        
        // здесь дублируется список, но могут быть промежуточные шаги
        steps        : [ 
            { type : 'guide', code : 'prc_tb'        },
            { type : 'guide', code : 'prc_filter'    },
            { type : 'guide', code : 'prc_dataTable' },
            { type : 'guide', code : 'prc_crt'       },
            { type : 'guide', code : 'prc_prp'       },
            { type : 'guide', code : 'prc_edt'       },
            { type : 'guide', code : 'prc_del'       }
                 
        ]
    },
}