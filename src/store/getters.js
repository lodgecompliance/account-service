const getters = {
    error : state => state.error,
    app_ready: state => state.app_ready,
    app_process: state => state.app_process,
    auth: state => state.auth,
    authenticated: state => !!state.auth,
    current_user: state => state.current_user,
    user_notifications: state => state.current_user.profile?.notifications || [],
    snackbar: state => state.snackbar,
    app_layout: state => state.app_layout,
    mode: state => state.mode,
    current_page: state => state.current_page || {},
    is_admin: state => !!state.current_user?.profile?.auth?.is_admin,
    is_super_admin: state => !!state.current_user?.profile?.auth?.is_super_admin,
    system: state => state.system || {},
}

export default getters