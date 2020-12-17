<template>
    <div class="border-bottom blue050-border">
        <div class="hidden-loading"></div>
        <v-progress-linear :class="{'hidden-loading': !glb_showLoading}" indeterminate='' color='rgba(53, 127, 212, 0.8)' background-color='rgba(232, 230, 227, 0.0)' height='1'></v-progress-linear>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed:{
    ...mapGetters(['glb_showLoading'])
  }  
}
</script>
<style lang="stylus" scoped>
.hidden-loading
  visibility: hidden !important
  height: 1px
</style>