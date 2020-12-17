export default {
    // гайд по всему разделу, должен включать в себя все гайды раздела
    vm_guide: {
        sectionPath  : 'vms',

        prepareScript: (ds) => {
            ds('sys', 'clear')
            ds('vm', 'clearList')
        },
        features     : ['ft_vmShowSection'],
        childCodes   : [
            'vm_tb'          ,
            'vm_filter'      ,
            'vm_dataTable'   ,
            'vm_crt'         ,         
            'vm_crtAdv'      ,         
            'vm_prp'         ,
            'vm_edt'         ,
            'vm_del'         ,
            'vm_takeSnap'    ,
            'vm_migration'   ,
            'vm_clone'       ,
            'vm_convertTmpl' ,
            'vm_saveTmpl'    ,
            'vm_stateChange' ,
            'vm_snapMngr'    ,
        ],
        
        // здесь дублируется список, но могут быть промежуточные шаги
        steps        : [ 
            { type : 'guide', code : 'vm_tb'          },
            { type : 'guide', code : 'vm_filter'      },
            { type : 'guide', code : 'vm_dataTable'   },
            { type : 'guide', code : 'vm_crt'         },
            { type : 'guide', code : 'vm_crtAdv'      },
            { type : 'guide', code : 'vm_prp'         },
            { type : 'guide', code : 'vm_edt'         },
            { type : 'guide', code : 'vm_del'         },                 
            { type : 'guide', code : 'vm_takeSnap'    },
            { type : 'guide', code : 'vm_migration'   },
            { type : 'guide', code : 'vm_clone'       },
            { type : 'guide', code : 'vm_convertTmpl' },
            { type : 'guide', code : 'vm_saveTmpl'    },
            { type : 'guide', code : 'vm_stateChange' },
            { type : 'guide', code : 'vm_snapMngr'    },
       ]
    },
}