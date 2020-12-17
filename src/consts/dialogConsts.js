
export const dialogs = {
    vms_powerOn           : { icon: 'mdi mdi-play'        , color: 'green500', text: 'Are you sure want to run all selected VMs'        },
    vms_suspend           : { icon: 'icon-pause grey500-i', color: 'grey700' , text: 'Are you sure want to suspend all selected VMs'    },
    vms_powerOff          : { icon: 'mdi mdi-stop'        , color: 'grey700' , text: 'Are you sure want to stop all selected VMs'       },
    vms_reboot            : { icon: 'mdi mdi-autorenew'   , color: 'grey700' , text: 'Are you sure want to reset all selected VMs'      },
    vms_softPowerOff      : { icon: 'mdi mdi-stop'        , color: 'grey700' , text: 'Are you sure want to soft stop all selected VMs'  },
    vms_softReboot        : { icon: 'mdi mdi-autorenew'   , color: 'grey700' , text: 'Are you sure want to soft reboot all selected VMs'},
   
    vm_powerOn            : { icon: 'mdi mdi-play'        , color: 'green500', text: 'Are you sure want to run selected VM' },
    vm_softPowerOff       : { icon: 'mdi mdi-stop'        , color: 'grey700' , text: 'Are you sure want to soft stop'       },
    vm_softReboot         : { icon: 'mdi mdi-autorenew'   , color: 'grey700' , text: 'Are you sure want to soft reboot'     },
    vm_powerOff           : { icon: 'mdi mdi-stop'        , color: 'grey700' , text: 'Are you sure want to hard stop'       },
    vm_suspend            : { icon: 'icon-pause grey500-i', color: 'grey700' , text: 'Are you sure want to suspend'         },
    vm_reboot             : { icon: 'mdi mdi-autorenew'   , color: 'grey700' , text: 'Are you sure want to reboot'          },

    vm_resync             : { icon: 'mdi mdi-autorenew'   , color: 'red500'  , text: 'Are you sure want to resync VM'       },
    net_resync            : { icon: 'mdi mdi-autorenew'   , color: 'red500'  , text: 'Are you sure want to resync Network'  },
    vm_resetError         : { icon: 'icon-alert-triangle' , color: 'grey700' , text: 'Are you sure want to reset error message for next VMs'  },
   
    lctn_lock             : { icon: 'icon-alert-triangle' , color: 'red500'  , text: 'Are you sure want to lock'   },
    lctn_unlock           : { icon: 'icon-alert-triangle' , color: 'red500'  , text: 'Are you sure want to unlock' },

    confirmCreate         : { icon: 'icon-alert-triangle', color: 'blue700'  , text: 'Create new object'                    },
    confirmCreateMultiple : { icon: 'icon-alert-triangle', color: 'blue700'  , text: (count)=>`Create ${count} new object`  },
    confirmChanges        : { icon: 'icon-alert-triangle', color: 'blue700'  , text: 'Apply changes for object'             },
    delete                : { icon: 'icon-trash'         , color: 'red500'   , text: 'Are you sure want to delete'          },
    deleteAllSelected     : { icon: 'icon-trash'         , color: 'red500'   , text: 'Are you sure want to delete all selected objects'  },
    closeEditor           : { icon: 'icon-alert-triangle', color: 'red500'   , text: 'Are you sure want to close the editor, the data will not be saved' },    
    chooseLocation        : { icon: 'icon-alert-triangle', color: 'grey700'  , text: 'You must choose default location'     },  
   
    confirmLeave          : { icon: 'icon-alert-triangle', color: 'grey700'  , text: 'Cancel edit object?'                  }, 
   
    confirmLock           : { icon: 'icon-alert-triangle', color: 'grey700'  , text: 'Are you sure want to lock object?'    },
    confirmUnLock         : { icon: 'icon-alert-triangle', color: 'grey700'  , text: 'Are you sure want to unlock object?'  },    
   
    deleteAllSnapshots    : { icon: 'icon-trash'         , color: 'red500'   , text: 'Are you sure want to delete all snapshots for'  },
    deleteSnapshot        : { icon: 'icon-trash'         , color: 'red500'   , text: 'Are you sure want to delete snapshot'  },
    revertSnapshot        : { icon: 'icon-alert-triangle', color: 'grey700'  , text: 'Are you sure want to revert snapshot'  },

    taskAcknowledge       : { icon: 'icon-alert-triangle', color: 'grey700'  , text: 'Are you sure want to acknowledge this task'  },

    unsupportedBrowser    : { icon: 'icon-alert-triangle', color: 'red500'  , text: 'You are using an unsupported browser.<br> We recommend using the following browsers:' },
}