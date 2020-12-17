<template>
    <v-card flat tile class="c-labeled-btn">
        <span class="grey700 fs-s">{{label}}</span>
        <span>
            <span v-if="!editMode" class="body-1">{{valueToShow}}</span>
            <div  v-if="editMode"  class="align-self-center">
                <v-btn @click="onClick" :disabled="disabled" text height="24px" class="c-labeled-btn__button justify-space-between align-center fs-s fw-b px-2 br-2 normal-text mt-n1" :class="[active ? 'blue500-border blue800 blue000-b' : 'grey700 grey300-border']" outlined>
                    <div>{{value}}</div>
                    <div v-if="!hideIcon"> <i class="grey500-i icon-Create icon-10"></i> </div>
                </v-btn>
            </div>
        </span>
    </v-card>
</template>

<script>

export default {
    props:[
        'label', 'value', 'editMode', 'hideIcon', 'active', 'disabled'
    ],
    
    methods: {
      updateValue: function (value) {
        this.$emit('input', value)
      },

      onClick(){
        this.$emit('click')
      }
    },

    computed: {
        valueToShow(){
            return isNullOrUndefined(this.value) ? "-" : this.value
        }
    }
}
</script>

<style lang="stylus" scoped>
.c-labeled-btn
    &__button
        width: 100%
        text-align: left
        text-transform: none
        border-style: dashed
</style>