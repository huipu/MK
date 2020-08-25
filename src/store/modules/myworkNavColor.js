export default {
    namespaced: true,
    state: {
        myworkNavColor: '1',
        myTaskNavColor: ''
    },
    getters:{

    },
    mutations:{
        setmyworkNavColor (state, data) {
            state.myworkNavColor = data
        },
        setmyTaskNavColor (state, obj) {
            state.myTaskNavColor = obj
            // console.log('obj==', state.myTaskNavColor)
        }
    }
}