import store from './../../store';
import { TokenManager } from "@/auth-token";

const middleware = {
    auth: (to, from, next) => {
        if(TokenManager.getToken()){
            if(store.getters.app_ready && !store.getters.current_user.profile && to.name !== 'onboard'){
                next({ name: 'onboard',
                    query: {
                        redirect: to.fullPath
                    }
                });
            } else next();
        } else {
            next({
                name: 'signin',
                query:{ redirect: to.fullPath }
            });
        } 
    },

    guest: (to, from, next) => {
        if(!TokenManager.getToken()) next();
        else {
            next( to.query.redirect
                ? { path: to.query.redirect }
                : {  name: 'home' }
            );
        }
    },
    
    verificationSent: (to, from, next) => {
        if(window.confirmationResult) next();
        else next({ name: 'signin' });
    }
};
 
export default middleware;