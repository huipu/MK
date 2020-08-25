let navConfig = {
    'index' : '0',
    'fristPage' : '1',
    'myWork' : '2',
    'myTask' : '3',
    'AllotTask' : '4',
    'filesHandle': '5',
    'tabGroup': '6',
    'auth' : '7',
    'auth/': '7-0',
    'auth/addAuth': '7-1'
    };
let  getActiveNav = {
    getActiveHomeNav: function (href) {
        let homeKey = href.split('/home/')[1].split('?')[0]
        let childrenKey = href.split('/home/')[1].split('/')[0]
        // console.log('homeKey====', homeKey)
        // console.log('childrenKey====', childrenKey)
        if (homeKey.indexOf('/') === -1) {
            return navConfig[homeKey]
        }
        return navConfig[childrenKey]
    },
    getActiveChildNav: function (href) {
        let homeKey = href.split('/home/')[1].split('?')[0]
        // let childrenKey = href.split('/home/')[1].split('/')[0]
        // console.log('homeKey==',homeKey,'--','childrenKey==', childrenKey)
        // console.log('navConfig[homeKey]====', navConfig[homeKey])
        if (homeKey.indexOf('/') > -1) {
            return navConfig[homeKey]
        }
        return navConfig[homeKey+"/"]
    }
}

export default getActiveNav
