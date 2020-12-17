<template>
    <div class="c-table-checkbox d-flex pl-3 align-center" @click.stop="updateValue()">
        <input type="checkbox" :checked="checkState" :id="cbid" disabled> 
        <label class="c-table-checkbox__label grey700 fs-s" :class="{'indeterminate': indeterminate, classes}" :for="cbid">{{label}}</label>
    </div>
</template>

<script>
export default {
    props:[
        'label', 'cbid', 'classes', 'indeterminate', 'value', 'state'
    ],

    data(){
        return{
            checkState: false,
            stateInner: false
        }
    },

    methods: {
        updateValue(){
            var value = !this.stateInner;
            if(this.indeterminate && !value)
                value = true;           

            this.stateInner = value;
            this.updateChecState();           
            this.$emit('input', value)
            this.$emit('checked', value)
            this.$emit('click', value)
        },

        updateChecState(){
            if(this.indeterminate && !this.stateInner)
            {
                this.checkState = true;
                return;
            }
            
            if(this.stateInner)
            {
                this.checkState = true;                
                return;
            }

            this.checkState = false; 
        }
    },

    watch:{
        value:{
            handler: function(data){
                if(!isNullOrUndefined(data))
                {
                    this.stateInner = data;
                    this.updateChecState(); 
                }   
            },
            immediate: true            
        }, 

        state:{
            handler: function(data){
                if(!isNullOrUndefined(data))
                {
                    this.stateInner = data;
                    this.updateChecState(); 
                }   
            },
            immediate: true            
        },

        indeterminate:function(data)
        {
            this.updateChecState();
        }
    },
}
</script>
<style lang="stylus" scoped>
.c-table-checkbox
    margin-top: 5px
    &__label
        width: 100%
        line-height: 14px !important
        bottom: 10px
        box-sizing: border-box
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
    cursor: pointer;
}

input[type="checkbox"]:checked + label:before, 
input[type="checkbox"]:not(:checked) + label:before {
    content: "";
    position: absolute;
    left: 0px;
    top: 0px;
    width: 14px;
    height: 14px;
    border: 1px solid #B0BEC5;     /* Цвет рамки */
    background-color: #ffffff;     /* Цвет фона */
}
input[type="checkbox"]:checked + label:before {
    background-color: var(--var-accent700);     /* Цвет фона (active) */
    border: 1px solid var(--var-accent700);     /* Цвет рамки (active) */
}
input[type="checkbox"]:checked + .indeterminate:before {
    background-color: #fff;     /* Цвет фона (active) */
    border: 1px solid #B0BEC5;     /* Цвет рамки (active) */
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
    top: 2px;
    width: 9px;
    height: 6px;
    border-radius: 1px;
    border-left: 2px solid #fff;      /* Цвет галочки */
    border-bottom: 2px solid #fff;    /* Цвет галочки */
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
}
input[type="checkbox"]:checked + .indeterminate:after {
    left: 3px;
    top: 3px;
    width: 8px;
    height: 8px;
    background: var(--var-accent700);
    border-radius: 1px;
    border-left: 0;      /* Цвет галочки */
    border-bottom: 0;    /* Цвет галочки */
    -webkit-transform:none;
    -moz-transform: none;
    -o-transform: none;
    -ms-transform: none;
    transform: none;
}

.dark-theme input[type="checkbox"]:not(:checked) + label::before {
    border-color: rgb(58, 72, 79);
    background-color: rgb(24, 26, 27);
}

.dark-theme input[type="checkbox"]:checked + label::after {
    border-color: rgb(0, 0, 0);
}

.dark-theme input[type="checkbox"]:checked + .indeterminate:before {
    border-color: rgb(58, 72, 79);
    background-color: rgb(24, 26, 27);
}
</style>