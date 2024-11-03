<template>
    <v-autocomplete
        v-model="location"
        :loading="loading"
        :items="predictions"
        :search-input.sync="search"
        v-bind="$attrs"
        v-on="$listeners"
    ></v-autocomplete>
</template>

<script>
import config from '../../config';
import { loadGoogleMapsAPI } from '../../helper/googleMapsLoader';

export default {
    name: "GooglePlaces",
    data: () => ({
      location: null,
      search: null,
      searchResults: [],
      service: null,
      loading: false
    }),

    // metaInfo () {
    //   return {
    //     script: [{
    //       src: `https://maps.googleapis.com/maps/api/js?key=${config.google.api_key}&libraries=places`,
    //       async: true,
    //       defer: true,
    //       callback: () => this.MapsInit()
    //     }]
    //   }
    // },

    props: {
        value: String,
        country: {
          type: String,
          required: false
        }
    },
    computed: {
        predictions(){
            return this.searchResults.map(prediction => prediction.description);
        }
    },

    methods: {
      MapsInit () {
        this.service = new window.google.maps.places.AutocompleteService()
      },

      displaySuggestions (predictions, status) {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
          this.searchResults = []
          return
        }
        this.searchResults = predictions;
        this.loading = false
      },
      fetchSuggestions (val) {
        this.loading = true;
        this.service.getPlacePredictions({
            input: val,
            componentRestrictions: {country: this.country}
            // types: ['(regions)']
        }, this.displaySuggestions)
      }
    },

  mounted() {
      // Load google maps once across all pages
      loadGoogleMapsAPI(`${config.google.api_key}`, this.MapsInit).catch((error) => {
        console.log('Error loading GoogleMaps API');
      });
      if(this.value) {
        this.location = this.value;
        this.searchResults =  [{description: this.value}]
      }
  },

  watch: {
      country: {
        immediately: true,
        handler (newCountry) {
          if (newCountry.length > 0) {
            // reset the search results list
            this.location = ''
            this.searchResults = [];
            this.fetchSuggestions(this.value);
          }
        }
      },
      search (val) {
        if (val && this.service) {
          this.fetchSuggestions(val);
        }
      }
    }
}
</script>