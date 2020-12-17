import dataScripts from './_system-dataScripts'
import complete    from './system-complete-guide'
import alarmMenu   from './system-alarmMenu-guide'
import errMsg      from './system-errMsg-guide'

import Vue from 'vue'

export default {
    ...complete ,
    ...alarmMenu,
    ...errMsg
}

export function initScripts(){
    Vue.prototype.$guide.addDataScripts(dataScripts.moduleCode, dataScripts.functions);
}