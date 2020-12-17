import dataScripts from './_locations-dataScripts'

 import complete    from './locations-complete-guide'
// import toolbar     from './projects-toolbar-guide'
// import filter      from './projects-filter-guide'
// import dataTable   from './projects-dataTable-guide'
// import property    from './projects-property-guide'
// import create      from './projects-create-guide'
// import edit        from './projects-edit-guide'
// import del         from './projects-delete-guide'

import Vue from 'vue'

export default {
    ...complete
}

export function initScripts(){
    Vue.prototype.$guide.addDataScripts(dataScripts.moduleCode, dataScripts.functions);
}