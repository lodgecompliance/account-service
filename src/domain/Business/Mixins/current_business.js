import {mapGetters, mapMutations} from "vuex";

export default {

    computed: {

        ...mapGetters(['current_user']),

        currentUserBusiness() {
            return this.current_user.business
        },

        currentBusiness() {
            return this.currentUserBusiness?.business
        },

        currentProperties() {
            const properties = this.currentBusiness?.properties || [];
            const obj = {};
            for (const property of properties) {
                obj[property.id] = property
            }
            return obj;
        }
    },

    methods: {

        ...mapMutations([
            'SNACKBAR',
            'SET_USER_BUSINESS_KEYS'
        ]),
    }

}