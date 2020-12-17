<!--noindex-->Базовый компорнент диалога, реагирует на события из шины<!--/noindex-->
<template>
    <!-- <v-dialog v-model="showDialog" style="'border-radius:0 !important;" :style="{width: width, maxWidth: maxWidth}"> -->
    <v-dialog v-model="showDialog"  :width="width" :max-width="maxWidth" :style="{height: height}" style="max-height:90%;border-radius:0 !important;">
        <slot />
    </v-dialog>
</template>

<script>
import bus from './windowBus'

export default {
    props: ['value', 'dialogId', 'width', 'maxWidth', 'height', 'maxHeight'],

    data(){
        return{
            showDialog     : false,
            showDialogInner: false
        }
    },

    methods:{
        setShowDialog(value){
            this.showDialogInner = value;
            this.showDialog = value;

        }
    },

    watch:{
        showDialog: {
            handler: function(value){
                if(value==false && this.showDialogInner != value){
                    bus.$emit('close-'  + this.dialogId);  // кидаем в шину - закрыть окно
                    bus.$emit('cancel-' + this.dialogId);  // кидаем в шину - ответить что результат Cancel
                }
            },
            immediate: true
        }
    },

    created(){  
        var self = this;
        this.setShowDialog(this.value);
        bus.$on('open-'   + this.dialogId, f=>{ self.setShowDialog(true); })
        bus.$on('close-'  + this.dialogId, f=>{ self.setShowDialog(false); })             
        bus.$on('accept-' + this.dialogId, f=>{ self.setShowDialog(false); })             
        bus.$on('cancel-' + this.dialogId, f=>{ self.setShowDialog(false); })             
    }

}
</script>
<style lang="stylus">
.v-dialog--active
    max-height 90%
</style>