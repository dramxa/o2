<template>
    <v-flex v-bind:[xsValue]="true" >
        <v-card flat tile class="c-lebeled-slot">
            <span v-if="label" class="prop-title grey700 fs-s nonselect">{{label}}</span><br v-if="label">
            <span class="text--primary prop-value">
                <slot/>
            </span>
        </v-card>
    </v-flex>
</template>
<script>
export default {
    props:[
        'label', 'xs'
    ],

    computed: {
        xsValue(){
            return 'xs' + this.xs;
        }
    }
}
</script>
<style lang="stylus" scoped>
.c-lebeled-slot
    line-height: 1.1
</style>