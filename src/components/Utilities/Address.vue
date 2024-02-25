<template>
  <google-places
      v-if="useGoogleLocation"
      flat
      hide-no-data
      clearable
      cache-items
      v-bind="googlePlaces"
      v-on="$listeners"
  />
  <v-text-field
      v-else
      v-on="$listeners"
      v-bind="textField"></v-text-field>
</template>

<script>
import config from "@/config";
import GooglePlaces from "@/components/Utilities/GooglePlaces";

export default {
  name: "Address",
  components: {GooglePlaces},
  data() {
    return {}
  },
  props: {
    googlePlaces: Object,
    textField: Object
  },
  computed: {
    useGoogleLocation(){
      return config.google.api_key && config.google.api_key !== '';
    }
  },

}
</script>

