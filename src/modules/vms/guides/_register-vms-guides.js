import dataScripts from './_vms-dataScripts'

import complete    from './vms-complete-guide'
import toolbar     from './vms-toolbar-guide'
import filter      from './vms-filter-guide'
import dataTable   from './vms-dataTable-guide'
import property    from './vms-property-guide'
import create      from './vms-create-guide'
import createAdv   from './vms-createAdv-guide'
import edit        from './vms-edit-guide'
import del         from './vms-delete-guide'
import takeSnap    from './vms-dlg-takeSnap'
import migration   from './vms-dlg-migration'
import clone       from './vms-dlg-clone'
import saveTmpl    from './vms-dlg-saveTmpl'
import convertTmpl from './vms-dlg-convertTmpl'
import stateChange from './vms-stateChange'
import snapMngr    from './vms-dlg-snapMngr'

import Vue from 'vue'

export default {
    ...complete    ,
    ...toolbar     ,
    ...filter      ,
    ...dataTable   ,
    ...property    ,
    ...create      ,
    ...createAdv   ,
    ...edit        ,
    ...del         ,
    ...takeSnap    ,
    ...migration   ,
    ...clone       ,
    ...convertTmpl ,
    ...saveTmpl    ,
    ...stateChange ,
    ...snapMngr    ,
}

export function initScripts(){
    Vue.prototype.$guide.addDataScripts(dataScripts.moduleCode, dataScripts.functions);
}