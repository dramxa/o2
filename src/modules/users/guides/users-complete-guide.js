export default {
    // гайд по всему разделу, должен включать в себя все гайды раздела
    usr_guide: {
        sectionPath  : 'users',

        prepareScript: (ds) => {
            ds('sys', 'clear')
            ds('usr', 'clearList')
        },

        features     : ['ft_usrShowSection'],

        childCodes   : [
            'usr_tb'            ,
            'usr_filter'        ,
            'usr_dataTable'     ,
            'usr_crt'           ,         
            'usr_prp'           ,
            'usr_edt'           ,
            'usr_del'           ,
            'usr_menu'          ,
            'usr_profile'       ,
            'usr_chngLockState' ,
        ],
        
        // здесь дублируется список, но могут быть промежуточные шаги
        steps        : [ 
            { type : 'guide', code : 'usr_tb'            },
            { type : 'guide', code : 'usr_filter'        },
            { type : 'guide', code : 'usr_dataTable'     },
            { type : 'guide', code : 'usr_crt'           },
            { type : 'guide', code : 'usr_prp'           },
            { type : 'guide', code : 'usr_edt'           },
            { type : 'guide', code : 'usr_del'           },
            { type : 'guide', code : 'usr_menu'          },
            { type : 'guide', code : 'usr_profile'       },
            { type : 'guide', code : 'usr_chngLockState' },
                 
        ]
    },
}