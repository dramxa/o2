<template>
    <v-flex v-bind:[xsValue]="true">
        <v-card flat tile class="c-labeled-text-area">
            <span class="fs-s grey700 nonselect">{{label}}<span v-if="required && editMode" class="red500">*</span></span><br>
            <span class="prop-value">
                <v-textarea 
                    outlined 
                    :value="value" 
                    @input="updateValue($event)"                   
                    class="grey600 fs-m custom-text-area"
                    :rows="!isNullOrUndefined(customRows) ? customRows : 3"
                    :disabled="!editMode"
                    dark
                    no-resize
                    :class="{'contrast-disabled-text': isDisabledContrast}"
                    ></v-textarea>
            </span>
        </v-card>
    </v-flex>
</template>

<script>
export default {
    props:[
        'label',
        'value',
        'editMode',
        'xs',
        'useRightSlot',
        'isDisabledContrast',
        'required',
        'customRows'
    ],

    methods: {
      updateValue: function (value) {
        this.$emit('input', value)
      }
    },

    computed: {
        valueToShow(){
            return isNullOrUndefined(this.value) ? "-" : this.value
        },

        xsValue(){
            return 'xs' + this.xs;
        }
    },

    mounted(){
        // new SimpleBar(qs(".v-textarea--auto-grow .v-text-field__slot"), { autoHide: true });
        this.$vuebar.initScrollbar(qs(".custom-text-area .v-text-field__slot"), {})
    }
}
</script>
<style lang="stylus" scoped>
c-labeled-text-area
    line-height: 1.1
</style>

<style>
.custom-text-area textarea{
    -ms-overflow-style: none;  /* IE 10+ */
    scrollbar-width: none; /* Firefox */
}
.custom-text-area textarea::-webkit-scrollbar { /* chrome based */
    width: 0px;  /* ширина scrollbar'a */
    background: transparent;  /* опционально */
}
.prop-value textarea{
    padding:0 !important; 
    margin-top:8px !important; 
    margin-bottom:8px !important; 
    font-size: 14px; 
    line-height: 16px;
}
.contrast-disabled-text.v-input--is-disabled input, .theme--light.v-input--is-disabled textarea{color: unset !important;}
.custom-text-area .v-text-field__details{display: none !important;}
.custom-text-area .v-input__slot{margin-bottom:0 !important;}
.custom-text-area .v-text-field__slot textarea{caret-color: unset !important;}
</style>