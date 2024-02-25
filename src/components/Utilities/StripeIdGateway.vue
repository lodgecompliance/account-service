<template>
      <div>
        <data-container :loading="initializing">
            <template #loading>
                <div class="py-5 grey--text text-center"> Hold on, verification starting soon...... </div>
            </template>
            <v-alert v-if="initError" color="error">Unable to initialize ID verification gateway right now</v-alert>
        </data-container>
        <slot v-bind="verify" />
      </div>
</template>


<script>
    import config from '../../config';
    import DataContainer from '../../components/DataContainer.vue';
    export default {
        name: "StripeIdGateway",
        components: {
           DataContainer
        },
        data(){
            return {
                initError: null,
                initializing: false,
            }
        },
        methods: {
            setStripe()
            {
                this.initializing = true;
                 /* eslint-disable */
                return new Promise((resolve, reject) => {                    
                    if(document.querySelector("[data-stripe='true']") !== null){
                        this.initializing = false;
                        resolve();
                        return;
                    }
                    let stripeScript = document.createElement('script')
                    stripeScript.setAttribute('src', 'https://js.stripe.com/v3/');
                    document.head.appendChild(stripeScript);
                    stripeScript.onload = () => {
                        stripeScript.setAttribute('data-stripe', 'true');
                        this.initializing = false;
                        resolve();
                    };
                    stripeScript.onerror = (e) => {
                        reject(e);
                    }; 
                })
            },

            verify(clientSecret) {
                return new Promise((resolve, reject) => {
                    this.setStripe()
                    .then(() => {
                        const stripe = Stripe(config.stripe.publishable_key);
                        return stripe.verifyIdentity(clientSecret);
                    })
                    .then((result) => {
                        resolve(result)
                    })
                    .catch(e => {
                        reject(e);
                    })
                    .finally(() => {
                        this.verificationOngoing = false;
                    })
                })
            }
        },
        watch: {
            initializing: {
                immediate: true,
                handler(val) {
                    this.$emit('loading', val)
                }
            }
        }
    }
</script>