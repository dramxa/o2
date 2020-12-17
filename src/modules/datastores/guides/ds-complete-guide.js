export default {
    // гайд по всему разделу, должен включать в себя все гайды раздела
    ds_guide: {
        name         : 'Datastores',
        description  : 'Данный гайд расскажет какие функции доступны в разделе хранилищ данных',
        sectionPath  : 'datastores',

        features    : ['ft_dsShowSection'],
        
        prepareScript: (ds)=>{
            isNullOrUndefined(qs('.gd-prp-close'), { noFnc: v=>v.click() })
            ds('ds', 'clearList')
        },

        childCodes   : [
            'ds_tb',
            'ds_filter',
            'ds_dataTable',
            'ds_crt',         
            'ds_prp',
            'ds_edt',
            'ds_del'
        ],
        
        // здесь дублируется список, но могут быть промежуточные шаги
        steps        : [ 
            { type : 'guide', code : 'ds_tb'        },
            { type : 'guide', code : 'ds_filter'    },
            { type : 'guide', code : 'ds_dataTable' },
            { type : 'guide', code : 'ds_crt'       },
            { type : 'guide', code : 'ds_prp'       },
            { type : 'guide', code : 'ds_edt'       },
            { type : 'guide', code : 'ds_del'       }
                 
        ]
    },
}