<template>
    <div class="c-filter-input">
    <input
        type="text" 
        class="c-filter-input__input prop-edit-value px-2 py-1 border br-2 fs-s fw-b"
        :class="[isActive ? 'blue500-border blue800 blue000-b':'grey300-border grey500']"
        :placeholder="placeholder"
        :value="showValue" 
        @input="updateValue($event.target.value)"
        >
     <i v-show="showClearBtn" class="c-filter-input__icon icon-Close py-1 px-1 pointer" :class="[isActive ? 'blue700-i blue000-b': 'white']" @click="clear()"></i>
    </div>
</template>

<script>

export default {
    props: [ 'placeholder', 'value', 'choosen'],
    data(){
        return{
            showValue: '',
            showClearBtn: false,
            init: true
        }
    },

    computed:{
      isActive(){
        return this.value!='';
        }
    },

    methods: {

      clear(){
        this.updateValue('')
      },

      updateValue: function (inValue) {
        // if(this.init){
        //   this.init = false;
        //   return;
        // }
        this.showValue = inValue
        if(inValue!='')
          this.showClearBtn = true;
        else
          this.showClearBtn = false;

        try{
         this.$emit('doChange', inValue)
         this.$emit('input', inValue)
        }catch{}
      }      
    },

    mounted(){
      this.showValue = this.value;
      if(this.value!='')
          this.showClearBtn = true;
        else
          this.showClearBtn = false;
    }
}
</script>
<style lang="stylus" scoped>
.c-filter-input
  position relative
  &__input
    height 24px
    width 100%
  &__icon
    position absolute
    right 1px
    top 1px
    font-size 16px
    width 24px
    height 22px
</style>