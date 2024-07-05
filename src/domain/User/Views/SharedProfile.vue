<template>
  <app-layer ref="app">
    <v-row justify="center" class="mt-10">
      <v-col cols="12" md="8">
        <v-alert v-if="!decodedToken.id" type="error" border="left" colored-border>
          Invalid Url
        </v-alert>
        <data-container v-else :loading="loading" :error="error" @retry="getProfile">
          <div class="d-flex justify-space-between">
            <div class="d-flex align-center mb-5">
              <profile-avatar
                  :profile="user"
                  :size="42"
              />
              <div class="ml-3">
                <h3>{{ user.full_name }}</h3>
                <small v-if="user.email" class="grey--text">{{ user.email }}</small>
                <small v-else-if="user.phone" class="grey--text">{{ user.phone }}</small>
              </div>
            </div>
          </div>
          <h2 class="headline">Shared Profile</h2>
          <template v-if="!details.length">
            <div class="py-5 grey--text">
              No detail is shared
            </div>
          </template>
          <template v-else>
            <section v-if="details.includes('identity')" class="my-2">
              <h4 class="grey--text">Identity</h4>
              <user-identity-verification-result :user-id="user.id" flat />
            </section>
          </template>

        </data-container>
      </v-col>
    </v-row>
  </app-layer>
</template>

<script>
import gql from "graphql-tag";
import current_user from "@/domain/User/Mixins/current_user";
import AppLayer from "@/AppLayer.vue";
import ProfileAvatar from "@/components/ProfileAvatar.vue";
import {mapActions, mapGetters} from "vuex";
import DataContainer from "@/components/DataContainer.vue";
import UserIdentityVerificationResult from "@/domain/User/Widgets/IdentityVerificationResult.vue";

export default {
  name: "UserSharedProfile",
  mixins: [current_user],
  components: {
    UserIdentityVerificationResult,
    DataContainer,
    ProfileAvatar,
    AppLayer,
  },
  data(){
    return {
      loading: true,
      user: null,
      error: null,
    }
  },
  computed: {
    ...mapGetters(['auth']),

    token() {
      return this.$route.params.token
    },
    decodedToken() {
      try {
        return JSON.parse(atob(this.token))
      } catch (e) {
        return {};
      }
    },
    details() {
      return this.decodedToken?.details || []
    }
  },
  methods: {
    ...mapActions(['query']),
    getProfile() {
      this.loading = true;
      this.error = null;
      this.query({
        query: gql`
          query getUserById($id: ID!) {
              getUserById(id: $id) {
                  id
                  email
                  phone
                  first_name
                  last_name
                  full_name
                  image
                  status
              }
          }`,
        variables: {
          id: this.decodedToken.id
        }
      }).then(response => {
        this.user = response.data.getUserById
      })
      .catch(e => this.error = e)
      .finally(() => this.loading = false)
    }
  },
  watch: {
    token: {
      immediate: true,
      handler() {
        if(this.decodedToken.id) this.getProfile();
      }
    }
  }
}
</script>


