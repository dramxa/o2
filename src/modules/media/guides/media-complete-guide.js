export default {
    // гайд по всему разделу, должен включать в себя все гайды раздела
    med_guide: {
        sectionPath  : 'media',
        prepareScript: (ds)=>{
            ds('sys', 'clear')
            ds('med', 'clearList')
        },
        features     : ['ft_medShowSection'],
        childCodes   : [
            'med_tb',
            'med_filter',
            'med_dataTable',
            'med_crt',         
            'med_prp',
            'med_edt',
            'med_del',
            'med_imprt',
        ],
        
        // здесь дублируется список, но могут быть промежуточные шаги
        steps        : [ 
            { type : 'guide', code : 'med_tb'         },
            { type : 'guide', code : 'med_filter'     },
            { type : 'guide', code : 'med_dataTable'  },
            { type : 'guide', code : 'med_crt'        },
            { type : 'guide', code : 'med_prp'        },
            { type : 'guide', code : 'med_edt'        },
            { type : 'guide', code : 'med_del'        },
            { type : 'guide', code : 'med_imprt'      },
                 
        ]
    },
}