<template>
<v-layout class="w-notification br-2">
<v-flex class="d-flex flex-grow-0 w-notification__date-time-block align-center py-3 px-4 pr-6">
    <i class="mdi mdi-calendar w-notification__date-time-block-icon"></i>
    <div class="ml-3">
        <div class="fs-l w-notification__date-time-block-time"><span :class="[$vuetify.breakpoint.smAndDown ? 'fs-ml' : '']">{{time}}</span></div>
        <div class="fs-s w-notification__date-time-block-date">{{date}}</div>
    </div>
</v-flex>
<v-flex class="d-flex flex-grow-0 w-notification__name align-center px-4 pr-6" :class="[$vuetify.breakpoint.smAndDown ? 'fs-ml' : '']">
    <div>
        Platform update
    </div>
</v-flex>
<v-flex class="d-flex flex-grow-1 w-notification__description fs-ml align-center px-4">
    <div :class="glb_current_theme == 'white' ? 'grey900' : 'white--text'">
        Today {{date}} at {{time}} platform will be partially unavailable for {{period}} hours 
    </div>
</v-flex>
</v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    props:[
        'date', 'time', 'period'
    ],
    
    methods: {
      
    },

    computed: {
        ...mapGetters(['glb_current_theme']),
    }
}
</script>
<style lang="stylus" scoped>
.w-notification
    height 56px
    &__date-time-block
        background rgba(238, 143, 0, 0.85)
        &-icon
            font-size 32px
            color rgba(white, 0.85)
        &-time
            color rgba(white, 0.85)
        &-date
            color rgba(white, 0.68)
    &__name
        font-size 20px
        background rgba(238,143,0,0.49)
        color rgba(white, 0.85)
    &__description
        background rgba(238,182,0,0.31)
</style>