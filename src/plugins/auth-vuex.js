
const state = {
    _accessToken     : null,
    _accessTokenInfo : null,
    _refreshToken    : null,
    _success         : false
}

const getters = {
    auth_accessToken     : state => state._accessToken     ,
    auth_accessTokenInfo : state => state._accessTokenInfo ,
    auth_refreshToken    : state => state._refreshToken    ,

    auth_success         : state => state._success
}

const actions = {
    auth_setData: async ({commit}, value) => {
        commit('AUTH_SET_DATA', value);
    },

    auth_setSuccess: async ({commit}, value) => {
        commit('AUTH_SET_SUCCESS', value);
    }
}

const mutations = {
    AUTH_SET_DATA(state, { accessToken, accessTokenInfo, refreshToken }){
        state._accessToken     = accessToken;
        state._accessTokenInfo = accessTokenInfo;
        state._refreshToken    = refreshToken;
    },

    AUTH_SET_SUCCESS(state, value){
        state._success = value;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
  