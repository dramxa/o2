import { toCN } from '@/utilites'

export const jobTypesCodes = [
    { code: 'job_vm_create'       , name: 'Create virtual machine' },
    { code: 'job_vm_clone'        , name: 'Clone virtual machine' },
    { code: 'job_vm_convert'      , name: 'Convert virtual machine' },
    { code: 'job_vm_delete'       , name: 'Delete virtual machine' },
    { code: 'job_vm_change'       , name: 'Change virtual machine' },
    { code: 'job_vm_import'       , name: 'Import virtual machine' },
    { code: 'job_vm_synchronize'  , name: 'Synchronize virtual machine' },
    { code: 'job_unknown'         , name: 'Unknown code' },
    { code: 'job_tmpl_create'     , name: 'Create template' },
    { code: 'job_tmpl_delete'     , name: 'Delete template' },
    { code: 'job_tmpl_change'     , name: 'Change template' },
    { code: 'job_tmpl_import'     , name: 'Import template' },
    { code: 'job_tmpl_synchronize', name: 'Synchronize template' },
    { code: 'job_vn_create'       , name: 'Create virtual network' },
    { code: 'job_vn_change'       , name: 'Change virtual network' },
    { code: 'job_vn_delete'       , name: 'Delete virtual network' },
    { code: 'job_vn_import'       , name: 'Import virtual network' },
    { code: 'job_vn_synchronize'  , name: 'Synchronize virtual network' },
    { code: 'job_mi_create'       , name: 'Create media' },
    { code: 'job_mi_change'       , name: 'Change media' },
    { code: 'job_mi_delete'       , name: 'Delete media' },
    { code: 'job_mi_import'       , name: 'Import media' },
    { code: 'job_mi_synchronize'  , name: 'Synchronize media' },
    { code: 'job_org_create'      , name: 'Create organization' },
    { code: 'job_org_change'      , name: 'Change organization' },
    { code: 'job_org_delete'      , name: 'Delete organization' },
    { code: 'job_prj_create'      , name: 'Create project' },
    { code: 'job_prj_change'      , name: 'Change project' },
    { code: 'job_prj_delete'      , name: 'Delete project' },
    { code: 'job_grp_create'      , name: 'Create group' },
    { code: 'job_grp_change'      , name: 'Change group' },
    { code: 'job_grp_delete'      , name: 'Delete group' },
    { code: 'job_prc_create'      , name: 'Create pricelist' },
    { code: 'job_prc_change'      , name: 'Change pricelist' },
    { code: 'job_prc_delete'      , name: 'Delete pricelist' },
    { code: 'job_vds_create'      , name: 'Create datastore' },
    { code: 'job_vds_change'      , name: 'Change datastore' },
    { code: 'job_vds_delete'      , name: 'Delete datastore' },
    { code: 'job_lmt_create'      , name: 'Create limit' },
    { code: 'job_lmt_change'      , name: 'Change limit' },
    { code: 'job_lmt_delete'      , name: 'Delete limit' },
    { code: 'job_usr_create'      , name: 'Create user' },
    { code: 'job_usr_change'      , name: 'Change user' },
    { code: 'job_usr_delete'      , name: 'Delete user' },
    { code: 'job_role_create'     , name: 'Create role' },
    { code: 'job_role_change'     , name: 'Change role' },
    { code: 'job_role_delete'     , name: 'Delete role' },
    { code: 'job_loc_create'      , name: 'Create location' },
    { code: 'job_loc_change'      , name: 'Change location' },
    { code: 'job_loc_delete'      , name: 'Delete location' },
    { code: 'job_dscp_create'     , name: 'Create datastore type' },
    { code: 'job_dscp_change'     , name: 'Change datastore type' },
    { code: 'job_dscp_delete'     , name: 'Delete datastore type' },
    { code: 'job_os_create'       , name: 'Create operating system' },
    { code: 'job_os_change'       , name: 'Change operating system' },
    { code: 'job_os_delete'       , name: 'Delete operating system' },
]

export const jobTypes = toCN(jobTypesCodes)

