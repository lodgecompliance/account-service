<template>
      <v-card v-bind="$attrs">
        <v-card-text v-if="verification">
          <div class="d-flex flex-wrap align-items-center justify-space-between">
            <div class="text-uppercase">Verification Type: {{ verification.type  }}</div>
            <v-chip
                class="ma-2"
                :color="`${statuses[verification.status] ? statuses[verification.status].color : 'info'}`"
                text-color="white"
                small
            >
              <span>{{  statuses[verification.status] ? statuses[verification.status].tag : verification.status }}</span>
            </v-chip>
          </div>
        </v-card-text>
        <v-card-text v-else class="text-center grey--text">
          <p>No verification available</p>
        </v-card-text>
      </v-card>
</template>
<script>
export default {
    name: "StripeVerificationResult",
    data(){
        return {}
    },

    props: {
        verification: Object
    },

    computed: {
      statuses() {
          return {
            'requires_input': {
              tag: 'Abandoned',
              color: 'warning'
            },
            'verified': {
              tag: 'Verified',
              color: 'success'
            }
          }
      }
    }
}
</script>