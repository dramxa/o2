const state = {
  _unstableFeatures : [],
  _unreachable      : false,
}

const getters = {
  features_unstableFeatures   : state => state._unstableFeatures,
  features_unreachable        : state => state._unreachable
}

const actions = {
  features_setData: async ({commit}, value) => {
    commit('SET_DATA', value);
  },

  features_setUnreachable: async ({commit}, value) => {
    commit('SET_UNREACHABLE', value);
  },
}

const mutations = {
  SET_DATA(state, value){
      state._unstableFeatures = value;
  },

  SET_UNREACHABLE(state, value){
    state._unreachable = value;
},
}

export default {
    state,
    getters,
    actions,
    mutations
}
  