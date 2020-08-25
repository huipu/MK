export default {
    namespaced: true,
    state: {
        limitsOfauthority: '1',
        loginName: '',
        userid: '',
        loginAuth: ''

    },
    getters:{

    },
    mutations:{
        setlimitsOfauthority (state, data) {
            state.limitsOfauthority = data
            
        },
        setloginName (state, data) {
            state.loginName = data
        },
        setloginID (state, data) {
            state.userid =  data
        },
        setLoginAuth (state, data) {
            state.loginAuth = data
            console.log('loginAuth==', state.loginAuth)
        }
        
    }
}