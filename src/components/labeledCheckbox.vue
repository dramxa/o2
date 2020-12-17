<template>
    <v-card flat tile class="c-labeled-checkbox">
        <input type="checkbox" 
            :disabled="isDisable" 
            :id="cbid" 
            :checked="stateInner" 
            @change="updateValue($event.target.checked)" 
        > 
            <label class="grey700 fs-xs c-labeled-checkbox__label" :class="classes" :for="cbid">{{label}}</label>   <!-- id и for должны быть одинаковыми и уникальными -->
    </v-card>
</template>

<script>

export default {
    props:[
        'label', 'cbid', 'classes', 'isDisable', 'value'
    ],

    data(){
        return{
            stateInner: false
        }
    },

    methods: {
        updateValue(value){
            this.$emit('input', value)
            this.$emit('checked', value)
            this.$emit('click', value)
        }
    },

    watch:{
        value:{
            handler : function(value){
                this.stateInner = value;
            },
            immediate : true
        }
    }
}
</script>

<style lang="stylus" scoped>
.c-labeled-checkbox
    &__label
        width: 100%
        line-height:13px !important
        height: 13px
</style>
<style scoped>
label {
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
}
input[type="checkbox"]:checked, 
input[type="checkbox"]:not(:checked) {
    position: absolute;
    left: -9999px;
}

input[type="checkbox"]:checked + label, 
input[type="checkbox"]:not(:checked) + label {
    display: inline-block;
    position: relative;
    padding-left: 20px;
    line-height: 12px;    
}
input[type="checkbox"]:not([disabled]):checked + label, 
input[type="checkbox"]:not([disabled]):not(:checked) + label {   
    cursor: pointer;
}

input[type="checkbox"]:checked + label:before, 
input[type="checkbox"]:not(:checked) + label:before {
    content: "";
    position: absolute;
    left: 0px;
    top: 0px;
    width: 13px;
    height: 13px;
    border: 1px solid #B0BEC5;     /* Цвет рамки */
    background-color: #ffffff;     /* Цвет фона */
}
input[type="checkbox"]:checked + label:before {
    background-color: var(--var-accent700);     /* Цвет фона (active) */
    border: 1px solid var(--var-accent700);     /* Цвет рамки (active) */
}

input[type="checkbox"]:checked + label:before, 
input[type="checkbox"]:not(:checked) + label:before {
    border-radius: 2px;
}

input[type="checkbox"]:checked + label:after, 
input[type="checkbox"]:not(:checked) + label:after {
    content: "";
    position: absolute;
}

input[type="checkbox"]:checked + label:after {
    left: 3px;
    top: 3px;
    width: 8px;
    height: 5px;
    border-radius: 1px;
    border-left: 2px solid #fff;      /* Цвет галочки */
    border-bottom: 2px solid #fff;    /* Цвет галочки */
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
}

.dark-theme input[type="checkbox"]:not(:checked) + label:before {
    border-color: rgb(58, 72, 79) !important;
    background-color: rgb(24, 26, 27) !important;
}

.dark-theme input[type="checkbox"]:checked + label:after {
    border-color: rgb(0, 0, 0) !important;
}

.label-bigger-font-size label{
    font-size: 14px !important;
}
</style>