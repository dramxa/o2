const state = {
    _show          : false,
    _items         : null,
    _scripts       : null,
    _currentCode   : null,

    _steps            : null,
    _currentStepIndex : null,

    _tree  : []
}

const getters = {
    guide_show          : state => state._show,
    guide_items         : (state, getters) => Object.entries(state._items)
        .reduce((res, [key, value])=>{
            if( isNullOrUndefined(value.features, {
                y: ()  => true,
                n: (v) => v.reduce((res, item)=>getters.glb_permissions.includes(item) ? res + 1 : res + 0, 0) == v.length // обязательно наличие всех фич в списке разрешений
                })
            )
                res[key] = value
            return res;
        }
    , {}),

    guide_scripts       : state => state._scripts,

    guide_current     : state => state._items[state._currentCode],
    guide_currentCode : state => state._currentCode,

    guide_steps            : state => state._steps,
    guide_currentStep      : state => isNullOrUndefined(state._currentStepIndex) ? null : state._steps[state._currentStepIndex],
    guide_currentStepIndex : state => state._currentStepIndex,

    guide_tree : state => state._tree
}

const actions = {
    guide_show: async ({commit}, value) => {
        commit('GUIDE_SHOW', value);
    },

    guide_setItems: async ({commit}, value) => {
        commit('GUIDE_SET_ITEMS', value);
    },

    guide_setScripts: async ({commit}, value) => {
        commit('GUIDE_SET_SCRIPTS', value);
    },

    guide_setCurrentCode: async ({commit}, value) => {
        commit('GUIDE_SET_CURRENT_CODE', value);
    },

    guide_setSteps: async ({commit}, value) => {
        commit('GUIDE_SET_STEPS', value);
    },

    guide_setCurrentStepIndex: async ({commit}, value) => {
        commit('GUIDE_SET_CURRENT_STEP_INDEX', value);
    },

    guide_setTree: async ({commit}, value) => {
        commit('GUIDE_SET_TREE', value);
    }
}

const mutations = {
    GUIDE_SHOW(state, value){
        state._show = value;
    },

    GUIDE_SET_ITEMS(state, value){
        state._items = value;
    },
    
    GUIDE_SET_SCRIPTS(state, value){
        state._scripts = value;
    },
    
    GUIDE_SET_CURRENT_CODE(state, value){
        state._currentCode = value;
    },

    GUIDE_SET_STEPS(state, value){
        state._steps = value;
    },

    GUIDE_SET_CURRENT_STEP_INDEX(state, value){
        state._currentStepIndex = value;
    },

    GUIDE_SET_TREE(state, value){
        state._tree = value;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
  