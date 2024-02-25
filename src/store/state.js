
const state = {
    auth: null,
    navDrawer: false,
    processing: false,
    app_ready: false,
    app_process: '',
    current_user: {
        auth: null,
        profile: null,
        business: null,
        admin: null
    },
    error: {
        show: false,
        message: '',
        retry: () => Promise.resolve(),
        exception: null
    },
    snackbar: {
        status: false,
        text: '', 
        color: 'primary', 
    },
    app_layout: 'full',
    mode: null,
    current_page: null,
    system: {},
}
export default state;