import Vue from 'vue'
const moduleCode = 'sys'

const functions = {
    attachListClasses: function(){
        setTimeout(()=>{
            var cols = [];
            // собираем список столбцов через хедер в порядке их размещения
            // через классы .gd-tb-col и начало класса gd-tbcol
            document.querySelectorAll('.gd-tb-col').forEach(item=>{
                item.classList.forEach(cls=>{ if(cls.startsWith('gd-tbcol')) cols.push(cls) })
            })

            qs('.gd-table tbody tr:first-child').classList.add('gd-tb-row-item')

            // дабавляем классы к первой строке таблицы
            document.querySelectorAll('.gd-table tbody tr:first-child td').forEach((item, index)=>{
                if(cols.length -1 >= index)
                    item.classList.add(cols[index] + '-item');                        
            })  
        }, 100); 
    },

    clear: function(){
        isNullOrUndefined(qs('.gd-prp-close'), { n: v=>v.click() });
        isNullOrUndefined(qs('.gd-dlg-close'), { n: v=>v.click() });
    },

    errorMsg: function(){
        showMessage('serverError', 
        { 
            caption     : 'Test error', 
            message     : 'Error while processing of something', 
            subjectName : 'Error for demonstrating',
            noTimeout   : true
        });
    },

    fillAlarmMenu: function(){
        Vue.prototype.$store.dispatch('msg_deleteAllMessages');
        let msg = { 
            id          : Date.now() / 1000|0,
            type        : 'error', 
            kind        : 'message',
            title       : 'Test error',
            caption     : 'Error for demonstrating', 
            description : 'Error while processing of something', 
            wasShown    : false,  
            acknowledge : false 
        };
        Vue.prototype.$store.dispatch('msg_pushNewMessage', msg) 
    },
}

export default { moduleCode, functions }
