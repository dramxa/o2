import dataScripts   from './_users-dataScripts'

import complete      from './users-complete-guide'
import toolbar       from './users-toolbar-guide'
import filter        from './users-filter-guide'
import dataTable     from './users-dataTable-guide'
import property      from './users-property-guide'
import create        from './users-create-guide'
import edit          from './users-edit-guide'
import del           from './users-delete-guide'
import menu          from './users-menu-guide'
import profile          from './users-profile-guide'
import chngLockState from './users-chngLockState'

import Vue from 'vue'

export default {
    ...complete      ,
    ...toolbar       ,
    ...filter        ,
    ...dataTable     ,
    ...property      ,
    ...create        ,
    ...edit          ,
    ...del           ,
    ...menu          ,
    ...profile       ,
    ...chngLockState ,
}

export function initScripts(){
    Vue.prototype.$guide.addDataScripts(dataScripts.moduleCode, dataScripts.functions);
}