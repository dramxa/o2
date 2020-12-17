<template>
    <div>
        <message-wrapper/>
        <dialog-wrapper/>
    </div>
</template>

<script>
import dialogWrapper from '@/dialogs/windows/dialogWrapper'
import messageWrapper from '@/dialogs/windows/messageWrapper'

export default {
    components:{
        dialogWrapper,
        messageWrapper
    },
}
</script>

<style>
    .v-dialog--active{border-radius:0 !important;}
</style>