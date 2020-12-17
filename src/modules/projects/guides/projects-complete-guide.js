export default {
    // гайд по всему разделу, должен включать в себя все гайды раздела
    prj_guide: {
        sectionPath  : 'projects',

        prepareScript: (ds) => {
            ds('sys', 'clear')
            ds('prj', 'clearList')
        },
 
        features     : ['ft_prjShowSection'],
        
        childCodes   : [
            'prj_tb',
            'prj_filter',
            'prj_dataTable',
            'prj_crt',         
            'prj_prp',
            'prj_edt',
            'prj_del'
        ],
        
        // здесь дублируется список, но могут быть промежуточные шаги
        steps        : [ 
            { type : 'guide', code : 'prj_tb'         },
            { type : 'guide', code : 'prj_filter'     },
            { type : 'guide', code : 'prj_dataTable'  },
            { type : 'guide', code : 'prj_crt'        },
            { type : 'guide', code : 'prj_prp'        },
            { type : 'guide', code : 'prj_edt'        },
            { type : 'guide', code : 'prj_del'        }
                 
        ]
    },
}