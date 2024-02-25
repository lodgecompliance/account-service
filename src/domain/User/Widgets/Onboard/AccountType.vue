<template>
  <section>
      <v-radio-group v-model="selected">
      <v-row justify="center">
        <v-col
            v-for="(type, n) in types"
            :key="n"
            cols="12"
            sm="6"
        >
          <v-card
              outlined
              class="ma-1"
              height="300"
              :style="`${selected === n ? 'border-color: '+$vuetify.theme.currentTheme.primary : ''}`"
          >
            <v-card-text class="pa-1">
              <div class="d-flex justify-end mt-2">
                <v-radio
                    :value="n"
                    color="primary"
                ></v-radio>
              </div>
              <div class="mt-n3">
                <div class="text-center">
                  <v-avatar color="accent" class="pa-10 rounded-lg" tile >
                    <v-icon color="primary" size="40">{{ type.icon }}</v-icon>
                  </v-avatar>
                <h3 class="primary--text text-truncate my-3">{{ type.title }}</h3>
                </div>
                <ul v-if="type.descriptions.length">
                  <li
                      v-for="(description, d) in type.descriptions"
                      :key="d"
                      class="grey--text"
                  >
                    <small>{{ description }}</small>
                  </li>
                </ul>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      </v-radio-group>
      <error-handler :error="formError" :can-retry="false"></error-handler>
      <slot name="actions" v-bind="{ loading, submitting, submit }"></slot>
  </section>
</template>

<script>
  import form from "@/mixins/form";
  import ErrorHandler from "@/components/ErrorHandler";
  import {mapGetters} from "vuex";
  import user from "@/domain/User/Mixins/user";
  export default {
      name: 'AccountType',
      mixins:[form, user],
      components:{ ErrorHandler },
      data(){
          return {
            loading: false,
            selected: null,
            types: [
              {
                icon: "mdi-account",
                title: "Individual",
                name: "individual",
                descriptions: [
                    "You, as an individual",
                    "You do not have a business number or an EIN number"
                ]
              },
              {
                icon: "mdi-domain",
                title: "Business",
                name: "business",
                descriptions: [
                    "You have a registered business (such as an LLC) and the transactionProperty is owned by the business",
                    "You have a business Number"
                ]
              }
            ]
          };
      },
      props: {
        pendingUser: Object
      },
      computed: {
          ...mapGetters(['current_user'])
      },
      methods: {

        submission() {
          if(this.selected === null) return Promise.reject(new Error("Select an account type"));
          const account_type = this.types[this.selected].name;
          return new Promise((resolve, reject) => {
            this.saveUserAttribute( this.current_user.auth.uid, [
              { key: "account_type", value: account_type }
            ])
            .then(response => {
              this.$emit("completed", account_type);
              this.$store.commit("SET_USER_PROFILE_KEYS", { account_type })
              resolve(response);
            }).catch(e => reject(e))
          })
        }
      },

    mounted() {
        if(this.current_user.profile) {
          this.selected = this.types.findIndex(type => type.name === this.current_user.profile.account_type);
        } else if(this.pendingUser) {
          this.selected = this.types.findIndex(type => type.name === this.pendingUser.account_type)
        }
    },

    watch: {
        selected: {
          immediate: true,
          handler(s) {
            if(s !== null) this.error = null;
          }
        }
    }
  }
</script>
<style>

</style>
