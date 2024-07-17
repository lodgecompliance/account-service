import { auth } from '@/firebase';
import _apollo from '@/apollo';
import GET_AUTH_USER from '@/domain/Auth/Queries/getAuthUser';
import GET_AUTH_USER_ACCOUNT from '@/domain/Auth/Queries/getUserAccount';
import GET_SYSTEM_PARAMS from '@/graphql/query/getSystemParam'
import config from "@/config";
import helper from "@/helper";
import { TokenManager } from "@/auth-token";
import gql from "graphql-tag";

const actions = {
    broadcast({ getters }, data) {
        window.parent.postMessage(data, '*')
    },

    broadcastAuth({ dispatch, getters }) {
        dispatch('broadcast', {
            type: 'auth',
            status: auth.currentUser && !TokenManager.tokenExpired() ? 'signedin' : 'signedout',
            token: TokenManager.getRawToken(),
            profile: getters.current_user.profile
        })
    },

    getAuthUserToken({ dispatch, commit }, force_refresh = false){
        return new Promise((resolve, reject) => {
            auth.currentUser.getIdTokenResult(force_refresh)
            .then(tokenResult => {
                TokenManager.setToken(tokenResult)
                return dispatch('getAuthUser')
            }).then(() => resolve(true))
            .catch(e => {
                TokenManager.clearToken()
                reject(e)
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
        })
    },

    getAuthUserOnboardingItems({ commit, dispatch }) {
        return new Promise((resolve, reject) => {
            dispatch('query', {
                domain: config.apollo.account,
                query: gql`
                  query getOnboardingItems {
                    getAuthUser {
                      onboarding {
                        id
                        title
                        description
                        completed
                      }
                    }
                  }
                `,
            }).then(response => {
                const account = response.data.getAuthUser;
                commit('SET_USER_PROFILE_KEYS', account);
                resolve(account.onboarding);
            })
            .catch(e => reject(e))
        })
    },

    getBusinessOnboardingItems({ commit, dispatch, getters }) {
        return new Promise((resolve, reject) => {
            dispatch('query', {
                domain: config.apollo.account,
                query: gql`
                  query getOnboardingItems {
                    getBusinessById(id: ID!) {
                      onboarding {
                        id
                        title
                        description
                        completed
                      }
                    }
                  }
                `,
                variables: {
                    id: getters.current_user.business.id
                },
            }).then(response => {
                const business = response.data.getBusinessById;
                commit('SET_USER_BUSINESS_KEYS', business);
                resolve(business.onboarding);
            })
            .catch(e => reject(e))
        })
    },

    query({commit, dispatch}, { domain = config.apollo.account, query, variables }){
        return _apollo(domain,(e) => {
                console.log('Network Error-->', e);
            }, (e) => {
                console.log('GraphQL Error-->', e);
            }
        ).then(apollo =>  apollo.client.query({ query, variables }))
    },
    
    mutate({commit, dispatch}, { domain = config.apollo.account, mutation, variables}){
        return _apollo(domain,(e) => {
                console.log('Network Error-->', e);
            }, (e) => {
                console.log('GraphQL Error-->', e);
            }
        ).then(apollo =>  apollo.client.mutate({ mutation, variables }))
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
            .then(() => dispatch('getAuthUserAccount'))
    },

    /**
     * sign out the currently authenticated user
     */
    signout({commit, dispatch}){
       return new Promise((resolve, reject) => {
        auth.signOut()
        .then(() => {
            commit('UNSET_CURRENT_USER');
            TokenManager.clearToken()
            resolve()
        })
        .catch(e =>  reject(e))
        .finally(() => dispatch('broadcastAuth'))
       })
      }
}

export default actions