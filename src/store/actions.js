import { auth } from '@/firebase';
import _apollo from '@/apollo';
import GET_AUTH_USER from '@/domain/Auth/Queries/getAuthUser';
import GET_AUTH_USER_ACCOUNT from '@/domain/Auth/Queries/getUserAccount';
import GET_SYSTEM_PARAMS from '@/graphql/query/getSystemParam'
import config from "@/config";
import helper from "@/helper";

const actions = {
    broadcast({ getters }, data) {
        window.parent.postMessage(data, '*')
    },

    broadcastAuth({ dispatch, getters }) {
        const token = window.localStorage.getItem("gr-user");
        const expires = window.localStorage.getItem('token-expires')
        dispatch('broadcast', {
            type: 'auth',
            status: auth.currentUser && token ? 'signedin' : 'signedout',
            token: token,
            expires: expires,
            profile: getters.current_user.profile
        })
    },

    getAuthUserToken({ dispatch, commit }){
        return new Promise((resolve, reject) => {
            auth.currentUser.getIdTokenResult(true)
            .then(tokenResult => {
                window.localStorage.setItem('gr-user', tokenResult.token);
                window.localStorage.setItem('token-expires', tokenResult.expirationTime);
                return dispatch('getAuthUser')
            }).then(() => resolve(true))
            .catch(e => {
                window.localStorage.removeItem('gr-user');
                window.localStorage.removeItem('token-expires');
                reject(e)
            }).finally(() => {
                dispatch('broadcastAuth')
            })
        })
    },

    getAuthUser({ commit, dispatch, getters }) {
        return new Promise((resolve, reject) => {
            dispatch('query', {
                domain: config.apollo.auth,
                query: GET_AUTH_USER
            }).then(response => {
                const authentication = response.data.getAuth?.authentication;
                commit('SET_USER_AUTH', authentication);
                commit('SET_USER_ADMIN', authentication?.admin);
                if(getters.mode === "admin" && !authentication?.is_admin) {
                    commit('SET_MODE', 'personal')
                }
                resolve(authentication)
            })
            .catch(e => reject(e))
            .finally(() => dispatch('broadcastAuth'))
        })

    },

    getAuthUserAccount({ commit, dispatch }) {
        return new Promise((resolve, reject) => {
                dispatch('query', {
                    domain: config.apollo.account,
                    query: GET_AUTH_USER_ACCOUNT,
                }).then(response => {
                    const account = response.data.getAuthUser;
                    const businesses = account?.businesses || [];
                    commit('SET_USER_PROFILE', account);
                    const applicableModes = ["personal","admin"]
                        .concat(businesses.map(business => business.business?.id ? business.business.id : null ))
                        .filter(mode => !!mode);
                    const lastMode = window.localStorage.getItem('mode');
                    if(lastMode && applicableModes.includes(lastMode)) {
                        commit('SET_MODE', lastMode);
                    } else commit('SET_MODE', 'personal')
                    resolve(account);
                })
                .catch(e => reject(e))
                .finally(() => dispatch('broadcastAuth'))
        })
    },

    query({commit, dispatch}, { domain = config.apollo.account, query, variables }){
        let error = null;
        const runQuery = () => {
            return _apollo(domain, (e) => {
                error = e;
            }, (e) => {
                    error = e;
                }
            ).then(apollo => {
                return apollo.client.query({
                    query, variables
                })
            })
        }

        return new Promise((resolve, reject) => {
            runQuery().then(response => {
                resolve(response)
            })
            .catch(e => {
                //refresh token and retry
                if(error && error.response && error.response.status === 401) {
                    console.log("Retrying after refreshing ID token...");
                    dispatch('getAuthUserToken').then(() => runQuery())
                    .then(response => resolve(response))
                    .catch(e => reject(e))
                }
                console.log("error---->", error)
                if(error) return reject(error.result ? error.result : error);
                return reject(e);
            })

        });
        
    },
    
    mutate({commit, dispatch}, { domain = config.apollo.account, mutation, variables}){
        let error = null;
        const runMutation = () => {
            return _apollo(domain,(e) => {
                    error = e.result ? e.result : null;
                }, (e) => {
                    error = e;
                }
            ).then(apollo => {
                return apollo.client.mutate({
                    mutation, variables
                })
            })
        }
        return new Promise((resolve, reject) => {
            runMutation().then(response => resolve(response))
            .catch(e => {
                //refresh token and retry
                if(error && error.response && error.response.status === 401) {
                    console.log("Retrying after refreshing ID token...");
                    dispatch('getAuthUserToken').then(() => runMutation())
                        .then(response => resolve(response))
                        .catch(e => reject(e))
                }
                if(error?.result) return reject(error.result)
                return reject(e);
            })

        })
    },

    getSystemParams({ commit, dispatch }) {
        return new Promise((resolve, reject) => {
            dispatch('query', {
                domain: config.apollo.gr,
                query: GET_SYSTEM_PARAMS
            }).then(response => {
                const params = helper.convertMetaKeyValueToObj(response.data.getSystemParams || []);
                commit("SET_SYSTEM_PARAMS", params)
                resolve(params)
            }).catch(e => reject(e))
        })
    },

    syncAuthUser({ dispatch }) {
        return dispatch('getAuthUser')
            .then(() => dispatch('getAuthUserAccount'));
    },

    /**
     * sign out the currently authenticated user
     */
    signout({commit, dispatch}){
       return new Promise((resolve, reject) => {
            auth.signOut()
            .then(() => {
                commit('UNSET_CURRENT_USER');
                window.localStorage.removeItem('gr-user');
                window.localStorage.removeItem('token-expires');
                resolve()
            })
            .catch(e =>  reject(e))
            .finally(() => dispatch('broadcastAuth'))
       })
      }
}

export default actions