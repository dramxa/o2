export default {
    // гайд по всему разделу, должен включать в себя все гайды раздела
    tmpl_guide: {
        sectionPath  : 'templates',

        prepareScript: (ds) => {
            ds('sys', 'clear')
            ds('tmpl', 'clearList')
        },

        features     : ['ft_templShowSection'],

        childCodes   : [
            'tmpl_tb',
            'tmpl_filter',
            'tmpl_dataTable',
            'tmpl_crt',         
            'tmpl_prp',
            'tmpl_edt',
            'tmpl_del'
        ],
        
        // здесь дублируется список, но могут быть промежуточные шаги
        steps        : [ 
            { type : 'guide', code : 'tmpl_tb'         },
            { type : 'guide', code : 'tmpl_filter'     },
            { type : 'guide', code : 'tmpl_dataTable'  },
            { type : 'guide', code : 'tmpl_crt'        },
            { type : 'guide', code : 'tmpl_prp'        },
            { type : 'guide', code : 'tmpl_edt'        },
            { type : 'guide', code : 'tmpl_del'        }
                 
        ]
    },
}