<template>
    <section>
        <template v-if="runNewVerification">
            <smile-id @computed-images="smileComputedImages" />
            <div class="my-3">
                <v-alert
                v-if="submission"
                colored-border
                border="left"
                type="success"
                >
                    Verification has been submitted
                </v-alert>
                <v-alert
                v-if="submitting"
                colored-border
                border="left"
                type="info"
                >
                    Submitting for verification...
                </v-alert>
                <error-handler :error="error" @retry="submitSmileID" />
            </div>
        </template>
        <template v-else-if="verification">
            <smile-verification-result :result="verification" flat />
            <v-btn small color="primary" @click="runNewVerification = true" class="mt-3">Redo Verification</v-btn>
        </template>
    </section>
</template>

<script>
import gql from 'graphql-tag';
import SmileId from '@/components/Utilities/SmileID.vue';
import SmileVerificationResult from './SmileVerificationResult.vue';
import ErrorHandler from "@/components/ErrorHandler.vue";

export default {
    name: "SmileVerification",
    components: {
      ErrorHandler,
        SmileId, SmileVerificationResult
    },
    data() {
        return {
            submission: null,
            error: null,
            submitting: false,
            images: null,
            runNewVerification: true,
        }
    },
    props: {
      user: Object,
      verification: Object,
    },

    methods: {
        smileComputedImages(images) {
            this.images = images;
            this.submitSmileID();
        },

        submitSmileID(){
            this.submitting = true;
            this.submission = null;
            this.$store.dispatch('mutate', {
                mutation: gql `
                    mutation submitSmileVerification($user_id: ID!, $image_data: SmileVerificationInput!, $id_info: SmileIDInfoInput!, $metadata: MetadataInput) {
                        submitSmileVerification(user_id: $user_id, image_data: $image_data, id_info: $id_info, metadata: $metadata) {
                            job_complete
                            job_success
                            result {
                                ResultCode
                                ResultText
                                Actions {
                                    Liveness_Check
                                    Register_Selfie
                                    Selfie_Provided
                                    Verify_ID_Number
                                    Human_Review_Compare
                                    Return_Personal_Info
                                    Selfie_To_ID_Card_Compare
                                    Human_Review_Update_Selfie
                                    Human_Review_Liveness_Check
                                    Selfie_To_ID_Authority_Compare
                                    Update_Registered_Selfie_On_File
                                    Selfie_To_Registered_Selfie_Compare
                                }
                            }
                        }
                    }
                `,
                variables: {
                    user_id: this.user.id,
                    image_data: this.images,
                    metadata: [],
                }
            })
            .then(response => {
                this.submission = response.data.submitSmileVerification;
                this.$emit('submitted',  this.submission);
            })
            .catch(e => {
                this.error = e
            })
            .finally(() => {
                this.submitting = false
            })
        }
    },

    watch: {
        verification: {
            immediate: true,
            handler(verification){
                if(verification) this.runNewVerification = false;
            }
        }
    }
}
</script>