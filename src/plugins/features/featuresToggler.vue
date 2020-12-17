<template>
<label class="tgl" :style="toggleStyle">
  <input type="checkbox" 
  :checked="stateInner" 
  :disabled="disabled"
  @change="updateValue($event.target.checked)" 
  />
  <span class="tgl_body">
    <span class="tgl_switch"></span>
    <span class="tgl_track">
      <span class="tgl_bgd"></span>
      <span class="tgl_bgd tgl_bgd-negative"></span>
      
    </span>
  </span>
</label>
</template>

<script>
export default {
    props:[
        'value', 
        'disabled',
        'height'
    ],

    data(){
        return{
            stateInner: false,
        }
    },

    computed:{
      toggleStyle(){
        var height = isNullOrUndefined(this.height, { y: r=>22, n: r=>r })
        return {
          '--cp-size'   : `${height}px`,          
        }
      }
    },

    methods: {
        updateValue(value){
            this.$emit('input', !value)
            this.$emit('checked', !value)
            this.$emit('click', !value)
        }
    },

    watch:{
        value:{
            handler : function(value){
                this.stateInner = !value;
            },
            immediate : true
        }
    }
}
</script>

<style scoped>
.tgl {
  position: relative;
  display: inline-block;
  height: var(--cp-size);
  cursor: pointer;
}
.tgl > input {
  position: absolute;
  opacity: 0;
  z-index: -1;
  /* Put the input behind the label so it doesn't overlay text */
  visibility: hidden;
}
.tgl .tgl_body {
  width: calc(var(--cp-size)*2 + 2px);
  height: var(--cp-size);
  background: white;
  border: 1px solid #dadde1;
  display: inline-block;
  position: relative;
  border-radius: 4px;
}
.tgl .tgl_switch {
  width: var(--cp-size);
  height: var(--cp-size);
  display: inline-block;
  background-color: white;
  position: absolute;
  left: -1px;
  top: -1px;
  border-radius: 4px;
  border: 1px solid #ccd0d6;
  -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.13);
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.13);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.13);
  -moz-transition: left 250ms cubic-bezier(0.34, 1.61, 0.7, 1), -moz-transform 250ms cubic-bezier(0.34, 1.61, 0.7, 1);
  -o-transition: left 250ms cubic-bezier(0.34, 1.61, 0.7, 1), -o-transform 250ms cubic-bezier(0.34, 1.61, 0.7, 1);
  -webkit-transition: left 250ms cubic-bezier(0.34, 1.61, 0.7, 1), -webkit-transform 250ms cubic-bezier(0.34, 1.61, 0.7, 1);
  transition: left 250ms cubic-bezier(0.34, 1.61, 0.7, 1), transform 250ms cubic-bezier(0.34, 1.61, 0.7, 1);
  z-index: 1;
}
.tgl .tgl_track {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  border-radius: 4px;
}
.tgl .tgl_bgd {
  position: absolute;
  left: calc(var(--cp-size)*-1);
  top: 0;
  bottom: 0;
  width: calc(var(--cp-size)*2 + 2px);
  -moz-transition: left 250ms cubic-bezier(0.34, 1.61, 0.7, 1), right 250ms cubic-bezier(0.34, 1.61, 0.7, 1);
  -o-transition: left 250ms cubic-bezier(0.34, 1.61, 0.7, 1), right 250ms cubic-bezier(0.34, 1.61, 0.7, 1);
  -webkit-transition: left 250ms cubic-bezier(0.34, 1.61, 0.7, 1), right 250ms cubic-bezier(0.34, 1.61, 0.7, 1);
  transition: left 250ms cubic-bezier(0.34, 1.61, 0.7, 1), right 250ms cubic-bezier(0.34, 1.61, 0.7, 1);
  background: #439fd8 url("../../../public/img/icons/tgl_check.png") center center no-repeat;
  background-size: 10px;
}
.tgl .tgl_bgd-negative {
  left: auto;
  right: calc(var(--cp-size)/-2 - 1px);
  background: white url("../../../public/img/icons/tgl_x.png") center center no-repeat;
  background-size: 10px;
}
.tgl:hover .tgl_switch {
  border-color: #b5bbc3;
  -moz-transform: scale(1.06);
  -ms-transform: scale(1.06);
  -webkit-transform: scale(1.06);
  transform: scale(1.06);
}
.tgl:active .tgl_switch {
  -moz-transform: scale(0.95);
  -ms-transform: scale(0.95);
  -webkit-transform: scale(0.95);
  transform: scale(0.95);
}
.tgl > :not(:checked) ~ .tgl_body > .tgl_switch {
  left:  var(--cp-size);
}
.tgl > :not(:checked) ~ .tgl_body .tgl_bgd {
  left: calc(var(--cp-size)/-2);
}
.tgl > :not(:checked) ~ .tgl_body .tgl_bgd.tgl_bgd-negative {
  left: auto;
  right: calc(var(--cp-size)*-2);
}
</style>