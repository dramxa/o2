export default {
    // гайд по всему разделу, должен включать в себя все гайды раздела
    dst_guide: {
        name         : 'Datastores types',
        description  : 'Данный гайд расскажет какие функции доступны в разделе типов хранилищ данных',
        sectionPath  : 'dstypes',
        features     : ['ft_dstShowSection'],
        prepareScript: (ds)=>{
            isNullOrUndefined(qs('.gd-prp-close'), { noFnc: v=>v.click() })
            ds('dst', 'clearList')
        },

        childCodes   : [
            'dst_tb',
            'dst_filter',
            'dst_dataTable',
            'dst_crt',         
            'dst_prp',
            'dst_edt',
            'dst_del'
        ],
        
        // здесь дублируется список, но могут быть промежуточные шаги
        steps        : [ 
            { type : 'guide', code : 'dst_tb'        },
            { type : 'guide', code : 'dst_filter'    },
            { type : 'guide', code : 'dst_dataTable' },
            { type : 'guide', code : 'dst_crt'       },
            { type : 'guide', code : 'dst_prp'       },
            { type : 'guide', code : 'dst_edt'       },
            { type : 'guide', code : 'dst_del'       }
                 
        ]
    },
}