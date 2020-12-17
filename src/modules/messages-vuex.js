// шаблон
// const clsMsg = {
//     type        : 'error',  // тип error|warning|info|success
//     caption     : '',
//     description : '',
//     wasShown    : false,
//     acknowledge : false
// }

const state = {
    _msg_items : []
}

const getters = {
    /** массив не подтвержденных пользователем событий */
    msg_notAcknowledge  : state => state._msg_items.filter(item=>!item.acknowledge),
    /** массив непрочитанных событий */
    msg_itemsUnshown    : state => state._msg_items.filter(item=>!item.wasShown),
    /** признак вывода окна с новыми сообщениями */
    msg_showMessagesBox : (state, getters) => getters.msg_itemsUnshown.length > 0
}

const actions = {
    /** добавление нового сообщения в список */
    msg_pushNewMessage: async ({commit}, message) => {
        commit('MSG_PUSH_NEW_MESSAGE', message);
    },

    msg_deleteMessage: async({commit}, message) => {
        commit('MSG_DELETE_MESSAGE', message);
    },

    msg_deleteAllMessages: async({commit}) => {
        commit('MSG_DELETE_ALL_MESSAGES');
    },
}

const mutations = {
    MSG_PUSH_NEW_MESSAGE(state, message){
        state._msg_items.push(Object.assign({}, message));
    },

    MSG_DELETE_MESSAGE(state, message){
        state._msg_items.splice(state._msg_items.indexOf(message), 1);
    },

    MSG_DELETE_ALL_MESSAGES(state){
        state._msg_items = [];
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
  