 /**
  * Tokens that are used for authentication both for client and the user
  */
import { auth } from './firebase';
import config from './config';
import { TokenManager } from "@/auth-token"

export default async () => {
  const token = {
    client : `Bearer ${config.apollo.client_key}`,
    user: `Bearer ${TokenManager.getToken()}`
  }
  if(TokenManager.getToken() && TokenManager.tokenExpired() && auth.currentUser){
    token.user = `Bearer ${await TokenManager.refreshToken()}`;
  }
  return token;
 }
