<template>
    <v-tooltip bottom  content-class="custom-tooltip fs-s">
        <template v-slot:activator="{ on }">
          <v-btn icon tile class="pa-0 icon-18 control-button br-4" :class="[tooltip == 'Console' ? 'mx-1' : 'mx-0-5', btnClass]" v-on="on" @click="click">
            <i v-if="!showSlot" :class="icon"></i>
            <slot v-if="showSlot" />
          </v-btn>
        </template>
        <span class="custom-tooltip-accent fw-m">{{tooltip}}</span>
    </v-tooltip>
</template>

<script>
export default {
    props: ['tooltip', 'icon', 'btnClass'],

    methods: {
        click() {
            this.$emit('click')
        }
    },

    computed:{
        showSlot(){
            if(isNullOrUndefined(this.icon))
                return true;
            return false
        },

        buttonClass(){
            return isNullOrUndefined(this.btnClass) ? '' : this.btnClass
        }

    }

}
</script>