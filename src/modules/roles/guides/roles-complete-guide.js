export default {
    // гайд по всему разделу, должен включать в себя все гайды раздела
    role_guide: {
        sectionPath  : 'roles',

        prepareScript: (ds)=>{
            ds('sys', 'clear')
            ds('role', 'clearList')
        },
        features     : ['ft_roleShowSection'],
        childCodes   : [
            'role_tb',
            'role_filter',
            'role_dataTable',
            'role_crt',         
            'role_prp',
            'role_edt',
            'role_del'
        ],
        
        // здесь дублируется список, но могут быть промежуточные шаги
        steps        : [ 
            { type : 'guide', code : 'role_tb'         },
            { type : 'guide', code : 'role_filter'     },
            { type : 'guide', code : 'role_dataTable'  },
            { type : 'guide', code : 'role_crt'        },
            { type : 'guide', code : 'role_prp'        },
            { type : 'guide', code : 'role_edt'        },
            { type : 'guide', code : 'role_del'        }
                 
        ]
    },
}