export const tskTypesCodes = [
    { code: 'vm_create'            , name: 'Create VM' },
    { code: 'vm_clone'             , name: 'Clone VM' },
    { code: 'vm_delete'            , name: 'Delete VM' },
    { code: 'vm_run'               , name: 'Run VM' },
    { code: 'vm_stop'              , name: 'Stop VM' },
    { code: 'vm_suspend'           , name: 'Suspend VM' },
    { code: 'vm_reset'             , name: 'Reset VM' },
    { code: 'vm_apply'             , name: 'Apply' },
    { code: 'vm_read'              , name: 'Read VM' },
    { code: 'vm_description_update', name: 'VM description update' },
    { code: 'vm_cp_update'         , name: 'VM cp update' },
    { code: 'vm_disks_update'      , name: 'VM disks update' },
    { code: 'vm_media_update'      , name: 'VM media update' },
    { code: 'vm_network_update'    , name: 'VM network update' },
    { code: 'vm_membership_update' , name: 'VM membership update' },
    { code: 'vm_snapshot_create'   , name: 'Create snapshot' },
    { code: 'vm_snapshot_update'   , name: 'Update snapshot' },
    { code: 'vm_snapshot_revert'   , name: 'Revert snapshot' },
    { code: 'vm_snapshot_delete'   , name: 'Delete snapshot' },
    { code: 'vm_snapshot_clear'    , name: 'Clear snapshot' },
    { code: 'vm_synchronize'       , name: 'Synchronize VM' },
    { code: 'vm_import'            , name: 'Import VM' },
    { code: 'vm_change'            , name: 'Change VM' },
    { code: 'unknown'              , name: 'Unknown code' },

    { code: 'tmpl_clone_from_vm'   , name: 'Clone VM to template' },
    { code: 'tmpl_convert_from_vm' , name: 'Convert VM to template' },
    { code: 'tmpl_delete'          , name: 'Delete template' },
    { code: 'tmpl_update'          , name: 'Update template' },
    { code: 'tmpl_read'            , name: 'Read template' },
    { code: 'tmpl_import'          , name: 'Import template' },

    { code: 'vn_create' , name: 'Create virtual network' },
    { code: 'vn_update' , name: 'Update virtual network' },
    { code: 'vn_delete' , name: 'Delete virtual network' },
    { code: 'vn_import' , name: 'Import virtual network' },

    { code: 'mi_create' , name: 'Create media' },
    { code: 'mi_update' , name: 'Update media' },
    { code: 'mi_delete' , name: 'Delete media' },
    { code: 'mi_import' , name: 'Import media' },

    { code: 'org_create' , name: 'Create organization' },
    { code: 'org_update' , name: 'Update organization' },
    { code: 'org_delete' , name: 'Delete organization' },

    { code: 'prj_create' , name: 'Create project' },
    { code: 'prj_update' , name: 'Update project' },
    { code: 'prj_delete' , name: 'Delete project' },

    { code: 'grp_create' , name: 'Create group' },
    { code: 'grp_update' , name: 'Update group' },
    { code: 'grp_delete' , name: 'Delete group' },

    { code: 'prc_create' , name: 'Create pricelist' },
    { code: 'prc_update' , name: 'Update pricelist' },
    { code: 'prc_delete' , name: 'Delete pricelist' },

    { code: 'vds_create' , name: 'Create datastore' },
    { code: 'vds_update' , name: 'Update datastore' },
    { code: 'vds_delete' , name: 'Delete datastore' },

    { code: 'lmt_create' , name: 'Create limit' },
    { code: 'lmt_update' , name: 'Update limit' },
    { code: 'lmt_delete' , name: 'Delete limit' },

    { code: 'usr_create' , name: 'Create user' },
    { code: 'usr_update' , name: 'Update user' },
    { code: 'usr_delete' , name: 'Delete user' },

    { code: 'role_create' , name: 'Create role' },
    { code: 'role_update' , name: 'Update role' },
    { code: 'role_delete' , name: 'Delete role' },

    { code: 'loc_create' , name: 'Create location' },
    { code: 'loc_update' , name: 'Update location' },
    { code: 'loc_delete' , name: 'Delete location' },

    { code: 'dscp_create' , name: 'Create datastore type' },
    { code: 'dscp_update' , name: 'Update datastore type' },
    { code: 'dscp_delete' , name: 'Delete datastore type' },

    { code: 'os_create' , name: 'Create operating system' },
    { code: 'os_update' , name: 'Update operating system' },
    { code: 'os_delete' , name: 'Delete operating system' },
]

export const tskTypes = toCN(tskTypesCodes)

