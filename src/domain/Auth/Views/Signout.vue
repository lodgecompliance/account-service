<template>
    <div></div>
</template>

<script>
    import { mapActions } from "vuex";
    export default {
        name: 'Signout',
        data(){
            return {};
        },
        computed: {
            redirect(){
                return this.$route.query.redirect ? this.$route.query.redirect : '/'
            },
        },

        methods: {
          ...mapActions(['signout']),
        },

        mounted() {
          this.signout().finally(() => {
            window.location.replace(this.redirect);
          })
        }
    }
</script>
