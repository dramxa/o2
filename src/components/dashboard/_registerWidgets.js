import Vue from 'vue';

import widgetNotification from '@/components/dashboard/notification-widget'
import widgetResource     from '@/components/dashboard/resource-widget'
import widgetTable        from '@/components/dashboard/table-widget'
import widgetTasks        from '@/components/dashboard/tasks-widget'
import widgetPrice        from '@/components/dashboard/price-widget'
import widgetCost         from '@/components/dashboard/cost-widget'
import widgetVms          from '@/components/dashboard/vms-widget'
import widgetProject      from '@/components/dashboard/project-widget'



export default function ()  {
    Vue.component('w-notification', widgetNotification)
    Vue.component('w-resource'    , widgetResource    )
    Vue.component('w-table'       , widgetTable       )
    Vue.component('w-tasks'       , widgetTasks       )
    Vue.component('w-price'       , widgetPrice       )
    Vue.component('w-cost'        , widgetCost        )
    Vue.component('w-vms'         , widgetVms         )
    Vue.component('w-project'     , widgetProject     )
}