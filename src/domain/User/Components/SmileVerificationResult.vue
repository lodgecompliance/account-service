<template>
  <v-card v-bind="$attrs" :loading="loading">
      <v-card-title>Verification Result</v-card-title>
      <v-alert color="info" colored-border border="left">
          {{ result.result.ResultText }}
      </v-alert>
      <v-card-text v-if="actions">
          <v-list dense>
              <v-list-item>
                  <v-list-item-content>
                      <v-list-item-title>
                          Liveness Check: <v-chip small> {{ actions.Liveness_Check }} </v-chip>
                      </v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
              <v-list-item>
                  <v-list-item-content>
                      <v-list-item-title>
                          Register Selfie: <v-chip small> {{ actions.Register_Selfie }} </v-chip>
                      </v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
              <v-list-item>
                  <v-list-item-content>
                      <v-list-item-title>
                         Selfie Provided <v-chip small> {{ actions.Selfie_Provided }} </v-chip>
                      </v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
              <v-list-item>
                  <v-list-item-content>
                      <v-list-item-title>
                         Verify ID Number <v-chip small> {{ actions.Verify_ID_Number }} </v-chip>
                      </v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
              <v-list-item>
                  <v-list-item-content>
                      <v-list-item-title>
                         Human Review Compare <v-chip small> {{ actions.Human_Review_Compare }} </v-chip>
                      </v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
              <v-list-item>
                  <v-list-item-content>
                      <v-list-item-title>
                        Selfie To ID Card Compare <v-chip small> {{ actions.Selfie_To_ID_Card_Compare }} </v-chip>
                      </v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
              <v-list-item>
                  <v-list-item-content>
                      <v-list-item-title>
                        Human Review Update Selfie <v-chip small> {{ actions.Human_Review_Update_Selfie }} </v-chip>
                      </v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
              <v-list-item>
                  <v-list-item-content>
                      <v-list-item-title>
                        Human Review Liveness Check <v-chip small> {{ actions.Human_Review_Liveness_Check }} </v-chip>
                      </v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
              <v-list-item>
                  <v-list-item-content>
                      <v-list-item-title>
                        Selfie To ID Authority Compare <v-chip small> {{ actions.Selfie_To_ID_Authority_Compare }} </v-chip>
                      </v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
              <v-list-item>
                  <v-list-item-content>
                      <v-list-item-title>
                        Update Registered Selfie On File <v-chip small> {{ actions.Update_Registered_Selfie_On_File }} </v-chip>
                      </v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
              <v-list-item>
                  <v-list-item-content>
                      <v-list-item-title>
                        Selfie To Registered Selfie Compare <v-chip small> {{ actions.Selfie_To_Registered_Selfie_Compare }} </v-chip>
                      </v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
          </v-list>
          <p v-if="lastUpdated">Updated {{ lastUpdated }}</p>
      </v-card-text>
  </v-card>
</template>

<script>
import moment from 'moment';

export default {
    name: "SmileVerificationResult",
    data(){
        return {
            loading: false,
        }
    },

    props: {
        result: Object,
    },

    computed: {
        isMine(){
            if(this.result) {
                return this.result.user_id === this.$store.getters.current_user.profile.id
            } 
            return false;
        },

        lastUpdated() {
            if(!this.result || !this.result.last_updated) return null;
            return moment.unix(this.result.last_updated).fromNow();
        },

        actions() {
            return this.result && this.result.result ? this.result.result.Actions : null
        }
    }, 

    methods: {
        
    },
    
}
</script>