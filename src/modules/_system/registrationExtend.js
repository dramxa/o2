import Vue from 'vue';

import osTypes    from '@/modules/vms/vms-osTypes-vuex-extension'

import calcGrp       from '@/modules/groups/grp-calc-extension'
import calcGrpFabric from '@/modules/groups/grp-calc-fabric'

import calcPrj       from '@/modules/projects/projects-calc-extension'
import calcPrjFabric from '@/modules/projects/projects-calc-fabric'


import groups       from '@/modules/groups/grp-vuex-extension'
import locaions     from '@/modules/locations/locations-vuex-extension'
import orgs         from '@/modules/orgs/orgs-vuex-extension'
import projects     from '@/modules/projects/projects-vuex-extension'
import vjobs        from '@/modules/virtualJobs/vjobs-vuex-extension'
import templates    from '@/modules/templates/templates-vuex-extension'
import users        from '@/modules/users/users-vuex-extension'
import vms          from '@/modules/vms/vms-vuex-extension'
import net          from '@/modules/networks/networks-vuex-extension'
import med          from '@/modules/media/media-vuex-extension'
import pricelists   from '@/modules/pricelists/pricelists-vuex-extension'
import limits       from '@/modules/limits/limits-vuex-extension'
import roles        from '@/modules/roles/roles-vuex-extension'
import diskPolicies from '@/modules/vms/vms-diskPolicies-vuex-extension'
import datastores     from '@/modules/datastores/ds-vuex-extension'
import datastoreTypes from '@/modules/datastoreTypes/dst-vuex-extension'

  
export default function () {
    groups        ();
    locaions      ();
    orgs          ();
    osTypes       ();
    projects      ();
    vjobs         ();
    templates     ();
    users         ();
    vms           ();
     
    calcPrj       (); 
    calcPrjFabric ();
    
    calcGrp       ();
    calcGrpFabric ();

    pricelists    ();
    net           ();
    med           ();
    limits        ();
    roles         ();
    diskPolicies  ();
    datastores    ();
    datastoreTypes();
}
    