export const vmTaskConsts = {
    vm_description_update : { name: 'Changing'   , subtitle: 'description', caption: 'Changing vm description'       , errorDescription: (objName) => `Found error while trying change vm <span class="fw-b">'${objName}'</span> description`       },
    vm_cp_update          : { name: 'Changing'   , subtitle: 'compute res', caption: 'Changing vm compute resources' , errorDescription: (objName) => `Found error while trying change vm <span class="fw-b">'${objName}'</span> compute resources` },
    vm_disks_update       : { name: 'Changing'   , subtitle: 'disks'      , caption: 'Changing vm disks'             , errorDescription: (objName) => `Found error while trying change vm <span class="fw-b">'${objName}'</span> disks`             },
    vm_media_update       : { name: 'Changing'   , subtitle: 'media'      , caption: 'Changing vm media'             , errorDescription: (objName) => `Found error while trying change vm <span class="fw-b">'${objName}'</span> media`             },
    vm_network_update     : { name: 'Changing'   , subtitle: 'networks'   , caption: 'Changing vm networks'          , errorDescription: (objName) => `Found error while trying change vm <span class="fw-b">'${objName}'</span> networks`          },
    vm_membership_update  : { name: 'Changing'   , subtitle: 'membership' , caption: 'Changing vm membership'        , errorDescription: (objName) => `Found error while trying change vm <span class="fw-b">'${objName}'</span> membership`        },

    vm_clone              : { name: 'Cloning'    , subtitle: null, caption: 'Cloning vm'   , errorDescription: (objName) => `Found error while trying clone vm <span class="fw-b">'${objName}'</span>`    },
    vm_create             : { name: 'Creating'   , subtitle: null, caption: 'Creating vm'  , errorDescription: (objName) => `Found error while trying create vm <span class="fw-b">'${objName}'</span>`   },
    vm_delete             : { name: 'Deleting'   , subtitle: null, caption: 'Deleting vm'  , errorDescription: (objName) => `Found error while trying delete vm <span class="fw-b">'${objName}'</span>`   },
    vm_reset              : { name: 'Resetting'  , subtitle: null, caption: 'Resetting vm' , errorDescription: (objName) => `Found error while trying run vm <span class="fw-b">'${objName}'</span>`      },
    vm_run                : { name: 'Running'    , subtitle: null, caption: 'Running vm'   , errorDescription: (objName) => `Found error while trying reset vm <span class="fw-b">'${objName}'</span>`    },
    vm_stop               : { name: 'Stopping'   , subtitle: null, caption: 'Stopping vm'  , errorDescription: (objName) => `Found error while trying stop vm <span class="fw-b">'${objName}'</span>`     },
    vm_suspend            : { name: 'Suspending' , subtitle: null, caption: 'Suspending vm', errorDescription: (objName) => `Found error while trying suspend vm <span class="fw-b">'${objName}'</span>`  },
    vm_apply              : { name: 'Applying'   , subtitle: null, caption: 'Applying settings vm', errorDescription: (objName) => `Found error while trying applying vm <span class="fw-b">'${objName}'</span> settings`   },
    
    vm_snapshot_create    : { name: 'Snapshot'   , subtitle: 'creating' , caption: ' vm snapshot creating' , errorDescription: (objName) => `Found error while trying create vm <span class="fw-b">'${objName}'</span> snapshot`   },
    vm_snapshot_update    : { name: 'Snapshot'   , subtitle: 'updating' , caption: ' vm snapshot updating' , errorDescription: (objName) => `Found error while trying update vm <span class="fw-b">'${objName}'</span> snapshot`   },
    vm_snapshot_revert    : { name: 'Snapshot'   , subtitle: 'reverting', caption: ' vm snapshot reverting', errorDescription: (objName) => `Found error while trying revert vm <span class="fw-b">'${objName}'</span> snapshot`  },
    vm_snapshot_delete    : { name: 'Snapshot'   , subtitle: 'deleting' , caption: ' vm snapshot deleting' , errorDescription: (objName) => `Found error while trying delete vm <span class="fw-b">'${objName}'</span> snapshot`   },
    vm_snapshot_clear     : { name: 'Snapshot'   , subtitle: 'clearing' , caption: ' vm snapshots clearing', errorDescription: (objName) => `Found error while trying delete all vm <span class="fw-b">'${objName}'</span> snapshots`  },

}

export const sysTaskConsts = {
    login       : { name: 'Login',  caption: 'Login error', errorDescription: (objName) => `Found error while user '${objName}' try to login` },
}

export const tskCombine = {
    vm  : vmTaskConsts,
    sys : sysTaskConsts
}

export const tskStateCodes = [
    {
        code: "created",
        name: "Created"
    },
    {
        code: "error",
        name: "Error"
    },
    {
        code: "running",
        name: "Running"
    },
    {
        code: "completed",
        name: "Completed"
    },
]
export const tskStates = toCN(tskStateCodes)


export const tskObjTypeCodes = [
    {
        code: "sys",
        name: "System"
    },
    {
        code: "org",
        name: "Organization"
    },
    {
        code: "vm",
        name: "VM"
    },
    {
        code: "prj",
        name: "Project"
    },
    {
        code: "grp",
        name: "Group"
    },
    {
        code: "usr",
        name: "User"
    },
    {
        code: "tmpl",
        name: "Teplate"
    },
    {
        code: "net",
        name: "Network"
    },
    {
        code: "med",
        name: "ISO"
    }
]
export const tskObjTypes = toCN(tskObjTypeCodes)
