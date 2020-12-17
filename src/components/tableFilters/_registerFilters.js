import Vue from 'vue';

import filterAutocomplete    from '@/components/tableFilters/filterAutocomplete'
import filterInput           from '@/components/tableFilters/filterInput'
import filterFromTo          from '@/components/tableFilters/filterFromTo'
import filterSelect          from '@/components/tableFilters/filterSelect'
import filterLocation        from '@/components/tableFilters/filterLocation'



export default function ()  {
    Vue.component('c-filter-autocomplete'  , filterAutocomplete)
    Vue.component('c-filter-input'         , filterInput)
    Vue.component('c-filter-from-to'       , filterFromTo)
    Vue.component('c-filter-select'        , filterSelect)
    Vue.component('c-filter-location'      , filterLocation)
}