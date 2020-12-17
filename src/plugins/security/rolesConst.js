// список Ролей

export default { 
    PlatformAdministrator : {
      id: '6f1c4404-791f-44bb-9aac-e2bda5fa7221',
      permissions: ['vmAdministrationTools', 'netEditVlan']
    },

    Administrator : {
      id: '6f1c4404-791f-44bb-9aac-e2bda5fa7222',
      permissions: [
        'dashboardShow',
        'lmtCreate', 'lmtUpdate', 'lmtDelete', 'lmtRead',
        'lctnRead',
        'prjCreate', 'prjUpdate', 'prjDelete', 'prjRead',
        'grpCreate', 'grpUpdate', 'grpDelete', 'grpRead',        
        'usrCreate', 'usrUpdate', 'usrDelete', 'usrRead',
        'roleRead',
        'medImport', 'medUpdate', 'medDelete', 'medRead',
        'templRead', 'templUpdate', 'templDelete',
        'netCreate', 'netUpdate', 'netDelete', 'netRead',

        'vmCreate' , 'vmRead' , 'vmUpdate', 'vmDelete',
        'vmConsole', 'vmClone', 'vmChangePowerState',

        'vmCopyToTemplate', 'vmConvertToTemplate',

        'snapRead', 'snapCreate', 'snapUpdate', 'snapDelete', 'snapRevert',
        ]
    },

    User: {
        id: '6f1c4404-791f-44bb-9aac-e2bda5fa7223',
        permissions: [
          'dashboardShow',
          'lmtCreate', 'lmtUpdate', 'lmtDelete', 'lmtRead',
          'lctnRead',
          'prjCreate', 'prjUpdate', 'prjDelete', 'prjRead',
          'grpCreate', 'grpUpdate', 'grpDelete', 'grpRead',        
          'usrCreate', 'usrUpdate', 'usrDelete', 'usrRead',
          'roleRead', 
          'medImport', 'medUpdate', 'medDelete', 'medRead',
          'templRead', 'templUpdate', 'templDelete',
          'netCreate', 'netUpdate', 'netDelete', 'netRead',

          'vmCreate' , 'vmRead' , 'vmUpdate', 'vmDelete',
          'vmConsole', 'vmClone', 'vmChangePowerState',

          'vmCopyToTemplate', 'vmConvertToTemplate',

          'snapRead', 'snapCreate', 'snapUpdate', 'snapDelete', 'snapRevert',
        ]
    },

    ReadonlyUser: {
      id: '6f1c4404-791f-44bb-9aac-e2bda5fa7224',
      permissions: [
        'dashboardShow',
        'lmtRead',
        'lctnRead',
        'prjRead',
        'grpRead',        
        'usrRead',
        'roleRead',
        'medRead',
        'templRead',
        'netRead',
        'vmRead' 
        ]
    },

    BillingReport: {
      id: '6f1c4404-791f-44bb-9aac-e2bda5fa7225',
      permissions:[]
    },

    PriceViewer : {
      id: '6f1c4404-791f-44bb-9aac-e2bda5fa7226',
      permissions: [ 'prcRead' ]
    },

    ConsoleAccess : {
      id: '6f1c4404-791f-44bb-9aac-e2bda5fa7227',
      permissions: ['vmConsole']
    }
}