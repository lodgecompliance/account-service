import moment from "moment";
import { auth } from "@/firebase";

export class AuthToken {

    tokenKey= 'token';
    refreshTokenKey= 'refresh-token';

    getRawToken() {
        let token = window.localStorage.getItem(this.tokenKey);
        try {
            token = JSON.parse(token);
            token.refresh_token = auth.currentUser?.refreshToken
            return token;
        } catch (e) {
            return null;
        }
    }

    getToken() {
        return this.getRawToken()?.token
    }
    getTokenExpiration() {
        return this.getRawToken()?.expirationTime
    }

    tokenExpired() {
        if(!this.getToken()) return true;
        return moment(this.getTokenExpiration()).isSameOrBefore(moment())
    }

    getRefreshToken() {
        return window.localStorage.getItem(this.refreshTokenKey);
    }
    setToken(token) {
        window.localStorage.setItem(this.tokenKey, JSON.stringify(token));
        return this;
    }
    setRefreshToken(token) {
        window.localStorage.setItem(this.refreshTokenKey, token);
        return this;
    }
    clearToken() {
        window.localStorage.removeItem(this.tokenKey);
        return this;
    }

    refreshToken() {
        return auth.currentUser
            .getIdTokenResult(true)
            .then(token =>  this.setToken(token).getToken())
    }
}

export const TokenManager = new AuthToken()