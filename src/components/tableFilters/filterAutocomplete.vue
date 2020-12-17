<template>
    <v-autocomplete 
    class="c-filter-autocomplete p-0 m-0 border grey300-border custom-select fs-s fw-b grey700 white"
    :items="items"
    :menu-props="{ offsetY: true }"
    dense
    multiple
    loader-height="0"
    flat
    placeholder="All"
    :value="value" 
    @change="updateValue($event)"
    >
    </v-autocomplete>
</template>

<script>

export default {
    props:[
        'items', 'value'
    ],

    methods: {
      updateValue: function (value) {
        this.$emit('input', value)
      }
    }
}
</script>

<style lang="stylus">
.c-filter-autocomplete
  overflow hidden !important
</style>