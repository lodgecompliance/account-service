<template>
  <v-container v-if="error">
    <v-alert colored-border border="left" color="error" >
      <slot>{{ message }}</slot>
    </v-alert>
    <v-btn v-if="canRetry" text color="info" @click="$emit('retry', true)">Try Again</v-btn>
  </v-container>
</template>

<script>
export default {
  name: "ErrorHandler",
  data(){
    return {
      retrying: false
    }
  },
  props: {
        error: [Object, Error],
        canRetry: {
          type: Boolean,
          default: () => false
        }
    },
  computed: {
    message() {
      if(!this.error) return null;
      if(this.error.message) return this.error.message.replace('GraphQL error:', '').trim();
      else return "Something went wrong"+(this.canRetry ? ", Please try again." : "");
    }
  }
}
</script>