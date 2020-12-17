// ----  VUEX подключение модулей  ----

import Vue  from 'vue'
import Vuex from 'vuex'

import glb       from '@/modules/global-vuex'
import guide     from '@/modules/guide-vuex'
import msgs      from '@/modules/messages-vuex'

import calcGrp   from '@/modules/groups/grp-calc-vuex'
import calcPrj   from '@/modules/projects/projects-calc-vuex'

import orgs         from '@/modules/orgs/orgs-vuex'
import usrs         from '@/modules/users/users-vuex'
import projects     from '@/modules/projects/projects-vuex'
import groups       from '@/modules/groups/grp-vuex'
import vms          from '@/modules/vms/vms-vuex'
import os           from '@/modules/vms/vms-osTypes-vuex'
import net          from '@/modules/networks/networks-vuex'
import med          from '@/modules/media/media-vuex'
import tmpl         from '@/modules/templates/templates-vuex'
import locations    from '@/modules/locations/locations-vuex'
import vjobs        from '@/modules/virtualJobs/vjobs-vuex'
import pricelists   from '@/modules/pricelists/pricelists-vuex'
import limits       from '@/modules/limits/limits-vuex'
import roles        from '@/modules/roles/roles-vuex'
import diskPolicies from '@/modules/vms/vms-diskPolicies-vuex'

import datastores     from '@/modules/datastores/ds-vuex'
import datastoreTypes from '@/modules/datastoreTypes/dst-vuex'

import dashboard_projects  from '@/modules/dashboard/dashboard-projects-vuex'
import dashboard_amounts   from '@/modules/dashboard/dashboard-amounts-vuex'
import dashboard_costs     from '@/modules/dashboard/dashboard-costs-vuex'
import dashboard_vms       from '@/modules/dashboard/dashboard-vms-vuex'
import dashboard_resources from '@/modules/dashboard/dashboard-resources-vuex'
import dashboard_vJobs from '@/modules/dashboard/dashboard-vJobs-vuex'
import dashboard_vJobsErrors from '@/modules/dashboard/dashboard-vJobsErrors-vuex'


Vue.use(Vuex)

var store = new Vuex.Store({
  modules: {
    glb,

    msgs,
    locations,

    orgs,
    usrs,
    projects,
    groups,
    vms,
    net,
    med,
    tmpl,
    os,
    vjobs,
    
    pricelists,
    limits,
    roles,

    calcGrp,
    calcPrj,

    diskPolicies,
    guide,

    datastores,
    datastoreTypes,

    dashboard_projects,
    dashboard_amounts,
    dashboard_costs, 
    dashboard_vms,    
    dashboard_resources,
    dashboard_vJobs,
    dashboard_vJobsErrors,
  }
})

Vue.prototype.$store = store

export default store;