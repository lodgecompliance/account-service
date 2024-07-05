
    import {mapActions, mapMutations} from 'vuex';
    import UPDATE_USER from '../Mutations/updateUser';
    import CREATE_USER from '../Mutations/createUser';
    import form from "@/mixins/form";
    import connect from "@/domain/Auth/Mixins/connect";
    import user from "@/domain/User/Mixins/user";

    export default {
        mixins: [form, connect, user],
        data(){
            return {
                loading: false,
                alert: null,
                form: {
                    phone: null,
                    email: null,
                    first_name: null,
                    last_name: null,
                }
            }
        },
        computed: {
            profile() {
                return this.current_user.profile;
            },

            trimedPhone() {
                return this.form.phone?.replace(/[-\s]+/g, "");
            }

        },
        methods: {
             ...mapMutations([
                'SET_USER_PROFILE',
                'SET_APP_STATE',
                'SET_APP_PROCESS',
            ]),

            ...mapActions(['getAuthUserAccount']),

            setForm(){
                if(this.current_user.profile){
                    this.form = {
                        phone: this.current_user.profile.phone,
                        email: this.current_user.profile.email,
                        first_name: this.current_user.profile.first_name,
                        last_name: this.current_user.profile.last_name,
                        image: this.profileAvatar || this.googleAvatar
                    }
                } else if(this.current_user.auth) {
                    this.form.email = this.current_user.auth.email;
                    this.form.phone = this.current_user.auth.phoneNumber;
                    if(this.current_user.auth.displayName) {
                        const names = this.current_user.auth.displayName.split(' ');
                        this.form.first_name = names[0] || '';
                        this.form.last_name = names[1] || '';
                    }
                    this.form.image = this.googleAvatar;
                }
            },

            saveAuthUserAttribute(attributes = [], saveAsMetadata = false) {
                return this.saveUserAttribute(this.current_user.auth.uid, attributes, saveAsMetadata);
            },

            saveProfile(){
                return new Promise((resolve, reject) => {
                    this.mutate({
                        variables: {
                            user_id: this.auth.uid,
                            data: {...this.form, phone: this.trimedPhone}
                        },
                        mutation: this.current_user.profile ? UPDATE_USER : CREATE_USER,
                    })
                    .then(() => this.getAuthUserAccount())
                    .then(user  => {
                        return resolve(user);
                    })
                    .catch(e => reject(e))
                })
            },

            syncProfile(credentials){
                if(!this.current_user.profile) return Promise.resolve();
                this.setForm();
                return new Promise((resolve, reject) => {
                     this.loading = true;
                     this.formError = null;
                     this.form = { ...this.form, ...credentials };
                     this.SET_APP_STATE(false);
                     this.SET_APP_PROCESS('Syncing your profile...');
                     this.mutate({
                         variables: {
                             user_id: this.current_user.auth.uid,
                             data: this.form
                         },
                         mutation: UPDATE_USER,
                     })
                     .then(() => this.getAuthUserAccount())
                     .then(response  => {
                         resolve(response)
                     })
                     .catch(e => reject(e))
                     .finally(() => {
                         this.SET_APP_STATE(true);
                         this.SET_APP_PROCESS('');
                         this.setForm();
                         this.loading = true;
                     });
                 })

            },

            async googleConnect(){
                 this.loading = true;
                 this.alert = null;
                try {
                    const provider = await this.connectGoogle()
                    if(!provider) throw new Error("Google connect failed")
                    await this.syncProfile({ email: provider.email, image: this.form.image || provider.photoURL })
                    return provider;
                } catch (e) {
                    this.alert = { type: 'error', text: e.message }
                } finally {
                    this.loading = false;
                }
            },

            async emailConnect() {
                 this.loading = true;
                 this.alert = null;
                try {
                     const result = await this.connectionEmail(this.form.email)
                    if(result) {
                        this.alert = {
                            text: `A link has been sent to ${this.form.email}, use the link to verify the email.`,
                            type: 'success'
                        }
                    }
                    if(!this.current_user.profile) await this.saveProfile();
                    await this.saveAuthUserAttribute([{
                        key: "pending_email_confirmation",
                        value: this.form.email
                    }], true)
                    return result
                 } catch(e)  {
                     this.alert = { type: 'error', text: e.message }
                 } finally {
                     this.loading = false;
                 }
            },

            async phoneConnect() {
                this.loading = true;
                this.alert = null;
                try {
                    const result = await this.sendPhoneVerificationCode(this.trimedPhone)
                    if(result) {
                        this.alert = {
                            text: `Verification code sent to ${this.trimedPhone}.`,
                            type: 'success'
                        }
                    }
                    return result
                } catch(e)  {
                    this.alert = { type: 'error', text:  e.message }
                } finally {
                    this.loading = false;
                }
            },

            async providerDisconnect(provider) {
                this.loading = true;
                this.alert = null;
                try {
                    return await this.disconnectProvider(provider)
                } catch(e)  {
                    this.alert = { type: 'error', text:  e.message }
                } finally {
                    this.loading = false;
                }
            },

             resendPhoneVerification() {
                 this.loading = true;
                 this.alert = null;
                 this.resetPhoneVerification();
                 return this.sendPhoneVerificationCode(this.trimedPhone)
            },

            changePhoneVerificationNumber() {
                this.loading = false;
                this.alert = null;
                this.resetPhoneVerification();
            },

            submitPhoneVerificationOtp(otp) {
                this.loading = true;
                this.phoneVerificationSent = false;
                this.confirmVerificationCode(otp)
                    .then(() => {
                        this.$emit("update");
                        return this.syncProfile({ phone: this.trimedPhone });
                    })
                    .catch(e => {
                        this.alert = { type: "error", text: e.message }
                    })
                    .finally(() => {
                        this.resetPhoneVerification()
                        this.loading = false;
                    })
            }

        },

        watch: {
            profile: {
                immediate: true,
                handler() {
                    this.setForm()
                }
            }
        }
    }



