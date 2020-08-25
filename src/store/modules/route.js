export default {
    namespaced: true,
    state: {
        allowBack: false

    },
    getters:{

    },
    mutations:{
        setAllowBack (state, data) {
            state.allowBack = data.allowBack
            console.log('data===-=-=-=-=', state.allowBack)
        }
        
    },
    actions: {
        updateAppAllowBackSetting ({commit}, obj) {
            commit('setAllowBack', obj)
        }
    }
}