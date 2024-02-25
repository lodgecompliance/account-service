
const mutations = {
    SET_APP_STATE: (state, ready) => {
        state.app_ready = ready
    },

    SET_APP_PROCESS: (state, process) => {
        state.app_process = process
    },

    SET_AUTH: (state, auth) => {
        state.auth = auth
    },

    SET_USER_AUTH: (state, auth) => {
        state.current_user.auth = auth
    },

    SET_USER_PROFILE: (state, profile) => {
        state.current_user.profile = profile
    },

    SET_USER_BUSINESS: (state, business) => {
        state.current_user.business = business
    },

    SET_USER_ADMIN: (state, admin) => {
        state.current_user.admin = admin
    },

    SET_USER_PROFILE_KEYS: (state, values) => {
        if(state.current_user.profile) {
            state.current_user.profile = { ...state.current_user.profile, ...values}
        }
    },

    SET_USER_BUSINESS_KEYS: (state, values) => {
        if(state.current_user.business) {
            const user_business = state.current_user.business
            const user_businesses = state.current_user.profile?.businesses || [];
            user_business.business = { ...user_business.business, ...values }
            user_businesses.splice(user_businesses.findIndex(ub => ub.id === user_business.id), 1, user_business)
            state.current_user.profile = { ...state.current_user.profile, businesses: user_businesses };
            state.current_user.business = user_business;
        }
    },
    
    UNSET_CURRENT_USER: (state) => {
        state.current_user = {
            auth: null,
            profile: null,
        }
    },

    SNACKBAR(state, settings){
        state.snackbar = settings
    },

    SET_APP_LAYOUT(state, layout) {
        state.app_layout = layout
    },

    SET_MODE(state, mode) {
        window.localStorage.setItem('mode', mode);
        if(!['personal', 'admin'].includes(mode)) {
            state.current_user.business = (state.current_user.profile?.businesses || [])
                .find(business => business.business?.id === mode);
        }
        state.mode = mode
    },

    SET_CURRENT_PAGE(state, page) {
        state.current_page = { ...state.current_page, ...page }
    },

    SET_SYSTEM_PARAMS (state, params) {
        state.system = params || {}
    }

}

export default mutations