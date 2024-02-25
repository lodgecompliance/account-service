<template>
<div>
    <confirmation-dialog ref="confirmation" @confirmed="dialog = true">
        <div class="text-center mt-5">
            <p>
                You are accessing another user identity verification. The user will be notified about this.
            </p>
            <h4>
                Do you want to continue ?
            </h4>
        </div>
    </confirmation-dialog>
    <v-dialog
        v-model="dialog"
        width="400"
        scrollable
        persistent
        >
        <v-card outlined :loading="loading"> 
            <v-card-title
            class="headline"
            primary-title
            >
                Verification Report
            </v-card-title>
            <v-card-text>
                <data-container :loading="loading" :error="error" @retry="getUserStripeVerificationReport">
                    <div v-if="report" class="mt-5">
                        <v-list>
                            <v-subheader>Document: {{ documentOptions.document_types | nullable }}</v-subheader>
                            <v-list-item>
                                <v-list-item-content>
                                     Name: {{ [document.first_name, document.last_name].join(' ') }}
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                     DOB: {{ dob | nullable  }}
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                     Issued Date: {{ issued_date | nullable }}
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                     Expiration Date: {{ expiration_date | nullable }}
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                     Issuing country: {{ document.issuing_country }}
                                </v-list-item-content>
                            </v-list-item>
                             <v-list-item>
                                <v-list-item-content>
                                     status: {{ document.status }}
                                </v-list-item-content>
                            </v-list-item>
                            <v-subheader>Address</v-subheader>
                            <v-list-item>
                                <v-list-item-content>
                                     Line1: {{ address.line1 | nullable }}
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                     Line2: {{ address.line2 | nullable }}
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    City: {{ address.city | nullable }}
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    State: {{ address.state | nullable}}
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    Country: {{ address.country | nullable }}
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    Postal code: {{ address.postal_code | nullable}}
                                </v-list-item-content>
                            </v-list-item>
                            
                        </v-list>
                    </div>
                    <div v-else class="mt-5" >
                        <v-alert 
                        border="left"
                        colored-border
                        type="error">
                            No verification report
                        </v-alert>
                    </div>
                </data-container>
            </v-card-text>
            <v-card-actions v-if="!loading">
                <v-spacer></v-spacer>
                <v-btn text @click.prevent="close" color="red">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
    
</template>

<script>
import DataContainer from '../../../components/DataContainer.vue';
import ConfirmationDialog from '@/components/Utilities/ConfirmationDialog'

export default
    {
    name: "VerificationReport",
    components: { DataContainer, ConfirmationDialog },
    data(){
        return {
            dialog: false,
            loading: false,
            error: null
        }
    },
    props: {
        verification: Object,
    },

    computed: {
        report() {
          return this.verification?.last_verification_report
        },
        document(){
            return this.report ? this.report.document : {}
        },
        expiration_date() {
          if(this.document.expiration_date) return [this.document.expiration_date.day, this.document.expiration_date.day, this.document.expiration_date.year].join("/");
          return null;
        },
        issued_date() {
          if(this.document.issued_date) return [this.document.issued_date.day, this.document.issued_date.day, this.document.issued_date.year].join("/");
          return null;
        },
        dob() {
          if(this.document.dob) return [this.document.dob.day, this.document.dob.day, this.document.dob.year].join("/");
          return null;
        },
        address(){
            return this.document.address ? this.document.address : {}
        },
        selfie(){
            return this.report ? this.report.selfie :{}
        },
        files(){
            return this.report ? this.report.files :{}
        },
        options() {
          return this.report?.options || {}
        },
        documentOptions() {
          return this.options.document || {}
        }
    },
    methods: {
        open(){
            if(!this.verification) return;
            if(this.verification.metadata.user_id === this.$store.getters.current_user.auth.uid){
                this.dialog = true;
                return;
            }
            this.$refs.confirmation.open();
        },
        close(){
            this.dialog = false;
        },
    }
}
</script>