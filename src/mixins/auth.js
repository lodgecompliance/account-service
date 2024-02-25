import {mapActions, mapGetters, mapMutations} from "vuex";
import { auth } from "@/firebase";

export default {
    computed: {
        ...mapGetters(['auth', 'current_user']),

        currentUserAuth() {
            return this.auth
        },

        providerData() {
            if(!this.currentUserAuth) return [];
            return this.currentUserAuth.providerData;
        },

        googleProvider(){
            return this.providerData.find(provider => provider.providerId === 'google.com');
        },

        phoneProvider(){
            return this.providerData.find(provider => provider.providerId === 'phone');
        },

        emailProvider(){
            return this.providerData.find(provider => provider.providerId === 'password');
        },

        googleAvatar() {
            return this.googleProvider && this.googleProvider.photoURL
                ? this.googleProvider.photoURL : null;
        },

        profileAvatar() {
            return this.current_user.profile?.image
        },

    },

    methods: {
        ...mapMutations(['SET_AUTH']),
    },

    mounted() {
        auth.onAuthStateChanged( user => {
            this.SET_AUTH(user);
        })
    }
}