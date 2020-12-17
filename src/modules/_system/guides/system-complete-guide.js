export default {
    // гайд по всему разделу, должен включать в себя все гайды раздела
    sys_guide: {
        name         : 'O2 Platform',
        description  : 'Данный гайд расскажет о функциях системы',
        childCodes   : [
            'sys_alarmMenu',
            'sys_errMsg',

            'lctn_guide',

            'org_guide',
            'usr_guide',
            'role_guide',
            'lmt_guide',

            'prj_guide',
            'grp_guide',
            'vm_guide',
            'prc_guide',
            
            'tmpl_guide',
            'med_guide',

            'net_guide',

            'ds_guide',
            'dst_guide',

        ],
        
        // здесь дублируется список, но могут быть промежуточные шаги
        steps        : [ 
             { type : 'guide', code : 'sys_alarmMenu' },
             { type : 'guide', code : 'sys_errMsg'    },

             { type : 'guide', code : 'lctn_guide'    },

             { type : 'guide', code : 'org_guide'     },

             { type : 'guide', code : 'usr_guide'     },
             { type : 'guide', code : 'role_guide'    },
             { type : 'guide', code : 'lmt_guide'     },

             { type : 'guide', code : 'prj_guide'     },
             { type : 'guide', code : 'grp_guide'     },
             { type : 'guide', code : 'vm_guide'      },

             { type : 'guide', code : 'prc_guide'     },
             { type : 'guide', code : 'tmpl_guide'    },
             { type : 'guide', code : 'med_guide'     },
             { type : 'guide', code : 'net_guide'     },

             { type : 'guide', code : 'ds_guide'     },
             { type : 'guide', code : 'dst_guide'     },
        ]
    },
}