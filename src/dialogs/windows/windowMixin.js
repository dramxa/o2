// Примеси к классам диалогов

import bus from './windowBus'

export default {
    props: ['id'],
    
    methods:{
        acceptClick(data){
            bus.$emit('close-' + this.id, data);  // кидаем в шину - закрыть окно
            bus.$emit('accept-' + this.id, data); // кидаем в шину - ответить что результат Accepted
        },

        cancelClick(data){
            bus.$emit('close-' + this.id, data);  // кидаем в шину - закрыть окно
            bus.$emit('cancel-' + this.id, data); // кидаем в шину - ответить что результат Cancel
      }
    }
  }