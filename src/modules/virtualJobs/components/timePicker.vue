<template>
  <div class="white br-4" >
    <v-layout class="white">
      <v-btn text style="width:50%;" class="normal-text fs-s fw-b grey500 pa-0 br-0" height="32px" @click="clearTime('min')"><span class="btn-text">Min</span></v-btn>
      <v-btn text style="width:50%;" class="normal-text fs-s fw-b grey500 pa-0 br-0" height="32px" @click="clearTime('max')"><span class="btn-text">Max</span></v-btn>
    </v-layout>
    <div class="d-flex white px-6 pt-4 pb-2 align-center" style="margin-top: -16px;">
      <div>
        <v-btn @click="changeTime('hours', 'inc')" text class="normal-text px-0 br-right" style="min-width:12px;width:24px;" height="24px">
          <i class="mdi mdi-chevron-up grey500 icon-24" style="margin-left:-2px;"></i>
        </v-btn>
        <div>
          <input style="width:24px;" v-imask="masks.justDigits" @focus="$event.target.select()" @complete="updateHours" class="fs-m fw-b grey900 text-center timepicker-input" type="text" :value="timeInner.hours">
        </div>
        <v-btn @click="changeTime('hours', 'dec')" text class="normal-text px-0 br-right" style="min-width:12px;width:24px;" height="24px">
          <i class="mdi mdi-chevron-down grey500 icon-24" style="margin-left:-2px;"></i>
        </v-btn>
      </div>
      <div class="mx-2">:</div>
      <div>
        <v-btn @click="changeTime('minutes', 'inc')" text class="normal-text px-0 br-right" style="min-width:12px;width:24px;" height="24px">
          <i class="mdi mdi-chevron-up grey500 icon-24" style="margin-left:-2px;"></i>
        </v-btn>
        <div>
          <input style="width:24px;" v-imask="masks.justDigits" @focus="$event.target.select()" @complete="updateMinutes" class="fs-m fw-b grey900 text-center timepicker-input" type="text" :value="timeInner.minutes">
        </div>
        <v-btn @click="changeTime('minutes', 'dec')" text class="normal-text px-0 br-right" style="min-width:12px;width:24px;" height="24px">
          <i class="mdi mdi-chevron-down grey500 icon-24" style="margin-left:-2px;"></i>
        </v-btn>
      </div>
      <div class="mx-2">:</div>
      <div>
        <v-btn @click="changeTime('seconds', 'inc')" text class="normal-text px-0 br-right" style="min-width:12px;width:24px;" height="24px">
          <i class="mdi mdi-chevron-up grey500 icon-24" style="margin-left:-2px;"></i>
        </v-btn>
        <div>
          <input style="width:24px;" v-imask="masks.justDigits" @focus="$event.target.select()" @complete="updateSeconds" class="fs-m fw-b grey900 text-center timepicker-input" type="text" :value="timeInner.seconds">
        </div>
        <v-btn @click="changeTime('seconds', 'dec')" text class="normal-text px-0 br-right" style="min-width:12px;width:24px;" height="24px">
          <i class="mdi mdi-chevron-down grey500 icon-24" style="margin-left:-2px;"></i>
        </v-btn>
      </div>
    </div>
    <v-layout class="white" style="margin-top: -8px;">
      <v-btn text style="width:100%;" class="normal-text fs-s fw-b blue500 pa-0 br-0" height="34px" @click="applyClick()"><span class="btn-text">Apply</span></v-btn>
    </v-layout>
  </div>
</template>

<script>
import masks from '@/consts/maskConst'
import {IMaskDirective} from 'vue-imask';

export default {

  props: ['time'],

  directives: {
    imask: IMaskDirective
  },

  data:()=>({
    masks,
    timeInner : {
      hours   : 23,
      minutes : 59,
      seconds : 59,
    }
  }),

  watch: {
    time:{
      handler: function(value){
        let d = new Date(value);
        // let date = new Date(Date.UTC(
        //   d.getFullYear(),
        //   d.getMonth(),
        //   d.getDate(),
        //   d.getHours(),
        //   d.getMinutes(),
        //   d.getSeconds()
        // ))
    
        this.timeInner.hours   = d.getHours();
        this.timeInner.minutes = d.getMinutes();
        this.timeInner.seconds = d.getSeconds();      
      },
      deep      : true,
      immediate : true
    },
   
    timeInner : {
      handler: function(value){
        if(value.hours > 23)
          value.hours = 0
        if(value.minutes > 59){
          value.minutes = 0
          this.timeInner.hours++
        }
        if(value.seconds > 59){
          value.seconds = 0
          this.timeInner.minutes++
        }
      },
      deep: true
    }
  },

  methods: {
    clearTime(type){
      if(type=='min'){
        this.timeInner = {
          hours   : 0,
          minutes : 0,
          seconds : 0,
        }
      }
      if(type=='max'){
        this.timeInner = {
          hours   : 23,
          minutes : 59,
          seconds : 59,
        }
      }
    },

    changeTime(type, funcType){
      if(funcType == 'inc')
        this.timeInner[type]++
      if(funcType == 'dec')
        this.timeInner[type]--
    },



    updateHours(e){
      let newValue = e.detail.value
      if(e.detail.value > 23){
        let arr = e.detail.value.toString().split('')
        let lasDigits = arr[arr.length-2] + arr[arr.length-1]
        if( parseInt(lasDigits) > 23 )
          newValue = parseInt(arr[arr.length-1])
        else
          newValue = parseInt(lasDigits)
      }
      this.timeInner.hours = newValue
    },
    updateMinutes(e){
      let newValue = e.detail.value
      if(e.detail.value > 59){
        let arr = e.detail.value.toString().split('')
        let lasDigits = arr[arr.length-2] + arr[arr.length-1]
        if( parseInt(lasDigits) > 59 )
          newValue = parseInt(arr[arr.length-1])
        else
          newValue = parseInt(lasDigits)
      }
      this.timeInner.minutes = newValue
    },
    updateSeconds(e){
      let newValue = e.detail.value
      if(e.detail.value > 59){
        let arr = e.detail.value.toString().split('')
        let lasDigits = arr[arr.length-2] + arr[arr.length-1]
        if( parseInt(lasDigits) > 59 )
          newValue = parseInt(arr[arr.length-1])
        else
          newValue = parseInt(lasDigits)
      }
      this.timeInner.seconds = newValue
    },

    applyClick(){
      var {hours, minutes, seconds} =  this.timeInner;
      var date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(seconds);
      this.$emit('change', date.toISOString());
    }
  }


}

</script>

<style scoped>
.br-right{border-radius:2px 0 0 2px;}
.br-left{border-radius:0 2px 2px 0;}
.timepicker-input:hover{color:var(--var-accent500) !important;}
</style>