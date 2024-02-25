import {mapGetters, mapMutations} from "vuex";

export default {

    computed: {

        ...mapGetters(['current_user']),

        profile() {
            return this.current_user.profile
        },

        idVerification() {
            return this.profile?.id_verification || {}
        },

        userWalletAccount() {
            return this.profile?.wallet_account || {}
        },

        userWallets() {
            return this.userWalletAccount?.wallets || []
        },

        userBusinesses() {
            return (this.profile?.businesses || []).filter(business => !!business.business)
        },

        businesses() {
            return this.userBusinesses.map(business => business.business);
        }

    },

    methods: {
        ...mapMutations([
            'SNACKBAR',
            'SET_MODE',
            'SET_USER_BUSINESS',
            'SET_USER_PROFILE_KEYS',
            'SET_USER_BUSINESS_KEYS'
        ]),

        switchUserBusiness(business) {
            this.SET_USER_BUSINESS(this.userBusinesses.find(ub => ub.business.id === business.id));
        },

        newBusinessCreated(business) {
            const businesses = this.userBusinesses;
            businesses.push(business);
            this.SET_USER_PROFILE_KEYS({ businesses });
            this.SET_USER_BUSINESS(business);
            this.SET_MODE(business.business.id)
            this.SNACKBAR({
                status: true,
                text: `${business.business.name} created successfully!`,
                color: "success"
            })
            this.createBusiness = false;
            this.$router.push({ name: 'business.profile', params: { business: business.id } })
        },

        businessUpdated(update) {
            this.SET_USER_BUSINESS_KEYS(update)
            this.SNACKBAR({
                status: true,
                text: 'Business updated successfully',
                color: 'success'
            })
        },

        avatarUpdated(image) {
            this.SET_USER_PROFILE_KEYS({ image });
            this.SNACKBAR({
                status: true,
                text: "Profile image updated successfully",
                color: "success"
            })
        },

        idVerificationUpdated(id_verification) {
            this.SET_USER_PROFILE_KEYS({ id_verification });
            this.SNACKBAR({
                status: true,
                text: "ID updated successfully",
                color: "success"
            })
        },

        profileUpdated(user) {
            this.SNACKBAR({
                status: true,
                text: "Profile updated successfully",
                color: "success"
            })
        },

        walletCreated(wallet) {
            const wallets = this.userWallets;
            wallets.push(wallet);
            this.SET_USER_PROFILE_KEYS({ wallet_account: {  ...this.userWalletAccount, wallets } })
            this.SNACKBAR({
                status: true,
                text: wallet.type.name+" wallet created ",
                color: "success"
            })
        },

        userWalletUpdated(wallet) {
            this.SET_USER_PROFILE_KEYS({
                wallet_account: {
                    ...this.userWalletAccount,
                    wallets: this.updateItemInArray(wallet, "id", this.userWallets)
                }
            })
        }
    }

}