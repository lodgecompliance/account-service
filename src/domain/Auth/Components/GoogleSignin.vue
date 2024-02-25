<template>
    <v-btn v-bind="$attrs.btn" @click="signin" :loading="loading">
      <span><v-icon class="mr-5">mdi-google</v-icon> <slot>Sign in with Google</slot></span>
      <slot name="btn-append" />
    </v-btn>
</template>
<script>
import { fb, auth } from '@/firebase';

export default {
    name: "GoogleSignin",
    props: {

    },
    data(){
        return {
           loading: false,
        }
    },
    computed:{
    },
    methods: {
        signin(){
            this.loading = true;
            const provider = new fb.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
              .then(result => {
                if(result.user) this.$emit('authenticated', {
                  user: result.user,
                  provider: 'google'
                });
              })
            .catch((error) => {
                this.$emit('error', error);
            })
            .finally(() => {
                this.loading = false;
            });
        },
    },

    mounted() {
        auth.getRedirectResult()
        .then((result) => {
            if(result.user) this.$emit('authenticated', {
                user: result.user,
                provider: 'google'
            });
        }).catch((error) => {
            this.$emit('error', error);
        })

    }
}
</script>