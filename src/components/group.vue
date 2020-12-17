<template>
    <v-container grid-list-md text-xs-center class="c-group">
        <v-layout row>
            <v-flex grow v-if="caption!=null">
                <label class="blue600 white fs-ml fs-m c-group__label">{{caption}}</label>  
                <v-spacer class="c-group__spacer border-bottom grey100-border" />
            </v-flex>
            <v-flex shrink v-if="total">
                <label class="text-xs-right fs-m">{{total}}</label>
            </v-flex>             
            <v-flex xs12>
                <slot/>
            </v-flex>             
        </v-layout>
    </v-container>
</template>

<script>
export default {
  props: [ 'caption', 'total'],

  computed:{
      xsValue(){
          return isNullOrUndefined(this.total) ? 'xs12' : 'xs10'
      }
  }
}
</script>

<style lang="stylus" scoped>
.c-group
    &__label
        padding: 12px 6px !important
    &__spacer
        margin-top: -7px
</style>
