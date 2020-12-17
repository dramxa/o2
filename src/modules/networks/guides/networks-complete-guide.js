export default {
    // гайд по всему разделу, должен включать в себя все гайды раздела
    net_guide: {
        sectionPath  : 'networks',
        
        prepareScript: (ds)=>{
            ds('sys', 'clear')
            ds('net', 'clearList')
        },

        features     : ['ft_netShowSection'],

        childCodes   : [
            'net_tb',
            'net_filter',
            'net_dataTable',
            'net_crt',         
            'net_prp',
            'net_edt',
            'net_del'
        ],
        
        // здесь дублируется список, но могут быть промежуточные шаги
        steps        : [ 
            { type : 'guide', code : 'net_tb'        },
            { type : 'guide', code : 'net_filter'    },
            { type : 'guide', code : 'net_dataTable' },
            { type : 'guide', code : 'net_crt'       },
            { type : 'guide', code : 'net_prp'       },
            { type : 'guide', code : 'net_edt'       },
            { type : 'guide', code : 'net_del'       }
                 
        ]
    },
}