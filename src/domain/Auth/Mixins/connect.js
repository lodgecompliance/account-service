import gql from "graphql-tag";
import {auth, fb} from "@/firebase";
import authMixin from '@/mixins/auth'

export default {
    mixins: [authMixin],
    data(){
        return {
            phoneVerificationSent: false
        }
    },

    computed: {
        emailVerificationRoute(){
            return this.url(this.$router.resolve({
                name: 'email.verification',
                query: { redirect: this.$route.fullPath }
            } ).route.fullPath)
        },
    },

    methods: {

        async getUsersByField(field, value) {
            try {
                return await this.$store.dispatch('query', {
                    query: gql `query getUsersByField($field: String!, $value: String!){
                            getUsersByField(field: $field, value: $value){
                                id
                            }
                    }`,
                    variables: { field, value }
                })
            } catch (e) {
                throw new Error(`Could not verify ${field} : `+e.message)
            }
        },

        async connectGoogle(){
            try {
                const provider = new fb.auth.GoogleAuthProvider();
                const google = await auth.currentUser.linkWithPopup(provider);
                const newGoogleProvider = google.user.providerData.find(provider => provider.providerId == 'google.com');
                if(newGoogleProvider && this.emailProvider && this.emailProvider.email !== newGoogleProvider.email) {
                    await this.disconnectProvider(this.emailProvider.providerId)
                }
                return newGoogleProvider;
            } catch (e) {
                throw new Error("Google connect failed: "+e.message)
            }
        },

        async connectionEmail(email) {
            try {
                const usersWithEmail = (await this.getUsersByField("email", email))?.data?.getUsersByField || [];
                if(usersWithEmail.filter(user => user.id !== this.current_user.profile?.id).length) {
                    throw new Error("Email already taken")
                }

                await auth.sendSignInLinkToEmail(email, {
                    url: this.emailVerificationRoute,
                    handleCodeInApp: true,
                })
                window.localStorage.setItem('emailForConnect', email);
                return true;
            } catch(e)  {
                throw new Error("Email verification failed: "+e.message)
            }
        },

        async sendPhoneVerificationCode(phone) {
            const usersWithPhone = (await this.getUsersByField("phone", phone))?.data?.getUsersByField || [];
            if(usersWithPhone.filter(user => user.id !== this.current_user.profile?.id).length) {
                throw new Error("Phone number already taken")
            }
            try {
                if(this.phoneProvider) await auth.currentUser.unlink(this.phoneProvider.providerId);
            }
            catch (e) {
                console.log("Could not unlink phone provider: "+e.message);
            }
            try {
                window.recaptchaVerifier = new fb.auth.RecaptchaVerifier('recaptcha-container');
                window.confirmationResult = await auth.currentUser.linkWithPhoneNumber(phone, window.recaptchaVerifier);
                this.phoneVerificationSent = true;
                return true
            } catch (e) {
                throw new Error("Phone verification failed: "+e.message);
            }
        },

        async disconnectProvider(provider){
            try {
                await auth.currentUser.unlink(provider);
                await auth.currentUser.reload();
                this.$store.commit('SET_USER_AUTH', auth.currentUser);
                return true;
            } catch (e) {
                throw e
            }
        },

        resetPhoneVerification(){
            window.confirmationResult = null;
            document.getElementById("recaptcha-container").innerHTML = "";
            this.phoneVerificationSent = false;
        },

        async confirmVerificationCode(code){
            try {
                if(await window.confirmationResult.confirm(code)) {
                   return await auth.currentUser.reload()
                }
                throw new Error("Invalid code")
            } catch(e) {
                throw new Error("Failed to confirm verification: "+e.message)
            }
        }

    }
}