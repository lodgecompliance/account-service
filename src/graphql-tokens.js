 /**
  * Tokens that are used for authentication both for client and the user
  */
import { auth } from './firebase';
import config from './config';
import moment from "moment";

export default async () => {
  const token = {
    client : `Bearer ${config.apollo.client_key}`,
    user: `Bearer ${window.localStorage.getItem('lc-user')}`
  }
  if(window.localStorage.getItem('lc-user')
      && auth.currentUser
      && moment(window.localStorage.getItem('token-expires')).isSameOrBefore(moment())
  ){
    const tokenResult = await auth.currentUser.getIdTokenResult(true);
    window.localStorage.setItem('lc-user', tokenResult.token);
    window.localStorage.setItem('token-expires', tokenResult.expirationTime);
    token.user = `Bearer ${tokenResult.token}`;
  }
  return token;
 }
