import formValidation from "@/helper/formValidation";

export default {
    data(){
        return {
            form: {},
            rules: formValidation.rules,
        }
    },
    props: {
        business: Object,
        integration: Object,
        info: Object,
        saving: Boolean,
    },
    computed: {
        credentials() {
            return this.integration.credentials
                ? JSON.parse(this.integration.credentials)
                : {};
        },
        settings() {
            return this.integration.settings
                ? JSON.parse(this.integration.settings)
                : {};
        }
    },
    methods: {
        setForm() {
            this.form = {}
        },
    },
    watch: {
        integration: {
            immediate: true,
            handler() {
                this.setForm();
            }
        }
    }
}