<template>
    <component :is="pageContent"/>
</template>

<script>
import vmDefaultContent from './vms-view-content'
import vmAdvEditor from './vms-view-advEditor'
import { mapGetters } from 'vuex';

export default {
    components:{
        vmDefaultContent,
        vmAdvEditor
    },
    
    computed:{
        ...mapGetters(['vm_extEditor']),

        pageContent(){
            return this.vm_extEditor ? 'vmAdvEditor': 'vmDefaultContent'
        }
    }
}
</script>